import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Edit2, Trash2, Loader2, ArrowUp, ArrowDown, Search, Info, X } from 'lucide-react';
import { AdminSectionHeader } from '../shared';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../hooks/useAuth';
import { getUsersService } from '../../../../services/auth.service';
import { changeUserRoleService, deleteUserService } from './adminUsersServices';


const roleIdToLabel = (roleId, language) => {
  const labels = {
    1: language === 'fr' ? 'Selecteur' : 'Selector',
    2: 'Admin',
    3: language === 'fr' ? 'Super admin' : 'Super admin',
  };
  return labels[roleId] ?? String(roleId);
};

const formatDate = (value, language) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdminUsers = () => {
  const { user, refreshUser } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [roleEditUser, setRoleEditUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      // Default: desc for dates and role (highest first); asc for text
      const defaultDesc = ['created_at', 'last_login', 'role_id'].includes(key);
      setSortDir(defaultDesc ? 'desc' : 'asc');
    }
  };

  const visibleUsers = useMemo(() => {
    let list = [...users];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          (u.firstname && u.firstname.toLowerCase().includes(q)) ||
          (u.lastname && u.lastname.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'user') {
        const nameA = `${(a.firstname || '')} ${(a.lastname || '')}`.trim();
        const nameB = `${(b.firstname || '')} ${(b.lastname || '')}`.trim();
        cmp = nameA.localeCompare(nameB);
      } else if (sortKey === 'email') {
        cmp = (a.email || '').localeCompare(b.email || '');
      } else if (sortKey === 'last_login') {
        cmp = new Date(a.last_login || 0) - new Date(b.last_login || 0);
      } else if (sortKey === 'role_id') {
        cmp = (a.role_id || 0) - (b.role_id || 0);
      } else {
        cmp = new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [users, searchQuery, sortKey, sortDir]);

  // Only super admin (role_id === 3) can access this page
  if (user && user.role_id !== 3) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-4 min-h-[200px]">
        <p className="text-gray-400">
          {language === 'fr' ? "Vous n'êtes pas autorisé à accéder à cette page." : 'You are not authorized to access this page.'}
        </p>
        <button
          type="button"
          className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-bold uppercase hover:bg-gray-800"
          onClick={() => navigate('/dashboard')}
        >
          {language === 'fr' ? 'Retour' : 'Back'}
        </button>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const response = await getUsersService();
      setUsers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserRole = async (userId, new_role_id) => {
    setRoleUpdating(true);
    setActionError(null);
    try {
      await changeUserRoleService(userId, new_role_id);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role_id: new_role_id } : u))
      );
      if (user?.id === userId) {
        await refreshUser();
      }
      setRoleEditUser(null);
    } catch (err) {
      setActionError(err?.message || (language === 'fr' ? 'Erreur lors du changement de rôle' : 'Error changing role'));
    } finally {
      setRoleUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeleting(true);
    setActionError(null);
    try {
      await deleteUserService(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteConfirmUser(null);
    } catch (err) {
      setActionError(err?.message || (language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting user'));
    } finally {
      setDeleting(false);
    }
  };

  
  return (
    <div className="space-y-4">
      <AdminSectionHeader
        title={language === 'fr' ? 'Utilisateurs' : 'Users'}
        subtitle={language === 'fr' ? 'Gérez les comptes des utilisateurs.' : 'Manage users accounts.'}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-gray-400" size={32} />
          <p className="text-gray-500 text-sm">
            {language === 'fr' ? 'Chargement des utilisateurs...' : 'Loading users...'}
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Info className="text-red-400" size={32} />
          <p className="text-red-300 text-sm">
            {language === 'fr' ? 'Erreur lors du chargement' : 'Failed to load users'}
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 text-sm">
            {language === 'fr' ? 'Aucun utilisateur.' : 'No users.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search and Sort Mobile */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher un utilisateur...' : 'Search user...'}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-800 bg-[#1a1a1a] text-white text-sm focus:border-blue-500 outline-none transition-all shadow-lg"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-xs text-gray-400 outline-none focus:border-blue-500 md:hidden"
              >
                <option value="user">{language === 'fr' ? 'Nom' : 'Name'}</option>
                <option value="email">Email</option>
                <option value="role_id">{language === 'fr' ? 'Rôle' : 'Role'}</option>
                <option value="last_login">{language === 'fr' ? 'Connexion' : 'Login'}</option>
                <option value="created_at">{language === 'fr' ? 'Création' : 'Created'}</option>
              </select>
              <button
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-[#1a1a1a] border border-gray-800 rounded-xl text-gray-400 md:hidden"
              >
                {sortDir === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]/30 shadow-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-[#111]">
                  <th className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('user')}>
                    <div className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                      {language === 'fr' ? 'Utilisateur' : 'User'}
                      {sortKey === 'user' && (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('email')}>
                    <div className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                      {language === 'fr' ? 'Email' : 'Email'}
                      {sortKey === 'email' && (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('role_id')}>
                    <div className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                      {language === 'fr' ? 'Rôle' : 'Role'}
                      {sortKey === 'role_id' && (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('last_login')}>
                    <div className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-black tracking-widest whitespace-nowrap">
                      {language === 'fr' ? 'Dernière connexion' : 'Last login'}
                      {sortKey === 'last_login' && (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-gray-500 uppercase text-[10px] font-black tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {visibleUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      {language === 'fr' ? 'Aucun résultat' : 'No results'}
                    </td>
                  </tr>
                ) : (
                  visibleUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{u.firstname} {u.lastname}</div>
                        <div className="text-[10px] text-gray-500 uppercase mt-0.5 md:hidden">{formatDate(u.created_at, language)}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{u.email ?? '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                          u.role_id === 3 ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                          u.role_id === 2 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                          'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>
                          {roleIdToLabel(u.role_id, language)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(u.last_login, language)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            disabled={u.role_id === 3}
                            className={`p-2 rounded-xl transition-all ${u.role_id === 3 ? 'text-gray-800 cursor-not-allowed' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/20'}`}
                            onClick={() => { setActionError(null); setRoleEditUser(u); }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={u.role_id === 3}
                            className={`p-2 rounded-xl transition-all ${u.role_id === 3 ? 'text-gray-800 cursor-not-allowed' : 'bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-600/20 border border-white/5 hover:border-red-500/20'}`}
                            onClick={() => { setActionError(null); setDeleteConfirmUser(u); }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {visibleUsers.length === 0 ? (
              <div className="p-10 text-center text-gray-500 italic bg-[#1a1a1a] rounded-2xl border border-gray-800">
                {language === 'fr' ? 'Aucun résultat' : 'No results'}
              </div>
            ) : (
              visibleUsers.map((u) => (
                <div key={u.id} className="p-5 bg-[#1a1a1a] rounded-[2rem] border border-gray-800/50 shadow-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-black text-lg text-white leading-none">{u.firstname} {u.lastname}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{u.email}</div>
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      u.role_id === 3 ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                      u.role_id === 2 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {roleIdToLabel(u.role_id, language)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-800/50">
                    <div>
                      <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{language === 'fr' ? 'Connexion' : 'Login'}</div>
                      <div className="text-[11px] text-gray-400">{formatDate(u.last_login, language)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{language === 'fr' ? 'Création' : 'Created'}</div>
                      <div className="text-[11px] text-gray-400">{formatDate(u.created_at, language)}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={u.role_id === 3}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all ${
                        u.role_id === 3 
                          ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' 
                          : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 active:scale-95'
                      }`}
                      onClick={() => { setActionError(null); setRoleEditUser(u); }}
                    >
                      <Edit2 size={14} /> {language === 'fr' ? 'Rôle' : 'Role'}
                    </button>
                    <button
                      type="button"
                      disabled={u.role_id === 3}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all ${
                        u.role_id === 3 
                          ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' 
                          : 'bg-red-600/10 text-red-400 border border-red-500/20 active:scale-95'
                      }`}
                      onClick={() => { setActionError(null); setDeleteConfirmUser(u); }}
                    >
                      <Trash2 size={14} /> {language === 'fr' ? 'Supprimer' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}}

      {/* Role update modal */}
      {roleEditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => !roleUpdating && setRoleEditUser(null)}>
          <div className="bg-[#111] border border-gray-800 rounded-xl shadow-xl max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {language === 'fr' ? 'Changer le rôle' : 'Change role'}
              </h3>
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                aria-label="Close"
                onClick={() => !roleUpdating && setRoleEditUser(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {roleEditUser.firstname} {roleEditUser.lastname} ({roleEditUser.email})
            </p>
            {actionError && (
              <p className="text-red-400 text-sm mb-3">{actionError}</p>
            )}
            <div className="flex flex-col gap-2">
              {[1, 2].map((roleId) => {
                const isCurrent = roleEditUser.role_id === roleId;
                const label = roleId === 1 ? (language === 'fr' ? 'Selecteur' : 'Selector') : 'Admin';
                return (
                  <button
                    key={roleId}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => handleChangeUserRole(roleEditUser.id, roleId)}
                    className={`px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700'
                        : 'bg-white/5 text-gray-300 border border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {label}
                    {isCurrent && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({language === 'fr' ? 'rôle actuel' : 'current role'})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {roleUpdating && (
              <div className="mt-3 flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === 'fr' ? 'Mise à jour...' : 'Updating...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => !deleting && setDeleteConfirmUser(null)}>
          <div className="bg-[#111] border border-gray-800 rounded-xl shadow-xl max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-2">
              {language === 'fr' ? 'Supprimer l\'utilisateur' : 'Delete user'}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {language === 'fr'
                ? `Êtes-vous sûr de vouloir supprimer cet utilisateur « ${deleteConfirmUser.email} » ?`
                : `Are you sure you want to delete this user "${deleteConfirmUser.email}"?`}
            </p>
            {actionError && (
              <p className="text-red-400 text-sm mb-3">{actionError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteUser(deleteConfirmUser.id)}
                className="px-4 py-2 rounded-lg bg-red-600/90 text-white hover:bg-red-600 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {language === 'fr' ? 'Supprimer' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
