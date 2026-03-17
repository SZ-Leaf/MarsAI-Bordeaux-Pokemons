import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { AdminSectionHeader, AdminSearchInput } from '../../shared';
import { juryService } from '../../../../../services/jury.service';
import JuryCreateModal from './jury/JuryCreateModal';
import JuryEditModal from './jury/JuryEditModal';
import { useLanguage } from '../../../../../context/LanguageContext';

const coverUrl = (cover) => {
  if (!cover) return null;
  return `/${String(cover).replace(/^\/+/, '')}`;
};

const AdminJury = () => {
  const {language} = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await juryService.list();
      const data = res?.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce membre du jury ?')) return;
    try {
      await juryService.remove(id);
      await refresh();
    } catch (err) {
      setApiError(err);
    }
  };

  const filteredItems = searchTerm.trim()
    ? items.filter(
        (j) =>
          `${j.firstname || ''} ${j.lastname || ''} ${j.job || ''}`
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
      )
    : items;

  return (
    <div className="p-2">
      <AdminSectionHeader
        title="Jury"
        subtitle={language === 'fr' ? 'Gérez les membres du jury du festival.' : 'Manage the jury members of the festival.'}
        action={{
          label: language === 'fr' ? 'Ajouter un membre' : 'Add a member',
          icon: Plus,
          onClick: () => setCreateOpen(true),
          color: 'blue',
        }}
      />

      {apiError && (
        <div className="alert alert-error mb-4">
          <div className="alert-error-text">
            Erreur {apiError.httpStatus ? `(HTTP ${apiError.httpStatus})` : ''} —{' '}
            {apiError.message?.fr || apiError.message?.en || 'Une erreur est survenue'}
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <AdminSearchInput
            placeholder={language === 'fr' ? 'Rechercher par nom ou activité...' : 'Search by name or activity...'}
            className="w-96"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-gray-400 mb-4" size={32} />
            <p className="text-sm text-gray-500">Chargement du jury...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">
              {searchTerm.trim() ? 'Aucun membre ne correspond à la recherche.' : 'Aucun membre du jury.'}
            </p>
            {!searchTerm.trim() && (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold uppercase hover:bg-blue-500/30"
              >
                {language === 'fr' ? 'Ajouter un membre' : 'Add a member'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-800 bg-[#111]">
                    <th className="px-6 py-4">{language === 'fr' ? 'Membre' : 'Member'}</th>
                    <th className="px-6 py-4">{language === 'fr' ? 'Activité' : 'Activity'}</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredItems.map((j) => {
                    const name = `${j.firstname || ''} ${j.lastname || ''}`.trim() || '—';
                    const imgSrc = coverUrl(j.cover);
                    return (
                      <tr key={j.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={name}
                                className="w-10 h-10 rounded-full object-cover bg-gray-800 mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-800 mr-3 flex items-center justify-center text-gray-500 text-xs">
                                ?
                              </div>
                            )}
                            <div className="font-bold text-sm text-blue-400">{name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-400">{j.job || '—'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setEditId(j.id)}
                              className="p-2 hover:bg-purple-500/10 hover:text-purple-400 rounded-lg transition-colors"
                              aria-label="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(j.id)}
                              className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                              aria-label="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((j) => {
                const name = `${j.firstname || ''} ${j.lastname || ''}`.trim() || '—';
                const imgSrc = coverUrl(j.cover);
                return (
                  <div key={j.id} className="p-4 bg-[#1a1a1a] rounded-[2rem] border border-gray-800/50 shadow-lg space-y-4">
                    <div className="flex items-center gap-4">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={name}
                          className="w-16 h-16 rounded-2xl object-cover bg-gray-800 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-500 text-xs shrink-0">
                          ?
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-white text-lg leading-tight truncate">{name}</div>
                        <div className="text-xs text-gray-500 truncate mt-1">{j.job || '—'}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditId(j.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl text-xs font-bold active:scale-95 transition-all"
                      >
                        <Edit2 size={14} />
                        {language === 'fr' ? 'Modifier' : 'Edit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(j.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-bold active:scale-95 transition-all"
                      >
                        <Trash2 size={14} />
                        {language === 'fr' ? 'Supprimer' : 'Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <JuryCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          refresh();
        }}
      />

      <JuryEditModal
        isOpen={editId != null}
        onClose={() => setEditId(null)}
        juryId={editId}
        onUpdated={() => {
          setEditId(null);
          refresh();
        }}
      />
    </div>
  );
};

export default AdminJury;
