import React, { useState, useEffect, useMemo } from 'react';
import {
   getSponsorsService,
   deleteSponsorService,
} from '../../../../../services/sponsors.service';
import { useLanguage } from '../../../../../context/LanguageContext';
import { AdminSectionHeader } from '../../shared';
import { Loader2, Info, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import CreateSponsor from './CreateSponsor';

const API_URL = import.meta.env.VITE_API_URL || '';

const AdminSponsors = () => {
   const { language } = useLanguage();
   const [sponsors, setSponsors] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [createOpen, setCreateOpen] = useState(false);
   const [sortByName, setSortByName] = useState('asc'); // 'asc' | 'desc'

   const fetchSponsors = async () => {
      try {
         const res = await getSponsorsService();
         setSponsors(res?.data?.sponsors ?? []);
         setLoading(false);
      } catch (err) {
         console.error('Erreur fetch sponsors :', err);
         setError('Failed to load sponsors');
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchSponsors();
   }, []);

   const sortedSponsors = useMemo(() => {
      const list = [...sponsors];
      list.sort((a, b) => {
         const nameA = (a.name || '').toLowerCase();
         const nameB = (b.name || '').toLowerCase();
         return sortByName === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
      });
      return list;
   }, [sponsors, sortByName]);

   const handleDelete = async (id) => {
      if (!window.confirm(language === 'fr' ? 'Supprimer ce sponsor ?' : 'Delete this sponsor?')) return;
      try {
         await deleteSponsorService(id);
         await fetchSponsors();
      } catch (err) {
         console.error('Erreur suppression sponsor :', err);
         setError(err?.message || 'Failed to delete sponsor');
      }
   };

   const imageSrc = (sponsor) => {
      const cover = sponsor.cover || sponsor.image;
      if (!cover) return null;
      return cover.startsWith('http') ? cover : `${API_URL.replace(/\/$/, '')}${cover.startsWith('/') ? '' : '/'}${cover}`;
   };

   return (
      <div className="p-2">
         <AdminSectionHeader
            title={language === 'fr' ? 'Sponsors' : 'Sponsors'}
            subtitle={language === 'fr' ? 'Gérez les sponsors.' : 'Manage sponsors.'}
            action={{
               label: language === 'fr' ? 'Ajouter un sponsor' : 'Add a sponsor',
               icon: Plus,
               onClick: () => setCreateOpen(true),
               color: 'blue',
            }}
         />

         <CreateSponsor
            isOpen={createOpen}
            onClose={() => setCreateOpen(false)}
            onCreated={() => {
               setCreateOpen(false);
               fetchSponsors();
            }}
         />

         {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
               {error}
            </div>
         )}

         {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
               <Loader2 className="animate-spin text-gray-400" size={32} />
               <p className="text-gray-500 text-sm">
                  {language === 'fr' ? 'Chargement des sponsors...' : 'Loading sponsors...'}
               </p>
            </div>
         ) : sponsors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <p className="text-gray-500 text-sm">
                  {language === 'fr' ? 'Aucun sponsor.' : 'No sponsors.'}
               </p>
            </div>
         ) : (
            <div className="space-y-4">
               {/* Sort Mobile */}
               <div className="flex md:hidden justify-end">
                  <button
                     onClick={() => setSortByName((s) => (s === 'asc' ? 'desc' : 'asc'))}
                     className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-xl text-xs text-gray-400"
                  >
                     {language === 'fr' ? 'Trier par nom' : 'Sort by name'}
                     <ArrowUpDown size={14} />
                  </button>
               </div>

               {/* Desktop Table View */}
               <div className="hidden md:block bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden shadow-xl">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-800 bg-[#111]">
                           <th className="px-6 py-4">
                              <button
                                 type="button"
                                 onClick={() => setSortByName((s) => (s === 'asc' ? 'desc' : 'asc'))}
                                 className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"
                              >
                                 {language === 'fr' ? 'Nom du sponsor' : 'Sponsor name'}
                                 <ArrowUpDown size={14} />
                              </button>
                           </th>
                           <th className="px-6 py-4">{language === 'fr' ? 'Image' : 'Image'}</th>
                           <th className="px-6 py-4">{language === 'fr' ? 'URL' : 'URL'}</th>
                           <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800">
                        {sortedSponsors.map((sponsor) => {
                           const src = imageSrc(sponsor);
                           return (
                              <tr key={sponsor.id} className="hover:bg-white/5 transition-colors group">
                                 <td className="px-6 py-4">
                                    <span className="font-bold text-sm text-blue-400">{sponsor.name || '—'}</span>
                                 </td>
                                 <td className="px-6 py-4">
                                    {src ? (
                                       <img
                                          src={src}
                                          alt={sponsor.name || ''}
                                          className="w-12 h-12 rounded-lg object-cover bg-gray-800"
                                       />
                                    ) : (
                                       <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                                          —
                                       </div>
                                    )}
                                 </td>
                                 <td className="px-6 py-4">
                                    {sponsor.url ? (
                                       <a
                                          href={sponsor.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-400 hover:underline truncate max-w-[200px] inline-block"
                                       >
                                          {sponsor.url}
                                       </a>
                                    ) : (
                                       <span className="text-xs text-gray-500">—</span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button
                                          type="button"
                                          onClick={() => handleDelete(sponsor.id)}
                                          className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                                          aria-label={language === 'fr' ? 'Supprimer' : 'Delete'}
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>

               {/* Mobile Cards View */}
               <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedSponsors.map((sponsor) => {
                     const src = imageSrc(sponsor);
                     return (
                        <div key={sponsor.id} className="p-4 bg-[#1a1a1a] rounded-[2rem] border border-gray-800/50 shadow-lg space-y-4">
                           <div className="flex items-center gap-4">
                              {src ? (
                                 <img
                                    src={src}
                                    alt={sponsor.name || ''}
                                    className="w-16 h-16 rounded-2xl object-cover bg-gray-800 shrink-0"
                                 />
                              ) : (
                                 <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-500 text-xs shrink-0">
                                    ?
                                 </div>
                              )}
                              <div className="flex-1 min-w-0">
                                 <div className="font-black text-white text-lg leading-tight truncate">{sponsor.name}</div>
                                 {sponsor.url && (
                                    <a
                                       href={sponsor.url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-[10px] text-blue-400 truncate block mt-1"
                                    >
                                       {sponsor.url}
                                    </a>
                                 )}
                              </div>
                           </div>
                           
                           <button
                              type="button"
                              onClick={() => handleDelete(sponsor.id)}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-bold active:scale-95 transition-all"
                           >
                              <Trash2 size={14} />
                              {language === 'fr' ? 'Supprimer' : 'Delete'}
                           </button>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminSponsors;