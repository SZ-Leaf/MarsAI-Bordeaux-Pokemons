import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  getNewsletters,
  deleteNewsletter,
  sendNewsletter,
} from '../../services/newsletter.service';

function getMessage(err) {
  const m = err?.message;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && (m.fr || m.en)) return m.fr || m.en;
  return 'Une erreur est survenue.';
}

export default function AdminNewslettersList() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getNewsletters();
      const list = res?.data?.newsletters ?? res?.newsletters ?? [];
      setNewsletters(Array.isArray(list) ? list : []);
    } catch (err) {
      alert(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Supprimer la newsletter « ${title || id } » ?`)) return;
    setActionId(id);
    try {
      await deleteNewsletter(id);
      await load();
    } catch (err) {
      alert(getMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const handleSend = async (id, title) => {
    if (!window.confirm(`Envoyer la newsletter « ${title || id } » à tous les abonnés ?`)) return;
    setActionId(id);
    try {
      await sendNewsletter(id);
      alert('Envoi lancé.');
      await load();
    } catch (err) {
      alert(getMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--color-white)', margin: 0, fontSize: '1.5rem' }}>Newsletters</h1>
        <Link
          to="/admin/newsletters/new"
          style={{
            color: 'var(--color-white)',
            background: 'var(--color-blue)',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Nouvelle newsletter
        </Link>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-white)' }}>Chargement...</p>
      ) : newsletters.length === 0 ? (
        <p style={{ color: 'var(--color-white)' }}>Aucune newsletter.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-white)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Titre</th>
              <th style={{ padding: '0.5rem' }}>Sujet</th>
              <th style={{ padding: '0.5rem' }}>Statut</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.map((n) => (
              <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '0.5rem' }}>{n.title}</td>
                <td style={{ padding: '0.5rem' }}>{n.subject}</td>
                <td style={{ padding: '0.5rem' }}>{n.status === 'sent' ? 'Envoyée' : 'Brouillon'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <Link
                    to={`/admin/newsletters/${n.id}/edit`}
                    style={{ color: 'var(--color-cyan)', marginRight: '0.75rem' }}
                  >
                    Modifier
                  </Link>
                  {n.status !== 'sent' && (
                    <button
                      type="button"
                      onClick={() => handleSend(n.id, n.title)}
                      disabled={actionId === n.id}
                      style={{
                        marginRight: '0.75rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-green)',
                        cursor: actionId === n.id ? 'not-allowed' : 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      Envoyer
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(n.id, n.title)}
                    disabled={actionId === n.id}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-red)',
                      cursor: actionId === n.id ? 'not-allowed' : 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--color-blue)' }}>Retour à l'accueil</Link>
      </p>
    </div>
  );
}
