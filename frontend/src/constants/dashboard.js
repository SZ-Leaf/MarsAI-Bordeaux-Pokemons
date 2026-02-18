import { LayoutDashboard, Film, Users, Calendar, Settings, Mail, Send, SquareX } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = () => {
    const { user, isLoading, initialized } = useAuth();
    if (!initialized || isLoading) {
        return [];
    }
    if (!user) {
        return [];
    }
    return [
        { id: 'overview', label: { fr: 'Overview', en: 'Overview' }, icon: LayoutDashboard },
        { id: 'films', label: { fr: 'Galerie des films', en: 'Video Gallery' }, icon: Film },
        
        ...(user?.data?.role_id === 2 || user?.data?.role_id === 3 ? [
            { id: 'invitations', label: { fr: 'Invitations', en: 'Invitations' }, icon: Send },
            { id: 'rejected-submissions', label: { fr: 'Soumissions rejetées', en: 'Rejected Submissions' }, icon: SquareX },
            { id: 'newsletter', label: { fr: 'Newsletter', en: 'Newsletter' }, icon: Mail },
            { id: 'config', label: { fr: 'Configuration', en: 'Configuration' }, icon: Settings },
            { id: 'events', label: { fr: 'Évènements', en: 'Events' }, icon: Calendar },
        ] : []),
        ...(user?.data?.role_id === 3 ? [
            { id: 'users', label: { fr: 'Utilisateurs', en: 'Users' }, icon: Users },
        ] : []),
    ];
}
export default navItems;
