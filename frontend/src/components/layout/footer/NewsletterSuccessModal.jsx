import React from 'react';
import { Modal } from '../../ui';

const NewsletterSuccessModal = ({ isOpen, onClose, language = 'fr' }) => {
  const title =
    language === 'fr' ? 'Inscription confirmée' : 'Subscription confirmed';
  const message =
    language === 'fr'
      ? "Un email de confirmation vient de t'être envoyé. Ouvre-le et clique sur le lien pour valider ton inscription à la newsletter MarsAI"
      : 'We just sent you a confirmation email. Open it and click the link to validate your subscription to the Mars.AI newsletter.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      size="md"
      closeOnOverlayClick={true}
      showCloseButton={true}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0c0c0c] px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 -left-16 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-[#9d31ff] to-[#e61d8c] shadow-[0_0_30px_rgba(157,49,255,0.6)]">
            <span className="text-xl">📬</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
            {title}
          </h2>

          <p className="text-sm text-white/60 max-w-sm">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-[#9d31ff] to-[#e61d8c] px-8 py-3 text-xs font-black uppercase tracking-[0.25em] text-white shadow-[0_0_30px_rgba(157,49,255,0.4)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(157,49,255,0.6)]"
          >
            {language === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NewsletterSuccessModal;

