import {
  LayoutDashboard, CalendarPlus, Calendar,
  CheckCircle, AlertCircle, Clock, XCircle,
  ArrowRight, BookOpen, Users, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// ─── Données de simulation ────────────────────────────────────────────────────

const mockStats = [
  { label: 'Réservations dept', value: 18, sub: 'ce mois', icon: CalendarPlus, color: 'bg-uds-blue' },
  { label: 'Examens programmés', value: 5, sub: 'ce semestre', icon: BookOpen, color: 'bg-purple-500' },
  { label: 'En attente', value: 3, sub: 'à traiter', icon: AlertCircle, color: 'bg-uds-orange' },
  { label: 'Enseignants', value: 12, sub: 'dans le département', icon: Users, color: 'bg-green-500' },
];

const mockReservations = [
  { id: 1, room: 'Amphi 1000', teacher: 'Dr. Tagne', level: 'Master 1 Info', date: '2026-05-24', from: '08:00', to: '10:00', type: 'COURSE', status: 'CONFIRMED' },
  { id: 2, room: 'Salle 204', teacher: 'Dr. Nguetsop', level: 'Licence 3 Info', date: '2026-05-25', from: '10:00', to: '12:00', type: 'EXAM', status: 'CONFIRMED' },
  { id: 3, room: 'Labo Info 1', teacher: 'Pr. Kamdem', level: 'Master 2 Réseaux', date: '2026-05-26', from: '14:00', to: '16:00', type: 'EXAM', status: 'PENDING' },
  { id: 4, room: 'Amphi 500', teacher: 'Dr. Tagne', level: 'Licence 2 Info', date: '2026-05-27', from: '08:00', to: '10:00', type: 'COURSE', status: 'PENDING' },
];

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  PENDING: { label: 'En attente', color: 'bg-orange-100 text-uds-orange', icon: AlertCircle },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-600', icon: XCircle },
  EXPIRED: { label: 'Expirée', color: 'bg-gray-100 text-gray-500', icon: Clock },
};

const TYPE_COLORS = {
  COURSE: 'bg-uds-blue/10 text-uds-blue',
  EXAM: 'bg-purple-100 text-purple-700',
  EVENT: 'bg-pink-100 text-pink-700',
};

const TYPE_LABELS = {
  COURSE: 'Cours',
  EXAM: 'Examen',
  EVENT: 'Événement',
};

export default function DeanHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">
            Bonjour, {user?.nom || 'Chef de département'} 👋
          </h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dean/planning')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-uds-blue text-uds-blue font-semibold text-sm hover:bg-uds-blue hover:text-white transition-all"
          >
            <Calendar size={16} /> Planning
          </button>
          <button
            onClick={() => navigate('/dean/exam')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
          >
            <CalendarPlus size={16} /> Programmer un examen
          </button>
        </div>
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
              <p className="text-xs text-uds-gray-dark mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Info département */}
      <div className="bg-uds-blue rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <GraduationCap size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-lg">Département Informatique</p>
          <p className="text-blue-200 text-sm mt-0.5">
            Faculté des Sciences et Technologies · Université de Dschang
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-bold text-2xl">2025/2026</p>
          <p className="text-blue-200 text-xs">Année académique</p>
        </div>
      </div>

      {/* Réservations du département */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-uds-blue font-bold text-lg flex items-center gap-2">
            <CalendarPlus size={18} /> Réservations du département
          </h2>
          <button
            onClick={() => navigate('/dean/planning')}
            className="flex items-center gap-1 text-uds-orange text-sm font-semibold hover:underline"
          >
            Voir tout <ArrowRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {mockReservations.map((r) => {
            const status = STATUS_CONFIG[r.status];
            const StatusIcon = status.icon;
            return (
              <div key={r.id} className="px-6 py-4 hover:bg-uds-gray transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-uds-blue text-sm">{r.room}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[r.type]}`}>
                        {TYPE_LABELS[r.type]}
                      </span>
                    </div>
                    <p className="text-xs text-uds-gray-dark">👨‍🏫 {r.teacher}</p>
                    <p className="text-xs text-uds-gray-dark">📚 {r.level}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-700">{r.date}</p>
                    <p className="text-xs text-uds-gray-dark mt-0.5">{r.from} – {r.to}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mt-1 ${status.color}`}>
                      <StatusIcon size={10} /> {status.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}