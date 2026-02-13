import { LayoutDashboard, Film, Users, Calendar, Settings, Mail } from 'lucide-react';

const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'films', label: 'Gestion vidéos', icon: Film },
    { id: 'events', label: 'Évènements', icon: Calendar },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'config', label: 'Configuration', icon: Settings },
];

export default navItems;
