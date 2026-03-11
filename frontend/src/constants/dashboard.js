import { LayoutDashboard, Film, Users, Calendar, Settings, Mail, Send, SquareX, Award, TriangleAlert } from 'lucide-react';
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
        
        ...(user.role_id === 2 || user.role_id === 3 ? [
            { id: 'invitations', label: { fr: 'Invitations', en: 'Invitations' }, icon: Send },
            { id: 'newsletter', label: { fr: 'Newsletter', en: 'Newsletter' }, icon: Mail },
            { id: 'events', label: { fr: 'Évènements', en: 'Events' }, icon: Calendar },
            { id: 'reports', label: {fr: 'Vidéos signalées', en:'Reported videos'}, icon: TriangleAlert},
        ] : []),
        ...(user.role_id === 3 ? [
            { id: 'users', label: { fr: 'Utilisateurs', en: 'Users' }, icon: Users },
        ] : []),
        ...(user.role_id === 2 || user.role_id === 3 ? [
            { id: 'config', label: { fr: 'Configuration', en: 'Configuration' }, icon: Settings },
        ] : []),
    ];
}
export default navItems;
