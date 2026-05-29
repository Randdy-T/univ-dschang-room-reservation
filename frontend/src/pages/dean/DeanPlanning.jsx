import { useState } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight,
  BookOpen, MapPin, Users, Clock, Filter,
  GraduationCap
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

// Niveaux du département — vient du Academic Service
const LEVELS = [
  { id: 'ALL', label: 'Tous les niveaux' },
  { id: 'L1', label: 'Licence 1' },
  { id: 'L2', label: 'Licence 2' },
  { id: 'L3', label: 'Licence 3' },
  { id: 'M1', label: 'Master 1' },
  { id: 'M2', label: 'Master 2' },
];

// Simulation — vient du Reservation Service filtré par département
const mockPlanning = [
  { id: 1, day: 'Lundi', from: '08:00', to: '10:00', room: 'Amphi 1000', teacher: 'Dr. Tagne', level: 'Master 1 Info', levelId: 'M1', type: 'COURSE', status: 'CONFIRMED' },
  { id: 2, day: 'Lundi', from: '14:00', to: '16:00', room: 'Labo Info 1', teacher: 'Pr. Kamdem', level: 'Master 2 Réseaux', levelId: 'M2', type: 'COURSE', status: 'CONFIRMED' },
  { id: 3, day: 'Mardi', from: '10:00', to: '12:00', room: 'Salle 204', teacher: 'Dr. Nguetsop', level: 'Licence 3 Info', levelId: 'L3', type: 'EXAM', status: 'CONFIRMED' },
  { id: 4, day: 'Mardi', from: '08:00', to: '10:00', room: 'Amphi 500', teacher: 'Dr. Tagne', level: 'Licence 1 Info', levelId: 'L1', type: 'COURSE', status: 'CONFIRMED' },
  { id: 5, day: 'Mercredi', from: '08:00', to: '10:00', room: 'Amphi 500', teacher: 'Dr. Tagne', level: 'Licence 2 Info', levelId: 'L2', type: 'COURSE', status: 'PENDING' },
  { id: 6, day: 'Mercredi', from: '14:00', to: '16:00', room: 'Amphi 1000', teacher: 'Pr. Kamdem', level: 'Master 1 Info', levelId: 'M1', type: 'EXAM', status: 'CONFIRMED' },
  { id: 7, day: 'Jeudi', from: '10:00', to: '12:00', room: 'Labo Info 2', teacher: 'Dr. Nguetsop', level: 'Licence 1 Info', levelId: 'L1', type: 'COURSE', status: 'CONFIRMED' },
  { id: 8, day: 'Jeudi', from: '14:00', to: '16:00', room: 'Salle 305', teacher: 'Dr. Tagne', level: 'Licence 3 Info', levelId: 'L3', type: 'COURSE', status: 'CONFIRMED' },
  { id: 9, day: 'Vendredi', from: '08:00', to: '10:00', room: 'Salle 305', teacher: 'Dr. Tagne', level: 'Licence 3 Info', levelId: 'L3', type: 'EXAM', status: 'PENDING' },
  { id: 10, day: 'Vendredi', from: '10:00', to: '12:00', room: 'Amphi 200', teacher: 'Pr. Kamdem', level: 'Master 2 Réseaux', levelId: 'M2', type: 'EXAM', status: 'CONFIRMED' },
  { id: 11, day: 'Samedi', from: '08:00', to: '10:00', room: 'Salle 204', teacher: 'Dr. Nguetsop', level: 'Licence 2 Info', levelId: 'L2', type: 'COURSE', status: 'CONFIRMED' },
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
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const monday = getWeekStart(weekOffset);

  const filtered = mockPlanning.filter((e) => {
    const matchType = filterType === 'ALL' || e.type === filterType;
    const matchLevel = filterLevel === 'ALL' || e.levelId === filterLevel;
    return matchType && matchLevel;
  });

  const getEventForSlot = (day, time) => {
    return filtered.find((e) => {
      const slotMin = timeToMinutes(time);
      const fromMin = timeToMinutes(e.from);
      const toMin = timeToMinutes(e.to);
      return e.day === day && slotMin >= fromMin && slotMin < toMin;
    });
  };

  // Stats par niveau
  const statsByLevel = LEVELS.filter(l => l.id !== 'ALL').map((level) => ({
    ...level,
    count: mockPlanning.filter(e => e.levelId === level.id).length,
    examCount: mockPlanning.filter(e => e.levelId === level.id && e.type === 'EXAM').length,
  }));

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Planning du département</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            Département Informatique — vue hebdomadaire par niveau
          </p>
        </div>
        <button
          onClick={() => navigate('/dean/exam')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
        >
          <BookOpen size={16} /> Programmer un examen
        </button>
      </div>

      {/* Stats par niveau */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {statsByLevel.map((level) => (
          <button
            key={level.id}
            onClick={() => setFilterLevel(filterLevel === level.id ? 'ALL' : level.id)}
            className={`bg-white rounded-2xl p-4 border-2 shadow-sm text-left transition-all hover:shadow-md ${
              filterLevel === level.id
                ? 'border-uds-orange'
                : 'border-gray-100 hover:border-uds-orange/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                filterLevel === level.id ? 'bg-uds-orange' : 'bg-uds-blue'
              }`}>
                <GraduationCap size={18} className="text-white" />
              </div>
              {filterLevel === level.id && (
                <span className="text-xs bg-uds-orange text-white px-2 py-0.5 rounded-full font-bold">
                  Actif
                </span>
              )}
            </div>
            <p className="font-bold text-uds-blue text-sm">{level.label}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-uds-gray-dark">{level.count} séance(s)</span>
              {level.examCount > 0 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {level.examCount} examen(s)
                </span>
              )}
            </div>
          </button>
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

        {/* Filtres type */}
        <div className="flex items-center gap-2 flex-wrap">
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

      {/* Filtre niveau actif */}
      {filterLevel !== 'ALL' && (
        <div className="flex items-center gap-3 px-4 py-3 bg-uds-orange/10 border border-uds-orange/30 rounded-xl">
          <GraduationCap size={16} className="text-uds-orange shrink-0" />
          <p className="text-sm font-bold text-uds-orange">
            Affichage filtré : {LEVELS.find(l => l.id === filterLevel)?.label}
          </p>
          <button
            onClick={() => setFilterLevel('ALL')}
            className="ml-auto text-xs text-uds-orange font-semibold hover:underline"
          >
            Voir tous les niveaux
          </button>
        </div>
      )}

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
                            <p className="text-gray-500 mt-0.5">{event.teacher}</p>
                            <p className={`text-xs font-semibold mt-0.5 ${TYPE_COLORS[event.type].text}`}>
                              {event.levelId}
                            </p>
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

      {/* Vue mobile — liste par jour */}
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
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className={`font-bold text-sm ${TYPE_COLORS[event.type].text}`}>
                              {event.room}
                            </p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[event.type].light} ${TYPE_COLORS[event.type].text}`}>
                              {TYPE_COLORS[event.type].label}
                            </span>
                            <span className="text-xs bg-uds-blue/10 text-uds-blue px-2 py-0.5 rounded-full font-bold">
                              {event.levelId}
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

      {/* Message si aucun résultat */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={28} className="text-uds-gray-dark" />
          </div>
          <p className="text-uds-blue font-bold text-lg">Aucune activité</p>
          <p className="text-uds-gray-dark text-sm mt-1">
            Aucune réservation pour ce niveau cette semaine.
          </p>
        </div>
      )}

      {/* Modal détail événement */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className={`w-12 h-12 ${TYPE_COLORS[selectedEvent.type].bg} rounded-xl flex items-center justify-center mb-4`}>
              <BookOpen size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${TYPE_COLORS[selectedEvent.type].light} ${TYPE_COLORS[selectedEvent.type].text}`}>
                {TYPE_COLORS[selectedEvent.type].label}
              </span>
              <span className="text-xs bg-uds-blue/10 text-uds-blue px-2 py-1 rounded-full font-bold">
                {selectedEvent.level}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_CONFIG[selectedEvent.status].color}`}>
                {STATUS_CONFIG[selectedEvent.status].label}
              </span>
            </div>
            <h3 className="text-uds-blue font-bold text-xl mb-4">{selectedEvent.room}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Users size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedEvent.teacher}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <GraduationCap size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedEvent.level}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedEvent.day} · {selectedEvent.from} – {selectedEvent.to}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedEvent.room}</span>
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