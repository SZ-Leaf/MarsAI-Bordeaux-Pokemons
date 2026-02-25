import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useLanguage } from '../../../../context/LanguageContext';
import { Loader2, Info, Trash2, Loader, Send, ChevronUp, Mail, ArrowUp, ArrowDown, Search, UserPlus } from 'lucide-react';
import { getPendingInvitations, cancelInvitation, inviteUser } from '../../../../services/invitation.service';
import { AdminSectionHeader } from '../shared';

const ROLE_LABELS = {
   1: { fr: 'Selecteur', en: 'Selector' },
   2: { fr: 'Admin', en: 'Admin' },
   3: { fr: 'Super Admin', en: 'Super Admin' },
};

const Invitations = () => {
   const { user } = useAuth();
   const { language } = useLanguage();
   const [invitations, setInvitations] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [revokingId, setRevokingId] = useState(null);

   const [formOpen, setFormOpen] = useState(false);
   const [inviteEmail, setInviteEmail] = useState('');
   const [inviteRoleId, setInviteRoleId] = useState(1);
   const [sending, setSending] = useState(false);
   const [inviteError, setInviteError] = useState(null);
   const [inviteSuccess, setInviteSuccess] = useState(null);
   const formRef = useRef(null);

   const myRoleId = user?.role_id;
   const isSuperAdmin = myRoleId === 3;

   const [searchQuery, setSearchQuery] = useState('');
   const [sortKey, setSortKey] = useState('created_at');
   const [sortDir, setSortDir] = useState('desc');

   const toggleSort = (key) => {
      if (sortKey === key) {
         setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
         setSortKey(key);
         setSortDir(key === 'created_at' ? 'desc' : 'asc');
      }
   };

   const visibleInvitations = useMemo(() => {
      let list;
      if (myRoleId === 3) list = invitations.filter((inv) => inv.role_id <= 2);
      else if (myRoleId === 2) list = invitations.filter((inv) => inv.role_id === 1);
      else return [];

      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase();
         list = list.filter((inv) => inv.email.toLowerCase().includes(q));
      }

      return [...list].sort((a, b) => {
         let cmp = 0;
         if (sortKey === 'role_id') {
            cmp = a.role_id - b.role_id;
         } else {
            cmp = new Date(a.created_at) - new Date(b.created_at);
         }
         return sortDir === 'asc' ? cmp : -cmp;
      });
   }, [invitations, myRoleId, searchQuery, sortKey, sortDir]);

   const fetchInvitations = async () => {
      setLoading(true);
      try {
         const response = await getPendingInvitations();
         setInvitations(response.data || []);
      } catch (err) {
         setError(err);
      } finally {
         setLoading(false);
      }
   };

   const handleRevoke = async (id) => {
      setRevokingId(id);
      try {
         await cancelInvitation(id);
         setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      } catch (err) {
         setError(err);
      } finally {
         setRevokingId(null);
      }
   };

   const handleInvite = async (e) => {
      e.preventDefault();
      setSending(true);
      setInviteError(null);
      setInviteSuccess(null);
      try {
         const roleToSend = isSuperAdmin ? inviteRoleId : 1;
         await inviteUser(inviteEmail, roleToSend);
         setInviteSuccess(language === 'fr' ? 'Invitation envoyée !' : 'Invitation sent!');
         setInviteEmail('');
         setInviteRoleId(roleToSend);
         fetchInvitations();
      } catch (err) {
         const msg = err?.message?.[language] || err?.message?.en || err?.message;
         setInviteError(msg || (language === 'fr' ? "Erreur lors de l'envoi" : 'Failed to send'));
      } finally {
         setSending(false);
      }
   };

   const toggleForm = () => {
      setFormOpen((prev) => !prev);
      setInviteError(null);
      setInviteSuccess(null);
   };

   useEffect(() => {
      fetchInvitations();
   }, []);

   useEffect(() => {
      if (formOpen && formRef.current) {
         formRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
   }, [formOpen]);

   const formatDate = (dateStr) => {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <div className="space-y-4">
         <AdminSectionHeader
            title="Invitations" 
            subtitle={language === 'fr' ? "Gérez les invitations d'enregistrement." : "Manage register invitations."}
         />
         {/* Invite button */}
         <div className="flex justify-end">
            <button
               type="button"
               onClick={toggleForm}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-colors cursor-pointer border-none"
            >
               {formOpen ?  <ChevronUp size={16} /> : <UserPlus size={16} />}
               {language === 'fr' ? 'Inviter' : 'Invite'}
            </button>
         </div>

         {/* Invite form (slide open) */}
         <div
            ref={formRef}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
               maxHeight: formOpen ? '300px' : '0px',
               opacity: formOpen ? 1 : 0,
            }}
         >
            <form onSubmit={handleInvite} className="rounded-xl border border-gray-800/50 bg-[#111] p-5 space-y-4">
               <div className="flex items-center gap-2 text-white text-sm font-bold">
                  <Mail size={16} className="text-yellow-400" />
                  {language === 'fr' ? "Envoyer une invitation" : "Send an invitation"}
               </div>

               <div className={`flex gap-3 ${isSuperAdmin ? 'flex-col sm:flex-row' : ''}`}>
                  <div className="flex-1">
                     <input
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder={language === 'fr' ? 'Adresse email...' : 'Email address...'}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-[#0a0a0a] text-white placeholder-gray-600 focus:border-yellow-500/50 outline-none transition-colors text-sm"
                     />
                  </div>

                  {isSuperAdmin && (
                     <div className="sm:w-44">
                        <select
                           value={inviteRoleId}
                           onChange={(e) => setInviteRoleId(Number(e.target.value))}
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-[#0a0a0a] text-white outline-none transition-colors text-sm cursor-pointer"
                        >
                           <option value={1}>{ROLE_LABELS[1][language]}</option>
                           <option value={2}>{ROLE_LABELS[2][language]}</option>
                        </select>
                     </div>
                  )}

                  <button
                     type="submit"
                     disabled={sending || !inviteEmail.trim()}
                     className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                     {sending ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                     {language === 'fr' ? 'Envoyer' : 'Send'}
                  </button>
               </div>

               {inviteError && (
                  <p className="text-red-400 text-xs">{inviteError}</p>
               )}
               {inviteSuccess && (
                  <p className="text-green-400 text-xs">{inviteSuccess}</p>
               )}
            </form>
         </div>

         {/* Content */}
         {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
               <Loader2 className="animate-spin text-gray-400" size={32} />
               <p className="text-gray-500 text-sm">
                  {language === "fr" ? "Chargement des invitations..." : "Loading invitations..."}
               </p>
            </div>
         ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
               <Info className="text-red-400" size={32} />
               <p className="text-red-300 text-sm">
                  {language === "fr" ? "Erreur lors du chargement" : "Failed to load invitations"}
               </p>
            </div>
         ) : invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <p className="text-gray-500 text-sm">
                  {language === "fr" ? "Aucune invitation en attente" : "No pending invitations"}
               </p>
            </div>
         ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-800/50">
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="border-b border-gray-800 bg-[#111]">
                        <th className="px-5 py-3">
                           <div className="flex items-center gap-2">
                              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-wide shrink-0">Email</span>
                              <div className="relative flex-1 max-w-[200px]">
                                 <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
                                 <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                                    className="w-full pl-6 pr-2 py-1 rounded-lg border border-gray-700/50 bg-transparent text-white text-xs placeholder-gray-600 focus:border-gray-500 outline-none transition-colors"
                                 />
                              </div>
                           </div>
                        </th>
                        <th
                           className="px-5 py-3 text-gray-500 uppercase text-[10px] font-bold tracking-wide cursor-pointer select-none hover:text-gray-300 transition-colors"
                           onClick={() => toggleSort('role_id')}
                        >
                           <span className="inline-flex items-center gap-1">
                              {language === "fr" ? "Rôle" : "Role"}
                              {sortKey === 'role_id' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                           </span>
                        </th>
                        <th
                           className="px-5 py-3 text-gray-500 uppercase text-[10px] font-bold tracking-wide cursor-pointer select-none hover:text-gray-300 transition-colors"
                           onClick={() => toggleSort('created_at')}
                        >
                           <span className="inline-flex items-center gap-1">
                              {language === "fr" ? "Date d'invitation" : "Invited on"}
                              {sortKey === 'created_at' && (sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                           </span>
                        </th>
                        <th className="px-5 py-3 text-gray-500 uppercase text-[10px] font-bold tracking-wide text-right">
                           {language === "fr" ? "Action" : "Action"}
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {visibleInvitations.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="px-5 py-10 text-center text-gray-500 text-sm">
                              {language === "fr" ? "Aucun résultat" : "No results"}
                           </td>
                        </tr>
                     ) : visibleInvitations.map((inv) => (
                        <tr
                           key={inv.id}
                           className="border-b border-gray-800/50 last:border-b-0 hover:bg-white/2 transition-colors"
                        >
                           <td className="px-5 py-4 text-white font-medium">{inv.email}</td>
                           <td className="px-5 py-4">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-gray-700 text-gray-300 text-xs font-medium">
                                 {ROLE_LABELS[inv.role_id]?.[language] ?? `Role ${inv.role_id}`}
                              </span>
                           </td>
                           <td className="px-5 py-4 text-gray-400">{formatDate(inv.created_at)}</td>
                           <td className="px-5 py-4 text-right">
                              <button
                                 type="button"
                                 onClick={() => handleRevoke(inv.id)}
                                 disabled={revokingId === inv.id}
                                 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-red-800/50 text-red-400 hover:bg-red-500/10 hover:border-red-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                 {revokingId === inv.id ? (
                                    <Loader size={13} className="animate-spin" />
                                 ) : (
                                    <Trash2 size={13} />
                                 )}
                                 {language === "fr" ? "Révoquer" : "Revoke"}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>

               </table>
            </div>
         )}
      </div>
   );
};

export default Invitations;
