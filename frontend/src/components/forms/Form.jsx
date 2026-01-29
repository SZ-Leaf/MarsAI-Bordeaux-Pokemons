import React, { useState } from 'react';
import '../ui/inputs.css';
import '../ui/buttons.css';

export default function Form({ variant = 'light', onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    category: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    console.log('Form submitted:', formData);
  };

  const inputClass = variant === 'dark' ? 'input-dark' : 'input-light';
  const selectClass = variant === 'dark' ? 'select-dark' : 'select-light';
  const optionClass = variant === 'dark' ? 'select-dark-option' : 'select-light-option';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      
      {/* Section Inputs Text */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold uppercase tracking-wider">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={inputClass}
          placeholder="Entrez votre nom d'utilisateur"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="exemple@email.com"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold uppercase tracking-wider">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={inputClass}
          placeholder="••••••••"
          required
        />
      </div>

      {/* Section Select */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold uppercase tracking-wider">
          Catégorie
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={selectClass}
          required
        >
          <option className={optionClass} value="">Sélectionnez une catégorie</option>
          <option className={optionClass} value="animation">Animation</option>
          <option className={optionClass} value="vfx">VFX</option>
          <option className={optionClass} value="3d">3D Modeling</option>
          <option className={optionClass} value="motion">Motion Design</option>
          <option className={optionClass} value="game">Game Design</option>
        </select>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold uppercase tracking-wider">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={inputClass}
          placeholder="Écrivez votre message ici..."
          rows="4"
          required
        />
      </div>

      {/* Section Boutons - Tous les types */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-2">
          Actions disponibles
        </h3>
        
        {/* Bouton Primary */}
        <button type="submit" className="btn btn-primary">
          Soumettre le formulaire
        </button>

        {/* Bouton Modern */}
        <button type="button" className="btn btn-modern">
          Action moderne
        </button>

        {/* Bouton Secondary */}
        <button type="button" className="btn btn-secondary">
          Action secondaire
        </button>

        {/* Bouton Info */}
        <button type="button" className="btn btn-info">
          Information
        </button>

        {/* Bouton Danger */}
        <button type="button" className="btn btn-danger">
          Supprimer
        </button>
      </div>

      {/* Groupe de boutons horizontal (exemple) */}
      <div className="flex gap-3 mt-2">
        <button type="button" className="btn btn-secondary flex-1">
          Annuler
        </button>
        <button type="submit" className="btn btn-primary flex-1">
          Valider
        </button>
      </div>

    </form>
  );
}
