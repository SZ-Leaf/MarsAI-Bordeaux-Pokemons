import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getNewsletterById } from '../services/newsletter.service';

function getMessage(err) {
  const m = err?.message;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && (m.fr || m.en)) return m.fr || m.en;
  return 'Une erreur est survenue.';
}

export default function AdminNewsletterView() {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getNewsletterById(id);
        const n = res?.data?.newsletter ?? res?.newsletter;
        if (!cancelled && n) setNewsletter(n);
      } catch (err) {
        if (!cancelled) alert(getMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-color-white">Chargement...</div>
    );
  }

  if (!newsletter) {
    return (
      <div className="p-6 max-w-[900px] mx-auto">
        <p className="text-color-white">Newsletter introuvable.</p>
        <p className="mt-4">
          <Link to="/admin/newsletters" className="text-color-blue">Retour à la liste</Link>
        </p>
      </div>
    );
  }

  const viewBlockClass =
    'ckeditor-view-content rounded-md border border-white/20 bg-black/20 p-4 text-color-white [&_a]:text-color-cyan [&_ul]:list-disc [&_ol]:list-decimal [&_ul,_ol]:pl-6';

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <h1 className="text-color-white mb-6 text-2xl">{newsletter.title}</h1>

      {/* Version française */}
      <section className="mb-8">
        <h2 className="text-color-white text-lg font-semibold mb-3 pb-2 border-b border-white/20">
          Version française
        </h2>
        <p className="text-color-white/80 mb-4">
          <span className="font-medium">Sujet (email) :</span> {newsletter.subject}
        </p>
        <div
          className={viewBlockClass}
          dangerouslySetInnerHTML={{ __html: newsletter.content || '' }}
        />
      </section>

      {/* Version anglaise */}
      <section className="mb-8">
        <h2 className="text-color-white text-lg font-semibold mb-3 pb-2 border-b border-white/20">
          Version anglaise
        </h2>
        <p className="text-color-white/80 mb-4">
          <span className="font-medium">Subject (email) :</span> {newsletter.subject_en || '—'}
        </p>
        <div
          className={viewBlockClass}
          dangerouslySetInnerHTML={{ __html: newsletter.content_en || '' }}
        />
      </section>

      <p className="mt-6">
        <Link to="/admin/newsletters" className="text-color-blue">Retour à la liste</Link>
      </p>
    </div>
  );
}
