import React, { useState, useEffect } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { useLanguage } from '../../../../context/LanguageContext';
import {
  updateUserService,
  updateUserPasswordService,
} from '../../../../services/auth.service';
import { I18nError } from '../../../../services/error.service';
import { zodFieldErrors } from '../../../../utils/validation';

function getMessage(err) {
  if (err instanceof I18nError) {
    return err.getMessage?.('fr') || err.getMessage?.('en') || err.message;
  }
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

const AdminOverview = () => {
  const { language } = useLanguage();
  const { user, refreshUser } = useAuth();

  // Update profile state (synced when user loads/changes)
  const [firstname, setFirstname] = useState(user?.firstname ?? '');
  const [lastname, setLastname] = useState(user?.lastname ?? '');
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileFieldErrors, setProfileFieldErrors] = useState({});

  useEffect(() => {
    setFirstname(user?.firstname ?? '');
    setLastname(user?.lastname ?? '');
  }, [user?.firstname, user?.lastname]);

  // Update password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({});

  const isFr = language === 'fr';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    const fn = firstname?.trim();
    const ln = lastname?.trim();
    const payload = {};
    if (fn) payload.firstname = fn;
    if (ln) payload.lastname = ln;
    if (Object.keys(payload).length === 0) {
      alert(isFr ? 'Remplissez au moins le prénom ou le nom.' : 'Fill in at least first name or last name.');
      return;
    }
    setProfileSubmitting(true);
    setProfileFieldErrors({});
    try {
      await updateUserService(user.id, payload);
      await refreshUser();
      setProfileEditing(false);
      alert(isFr ? 'Profil mis à jour.' : 'Profile updated.');
    } catch (err) {
      const fe = zodFieldErrors(err);
      if (Object.keys(fe).length) {
        setProfileFieldErrors(fe);
      } else {
        alert(getMessage(err));
      }
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleCancelProfile = () => {
    setFirstname(user?.firstname ?? '');
    setLastname(user?.lastname ?? '');
    setProfileEditing(false);
    setProfileFieldErrors({});
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const pwd = newPassword?.trim();
    const confirm = confirmPassword?.trim();
    if (!pwd) {
      alert(isFr ? 'Saisissez le nouveau mot de passe.' : 'Enter the new password.');
      return;
    }
    if (pwd !== confirm) {
      alert(isFr ? 'Les deux mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    setPasswordSubmitting(true);
    setPasswordFieldErrors({});
    try {
      await updateUserPasswordService(pwd);
      setNewPassword('');
      setConfirmPassword('');
      alert(isFr ? 'Mot de passe mis à jour.' : 'Password updated.');
    } catch (err) {
      const fe = zodFieldErrors(err);
      if (Object.keys(fe).length) {
        setPasswordFieldErrors(fe);
      } else {
        alert(getMessage(err));
      }
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-gray-500">
        {isFr ? 'Chargement...' : 'Loading...'}
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="section-title">
          {isFr ? 'Mon profil' : 'My profile'}
        </h1>
        <p className="section-subtitle">
          {isFr
            ? 'Modifiez vos informations personnelles ou votre mot de passe.'
            : 'Update your personal information or password.'}
        </p>
        <div className="mt-4 flex items-center gap-2 text-gray-400">
          <Mail size={18} className="text-gray-500" />
          <span className="text-sm">
            {user.email ?? '—'}
          </span>
          <span className="text-[10px] text-gray-500">
            ({isFr ? 'Non modifiable' : 'Cannot be changed'})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update profile */}
        <div className="stat-card bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <User size={18} className="text-pink-400" />
            </div>
            <h2 className="font-bold text-lg">
              {isFr ? 'Informations personnelles' : 'Personal information'}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                  {isFr ? 'Prénom' : 'First name'}
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => { setFirstname(e.target.value); setProfileFieldErrors((p) => ({ ...p, firstname: undefined })); }}
                  disabled={!profileEditing}
                  className="w-full p-3 rounded-xl border border-gray-800 bg-[#0a0a0a] text-white focus:border-pink-500 outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder={isFr ? 'Prénom' : 'First name'}
                />
                {profileFieldErrors.firstname && (
                  <p className="mt-1 text-xs text-red-400">{profileFieldErrors.firstname}</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                  {isFr ? 'Nom' : 'Last name'}
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => { setLastname(e.target.value); setProfileFieldErrors((p) => ({ ...p, lastname: undefined })); }}
                  disabled={!profileEditing}
                  className="w-full p-3 rounded-xl border border-gray-800 bg-[#0a0a0a] text-white focus:border-pink-500 outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder={isFr ? 'Nom' : 'Last name'}
                />
                {profileFieldErrors.lastname && (
                  <p className="mt-1 text-xs text-red-400">{profileFieldErrors.lastname}</p>
                )}
              </div>
              {profileEditing ? (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {profileSubmitting
                      ? (isFr ? 'Enregistrement...' : 'Saving...')
                      : (isFr ? 'Enregistrer' : 'Save')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    disabled={profileSubmitting}
                    className="px-6 py-3 rounded-xl bg-transparent border border-gray-700 hover:bg-white/5 text-gray-400 hover:text-white font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setProfileEditing(true)}
                  className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors cursor-pointer border-none"
                >
                  {isFr ? 'Modifier' : 'Update'}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Update password */}
        <div className="stat-card bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Lock size={18} className="text-blue-400" />
            </div>
            <h2 className="font-bold text-lg">
              {isFr ? 'Changer le mot de passe' : 'Change password'}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                  {isFr ? 'Nouveau mot de passe' : 'New password'} *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordFieldErrors((p) => ({ ...p, password: undefined })); }}
                  className="w-full p-3 rounded-xl border border-gray-800 bg-[#0a0a0a] text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {passwordFieldErrors.password && (
                  <p className="mt-1 text-xs text-red-400">{passwordFieldErrors.password}</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold tracking-wide mb-2 block">
                  {isFr ? 'Confirmer le mot de passe' : 'Confirm password'} *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-800 bg-[#0a0a0a] text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={passwordSubmitting}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {passwordSubmitting
                  ? (isFr ? 'Mise à jour...' : 'Updating...')
                  : (isFr ? 'Mettre à jour le mot de passe' : 'Update password')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
