import { useState } from 'react';
import {
  CalendarPlus, MapPin, Users, CheckCircle,
  XCircle, AlertCircle, Clock, Search, Filter,
  Trash2, Eye, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  PENDING: { label: 'En attente', color: 'bg-orange-100 text-uds-orange', icon: AlertCircle },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-600', icon: XCircle },
  EXPIRED: { label: 'Expirée', color: 'bg-gray-100 text-gray-500', icon: Clock },
};

const TYPE_LABELS = {
  COURSE: { label: 'Cours', color: 'bg-uds-blue/10 text-uds-blue' },
  EXAM: { label: 'Examen', color: 'bg-purple-100 text-purple-700' },
  EVENT: { label: 'Événement', color: 'bg-pink-100 text-pink-700' },
};

// Simulation — à remplacer par appel API Reservation Service
const mockBookings = [
  {
    id: 1, room: 'Amphi 1000', building: 'Bâtiment A', capacity: 1000,
    level: 'Master 1 Informatique', date: '2026-05-24',
    from: '08:00', to: '10:00', type: 'COURSE', status: 'CONFIRMED',
    createdAt: '2026-05-20',
  },
  {
    id: 2, room: 'Salle 204', building: 'Bâtiment B', capacity: 60,
    level: 'Licence 3 Mathématiques', date: '2026-05-25',
    from: '10:00', to: '12:00', type: 'COURSE', status: 'PENDING',
    createdAt: '2026-05-21',
  },
  {
    id: 3, room: 'Labo Info 1', building: 'Bâtiment C', capacity: 40,
    level: 'Master 2 Réseaux', date: '2026-05-26',
    from: '14:00', to: '16:00', type: 'EXAM', status: 'CONFIRMED',
    createdAt: '2026-05-19',
  },
  {
    id: 4, room: 'Salle 101', building: 'Bâtiment A', capacity: 80,
    level: 'Licence 1 Physique', date: '2026-05-15',
    from: '08:00', to: '10:00', type: 'COURSE', status: 'EXPIRED',
    createdAt: '2026-05-10',
  },
  {
    id: 5, room: 'Amphi 500', building: 'Bâtiment A', capacity: 500,
    level: 'Licence 2 Informatique', date: '2026-05-18',
    from: '14:00', to: '16:00', type: 'COURSE', status: 'CANCELLED',
    createdAt: '2026-05-12',
  },
  {
    id: 6, room: 'Salle 305', building: 'Bâtiment B', capacity: 50,
    level: 'Master 1 Informatique', date: '2026-05-28',
    from: '10:00', to: '12:00', type: 'EVENT', status: 'PENDING',
    createdAt: '2026-05-22',
  },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
  });
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [bookings, setBookings] = useState(mockBookings);

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchSearch = b.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCancel = (id) => {
    // Simulation annulation — appel API cancelReservation(id)
    setBookings((prev) =>
      prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b)
    );
    setCancelId(null);
  };

  const counts = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
    EXPIRED: bookings.filter(b => b.status === 'EXPIRED').length,
  };

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Mes réservations</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {bookings.length} réservation(s) au total
          </p>
        </div>
        <button
          onClick={() => navigate('/teacher/reserve')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
        >
          <CalendarPlus size={16} />
          Nouvelle réservation
        </button>
      </div>

      {/* Filtres par statut */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'ALL', label: 'Toutes' },
          { key: 'CONFIRMED', label: 'Confirmées' },
          { key: 'PENDING', label: 'En attente' },
          { key: 'CANCELLED', label: 'Annulées' },
          { key: 'EXPIRED', label: 'Expirées' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
              filterStatus === f.key
                ? 'bg-uds-blue text-white border-uds-blue'
                : 'bg-white text-uds-gray-dark border-gray-100 hover:border-uds-blue hover:text-uds-blue'
            }`}
          >
            {f.label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              filterStatus === f.key ? 'bg-white/20 text-white' : 'bg-uds-gray text-uds-gray-dark'
            }`}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
        <input
          type="text"
          placeholder="Rechercher par salle ou niveau..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-white outline-none focus:border-uds-blue transition-all text-sm text-gray-700"
        />
      </div>

      {/* Liste des réservations */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter size={28} className="text-uds-gray-dark" />
          </div>
          <p className="text-uds-blue font-bold text-lg">Aucune réservation trouvée</p>
          <p className="text-uds-gray-dark text-sm mt-1">Modifiez vos filtres ou créez une nouvelle réservation</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const status = STATUS_CONFIG[b.status];
            const type = TYPE_LABELS[b.type];
            const StatusIcon = status.icon;
            const canCancel = b.status === 'PENDING' || b.status === 'CONFIRMED';

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row">

                  {/* Barre colorée gauche selon statut */}
                  <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto rounded-t-2xl sm:rounded-none sm:rounded-l-2xl ${
                    b.status === 'CONFIRMED' ? 'bg-green-500' :
                    b.status === 'PENDING' ? 'bg-uds-orange' :
                    b.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-300'
                  }`} />

                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                      {/* Infos salle */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-bold text-uds-blue">{b.room}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type.color}`}>
                            {type.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                            <StatusIcon size={10} />
                            {status.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-uds-gray-dark mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {b.building}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {b.capacity} places
                          </span>
                        </div>
                        <p className="text-xs text-uds-gray-dark mt-1">📚 {b.level}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Créée le {formatDate(b.createdAt)}
                        </p>
                      </div>

                      {/* Date + Heure + Actions */}
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-700 capitalize">
                            {formatDate(b.date)}
                          </p>
                          <p className="text-xs text-uds-gray-dark mt-0.5">
                            🕐 {b.from} – {b.to}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {canCancel && (
                            <button
                              onClick={() => setCancelId(b.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={12} /> Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal confirmation annulation */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-uds-blue font-bold text-lg mb-2">Annuler la réservation ?</h3>
            <p className="text-uds-gray-dark text-sm mb-6">
              Cette action est irréversible. La salle sera libérée et les étudiants notifiés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all"
              >
                Garder
              </button>
              <button
                onClick={() => handleCancel(cancelId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all"
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}