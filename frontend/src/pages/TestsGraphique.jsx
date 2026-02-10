import React from 'react';
import '../App.css';
import useModal from '../hooks/useModal';
import Modal from '../components/modals/Modal';
import Card from '../components/cards/Card';
import Form from '../components/forms/Form';
import Tag from '../components/tags/Tags.jsx';
import SubmitModal from '../components/modals/SubmitModal.jsx';
import '../components/ui/loading.css';
import Countdown from '../components/coutndown/Countdown.jsx';

export default function Homepage() {
  const loginModal = useModal();
  const formLightModal = useModal();
  const formDarkModal = useModal();
  const submitModal = useModal();

  const handleFormSubmit = (data) => {
    console.log('Données du formulaire:', data);
    alert('Formulaire soumis ! Vérifiez la console pour voir les données.');
  };

  return (
    <div className="pb-20">
      <section className="flex flex-col items-center justify-center min-h-screen gap-10 mb-10">
        <h1 className="text-4xl font-bold text-blue mb-4">Composants UI</h1>

        {/* Section Cards */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              type="text"
              title="1 MINUTE"
              description="FORMAT ULTRA-COURT POUR UN IMPACT MAXIMUM."
            />
            <Card
              type="image"
              image="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop"
              title="PROTOCOL ALPHA"
              subtitle="DIR. STARK"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <input type="text" className="input-dark" placeholder="Input Dark" />
          <input type="text" className="input-light" placeholder="Input Light" />
          <select className="select-dark">
            <option className="select-dark-option" value="1">Option 1</option>
            <option className="select-dark-option" value="2">Option 2</option>
            <option className="select-dark-option" value="3">Option 3</option>
          </select>
          <select className="select-light">
            <option className="select-light-option" value="1">Option 1</option>
            <option className="select-light-option" value="2">Option 2</option>
            <option className="select-light-option" value="3">Option 3</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <button className="btn btn-primary">Primary Action</button>
          <button className="btn btn-secondary">Secondary Action</button>
          <button className="btn btn-modern">Modern Action</button>
          <button className="btn btn-danger">Danger Action</button>
        </div>

        {/* Section Tags */}
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-blue mb-6 text-center">Tags</h2>

          <div className="flex flex-col gap-8">
            {/* Tags Light avec Statut */}
            <div className="p-6 bg-white rounded-xl shadow-md">
              <Tag
                variant="light"
                status="En attente"
                tags={['Animation', 'VFX', 'Motion Design', 'Court-métrage']}
              />
            </div>

            {/* Tags Dark avec Statut */}
            <div className="p-6 bg-gray-900 rounded-xl shadow-md">
              <Tag
                variant="dark"
                status="Approuvé"
                tags={['3D', 'Cinématique', 'Sci-Fi', 'Prix du Jury']}
              />
            </div>
          </div>
        </div>

        {/* Boutons pour ouvrir les différentes modals */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-blue mb-10">Modals</h2>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              className="btn btn-modern"
              onClick={loginModal.openModal}
            >
              Modal Simple
            </button>
            <button
              className="btn btn-primary"
              onClick={formLightModal.openModal}
            >
              Formulaire Light
            </button>
            <button
              className="btn btn-secondary"
              onClick={formDarkModal.openModal}
            >
              Formulaire Dark
            </button>
            <button
              className="btn btn-primary"
              onClick={submitModal.openModal}
            >
              Soumettre un film
            </button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center">
            <div className="loading"></div>
          </div>

        </div>
      </section>

      {/* Modal Simple */}
      <Modal
        isOpen={loginModal.isOpen}
        onClose={loginModal.closeModal}
        title="Modal Simple"
        size="md"
      >
        <p className="mb-4">Contenu basique d'une modal</p>
        <input type="text" className="input-dark" placeholder="Input Dark" />
      </Modal>

      {/* Modal avec Formulaire Light */}
      <Modal
        isOpen={formLightModal.isOpen}
        onClose={formLightModal.closeModal}
        title="Formulaire - Version Light"
        size="lg"
      >
        <Form
          variant="light"
          onSubmit={handleFormSubmit}
          onCancel={formLightModal.closeModal}
        />
      </Modal>

      {/* Modal avec Formulaire Dark */}
      <Modal
        isOpen={formDarkModal.isOpen}
        onClose={formDarkModal.closeModal}
        title="Formulaire - Version Dark"
        size="lg"
      >
        <div className="p-6 rounded-xl">
          <Form
            variant="dark"
            onSubmit={handleFormSubmit}
            onCancel={formDarkModal.closeModal}
          />
        </div>
      </Modal>

      {/* Modal de soumission de film */}
      <SubmitModal
        isOpen={submitModal.isOpen}
        onClose={submitModal.closeModal}
      />
      <Countdown targetDate="2026-03-01T00:00:00" />
    </div>
  );
}
