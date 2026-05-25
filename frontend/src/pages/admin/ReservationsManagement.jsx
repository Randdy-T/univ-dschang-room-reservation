import { useState } from 'react';
import {
  CalendarCheck, Search, Filter, CheckCircle,
  AlertCircle, XCircle, Clock, ShieldCheck,
  Trash2, X, MapPin, Users
} from 'lucide-react';

// ─── Configs ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmée', color: 'bg-green-100 text-green-700', icon: CheckCircle, dot: 'bg-green-500' },
  PENDING: { label: 'En attente', color: 'bg-orange-100 text-uds-orange', icon: AlertCircle, dot: 'bg-uds-orange' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-600', icon: XCircle, dot: 'bg-red-500' },
  EXPIRED: { label: 'Expirée', color: 'bg-gray-100 text-gray-500', icon: Clock, dot: 'bg-gray-400' },
};

const TYPE_CONFIG = {
  COURSE: { label: 'Cours', color: 'bg-uds-blue/10 text-uds-blue' },
  EXAM: { label: 'Examen', color: 'bg-purple-100 text-purple-700' },
  EVENT: { label: 'Événement', color: 'bg-pink-100 text-pink-700' },
};

// Simulation — vient du Reservation Service
const initialReservations = [
  { id: 1, room: 'Amphi 1000', building: 'Bât. A', capacity: 1000, user: 'Dr. Tagne', role: 'TEACHER', level: 'Master 1 Info', date: '2026-05-24', from: '08:00', to: '10:00', type: 'COURSE', status: 'CONFIRMED', createdAt: '2026-05-20' },
  { id: 2, room: 'Salle 204', building: 'Bât. B', capacity: 60, user: 'Dr. Nguetsop', role: 'TEACHER', level: 'Licence 3 Math', date: '2026-05-24', from: '10:00', to: '12:00', type: 'COURSE', status: 'PENDING', createdAt: '2026-05-21' },
  { id: 3, room: 'Labo Info 1', building: 'Bât. C', capacity: 40, user: 'Pr. Kamdem', role: 'HEAD_OF_DEPT', level: 'Master 2 Réseaux', date: '2026-05-25', from: '14:00', to: '16:00', type: 'EXAM', status: 'CONFIRMED', createdAt: '2026-05-19' },
  { id: 4, room: 'Amphi 500', building: 'Bât. A', capacity: 500, user: 'Dr. Tagne', role: 'TEACHER', level: 'Licence 2 Info', date: '2026-05-25', from: '08:00', to: '10:00', type: 'COURSE', status: 'PENDING', createdAt: '2026-05-22' },
  { id: 5, room: 'Salle 305', building: 'Bât. B', capacity: 50, user: 'Pr. Mbarga', role: 'HEAD_OF_DEPT', level: 'Licence 1 Physique', date: '2026-05-26', from: '10:00', to: '12:00', type: 'EXAM', status: 'PENDING', createdAt: '2026-05-22' },
  { id: 6, room: 'Amphi 200', building: 'Bât. D', capacity: 200, user: 'Dr. Tagne', role: 'TEACHER', level: 'Licence 3 Info', date: '2026-05-20', from: '08:00', to: '10:00', type: 'COURSE', status: 'EXPIRED', createdAt: '2026-05-15' },
  { id: 7, room: 'Salle 101', building: 'Bât. A', capacity: 80, user: 'Dr. Nguetsop', role: 'TEACHER', level: 'Licence 1 Math', date: '2026-05-18', from: '14:00', to: '16:00', type: 'COURSE', status: 'CANCELLED', createdAt: '2026-05-14' },
  { id: 8, room: 'Labo Info 2', building: 'Bât. C', capacity: 35, user: 'Pr. Kamdem', role: 'HEAD_OF_DEPT', level: 'Master 1 Info', date: '2026-05-27', from: '10:00', to: '12:00', type: 'EXAM', status: 'CONFIRMED', createdAt: '2026-05-23' },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
  });
}

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState(initialReservations);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Filtrage ───────────────────────────────────────────────────────────────

  const filtered = reservations.filter((r) => {
    const matchSearch =
      r.room.toLowerCase().includes(search.toLowerCase()) ||
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.level.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchType = filterType === 'ALL' || r.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    ALL: reservations.length,
    CONFIRMED: reservations.filter(r => r.status === 'CONFIRMED').length,
    PENDING: reservations.filter(r => r.status === 'PENDING').length,
    CANCELLED: reservations.filter(r => r.status === 'CANCELLED').length,
    EXPIRED: reservations.filter(r => r.status === 'EXPIRED').length,
  };

  const pendingCount = counts.PENDING;

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleAction = (id, action) => {
    if (action === 'FORCE') {
      // Appel API → confirmReservation(id) — Reservation Service
      setReservations((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: 'CONFIRMED' } : r)
      );
      showToast('Réservation confirmée avec succès.', 'success');
    } else if (action === 'CANCEL') {
      // Appel API → cancelReservation(id) — Reservation Service
      setReservations((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: 'CANCELLED' } : r)
      );
      showToast('Réservation annulée.', 'error');
    }
    setConfirmModal(null);
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
          {toast.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue flex items-center gap-2">
            <CalendarCheck size={24} />
            Gestion des réservations
          </h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {reservations.length} réservation(s) au total
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl">
            <AlertCircle size={16} className="text-uds-orange shrink-0" />
            <p className="text-sm font-bold text-uds-orange">
              {pendingCount} en attente de traitement
            </p>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'CONFIRMED', label: 'Confirmées', color: 'bg-green-500' },
          { key: 'PENDING', label: 'En attente', color: 'bg-uds-orange' },
          { key: 'CANCELLED', label: 'Annulées', color: 'bg-red-500' },
          { key: 'EXPIRED', label: 'Expirées', color: 'bg-gray-400' },
        ].map((s) => (
          <div key={s.key} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <CalendarCheck size={20} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-uds-blue">{counts[s.key]}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-uds-blue" />
          <p className="text-sm font-bold text-uds-blue">Filtres</p>
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
          <input
            type="text"
            placeholder="Rechercher par salle, enseignant ou niveau..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Filtre statut */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'Tous' },
              { key: 'CONFIRMED', label: 'Confirmées' },
              { key: 'PENDING', label: 'En attente' },
              { key: 'CANCELLED', label: 'Annulées' },
              { key: 'EXPIRED', label: 'Expirées' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterStatus === f.key
                    ? 'bg-uds-blue text-white border-uds-blue'
                    : 'bg-uds-gray text-uds-gray-dark border-gray-100 hover:border-uds-blue'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filterStatus === f.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {f.key === 'ALL' ? counts.ALL : counts[f.key] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Filtre type */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'Tous types' },
              { key: 'COURSE', label: 'Cours' },
              { key: 'EXAM', label: 'Examens' },
              { key: 'EVENT', label: 'Événements' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterType === f.key
                    ? 'bg-uds-orange text-white border-uds-orange'
                    : 'bg-uds-gray text-uds-gray-dark border-gray-100 hover:border-uds-orange'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultats */}
      <p className="text-sm text-uds-gray-dark font-medium">
        {filtered.length} réservation(s) trouvée(s)
      </p>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck size={28} className="text-uds-gray-dark" />
          </div>
          <p className="text-uds-blue font-bold text-lg">Aucune réservation trouvée</p>
          <p className="text-uds-gray-dark text-sm mt-1">Modifiez vos filtres</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const status = STATUS_CONFIG[r.status];
            const type = TYPE_CONFIG[r.type];
            const StatusIcon = status.icon;
            const isPending = r.status === 'PENDING';

            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  isPending ? 'border-l-4 border-l-uds-orange border-gray-100' : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <p className="font-bold text-uds-blue">{r.room}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type.color}`}>
                          {type.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                          <StatusIcon size={10} /> {status.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-uds-gray-dark">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {r.building}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {r.capacity} places
                        </span>
                        <span>👨‍🏫 {r.user}</span>
                        <span>📚 {r.level}</span>
                        <span>🗓 {formatDate(r.date)}</span>
                        <span>🕐 {r.from} – {r.to}</span>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        Créée le {formatDate(r.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {isPending && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmModal({ id: r.id, action: 'FORCE', room: r.room, user: r.user })}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-all shadow-sm"
                          >
                            <ShieldCheck size={13} /> Forcer
                          </button>
                          <button
                            onClick={() => setConfirmModal({ id: r.id, action: 'CANCEL', room: r.room, user: r.user })}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={13} /> Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal confirmation */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              confirmModal.action === 'FORCE' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {confirmModal.action === 'FORCE'
                ? <ShieldCheck size={28} className="text-green-600" />
                : <Trash2 size={28} className="text-red-500" />
              }
            </div>
            <h3 className="text-uds-blue font-bold text-lg mb-2">
              {confirmModal.action === 'FORCE' ? 'Forcer la confirmation ?' : 'Annuler la réservation ?'}
            </h3>
            <p className="text-uds-gray-dark text-sm mb-1">
              <span className="font-bold text-uds-blue">{confirmModal.room}</span>
            </p>
            <p className="text-uds-gray-dark text-sm mb-2">
              Enseignant : <span className="font-semibold">{confirmModal.user}</span>
            </p>
            <p className="text-xs text-uds-gray-dark mb-6">
              {confirmModal.action === 'FORCE'
                ? 'La réservation passera à CONFIRMED. Les étudiants seront notifiés.'
                : 'La salle sera libérée et les étudiants notifiés.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all"
              >
                Fermer
              </button>
              <button
                onClick={() => handleAction(confirmModal.id, confirmModal.action)}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all ${
                  confirmModal.action === 'FORCE' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {confirmModal.action === 'FORCE' ? 'Confirmer' : 'Oui, annuler'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}