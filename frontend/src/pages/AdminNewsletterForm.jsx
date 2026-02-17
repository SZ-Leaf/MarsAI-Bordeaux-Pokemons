import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import CKEditor from '../components/ckeditor/CKEditor';
import {
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
} from '../services/newsletter.service';

function getMessage(err) {
  const m = err?.message;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && (m.fr || m.en)) return m.fr || m.en;
  return 'Une erreur est survenue.';
}

export default function AdminNewsletterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getNewsletterById(id);
        const n = res?.data?.newsletter ?? res?.newsletter;
        if (cancelled || !n) return;
        setTitle(n.title ?? '');
        setSubject(n.subject ?? '');
        setContent(n.content ?? '');
      } catch (err) {
        alert(getMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !content.trim()) {
      alert('Remplissez tous les champs.');
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateNewsletter(id, { title: title.trim(), subject: subject.trim(), content });
        alert('Newsletter mise à jour.');
      } else {
        await createNewsletter({ title: title.trim(), subject: subject.trim(), content });
        alert('Newsletter créée.');
      }
      navigate('/admin/newsletters');
    } catch (err) {
      alert(getMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-color-white">Chargement...</div>
    );
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <h1 className="text-color-white mb-4 text-2xl">
        {isEdit ? 'Modifier la newsletter' : 'Nouvelle newsletter'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[700px]">
        <div>
          <label className="text-color-white mb-1 block">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-md border border-white/20 bg-black/20 text-color-white"
            placeholder="Titre de la newsletter"
            required
          />
        </div>
        <div>
          <label className="text-color-white mb-1 block">Sujet (email) *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 rounded-md border border-white/20 bg-black/20 text-color-white"
            placeholder="Sujet de l'email"
            required
          />
        </div>
        <div>
          <label className="text-color-white mb-1 block">Contenu *</label>
          <CKEditor
            editorKey={isEdit && content ? `edit-${id}-loaded` : `${id ?? 'new'}-init`}
            value={content}
            onChange={setContent}
            placeholder="Contenu de la newsletter..."
          />
        </div>
        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md border-none bg-color-blue text-color-white cursor-pointer disabled:opacity-70"
          >
            {submitting ? 'Envoi...' : isEdit ? 'Enregistrer' : 'Créer'}
          </button>
          <Link to="/admin/newsletters" className="text-color-blue">
            Annuler
          </Link>
        </div>
      </form>

      <p className="mt-6">
        <Link to="/admin/newsletters" className="text-color-blue">Retour à la liste</Link>
      </p>
    </div>
  );
}
