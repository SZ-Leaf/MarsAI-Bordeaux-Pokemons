import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { Loader2, Info, Trash2 } from 'lucide-react';
import { getPendingInvitations } from '../../services/invitation.service';

const Invitations = () => {
   const { user } = useAuth();
   const { language } = useLanguage();
   const [invitations, setInvitations] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const fetchInvitations = async () => {
      try {
         const response = await getPendingInvitations();
         setInvitations(response.data.invitations || []);
         console.log(response);
      } catch (error) {
         setError(error);
      }
   };

   useEffect(() => {
      fetchInvitations();
   }, []);

   return (
      <>
         {loading ? (
            <div className="loading-container">
               <Loader2 className="loading-icon" size={40} />
               <p className="loading-text">{language === 'fr' ? 'Chargement des invitations...' : 'Loading invitations...'}</p>
            </div>
         ) : error ? (
            <div className="error-container">
               <Info className="error-icon" size={32} />
            </div>
         ) : invitations.length === 0 ? (
            <div className="empty-container">
               <p className="empty-text">{language === 'fr' ? 'Aucune invitation trouvée' : 'No invitations found'}</p>
            </div>
         ) : (
            <div className="invitations-container">
               {invitations.map((invitation) => (
                  <div key={invitation.id} className="invitation-card">
                     <p className="invitation-email">{invitation.email}</p>
                     <p className="invitation-role">{invitation.role}</p>
                     <p className="invitation-created_at">{invitation.created_at}</p>
                     <button className="invitation-button">
                        <Trash2 className="invitation-button-icon" size={20} />
                     </button>
                  </div>
               ))}
            </div>
         )}
      </>
   )
}

export default Invitations;