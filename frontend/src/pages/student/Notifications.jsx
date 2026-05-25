import { useState } from 'react';
import {
  Bell, CheckCircle, AlertCircle, XCircle,
  Info, Trash2, Check, Filter
} from 'lucide-react';

const NOTIF_TYPES = {
  INFO: { label: 'Info', color: 'bg-blue-100 text-blue-700', icon: Info, dot: 'bg-blue-500' },
  SUCCESS: { label: 'Succès', color: 'bg-green-100 text-green-700', icon: CheckCircle, dot: 'bg-green-500' },
  WARNING: { label: 'Avertissement', color: 'bg-orange-100 text-uds-orange', icon: AlertCircle, dot: 'bg-uds-orange' },
  ERROR: { label: 'Annulation', color: 'bg-red-100 text-red-600', icon: XCircle, dot: 'bg-red-500' },
};

// Simulation — vient du Notification Service
const mockNotifications = [
  {
    id: 1, type: 'WARNING',
    title: 'Changement de salle',
    message: 'Le cours d\'Algorithmique du mardi est déplacé en Amphi 500 (Bât. A) au lieu de la Salle 204.',
    time: 'Il y a 30 min', date: '2026-05-24', read: false, channel: 'SMS',
  },
  {
    id: 2, type: 'SUCCESS',
    title: 'Emploi du temps mis à jour',
    message: 'Votre emploi du temps pour la semaine du 27 mai a été publié. 8 cours programmés.',
    time: 'Il y a 2h', date: '2026-05-24', read: false, channel: 'EMAIL',
  },
  {
    id: 3, type: 'ERROR',
    title: 'Cours annulé',
    message: 'Le cours de Physique Quantique prévu ce jeudi de 10h à 12h est annulé. Raison : enseignant absent.',
    time: 'Hier, 14h30', date: '2026-05-23', read: false, channel: 'SMS',
  },
  {
    id: 4, type: 'INFO',
    title: 'Examen programmé',
    message: 'Un examen d\'Algorithmique Avancée est programmé le mercredi 26 mai de 14h à 16h en Amphi 1000.',
    time: 'Hier, 09h00', date: '2026-05-23', read: true, channel: 'EMAIL',
  },
  {
    id: 5, type: 'SUCCESS',
    title: 'Réservation confirmée',
    message: 'La salle Labo Info 1 a été confirmée pour votre cours de Réseaux du vendredi 24 mai de 14h à 16h.',
    time: 'Il y a 2 jours', date: '2026-05-22', read: true, channel: 'EMAIL',
  },
  {
    id: 6, type: 'WARNING',
    title: 'Rappel — Examen demain',
    message: 'Rappel : vous avez un examen de Base de Données demain à 08h00 en Salle 204 (Bât. B).',
    time: 'Il y a 3 jours', date: '2026-05-21', read: true, channel: 'SMS',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterType, setFilterType] = useState('ALL');
  const [filterRead, setFilterRead] = useState('ALL');

  const filtered = notifications.filter((n) => {
    const matchType = filterType === 'ALL' || n.type === filterType;
    const matchRead = filterRead === 'ALL' ||
      (filterRead === 'UNREAD' && !n.read) ||
      (filterRead === 'READ' && n.read);
    return matchType && matchRead;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue flex items-center gap-2">
            <Bell size={24} />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-uds-orange text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {notifications.length} notification(s) au total
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-uds-blue text-uds-blue font-semibold text-sm hover:bg-uds-blue hover:text-white transition-all"
            >
              <Check size={16} /> Tout marquer lu
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all"
            >
              <Trash2 size={16} /> Tout effacer
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-uds-blue" />
          <p className="text-sm font-bold text-uds-blue">Filtres</p>
        </div>
        <div className="flex flex-wrap gap-4">

          {/* Filtre par type */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'Tous' },
              { key: 'INFO', label: 'Info' },
              { key: 'SUCCESS', label: 'Succès' },
              { key: 'WARNING', label: 'Avertissement' },
              { key: 'ERROR', label: 'Annulation' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterType === f.key
                    ? 'bg-uds-blue text-white border-uds-blue'
                    : 'bg-uds-gray text-uds-gray-dark border-gray-100 hover:border-uds-blue'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filtre lu/non lu */}
          <div className="flex gap-2">
            {[
              /*{ key: 'ALL', label: 'Tous' },*/
              { key: 'UNREAD', label: 'Non lus' },
              { key: 'READ', label: 'Lus' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterRead(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterRead === f.key
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

      {/* Liste notifications */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={28} className="text-uds-gray-dark" />
          </div>
          <p className="text-uds-blue font-bold text-lg">Aucune notification</p>
          <p className="text-uds-gray-dark text-sm mt-1">
            Vous êtes à jour !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => {
            const config = NOTIF_TYPES[notif.type];
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  notif.read ? 'border-gray-100 opacity-75' : 'border-l-4 border-l-uds-orange border-gray-100'
                }`}
              >
                <div className="p-5 flex items-start gap-4">

                  {/* Icône type */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon size={18} />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-uds-blue text-sm">{notif.title}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
                          {config.label}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          notif.channel === 'SMS'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {notif.channel}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-uds-orange rounded-full inline-block" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 shrink-0">{notif.time}</p>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{notif.message}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="flex items-center gap-1 text-xs text-uds-blue font-semibold hover:underline"
                        >
                          <Check size={12} /> Marquer comme lu
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotif(notif.id)}
                        className="flex items-center gap-1 text-xs text-red-400 font-semibold hover:underline"
                      >
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}