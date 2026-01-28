/**
 * Formulaire principal (Partie 2) - Métadonnées vidéo + upload
 * Design épuré et simple
 */
const SubmissionForm = ({ formData, errors, updateField }) => {
  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Informations sur la vidéo</h2>
      
      {/* Métadonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Titre anglais <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.english_title}
            onChange={(e) => updateField('english_title', e.target.value)}
            className={`w-full border rounded p-2 ${errors.english_title ? 'border-red-500' : ''}`}
            maxLength={255}
          />
          {errors.english_title && (
            <p className="text-red-500 text-sm mt-1">{errors.english_title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Titre original
          </label>
          <input
            type="text"
            value={formData.original_title}
            onChange={(e) => updateField('original_title', e.target.value)}
            className={`w-full border rounded p-2 ${errors.original_title ? 'border-red-500' : ''}`}
            maxLength={255}
          />
          {errors.original_title && (
            <p className="text-red-500 text-sm mt-1">{errors.original_title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Langue <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.language}
            onChange={(e) => updateField('language', e.target.value)}
            className={`w-full border rounded p-2 ${errors.language ? 'border-red-500' : ''}`}
            placeholder="ex: French, English"
          />
          {errors.language && (
            <p className="text-red-500 text-sm mt-1">{errors.language}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Classification <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.classification}
            onChange={(e) => updateField('classification', e.target.value)}
            className={`w-full border rounded p-2 ${errors.classification ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionner</option>
            <option value="IA">100% IA</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errors.classification && (
            <p className="text-red-500 text-sm mt-1">{errors.classification}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Synopsis anglais <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.english_synopsis}
          onChange={(e) => updateField('english_synopsis', e.target.value)}
          className={`w-full border rounded p-2 ${errors.english_synopsis ? 'border-red-500' : ''}`}
          rows={4}
          maxLength={300}
          placeholder="Résumé de votre vidéo (max 300 caractères)"
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.english_synopsis.length}/300 caractères
        </div>
        {errors.english_synopsis && (
          <p className="text-red-500 text-sm mt-1">{errors.english_synopsis}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Synopsis original
        </label>
        <textarea
          value={formData.original_synopsis}
          onChange={(e) => updateField('original_synopsis', e.target.value)}
          className={`w-full border rounded p-2 ${errors.original_synopsis ? 'border-red-500' : ''}`}
          rows={4}
          maxLength={300}
          placeholder="Résumé dans la langue originale (max 300 caractères)"
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.original_synopsis.length}/300 caractères
        </div>
        {errors.original_synopsis && (
          <p className="text-red-500 text-sm mt-1">{errors.original_synopsis}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Stack technique <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.tech_stack}
          onChange={(e) => updateField('tech_stack', e.target.value)}
          className={`w-full border rounded p-2 ${errors.tech_stack ? 'border-red-500' : ''}`}
          rows={3}
          maxLength={500}
          placeholder="Technologies utilisées (max 500 caractères)"
        />
        {errors.tech_stack && (
          <p className="text-red-500 text-sm mt-1">{errors.tech_stack}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Méthode créative <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.creative_method}
          onChange={(e) => updateField('creative_method', e.target.value)}
          className={`w-full border rounded p-2 ${errors.creative_method ? 'border-red-500' : ''}`}
          rows={3}
          maxLength={500}
          placeholder="Décrivez votre méthode créative (max 500 caractères)"
        />
        {errors.creative_method && (
          <p className="text-red-500 text-sm mt-1">{errors.creative_method}</p>
        )}
      </div>
    </div>
  );
};

export default SubmissionForm;
