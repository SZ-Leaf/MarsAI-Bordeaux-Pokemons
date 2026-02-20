import { useEffect, useRef } from 'react';

const RECAPTCHA_SCRIPT_URL = 'https://www.google.com/recaptcha/api.js?render=explicit';

/**
 * reCAPTCHA v2 (checkbox "Je ne suis pas un robot").
 * Nécessite VITE_RECAPTCHA_SITE_KEY dans .env.
 * Les callbacks sont lus via des refs pour éviter de recharger le widget à chaque re-render du parent (ex. cocher CGU/majeur).
 */
export default function Recaptcha({ siteKey, onChange, onExpire, error }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onChangeRef.current = onChange;
    onExpireRef.current = onExpire;
  }, [onChange, onExpire]);

  useEffect(() => {
    if (!siteKey) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.grecaptcha?.render) return;
      // Toujours rendre dans un nouvel élément pour éviter "reCAPTCHA has already been rendered in this element"
      containerRef.current.innerHTML = '';
      const widgetEl = document.createElement('div');
      containerRef.current.appendChild(widgetEl);
      try {
        widgetIdRef.current = window.grecaptcha.render(widgetEl, {
          sitekey: siteKey,
          callback: (token) => onChangeRef.current?.(token),
          'expired-callback': () => {
            onChangeRef.current?.('');
            onExpireRef.current?.();
          },
        });
      } catch (e) {
        console.warn('reCAPTCHA render error:', e);
      }
    };

    const runWhenReady = () => {
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(renderWidget);
      } else {
        renderWidget();
      }
    };

    const scriptSelector = 'script[src*="google.com/recaptcha/api.js"]';
    const existingScript = document.querySelector(scriptSelector);

    const cleanup = () => {
      if (widgetIdRef.current != null && window.grecaptcha?.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {
          // reset peut échouer si le widget est déjà détruit
        }
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };

    if (existingScript) {
      if (window.grecaptcha?.ready) {
        runWhenReady();
      } else {
        const poll = setInterval(() => {
          if (window.grecaptcha?.ready) {
            clearInterval(poll);
            window.grecaptcha.ready(renderWidget);
          }
        }, 50);
        const timeout = setTimeout(() => {
          clearInterval(poll);
          runWhenReady();
        }, 8000);
        return () => {
          clearInterval(poll);
          clearTimeout(timeout);
          cleanup();
        };
      }
      return cleanup;
    }

    const script = document.createElement('script');
    script.src = RECAPTCHA_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = runWhenReady;
    document.head.appendChild(script);

    return cleanup;
  }, [siteKey]);

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
