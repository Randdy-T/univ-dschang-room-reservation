import { useState } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight,
  BookOpen, MapPin, Users, Clock, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TYPE_COLORS = {
  COURSE: { bg: 'bg-uds-blue', light: 'bg-blue-50 border-uds-blue', text: 'text-uds-blue', label: 'Cours' },
  EXAM: { bg: 'bg-purple-600', light: 'bg-purple-50 border-purple-400', text: 'text-purple-700', label: 'Examen' },
  EVENT: { bg: 'bg-uds-orange', light: 'bg-orange-50 border-uds-orange', text: 'text-uds-orange', label: 'Événement' },
};

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmée', color: 'bg-green-100 text-green-700' },
  PENDING: { label: 'En attente', color: 'bg-orange-100 text-uds-orange' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-600' },
};

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// Simulation — vient du Reservation Service filtré par département
const mockPlanning = [
  { id: 1, day: 'Lundi', from: '08:00', to: '10:00', room: 'Amphi 1000', teacher: 'Dr. Tagne', level: 'Master 1 Info', type: 'COURSE', status: 'CONFIRMED' },
  { id: 2, day: 'Lundi', from: '14:00', to: '16:00', room: 'Labo Info 1', teacher: 'Pr. Kamdem', level: 'Master 2 Réseaux', type: 'COURSE', status: 'CONFIRMED' },
  { id: 3, day: 'Mardi', from: '10:00', to: '12:00', room: 'Salle 204', teacher: 'Dr. Nguetsop', level: 'Licence 3 Info', type: 'EXAM', status: 'CONFIRMED' },
  { id: 4, day: 'Mercredi', from: '08:00', to: '10:00', room: 'Amphi 500', teacher: 'Dr. Tagne', level: 'Licence 2 Info', type: 'COURSE', status: 'PENDING' },
  { id: 5, day: 'Mercredi', from: '14:00', to: '16:00', room: 'Amphi 1000', teacher: 'Pr. Kamdem', level: 'Master 1 Info', type: 'EXAM', status: 'CONFIRMED' },
  { id: 6, day: 'Jeudi', from: '10:00', to: '12:00', room: 'Labo Info 2', teacher: 'Dr. Nguetsop', level: 'Licence 1 Info', type: 'COURSE', status: 'CONFIRMED' },
  { id: 7, day: 'Vendredi', from: '08:00', to: '10:00', room: 'Salle 305', teacher: 'Dr. Tagne', level: 'Licence 3 Info', type: 'EXAM', status: 'PENDING' },
];

function getWeekStart(offset = 0) {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff + offset * 7));
  return monday;
}

