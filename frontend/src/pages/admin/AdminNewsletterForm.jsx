import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';
import {
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
} from '../../services/newsletter.service';

function getMessage(err) {
  const m = err?.message;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && (m.fr || m.en)) return m.fr || m.en;
  return 'Une erreur est survenue.';
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxWidth: '700px',
};
const inputStyle = {
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.2)',
  color: 'var(--color-white)',
  width: '100%',
};
const labelStyle = { color: 'var(--color-white)', marginBottom: '0.25rem' };
const btnStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  border: 'none',
  background: 'var(--color-blue)',
  color: 'var(--color-white)',
  cursor: 'pointer',
  alignSelf: 'flex-start',
};

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
    return <div style={{ padding: '1.5rem', color: 'var(--color-white)' }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem', fontSize: '1.5rem' }}>
        {isEdit ? 'Modifier la newsletter' : 'Nouvelle newsletter'}
      </h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle}>Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="Titre de la newsletter"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Sujet (email) *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={inputStyle}
            placeholder="Sujet de l'email"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Contenu *</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Contenu de la newsletter..."
            minHeight="280px"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="submit" disabled={submitting} style={btnStyle}>
            {submitting ? 'Envoi...' : isEdit ? 'Enregistrer' : 'Créer'}
          </button>
          <Link to="/admin/newsletters" style={{ color: 'var(--color-blue)' }}>
            Annuler
          </Link>
        </div>
      </form>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/admin/newsletters" style={{ color: 'var(--color-blue)' }}>Retour à la liste</Link>
      </p>
    </div>
  );
}
