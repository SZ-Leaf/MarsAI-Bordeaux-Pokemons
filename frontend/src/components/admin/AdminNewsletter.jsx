import React, { useState, useEffect } from 'react';
import { Send, Users, Mail, ArrowLeft, Download, Trash2, Eye, Edit3, Plus } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';
import AdminStatCard from './shared/AdminStatCard';
import CKEditor from '../ckeditor/CKEditor';
import { useLanguage } from '../../context/LanguageContext';
import {
  getNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  sendNewsletter,
  listSubscribers,
} from '../../services/newsletter.service';

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

function escapeCsvCell(value) {
  const s = String(value ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// ─── List sub-view ───────────────────────────────────────────────────────────

const NewsletterList = ({ language, onNew, onEdit, onView }) => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(null);

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

  const loadSubscriberCount = async () => {
    try {
      const res = await listSubscribers({ limit: 1, offset: 0 });
      const count = res?.data?.total ?? res?.total ?? null;
      setSubscriberCount(count);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    load();
    loadSubscriberCount();
  }, []);

  const handleDelete = async (id, title) => {
    const msg = language === 'fr'
      ? `Supprimer la newsletter « ${title || id} » ?`
      : `Delete newsletter "${title || id}"?`;
    if (!window.confirm(msg)) return;
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
    const msg = language === 'fr'
      ? `Envoyer la newsletter « ${title || id} » à tous les abonnés ?`
      : `Send newsletter "${title || id}" to all subscribers?`;
    if (!window.confirm(msg)) return;
    setActionId(id);
    try {
      await sendNewsletter(id);
      alert(language === 'fr' ? 'Envoi lancé.' : 'Sending started.');
      await load();
    } catch (err) {
      alert(getMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const all = [];
      let offset = 0;
      const limit = 100;
      let chunk;
      do {
        const res = await listSubscribers({ limit, offset });
        chunk = res?.data?.subscribers ?? res?.subscribers ?? [];
        if (Array.isArray(chunk)) all.push(...chunk);
        offset += limit;
      } while (chunk.length === limit);

      const header = 'email';
      const rows = all.map((s) => escapeCsvCell(s.email));
      const csv = [header, ...rows].join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(getMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const sentCount = newsletters.filter((n) => n.status === 'sent').length;
  const draftCount = newsletters.filter((n) => n.status !== 'sent').length;

  return (
    <>
      <AdminSectionHeader
        title="Newsletter"
        subtitle={
          language === 'fr'
            ? 'Gérez et envoyez vos newsletters aux abonnés.'
            : 'Manage and send newsletters to subscribers.'
        }
        action={{
          label: language === 'fr' ? 'Nouvelle newsletter' : 'New newsletter',
          icon: Plus,
          onClick: onNew,
          color: 'pink',
        }}
      />

      <div className="stats-grid">
        <AdminStatCard
          title={language === 'fr' ? 'Total abonnés' : 'Total subscribers'}
          value={subscriberCount !== null ? subscriberCount.toLocaleString() : '—'}
          icon={Users}
          iconColor="text-pink-400"
        />
        <AdminStatCard
          title={language === 'fr' ? 'Newsletters envoyées' : 'Sent newsletters'}
          value={sentCount}
          icon={Mail}
          iconColor="text-blue-400"
        />
        <AdminStatCard
          title={language === 'fr' ? 'Brouillons' : 'Drafts'}
          value={draftCount}
          icon={Edit3}
          iconColor="text-orange-400"
        />
        <AdminStatCard
          title={language === 'fr' ? 'Exporter les abonnés' : 'Export subscribers'}
          value="CSV"
          buttonText={
            exporting
              ? (language === 'fr' ? 'Export...' : 'Exporting...')
              : (language === 'fr' ? 'Télécharger' : 'Download')
          }
          icon={Download}
          iconColor="text-green-400"
        />
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold">
            {language === 'fr' ? 'Historique des newsletters' : 'Newsletter history'}
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            {language === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : newsletters.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {language === 'fr' ? 'Aucune newsletter.' : 'No newsletters yet.'}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-[10px] uppercase font-bold border-b border-gray-800">
                <th className="px-6 py-4">{language === 'fr' ? 'Titre' : 'Title'}</th>
                <th className="px-6 py-4">{language === 'fr' ? 'Sujet' : 'Subject'}</th>
                <th className="px-6 py-4">{language === 'fr' ? 'Statut' : 'Status'}</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {newsletters.map((n) => (
                <tr key={n.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm text-pink-400">{n.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {language === 'fr' ? n.subject : (n.subject_en || n.subject)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        n.status === 'sent'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      {n.status === 'sent'
                        ? (language === 'fr' ? 'Envoyée' : 'Sent')
                        : (language === 'fr' ? 'Brouillon' : 'Draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {n.status === 'sent' ? (
                        <button
                          onClick={() => onView(n.id)}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-none p-0"
                          title={language === 'fr' ? 'Visualiser' : 'View'}
                        >
                          <Eye size={16} />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onEdit(n.id)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-none p-0"
                            title={language === 'fr' ? 'Modifier' : 'Edit'}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleSend(n.id, n.title)}
                            disabled={actionId === n.id}
                            className="text-green-400 hover:text-green-300 transition-colors cursor-pointer bg-transparent border-none p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={language === 'fr' ? 'Envoyer' : 'Send'}
                          >
                            <Send size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(n.id, n.title)}
                            disabled={actionId === n.id}
                            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-transparent border-none p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={language === 'fr' ? 'Supprimer' : 'Delete'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

// ─── Form sub-view (create + edit) ──────────────────────────────────────────

const NewsletterForm = ({ language, editId, onBack, onSaved }) => {
  const isEdit = Boolean(editId);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [subjectEn, setSubjectEn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getNewsletterById(editId);
        const n = res?.data?.newsletter ?? res?.newsletter;
        if (cancelled || !n) return;
        setTitle(n.title ?? '');
        setSubject(n.subject ?? '');
        setContent(n.content ?? '');
        setSubjectEn(n.subject_en ?? '');
        setContentEn(n.content_en ?? '');
      } catch (err) {
        alert(getMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !content.trim()) {
      alert(language === 'fr' ? 'Remplissez tous les champs obligatoires (FR).' : 'Fill in all required fields (FR).');
      return;
    }
    if (!subjectEn.trim() || !contentEn.trim()) {
      alert(language === 'fr' ? 'Remplissez tous les champs obligatoires (EN).' : 'Fill in all required fields (EN).');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        subject: subject.trim(),
        content,
        subject_en: subjectEn.trim(),
        content_en: contentEn,
      };
      if (isEdit) {
        await updateNewsletter(editId, payload);
        alert(language === 'fr' ? 'Newsletter mise à jour.' : 'Newsletter updated.');
      } else {
        await createNewsletter(payload);
        alert(language === 'fr' ? 'Newsletter créée.' : 'Newsletter created.');
      }
      onSaved();
    } catch (err) {
      alert(getMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        {language === 'fr' ? 'Chargement...' : 'Loading...'}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer p-0"
      >
        <ArrowLeft size={18} />
        {language === 'fr' ? 'Retour à la liste' : 'Back to list'}
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {isEdit
          ? (language === 'fr' ? 'Modifier la newsletter' : 'Edit newsletter')
          : (language === 'fr' ? 'Nouvelle newsletter' : 'New newsletter')}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[750px]">
        <div>
          <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
            {language === 'fr' ? 'Titre' : 'Title'} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-800 bg-[#1a1a1a] text-white focus:border-pink-500 outline-none transition-colors"
            placeholder={language === 'fr' ? 'Titre de la newsletter' : 'Newsletter title'}
            required
          />
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-lg font-semibold mb-1">Version française</h2>
          <p className="text-gray-500 text-sm mb-4">
            {language === 'fr'
              ? 'Les abonnés ayant choisi la langue FR recevront cette version.'
              : 'Subscribers who selected FR will receive this version.'}
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                {language === 'fr' ? 'Sujet (FR)' : 'Subject (FR)'} *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-800 bg-[#1a1a1a] text-white focus:border-pink-500 outline-none transition-colors"
                placeholder={language === 'fr' ? "Sujet de l'email" : 'Email subject'}
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                {language === 'fr' ? 'Contenu (FR)' : 'Content (FR)'} *
              </label>
              <CKEditor
                editorKey={isEdit && content ? `edit-${editId}-loaded` : `${editId ?? 'new'}-init`}
                value={content}
                onChange={setContent}
                placeholder={language === 'fr' ? 'Contenu de la newsletter...' : 'Newsletter content...'}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-lg font-semibold mb-1">Version anglaise</h2>
          <p className="text-gray-500 text-sm mb-4">
            {language === 'fr'
              ? 'Les abonnés ayant choisi la langue EN recevront cette version.'
              : 'Subscribers who selected EN will receive this version.'}
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                {language === 'fr' ? 'Sujet (EN)' : 'Subject (EN)'} *
              </label>
              <input
                type="text"
                value={subjectEn}
                onChange={(e) => setSubjectEn(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-800 bg-[#1a1a1a] text-white focus:border-pink-500 outline-none transition-colors"
                placeholder="Email subject"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                {language === 'fr' ? 'Contenu (EN)' : 'Content (EN)'} *
              </label>
              <CKEditor
                editorKey={isEdit && contentEn ? `edit-en-${editId}-loaded` : `en-${editId ?? 'new'}-init`}
                value={contentEn}
                onChange={setContentEn}
                placeholder="Newsletter content..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? (language === 'fr' ? 'Envoi...' : 'Saving...')
              : isEdit
                ? (language === 'fr' ? 'Enregistrer' : 'Save')
                : (language === 'fr' ? 'Créer' : 'Create')}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-transparent border border-gray-700 hover:bg-white/5 text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
        </div>
      </form>
    </>
  );
};

// ─── View sub-view (read-only for sent newsletters) ─────────────────────────

const NewsletterView = ({ language, newsletterId, onBack }) => {
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getNewsletterById(newsletterId);
        const n = res?.data?.newsletter ?? res?.newsletter;
        if (!cancelled && n) setNewsletter(n);
      } catch (err) {
        if (!cancelled) alert(getMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [newsletterId]);

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        {language === 'fr' ? 'Chargement...' : 'Loading...'}
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div>
        <p className="text-gray-400 mb-4">
          {language === 'fr' ? 'Newsletter introuvable.' : 'Newsletter not found.'}
        </p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft size={18} />
          {language === 'fr' ? 'Retour à la liste' : 'Back to list'}
        </button>
      </div>
    );
  }

  const viewBlockClass =
    'rounded-xl border border-gray-800 bg-[#0a0a0a] p-6 text-gray-300 leading-relaxed [&_a]:text-cyan-400 [&_ul]:list-disc [&_ol]:list-decimal [&_ul,_ol]:pl-6';

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer p-0"
      >
        <ArrowLeft size={18} />
        {language === 'fr' ? 'Retour à la liste' : 'Back to list'}
      </button>

      <h1 className="text-3xl font-bold mb-8">{newsletter.title}</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-800">
          Version française
        </h2>
        <p className="text-gray-400 mb-4">
          <span className="font-medium text-gray-300">
            {language === 'fr' ? 'Sujet :' : 'Subject:'}
          </span>{' '}
          {newsletter.subject}
        </p>
        <div
          className={viewBlockClass}
          dangerouslySetInnerHTML={{ __html: newsletter.content || '' }}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-800">
          Version anglaise
        </h2>
        <p className="text-gray-400 mb-4">
          <span className="font-medium text-gray-300">
            {language === 'fr' ? 'Sujet :' : 'Subject:'}
          </span>{' '}
          {newsletter.subject_en || '—'}
        </p>
        <div
          className={viewBlockClass}
          dangerouslySetInnerHTML={{ __html: newsletter.content_en || '' }}
        />
      </section>
    </>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────

const AdminNewsletter = () => {
  const { language } = useLanguage();
  const [view, setView] = useState('list');
  const [selectedId, setSelectedId] = useState(null);

  const navigateTo = (newView, id = null) => {
    setView(newView);
    setSelectedId(id);
  };

  return (
    <div className="p-2">
      {view === 'list' && (
        <NewsletterList
          language={language}
          onNew={() => navigateTo('form')}
          onEdit={(id) => navigateTo('form', id)}
          onView={(id) => navigateTo('view', id)}
        />
      )}
      {view === 'form' && (
        <NewsletterForm
          language={language}
          editId={selectedId}
          onBack={() => navigateTo('list')}
          onSaved={() => navigateTo('list')}
        />
      )}
      {view === 'view' && (
        <NewsletterView
          language={language}
          newsletterId={selectedId}
          onBack={() => navigateTo('list')}
        />
      )}
    </div>
  );
};

export default AdminNewsletter;
