/**
 * Formulaire infos réalisateur (Partie 3)
 * Design épuré et simple
 */
const CreatorForm = ({ formData, errors, updateField }) => {
  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Informations du réalisateur</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.creator_firstname}
            onChange={(e) => updateField('creator_firstname', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_firstname ? 'border-red-500' : ''}`}
          />
          {errors.creator_firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_firstname}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.creator_lastname}
            onChange={(e) => updateField('creator_lastname', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_lastname ? 'border-red-500' : ''}`}
          />
          {errors.creator_lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_lastname}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.creator_email}
            onChange={(e) => updateField('creator_email', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_email ? 'border-red-500' : ''}`}
          />
          {errors.creator_email && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.creator_phone}
            onChange={(e) => updateField('creator_phone', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_phone ? 'border-red-500' : ''}`}
            maxLength={30}
          />
          {errors.creator_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.creator_mobile}
            onChange={(e) => updateField('creator_mobile', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_mobile ? 'border-red-500' : ''}`}
            maxLength={30}
          />
          {errors.creator_mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_mobile}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Genre <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.creator_gender}
            onChange={(e) => updateField('creator_gender', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_gender ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionner</option>
            <option value="Male">Homme</option>
            <option value="Female">Femme</option>
            <option value="Other">Autre</option>
          </select>
          {errors.creator_gender && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_gender}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Pays <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.creator_country}
            onChange={(e) => updateField('creator_country', e.target.value)}
            className={`w-full border rounded p-2 ${errors.creator_country ? 'border-red-500' : ''}`}
          />
          {errors.creator_country && (
            <p className="text-red-500 text-sm mt-1">{errors.creator_country}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Source de référence
          </label>
          <input
            type="text"
            value={formData.referral_source}
            onChange={(e) => updateField('referral_source', e.target.value)}
            className={`w-full border rounded p-2 ${errors.referral_source ? 'border-red-500' : ''}`}
            placeholder="Comment avez-vous connu le festival ?"
            maxLength={255}
          />
          {errors.referral_source && (
            <p className="text-red-500 text-sm mt-1">{errors.referral_source}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.creator_address}
          onChange={(e) => updateField('creator_address', e.target.value)}
          className={`w-full border rounded p-2 ${errors.creator_address ? 'border-red-500' : ''}`}
        />
        {errors.creator_address && (
          <p className="text-red-500 text-sm mt-1">{errors.creator_address}</p>
        )}
      </div>
    </div>
  );
};

export default CreatorForm;
