import { LayoutDashboard, Film, Users, Calendar, Settings } from 'lucide-react';

const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, active: true },
    { id: 'films', label: 'Gestion films', icon: Film },
    { id: 'jury', label: 'Distribution & Jury', icon: Users },
    { id: 'events', label: 'Evenements', icon: Calendar },
    { id: 'config', label: 'Configuration Festival', icon: Settings },
];

export default navItems;