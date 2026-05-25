import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, CalendarPlus, List, Search,
  Building2, Upload, Users, BookOpen, Bell,
  Calendar, ClipboardList, LogOut, Menu, X, GraduationCap
} from 'lucide-react';
import { useState } from 'react';

const MENUS = {
  TEACHER: [
    { label: 'Tableau de bord', path: '/teacher', icon: LayoutDashboard },
    { label: 'Rechercher une salle', path: '/teacher/search', icon: Search },
    { label: 'Réserver une salle', path: '/teacher/reserve', icon: CalendarPlus },
    { label: 'Mes réservations', path: '/teacher/my-bookings', icon: List },
  ],
  ETUDIANT: [
    { label: 'Tableau de bord', path: '/student', icon: LayoutDashboard },
    { label: 'Emploi du temps', path: '/student/schedule', icon: Calendar },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
  ],
  ADMIN: [
    { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { label: 'Campus & Bâtiments', path: '/admin/campus', icon: Building2 },
    { label: 'Gestion des salles', path: '/admin/rooms', icon: BookOpen },
    { label: 'Import étudiants', path: '/admin/import', icon: Upload },
    { label: 'Utilisateurs', path: '/admin/users', icon: Users },
    { label: 'Structure académique', path: '/admin/academic', icon: GraduationCap },
  ],
  HEAD_OF_DEPT: [
    { label: 'Tableau de bord', path: '/dean', icon: LayoutDashboard },
    { label: 'Programmer un examen', path: '/dean/exam', icon: ClipboardList },
    { label: 'Planning', path: '/dean/planning', icon: Calendar },
  ],
};

const ROLE_LABELS = {
  TEACHER: 'Espace Enseignant',
  ETUDIANT: 'Espace Étudiant',
  ADMIN: 'Administration',
  HEAD_OF_DEPT: 'Chef de Département / Doyen',
};

const ROLE_COLORS = {
  TEACHER: 'bg-green-500',
  ETUDIANT: 'bg-uds-orange',
  ADMIN: 'bg-red-500',
  HEAD_OF_DEPT: 'bg-purple-500',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const role = user?.role || 'ETUDIANT';
  const menuItems = MENUS[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.nom
    ? user.nom.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap size={22} className="text-uds-blue" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Univ. Dschang</p>
            <p className="text-blue-200 text-xs">Réservation des salles</p>
          </div>
        </div>

        {/* Badge rôle */}
        <div className="mt-4">
          <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${ROLE_COLORS[role]}`}>
            {ROLE_LABELS[role]}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-uds-orange text-white shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profil + Déconnexion */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 bg-uds-orange rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-semibold truncate">{user?.nom || 'Utilisateur'}</p>
            <p className="text-blue-300 text-xs truncate">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-red-500 text-white text-sm font-medium transition-all"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-uds-gray overflow-hidden">

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 bg-uds-blue flex-col shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-uds-blue flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Zone principale */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Bouton menu mobile */}
            <button
              className="lg:hidden text-gray-500 hover:text-uds-blue transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <p className="text-uds-blue font-bold text-sm">
                {ROLE_LABELS[role]}
              </p>
              <p className="text-uds-gray-dark text-xs">
                Système de Réservation — Université de Dschang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cloche notification */}
            <button className="relative p-2 text-gray-500 hover:text-uds-blue hover:bg-uds-gray rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-uds-orange rounded-full" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-uds-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.nom}</p>
                <p className="text-xs text-uds-gray-dark">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}