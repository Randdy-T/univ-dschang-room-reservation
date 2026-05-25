import { useState } from 'react';
import {
  Calendar, Bell, MapPin, Clock,
  BookOpen, CheckCircle, AlertCircle, ArrowRight, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Simulation — vient du Reservation Service + Academic Service
const mockTodayCourses = [
  {
    id: 1, course: 'Algorithmique Avancée', teacher: 'Dr. Tagne',
    room: 'Amphi 1000', building: 'Bâtiment A',
    from: '08:00', to: '10:00', status: 'CONFIRMED',
  },
  {
    id: 2, course: 'Réseaux Informatiques', teacher: 'Pr. Mbarga',
    room: 'Labo Info 1', building: 'Bâtiment C',
    from: '14:00', to: '16:00', status: 'CONFIRMED',
  },
];

const mockNotifications = [
  {
    id: 1, type: 'INFO', message: 'Le cours de Mathématiques est déplacé en Salle 305',
    time: 'Il y a 30 min', read: false,
  },
  {
    id: 2, type: 'SUCCESS', message: 'Votre emploi du temps a été mis à jour pour la semaine prochaine',
    time: 'Il y a 2h', read: false,
  },
  {
    id: 3, type: 'WARNING', message: 'Le cours de Physique est annulé ce jeudi',
    time: 'Hier', read: true,
  },
];

const mockStats = [
  { label: "Cours aujourd'hui", value: 2, icon: BookOpen, color: 'bg-uds-blue' },
  { label: 'Cette semaine', value: 8, icon: Calendar, color: 'bg-uds-orange' },
  { label: 'Notifications', value: 2, icon: Bell, color: 'bg-purple-500' },
  { label: 'Crédits validés', value: 42, icon: GraduationCap, color: 'bg-green-500' },
];

const NOTIF_CONFIG = {
  INFO: { color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  SUCCESS: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  WARNING: { color: 'bg-orange-100 text-uds-orange', icon: AlertCircle },
};

export default function StudentHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">
            Bonjour, {user?.nom || 'Étudiant'} 👋
          </h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/student/schedule')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-blue text-white font-semibold text-sm hover:bg-uds-blue-light transition-all shadow-md"
        >
          <Calendar size={16} />
          Voir mon emploi du temps
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-uds-blue">{stat.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Cours du jour */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-uds-blue font-bold text-lg flex items-center gap-2">
              <BookOpen size={18} /> Cours du jour
            </h2>
            <button
              onClick={() => navigate('/student/schedule')}
              className="flex items-center gap-1 text-uds-orange text-sm font-semibold hover:underline"
            >
              Tout voir <ArrowRight size={14} />
            </button>
          </div>

          {mockTodayCourses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-uds-gray-dark font-medium">Aucun cours aujourd'hui</p>
              <p className="text-gray-400 text-sm mt-1">Profitez de votre journée ! 🎉</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {mockTodayCourses.map((course) => (
                <div key={course.id} className="px-6 py-4 hover:bg-uds-gray transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-uds-blue text-sm">{course.course}</p>
                      <p className="text-xs text-uds-gray-dark mt-0.5">👨‍🏫 {course.teacher}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-uds-gray-dark">
                          <MapPin size={12} /> {course.room} — {course.building}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-uds-blue bg-uds-blue/10 px-2 py-1 rounded-lg">
                        <Clock size={11} />
                        {course.from} – {course.to}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mt-2 bg-green-100 text-green-700">
                        <CheckCircle size={10} /> Confirmé
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications récentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-uds-blue font-bold text-lg flex items-center gap-2">
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-uds-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-uds-orange font-semibold hover:underline"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {notifications.map((notif) => {
              const config = NOTIF_CONFIG[notif.type];
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  className={`px-6 py-4 transition-colors ${
                    notif.read ? 'opacity-60' : 'hover:bg-uds-gray'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-uds-orange rounded-full shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-3 border-t border-gray-100">
            <button
              onClick={() => navigate('/student/notifications')}
              className="flex items-center gap-1 text-uds-orange text-sm font-semibold hover:underline"
            >
              Toutes les notifications <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Info niveau */}
      <div className="bg-uds-blue rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <GraduationCap size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold">Master 1 — Informatique</p>
          <p className="text-blue-200 text-sm mt-0.5">
            Département Informatique · Faculté des Sciences
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-bold text-2xl">2025/2026</p>
          <p className="text-blue-200 text-xs">Année académique</p>
        </div>
      </div>

    </div>
  );
}