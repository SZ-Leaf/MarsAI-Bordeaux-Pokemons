import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { unsubscribeNewsletter } from '../services/newsletter.service';
import { useLanguage } from '../context/LanguageContext';

function getMessage(err) {
  const m = err?.message;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && (m.fr || m.en)) return m.fr || m.en;
  return 'Une erreur est survenue lors de la désinscription.';
}

const NO_TOKEN_STATE = { status: 'error', message: 'Lien invalide ou expiré.' };
const LOADING_STATE = { status: 'loading', message: '' };

export default function NewsletterUnsubscribe() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const successRef = useRef(false);

  const [state, setState] = useState(() =>
    token ? LOADING_STATE : NO_TOKEN_STATE
  );

  useEffect(() => {
    if (!token) return;
    unsubscribeNewsletter(token)
      .then(() => {
        successRef.current = true;
        setState({
          status: 'success',
          message:
            language === 'fr'
              ? 'Tu es bien désinscrit de la newsletter.'
              : 'You have been unsubscribed from the newsletter.',
        });
      })
      .catch((err) => {
        if (successRef.current) return;
        setState({ status: 'error', message: getMessage(err) });
      });
  }, [token, language]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#050509] px-8 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-40 -left-32 h-56 w-56 rounded-full bg-purple-600/25 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-56 w-56 rounded-full bg-pink-500/25 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-5">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#ff6363] to-[#e61d8c] shadow-[0_0_40px_rgba(230,29,140,0.7)]">
            <span className="text-2xl">📭</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            {language === 'fr' ? 'Désinscription newsletter' : 'Newsletter unsubscribe'}
          </h1>

          {state.status === 'loading' && (
            <p className="text-sm md:text-base text-white/70">
              {language === 'fr' ? 'Désinscription en cours...' : 'Unsubscribing...'}
            </p>
          )}

          {state.status === 'success' && (
            <p className="text-sm md:text-base text-emerald-300 max-w-md">
              {state.message}
            </p>
          )}

          {state.status === 'error' && (
            <p className="text-sm md:text-base text-red-300 max-w-md">
              {state.message}
            </p>
          )}

          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white/5 px-7 py-3 text-xs font-black uppercase tracking-[0.25em] text-white border border-white/15 hover:bg-white/10 transition-colors"
          >
            {language === 'fr' ? "Retour à l'accueil" : 'Back to home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
