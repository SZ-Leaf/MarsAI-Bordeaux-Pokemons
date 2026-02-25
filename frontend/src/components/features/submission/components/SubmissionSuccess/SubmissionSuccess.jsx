/**
 * Composant affichant le message de succès après soumission
 * Les données viennent de l'API dans response.data (submission_id, duration_seconds)
 */
import { useLanguage } from '../../../../../context/LanguageContext';

const SubmissionSuccess = ({ submitSuccess, onReset }) => {
  const data = submitSuccess?.data ?? submitSuccess;
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0c0c0c] px-10 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 -left-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#9d31ff] to-[#e61d8c] shadow-[0_0_40px_rgba(157,49,255,0.6)]">
            <span className="text-2xl">✨</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            {language === 'fr' ? 'Soumission réussie' : 'Submission successful'}
          </h2>

          <p className="text-sm md:text-base text-white/60 max-w-xl">
            {language === 'fr' ? 'Merci d\'avoir participé à MarsAI.' : 'Thank you for participating in MarsAI.'}
          </p>
          <p className="text-sm md:text-base text-white/60 max-w-xl">
            {language === 'fr' ? 'Votre soumission a bien été enregistrée.' : 'Your submission has been successfully recorded.'}
          </p>
          <p className="text-sm md:text-base text-white/60 max-w-xl">
            {language === 'fr' ? 'Vous recevrez un email de confirmation de votre soumission.' : 'You will receive an email confirmation of your submission.'}
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-[#9d31ff] to-[#e61d8c] px-10 py-4 text-xs md:text-sm font-black uppercase tracking-[0.25em] text-white shadow-[0_0_30px_rgba(157,49,255,0.4)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(157,49,255,0.6)]"
          >
            {language === 'fr' ? 'Soumettre un autre film' : 'Submit another film'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
