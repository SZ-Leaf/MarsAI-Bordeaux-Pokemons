import React, { useState, useRef } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { Loader2, ImagePlus } from 'lucide-react';
import { createSponsorService } from '../../../../../services/sponsors.service';
import Modal from '../../../../ui/Modal/Modal.jsx';
import { sponsorSchema } from '@marsai/schemas';
import { zodErrors } from '../../../../../helpers/zodHelper';

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/jpg,image/png';

const CreateSponsor = ({ isOpen, onClose, onCreated }) => {
   const { language } = useLanguage();
   const [formData, setFormData] = useState({ name: '', url: '' });
   const [coverFile, setCoverFile] = useState(null);
   const [submitting, setSubmitting] = useState(false);
   const [apiError, setApiError] = useState(null);
   const fileInputRef = useRef(null);
   const [fieldErrors, setFieldErrors] = useState({});

   const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleCoverChange = (e) => {
      const file = e.target.files?.[0] ?? null;
      setCoverFile(file);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!coverFile) {
         setApiError(language === 'fr' ? 'Veuillez sélectionner une image.' : 'Please select an image.');
         return;
      }
      try {
         sponsorSchema.parse({ name: formData.name.trim(), url: formData.url.trim() });
         setFieldErrors({});
      } catch (err) {
         const fe = zodErrors(err, language);
         if (Object.keys(fe).length) setFieldErrors(fe);
         return;
      }
      setSubmitting(true);
      setApiError(null);
      try {
         const body = new FormData();
         body.append('name', formData.name.trim());
         body.append('url', formData.url.trim());
         body.append('cover', coverFile);
         const res = await createSponsorService(body);
         if (res?.data) {
            onCreated?.(res?.data?.sponsorId ?? res?.data?.id ?? res?.data);
            onClose?.();
         }
      } catch (err) {
         const fe = zodErrors(err, language);
         if (Object.keys(fe).length) {
            setFieldErrors(fe);
         } else {
            setApiError(err?.message || err?.response?.data?.message || 'Une erreur est survenue');
         }
      } finally {
         setSubmitting(false);
      }
   };

   const inputClass =
      'w-full rounded-xl border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30';
   const labelClass = 'mb-1 block text-xs font-medium text-gray-400';

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title={language === 'fr' ? 'Ajouter un sponsor' : 'Add a sponsor'}
         size="md"
      >
         <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
               <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-300">
                  {apiError}
               </div>
            )}

            <div>
               <label htmlFor="sponsor-name" className={labelClass}>
                  {language === 'fr' ? 'Nom' : 'Name'}
               </label>
               <input
                  type="text"
                  id="sponsor-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={language === 'fr' ? 'Nom du sponsor' : 'Sponsor name'}
                  required
               />
               {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.name}</p>
               )}
            </div>

            <div>
               <label className={labelClass}>
                  {language === 'fr' ? 'Image (fichier)' : 'Image (file)'}
               </label>
               <input
                  ref={fileInputRef}
                  type="file"
                  id="sponsor-cover"
                  name="cover"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={handleCoverChange}
                  className="hidden"
               />
               <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full rounded-xl border border-dashed px-3 py-4 text-sm transition-colors flex items-center justify-center gap-2 ${coverFile ? 'border-gray-600 bg-gray-800/50 text-gray-300' : 'border-gray-600 bg-[#1a1a1a] text-gray-500 hover:border-gray-500 hover:text-gray-400'}`}
               >
                  <ImagePlus size={20} className="shrink-0" />
                  {coverFile ? (
                     <span className="truncate">{coverFile.name}</span>
                  ) : (
                     <span>{language === 'fr' ? 'Choisir une image (JPG, PNG)' : 'Choose an image (JPG, PNG)'}</span>
                  )}
               </button>
            </div>

            <div>
               <label htmlFor="sponsor-url" className={labelClass}>
                  {language === 'fr' ? 'URL du site' : 'Website URL'}
               </label>
               <input
                  type="url"
                  id="sponsor-url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://..."
               />
               {fieldErrors.url && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.url}</p>
               )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-600 bg-transparent px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
               >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
               </button>
               <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
               >
                  {submitting && <Loader2 className="animate-spin" size={18} />}
                  {language === 'fr' ? 'Créer' : 'Create'}
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default CreateSponsor;