function formatWeekRange(monday) {
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  return `${monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — ${saturday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function getDateOfDay(monday, dayIndex) {
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayIndex);
  return d.getDate();
}

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function DeanPlanning() {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const monday = getWeekStart(weekOffset);

  const filtered = mockPlanning.filter((e) =>
    filterType === 'ALL' || e.type === filterType
  );

  const getEventForSlot = (day, time) => {
    return filtered.find((e) => {
      const slotMin = timeToMinutes(time);
      const fromMin = timeToMinutes(e.from);
      const toMin = timeToMinutes(e.to);
      return e.day === day && slotMin >= fromMin && slotMin < toMin;
    });
  };

  const examCount = mockPlanning.filter(e => e.type === 'EXAM').length;
  const courseCount = mockPlanning.filter(e => e.type === 'COURSE').length;
  const pendingCount = mockPlanning.filter(e => e.status === 'PENDING').length;

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Planning du département</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            Département Informatique — vue hebdomadaire
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dean/exam')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
          >
            <BookOpen size={16} /> Programmer un examen
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cours', value: courseCount, color: 'bg-uds-blue' },
          { label: 'Examens', value: examCount, color: 'bg-purple-500' },
          { label: 'En attente', value: pendingCount, color: 'bg-uds-orange' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold text-white ${s.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2`}>
              {s.value}
            </p>
            <p className="text-sm font-medium text-gray-700">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation semaine + filtres */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Navigation semaine */}
        <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1.5 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center min-w-[200px]">
            <p className="text-xs text-uds-gray-dark font-medium">
              {weekOffset === 0 ? 'Semaine actuelle' : weekOffset === 1 ? 'Semaine prochaine' : weekOffset === -1 ? 'Semaine dernière' : `Semaine ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
            </p>
            <p className="text-uds-blue text-xs font-bold mt-0.5">{formatWeekRange(monday)}</p>
          </div>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Filtre type */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-uds-gray-dark" />
          {['ALL', 'COURSE', 'EXAM'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filterType === t
                  ? 'bg-uds-blue text-white border-uds-blue'
                  : 'bg-white text-uds-gray-dark border-gray-200 hover:border-uds-blue'
              }`}
            >
              {t === 'ALL' ? 'Tout' : t === 'COURSE' ? 'Cours' : 'Examens'}
            </button>
          ))}
        </div>
      </div>

      {/* Grille planning — desktop */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-uds-blue">
                <th className="w-16 p-3 text-left text-blue-200 text-xs font-medium">Heure</th>
                {DAYS.map((day, i) => (
                  <th key={day} className="p-3 text-center text-white text-xs font-semibold">
                    <p>{day}</p>
                    <p className="text-lg font-bold mt-0.5">{getDateOfDay(monday, i)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="border-t border-gray-50">
                  <td className="p-2 text-xs text-uds-gray-dark font-medium text-right pr-3 bg-uds-gray/50 w-16">
                    {time}
                  </td>
                  {DAYS.map((day) => {
                    const event = getEventForSlot(day, time);
                    const isFirst = event && event.from === time;
                    if (event && !isFirst) return <td key={day} className="border-l border-gray-50 p-0" />;
                    return (
                      <td key={day} className="border-l border-gray-50 p-1 align-top hover:bg-uds-gray/50">
                        {event && isFirst && (
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className={`w-full text-left p-2 rounded-lg border-l-4 text-xs transition-all hover:opacity-90 ${TYPE_COLORS[event.type].light}`}
                          >
                            <p className={`font-bold leading-tight ${TYPE_COLORS[event.type].text}`}>
                              {event.room}
                            </p>
                            <p className="text-gray-500 mt-1">{event.teacher}</p>
                            <p className="text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock size={10} /> {event.from}–{event.to}
                            </p>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vue mobile — liste */}
      <div className="md:hidden space-y-4">
        {DAYS.map((day, i) => {
          const dayEvents = filtered.filter(e => e.day === day);
          return (
            <div key={day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-uds-blue px-5 py-3 flex items-center justify-between">
                <p className="text-white font-bold text-sm">{day}</p>
                <p className="text-white/80 text-xs">{getDateOfDay(monday, i)}</p>
              </div>
              {dayEvents.length === 0 ? (
                <p className="text-center text-uds-gray-dark text-sm py-6">Aucune activité</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left px-5 py-4 hover:bg-uds-gray transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-bold text-sm ${TYPE_COLORS[event.type].text}`}>{event.room}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[event.type].light} ${TYPE_COLORS[event.type].text}`}>
                              {TYPE_COLORS[event.type].label}
                            </span>
                          </div>
                          <p className="text-xs text-uds-gray-dark">{event.teacher}</p>
                          <p className="text-xs text-uds-gray-dark">📚 {event.level}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-uds-blue">{event.from}</p>
                          <p className="text-xs text-uds-gray-dark">{event.to}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal détail événement */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className={`w-12 h-12 ${TYPE_COLORS[selectedEvent.type].bg} rounded-xl flex items-center justify-center mb-4`}>
              <BookOpen size={24} className="text-white" />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${TYPE_COLORS[selectedEvent.type].light} ${TYPE_COLORS[selectedEvent.type].text}`}>
              {TYPE_COLORS[selectedEvent.type].label}
            </span>
            <h3 className="text-uds-blue font-bold text-xl mt-3 mb-4">{selectedEvent.room}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Users size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedEvent.teacher}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <BookOpen size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedEvent.level}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedEvent.day} · {selectedEvent.from} – {selectedEvent.to}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-uds-gray-dark shrink-0" />
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_CONFIG[selectedEvent.status].color}`}>
                  {STATUS_CONFIG[selectedEvent.status].label}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-6 py-3 rounded-xl bg-uds-blue text-white font-bold hover:bg-uds-blue-light transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}