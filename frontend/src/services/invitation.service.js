import { apiCall } from '../utils/api';

const getPendingInvitations = async () => {
   return apiCall('/api/auth/pending-invites', { method: 'GET' });
};

const cancelInvitation = async (email) => {
   return apiCall(`/api/auth/pending-invites/${encodeURIComponent(email)}`, { method: 'DELETE' });
};

const inviteUser = async (email, roleId) => {
   return apiCall('/api/auth/invite', { method: 'POST', body: JSON.stringify({ email, roleId }) });
};

export { getPendingInvitations, cancelInvitation, inviteUser };