import { useState } from 'react';
import {
  Building2, Users, CalendarCheck, DoorOpen,
  TrendingUp, AlertCircle, CheckCircle, Clock,
  ArrowRight, Upload, GraduationCap, ShieldCheck,
  Trash2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Données de simulation ───────────────────────────────────────────────────

const mockStats = [
  { label: 'Salles totales', value: 24, sub: '18 disponibles', icon: DoorOpen, color: 'bg-uds-blue' },
  { label: 'Réservations actives', value: 47, sub: 'ce mois', icon: CalendarCheck, color: 'bg-uds-orange' },
  { label: 'Utilisateurs', value: 312, sub: 'enseignants + étudiants', icon: Users, color: 'bg-purple-500' },
  { label: "Taux d'occupation", value: '74%', sub: 'cette semaine', icon: TrendingUp, color: 'bg-green-500' },
];

const initialReservations = [
  { id: 1, room: 'Amphi 1000', user: 'Dr. Tagne', level: 'Master 1 Info', date: '2026-05-24', from: '08:00', to: '10:00', type: 'COURSE', status: 'CONFIRMED' },
  { id: 2, room: 'Salle 204', user: 'Dr. Nguetsop', level: 'Licence 3 Math', date: '2026-05-24', from: '10:00', to: '12:00', type: 'COURSE', status: 'PENDING' },
  { id: 3, room: 'Labo Info 1', user: 'Pr. Kamdem', level: 'Master 2 Réseaux', date: '2026-05-25', from: '14:00', to: '16:00', type: 'EXAM', status: 'CONFIRMED' },
  { id: 4, room: 'Amphi 500', user: 'Dr. Tagne', level: 'Licence 2 Info', date: '2026-05-25', from: '08:00', to: '10:00', type: 'COURSE', status: 'PENDING' },
  { id: 5, room: 'Salle 305', user: 'Dr. Mbarga', level: 'Licence 1 Physique', date: '2026-05-26', from: '10:00', to: '12:00', type: 'EXAM', status: 'PENDING' },
];

const initialRooms = [
  { id: 1, name: 'Amphi 1000', type: 'AMPHITHEATRE', status: 'AVAILABLE', capacity: 1000 },
  { id: 2, name: 'Amphi 500', type: 'AMPHITHEATRE', status: 'AVAILABLE', capacity: 500 },
  { id: 3, name: 'Salle 204', type: 'CLASSROOM', status: 'MAINTENANCE', capacity: 60 },
  { id: 4, name: 'Labo Info 1', type: 'LABORATORY', status: 'AVAILABLE', capacity: 40 },
  { id: 5, name: 'Salle 101', type: 'CLASSROOM', status: 'OUT_OF_SERVICE', capacity: 80 },
  { id: 6, name: 'Labo Info 2', type: 'LABORATORY', status: 'AVAILABLE', capacity: 35 },
];

// ─── Configs ─────────────────────────────────────────────────────────────────

const ROOM_STATUS_CONFIG = {
  AVAILABLE: { label: 'Disponible', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-orange-100 text-uds-orange', dot: 'bg-uds-orange' },
  OUT_OF_SERVICE: { label: 'Hors service', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
};

const RESERVATION_TYPE_COLORS = {
  COURSE: 'bg-uds-blue/10 text-uds-blue',
  EXAM: 'bg-purple-100 text-purple-700',
  EVENT: 'bg-pink-100 text-pink-700',
};

const RESERVATION_TYPE_LABELS = {
  COURSE: 'Cours',
  EXAM: 'Examen',
  EVENT: 'Événement',
};

const TYPE_LABELS = {
  AMPHITHEATRE: 'Amphi',
  CLASSROOM: 'Salle',
  LABORATORY: 'Labo',
};

const QUICK_LINKS = [
  { label: 'Campus & Bâtiments', icon: Building2, path: '/admin/campus' },
  { label: 'Gestion salles', icon: DoorOpen, path: '/admin/rooms' },
  { label: 'Import étudiants', icon: Upload, path: '/admin/import' },
  { label: 'Utilisateurs', icon: Users, path: '/admin/users' },
  { label: 'Structure académique', icon: GraduationCap, path: '/admin/academic' },
  { label: 'Réservations', icon: CalendarCheck, path: '/admin/reservations' },
];

// ─── Composant ────────────────────────────────────────────────────────────────

export default function AdminHome() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(initialReservations);
  const [rooms, setRooms] = useState(initialRooms);
  const [confirmModal, setConfirmModal] = useState(null);
  const [roomStatusModal, setRoomStatusModal] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReservationAction = (id, action) => {
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

  const handleRoomStatusChange = (id, newStatus) => {
    // Appel API → updateRoomStatus(id, newStatus) — Room Service
    setRooms((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: newStatus } : r)
    );
    showToast(`Statut mis à jour : ${ROOM_STATUS_CONFIG[newStatus].label}`, 'success');
    setRoomStatusModal(null);
  };

  const pendingCount = reservations.filter((r) => r.status === 'PENDING').length;

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
          <h1 className="text-2xl font-bold text-uds-blue">Console d'administration</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/import')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-uds-blue text-uds-blue font-semibold text-sm hover:bg-uds-blue hover:text-white transition-all"
          >
            <Upload size={16} /> Import étudiants
          </button>
          <button
            onClick={() => navigate('/admin/rooms')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
          >
            <DoorOpen size={16} /> Gérer les salles
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

      {/* Accès rapides */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-uds-orange hover:shadow-md transition-all text-center group"
            >
              <div className="w-10 h-10 bg-uds-gray rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-uds-orange transition-all">
                <Icon size={20} className="text-uds-blue group-hover:text-white transition-all" />
              </div>
              <p className="text-xs font-semibold text-uds-blue leading-tight">{item.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Réservations récentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-uds-blue font-bold text-lg flex items-center gap-2">
              <CalendarCheck size={18} /> Réservations
              {pendingCount > 0 && (
                <span className="bg-uds-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingCount} en attente
                </span>
              )}
            </h2>
          </div>

          {pendingCount > 0 && (
            <div className="mx-4 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-uds-orange shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-uds-orange">
                  {pendingCount} réservation(s) en attente
                </p>
                <p className="text-xs text-uds-gray-dark mt-0.5">
                  Le scheduler backend les traitera automatiquement. Vous pouvez aussi intervenir manuellement.
                </p>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-50 mt-3">
            {reservations.map((r) => {
              const isPending = r.status === 'PENDING';
              const isConfirmed = r.status === 'CONFIRMED';
              const isCancelled = r.status === 'CANCELLED';
              return (
                <div
                  key={r.id}
                  className={`px-6 py-4 transition-colors ${isPending ? 'bg-orange-50/50' : 'hover:bg-uds-gray'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-uds-blue text-sm">{r.room}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RESERVATION_TYPE_COLORS[r.type]}`}>
                          {RESERVATION_TYPE_LABELS[r.type]}
                        </span>
                      </div>
                      <p className="text-xs text-uds-gray-dark">👨‍🏫 {r.user}</p>
                      <p className="text-xs text-uds-gray-dark">📚 {r.level}</p>
                      <p className="text-xs text-uds-gray-dark mt-0.5">
                        🗓 {r.date} · {r.from} – {r.to}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                        isConfirmed ? 'bg-green-100 text-green-700' :
                        isPending ? 'bg-orange-100 text-uds-orange' :
                        isCancelled ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {isConfirmed && <CheckCircle size={10} />}
                        {isPending && <AlertCircle size={10} />}
                        {isCancelled && <X size={10} />}
                        {isConfirmed ? 'Confirmée' : isPending ? 'En attente' : isCancelled ? 'Annulée' : 'Expirée'}
                      </span>
                      {isPending && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setConfirmModal({ id: r.id, action: 'FORCE', room: r.room, user: r.user })}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-all"
                          >
                            <ShieldCheck size={12} /> Forcer
                          </button>
                          <button
                            onClick={() => setConfirmModal({ id: r.id, action: 'CANCEL', room: r.room, user: r.user })}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={12} /> Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* État des salles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-uds-blue font-bold text-lg flex items-center gap-2">
              <DoorOpen size={18} /> État des salles
            </h2>
            <button
              onClick={() => navigate('/admin/rooms')}
              className="flex items-center gap-1 text-uds-orange text-sm font-semibold hover:underline"
            >
              Voir tout <ArrowRight size={14} />
            </button>
          </div>

          <div className="px-6 py-3 bg-uds-gray flex gap-4 flex-wrap">
            {Object.entries(ROOM_STATUS_CONFIG).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${val.dot}`} />
                <span className="text-xs text-uds-gray-dark font-medium">{val.label}</span>
              </div>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {rooms.map((room) => {
              const status = ROOM_STATUS_CONFIG[room.status];
              return (
                <div key={room.id} className="px-6 py-3.5 hover:bg-uds-gray transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${status.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-uds-blue">{room.name}</p>
                      <p className="text-xs text-uds-gray-dark">
                        {TYPE_LABELS[room.type]} · {room.capacity} places
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    <button
                      onClick={() => setRoomStatusModal(room)}
                      className="p-1.5 rounded-lg hover:bg-uds-blue hover:text-white text-uds-gray-dark border border-gray-200 transition-all"
                      title="Changer le statut"
                    >
                      <TrendingUp size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal confirmation réservation */}
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
              <span className="font-semibold text-uds-blue">{confirmModal.room}</span>
            </p>
            <p className="text-uds-gray-dark text-sm mb-2">
              Enseignant : <span className="font-semibold">{confirmModal.user}</span>
            </p>
            <p className="text-xs text-uds-gray-dark mb-6">
              {confirmModal.action === 'FORCE'
                ? 'La réservation passera à CONFIRMED. Les étudiants concernés seront notifiés.'
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
                onClick={() => handleReservationAction(confirmModal.id, confirmModal.action)}
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

      {/* Modal changement statut salle */}
      {roomStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-uds-blue rounded-xl flex items-center justify-center shrink-0">
                <DoorOpen size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-uds-blue">{roomStatusModal.name}</p>
                <p className="text-xs text-uds-gray-dark">
                  {TYPE_LABELS[roomStatusModal.type]} · {roomStatusModal.capacity} places
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3">
              Choisir le nouveau statut :
            </p>

            <div className="space-y-2 mb-6">
              {Object.entries(ROOM_STATUS_CONFIG).map(([key, val]) => {
                const isCurrent = roomStatusModal.status === key;
                return (
                  <button
                    key={key}
                    onClick={() => !isCurrent && handleRoomStatusChange(roomStatusModal.id, key)}
                    disabled={isCurrent}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      isCurrent
                        ? 'border-uds-blue bg-uds-blue/5 cursor-not-allowed'
                        : 'border-gray-100 hover:border-uds-orange hover:bg-orange-50 cursor-pointer'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${val.dot}`} />
                    <p className={`text-sm font-bold flex-1 ${isCurrent ? 'text-uds-blue' : 'text-gray-700'}`}>
                      {val.label}
                    </p>
                    {isCurrent && (
                      <span className="text-xs bg-uds-blue text-white px-2 py-0.5 rounded-full font-semibold">
                        Actuel
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setRoomStatusModal(null)}
              className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}