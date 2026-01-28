import React from 'react';
import '../App.css';
import useModal from '../utils/useModal';
import Modal from '../components/ui/modal/Modal';

export default function Homepage() {
  const loginModal = useModal();

  return (
    <div>
      <section className="flex flex-col items-center justify-center h-screen gap-10">
        <div className="flex flex-col gap-4">
          <input type="text" className="input-dark" placeholder="Input Dark" />
          <input type="text" className="input-light" placeholder="Input Light" />
        </div>

        <div className="flex flex-col gap-4">
          <button className="btn btn-primary">Primary Action</button>
          <button className="btn btn-secondary">Secondary Action</button>
          <button className="btn btn-modern">Modern Action</button>
          <button className="btn btn-danger">Danger Action</button>
        </div>

        {/* Boutons pour ouvrir les différentes modals */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-center">Exemples de Modals avec Forms</h3>
          <div className="flex gap-3 flex-wrap justify-center">
            <button 
              className="btn btn-modern" 
              onClick={loginModal.openModal}
            >
              Modal
            </button>
            
          </div>
        </div>
      </section>

      {/* Modal de Connexion */}
      <Modal
        isOpen={loginModal.isOpen}
        onClose={loginModal.closeModal}
        title="Modal"
        size="md"
      >
        <p>Contenu du modal</p>
        <input type="text" className="input-dark" placeholder="Input Dark" />
      </Modal>
    </div>
  );
}
