import React from 'react';
import '../App.css';
import useModal from '../utils/useModal';
import Modal from '../components/Modal';
import Card from '../components/Card';

export default function Homepage() {
  const loginModal = useModal();

  return (
    <div className="pb-20">
      <section className="flex flex-col items-center justify-center min-h-screen gap-10 p-10">
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

        {/* Boutons pour ouvrir les différentes modals */}
        <div className="flex flex-col gap-4">
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
