import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  getNewsletters,
  deleteNewsletter,
  sendNewsletter,
} from '../services/newsletter.service';

function getMessage(err) {
  const fr = err?.message?.fr ?? err?.message?.en;
  const detail = err?.data;
  if (typeof detail === 'string' && detail.trim()) {
    return fr ? `${fr}\n\nDétail: ${detail}` : `Erreur: ${detail}`;
  }
  if (typeof err?.message === 'string') return err.message;
  if (err?.message && typeof err.message === 'object' && (err.message.fr || err.message.en)) {
    return err.message.fr || err.message.en;
  }
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
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-color-white m-0 text-2xl">Newsletters</h1>
        <Link
          to="/admin/newsletters/new"
          className="text-color-white bg-color-blue px-4 py-2 rounded-md no-underline"
        >
          Nouvelle newsletter
        </Link>
      </div>

      {loading ? (
        <p className="text-color-white">Chargement...</p>
      ) : newsletters.length === 0 ? (
        <p className="text-color-white">Aucune newsletter.</p>
      ) : (
        <table className="w-full border-collapse text-color-white">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="p-2">Titre</th>
              <th className="p-2">Sujet</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.map((n) => (
              <tr key={n.id} className="border-b border-white/10">
                <td className="p-2">{n.title}</td>
                <td className="p-2">{n.subject}</td>
                <td className="p-2">{n.status === 'sent' ? 'Envoyée' : 'Brouillon'}</td>
                <td className="p-2">
                  {n.status === 'sent' ? (
                    <Link
                      to={`/admin/newsletters/${n.id}/view`}
                      className="text-color-cyan underline"
                    >
                      Visualiser
                    </Link>
                  ) : (
                    <>
                      <Link
                        to={`/admin/newsletters/${n.id}/edit`}
                        className="text-color-cyan mr-3 underline"
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleSend(n.id, n.title)}
                        disabled={actionId === n.id}
                        className="mr-3 border-none bg-transparent text-color-green cursor-pointer p-0 underline disabled:cursor-not-allowed"
                      >
                        Envoyer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(n.id, n.title)}
                        disabled={actionId === n.id}
                        className="border-none bg-transparent text-color-red cursor-pointer p-0 underline disabled:cursor-not-allowed"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="mt-6">
        <Link to="/" className="text-color-blue">Retour à l'accueil</Link>
      </p>
    </div>
  );
}
