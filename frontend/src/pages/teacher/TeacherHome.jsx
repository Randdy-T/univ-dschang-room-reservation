import { CalendarPlus, Search, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  PENDING: { label: 'En attente', color: 'bg-orange-100 text-uds-orange', icon: AlertCircle },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-600', icon: XCircle },
  EXPIRED: { label: 'Expirée', color: 'bg-gray-100 text-gray-500', icon: Clock },
};

// Données de simulation — à remplacer par les appels API
const mockStats = [
  { label: "Réservations à venir", value: 3, icon: CalendarPlus, color: 'bg-uds-blue', sub: 'cette semaine' },
  { label: "Réservations aujourd'hui", value: 1, icon: Clock, color: 'bg-uds-orange', sub: "en cours" },
  { label: "Total ce mois", value: 12, icon: CheckCircle, color: 'bg-green-500', sub: 'confirmées' },
  { label: "Annulées", value: 2, icon: XCircle, color: 'bg-red-400', sub: 'ce mois' },
];

const mockReservations = [
  {
    id: 1,
    room: 'Amphi 1000',
    building: 'Bâtiment A',
    level: 'Master 1 Informatique',
    date: '2026-05-24',
    from: '08:00',
    to: '10:00',
    type: 'COURSE',
    status: 'CONFIRMED',
    capacity: 1000,
  },
  {
    id: 2,
    room: 'Salle 204',
    building: 'Bâtiment B',
    level: 'Licence 3 Mathématiques',
    date: '2026-05-25',
    from: '10:00',
    to: '12:00',
    type: 'COURSE',
    status: 'PENDING',
    capacity: 60,
  },
  {
    id: 3,
    room: 'Labo Info 1',
    building: 'Bâtiment C',
    level: 'Master 2 Réseaux',
    date: '2026-05-26',
    from: '14:00',
    to: '16:00',
    type: 'EXAM',
    status: 'CONFIRMED',
    capacity: 40,
  },
  {
    id: 4,
    room: 'Salle 101',
    building: 'Bâtiment A',
    level: 'Licence 1 Physique',
    date: '2026-05-20',
    from: '08:00',
    to: '10:00',
    type: 'COURSE',
    status: 'EXPIRED',
    capacity: 80,
  },
];

const TYPE_LABELS = {
  COURSE: 'Cours',
  EXAM: 'Examen',
  EVENT: 'Événement',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

export default function TeacherHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">
            Bonjour, {user?.nom || 'Enseignant'} 👋
          </h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Accès rapides */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/teacher/search')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-uds-blue text-uds-blue font-semibold text-sm hover:bg-uds-blue hover:text-white transition-all"
          >
            <Search size={16} />
            Rechercher
          </button>
          <button
            onClick={() => navigate('/teacher/reserve')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
          >
            <CalendarPlus size={16} />
            Réserver
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

      {/* Réservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-uds-blue font-bold text-lg">Mes réservations</h2>
          <button
            onClick={() => navigate('/teacher/my-bookings')}
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-uds-blue text-sm">{r.room}</p>
                      <span className="text-xs bg-uds-blue/10 text-uds-blue px-2 py-0.5 rounded-full font-medium">
                        {TYPE_LABELS[r.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-uds-gray-dark text-xs mt-1">
                      <MapPin size={12} />
                      <span>{r.building}</span>
                      <span className="mx-1">·</span>
                      <Users size={12} />
                      <span>{r.capacity} places</span>
                    </div>
                    <p className="text-xs text-uds-gray-dark mt-1">
                      📚 {r.level}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-700 capitalize">
                      {formatDate(r.date)}
                    </p>
                    <p className="text-xs text-uds-gray-dark mt-0.5">
                      {r.from} – {r.to}
                    </p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mt-2 ${status.color}`}>
                      <StatusIcon size={11} />
                      {status.label}
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