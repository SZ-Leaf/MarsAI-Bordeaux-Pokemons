import { useEffect, useRef, useCallback } from 'react';

const RECAPTCHA_SCRIPT_URL = 'https://www.google.com/recaptcha/api.js?render=explicit';

/**
 * reCAPTCHA v2 (checkbox "Je ne suis pas un robot").
 * Nécessite VITE_RECAPTCHA_SITE_KEY dans .env.
 * En dev sans clé, le parent peut mettre recaptchaToken à 'dev-bypass'.
 */
export default function Recaptcha({ siteKey, onChange, onExpire, error }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const handleCallback = useCallback(
    (token) => {
      onChange?.(token);
    },
    [onChange]
  );

  useEffect(() => {
    if (!siteKey) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.grecaptcha?.render) return;
      try {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: handleCallback,
          'expired-callback': () => {
            onChange?.('');
            onExpire?.();
          },
        });
      } catch (e) {
        console.warn('reCAPTCHA render error:', e);
      }
    };

    if (window.grecaptcha?.render) {
      // Script déjà chargé : attendre que le DOM soit prêt (ref attaché)
      const t = setTimeout(renderWidget, 100);
      return () => clearTimeout(t);
    }

    const script = document.createElement('script');
    script.src = RECAPTCHA_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Laisser le temps au ref d'être attaché
      setTimeout(renderWidget, 100);
    };
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current != null && window.grecaptcha?.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (_) {}
      }
    };
  }, [siteKey, handleCallback, onChange, onExpire]);

  if (!siteKey) {
    return (
      <div className="text-sm text-gray-400 bg-surface/50 p-3 rounded">
        Captcha désactivé (aucune clé configurée).
      </div>
    );
  }

  return (
    <div className="min-h-[78px] flex items-start">
      <div ref={containerRef} className="inline-block" />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
