import { useState } from 'react';
import { MapPin, Clock, ChevronLeft, ChevronRight, BookOpen, User } from 'lucide-react';

// Jours de la semaine
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Créneaux horaires
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const TYPE_COLORS = {
  COURSE: { bg: 'bg-uds-blue', light: 'bg-blue-50 border-uds-blue', text: 'text-uds-blue', label: 'Cours' },
  EXAM: { bg: 'bg-purple-600', light: 'bg-purple-50 border-purple-400', text: 'text-purple-700', label: 'Examen' },
  EVENT: { bg: 'bg-uds-orange', light: 'bg-orange-50 border-uds-orange', text: 'text-uds-orange', label: 'Événement' },
};

// Simulation — vient du Reservation Service
const mockSchedule = [
  {
    id: 1, day: 'Lundi', from: '08:00', to: '10:00',
    course: 'Algorithmique Avancée', teacher: 'Dr. Tagne',
    room: 'Amphi 1000', building: 'Bât. A', type: 'COURSE',
  },
  {
    id: 2, day: 'Lundi', from: '14:00', to: '16:00',
    course: 'Réseaux Informatiques', teacher: 'Pr. Mbarga',
    room: 'Labo Info 1', building: 'Bât. C', type: 'COURSE',
  },
  {
    id: 3, day: 'Mardi', from: '10:00', to: '12:00',
    course: 'Base de Données', teacher: 'Dr. Nguetsop',
    room: 'Salle 204', building: 'Bât. B', type: 'COURSE',
  },
  {
    id: 4, day: 'Mercredi', from: '08:00', to: '10:00',
    course: 'Systèmes d\'exploitation', teacher: 'Dr. Tagne',
    room: 'Amphi 500', building: 'Bât. A', type: 'COURSE',
  },
  {
    id: 5, day: 'Mercredi', from: '14:00', to: '16:00',
    course: 'Examen — Algorithmique', teacher: 'Dr. Tagne',
    room: 'Amphi 1000', building: 'Bât. A', type: 'EXAM',
  },
  {
    id: 6, day: 'Jeudi', from: '10:00', to: '12:00',
    course: 'Intelligence Artificielle', teacher: 'Pr. Kamdem',
    room: 'Labo Info 2', building: 'Bât. C', type: 'COURSE',
  },
  {
    id: 7, day: 'Vendredi', from: '08:00', to: '10:00',
    course: 'Génie Logiciel', teacher: 'Dr. Nguetsop',
    room: 'Salle 305', building: 'Bât. B', type: 'COURSE',
  },
  {
    id: 8, day: 'Vendredi', from: '14:00', to: '16:00',
    course: 'Projet Intégrateur', teacher: 'Dr. Tagne',
    room: 'Salle 204', building: 'Bât. B', type: 'EVENT',
  },
];

// Obtenir la date du lundi de la semaine courante
function getWeekStart(offset = 0) {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff + offset * 7));
  return monday;
}

function formatWeekRange(monday) {
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 5);
  return `${monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — ${friday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
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

export default function Schedule() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const monday = getWeekStart(weekOffset);
  const todayName = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const todayCapitalized = todayName.charAt(0).toUpperCase() + todayName.slice(1);

  const getCourseForSlot = (day, time) => {
    return mockSchedule.find((c) => {
      const slotMin = timeToMinutes(time);
      const fromMin = timeToMinutes(c.from);
      const toMin = timeToMinutes(c.to);
      return c.day === day && slotMin >= fromMin && slotMin < toMin;
    });
  };

  const isFirstSlotOfCourse = (day, time, course) => {
    return course && course.from === time;
  };

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Emploi du temps</h1>
          <p className="text-uds-gray-dark text-sm mt-1">Master 1 — Informatique</p>
        </div>

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
            <p className="text-uds-blue text-xs font-bold mt-0.5">
              {formatWeekRange(monday)}
            </p>
          </div>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grille emploi du temps — desktop */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-uds-blue">
                <th className="w-16 p-3 text-left text-blue-200 text-xs font-medium">Heure</th>
                {DAYS.map((day, i) => {
                  const isToday = day === todayCapitalized && weekOffset === 0;
                  return (
                    <th key={day} className={`p-3 text-center text-xs font-semibold ${isToday ? 'text-uds-orange' : 'text-white'}`}>
                      <p>{day}</p>
                      <p className={`text-lg font-bold mt-0.5 ${isToday ? 'text-uds-orange' : 'text-white'}`}>
                        {getDateOfDay(monday, i)}
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time, timeIdx) => (
                <tr key={time} className="border-t border-gray-50">
                  <td className="p-2 text-xs text-uds-gray-dark font-medium text-right pr-3 bg-uds-gray/50 w-16">
                    {time}
                  </td>
                  {DAYS.map((day) => {
                    const course = getCourseForSlot(day, time);
                    const isFirst = isFirstSlotOfCourse(day, time, course);
                    const isToday = day === todayCapitalized && weekOffset === 0;

                    if (course && !isFirst) {
                      return <td key={day} className={`border-l border-gray-50 p-0 ${isToday ? 'bg-orange-50/30' : ''}`} />;
                    }

                    return (
                      <td
                        key={day}
                        className={`border-l border-gray-50 p-1 align-top ${isToday ? 'bg-orange-50/30' : 'hover:bg-uds-gray/50'}`}
                      >
                        {course && isFirst && (
                          <button
                            onClick={() => setSelectedCourse(course)}
                            className={`w-full text-left p-2 rounded-lg border-l-4 text-xs transition-all hover:opacity-90 ${TYPE_COLORS[course.type].light}`}
                          >
                            <p className={`font-bold leading-tight ${TYPE_COLORS[course.type].text}`}>
                              {course.course}
                            </p>
                            <p className="text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin size={10} /> {course.room}
                            </p>
                            <p className="text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock size={10} /> {course.from}–{course.to}
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
          const dayCourses = mockSchedule.filter((c) => c.day === day);
          const isToday = day === todayCapitalized && weekOffset === 0;
          return (
            <div key={day} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isToday ? 'border-uds-orange' : 'border-gray-100'}`}>
              <div className={`px-5 py-3 flex items-center justify-between ${isToday ? 'bg-uds-orange' : 'bg-uds-blue'}`}>
                <p className="text-white font-bold text-sm">{day}</p>
                <p className="text-white/80 text-xs">{getDateOfDay(monday, i)}</p>
              </div>
              {dayCourses.length === 0 ? (
                <p className="text-center text-uds-gray-dark text-sm py-6">Pas de cours</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {dayCourses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className="w-full text-left px-5 py-4 hover:bg-uds-gray transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className={`font-bold text-sm ${TYPE_COLORS[course.type].text}`}>{course.course}</p>
                          <p className="text-xs text-uds-gray-dark mt-1 flex items-center gap-1">
                            <MapPin size={11} /> {course.room} — {course.building}
                          </p>
                          <p className="text-xs text-uds-gray-dark flex items-center gap-1 mt-0.5">
                            <User size={11} /> {course.teacher}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-uds-blue">{course.from}</p>
                          <p className="text-xs text-uds-gray-dark">{course.to}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${TYPE_COLORS[course.type].light} ${TYPE_COLORS[course.type].text}`}>
                            {TYPE_COLORS[course.type].label}
                          </span>
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

      {/* Modal détail cours */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className={`w-12 h-12 ${TYPE_COLORS[selectedCourse.type].bg} rounded-xl flex items-center justify-center mb-4`}>
              <BookOpen size={24} className="text-white" />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${TYPE_COLORS[selectedCourse.type].light} ${TYPE_COLORS[selectedCourse.type].text}`}>
              {TYPE_COLORS[selectedCourse.type].label}
            </span>
            <h3 className="text-uds-blue font-bold text-xl mt-3 mb-4">{selectedCourse.course}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <User size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedCourse.teacher}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedCourse.room} — {selectedCourse.building}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={16} className="text-uds-gray-dark shrink-0" />
                <span>{selectedCourse.day} · {selectedCourse.from} – {selectedCourse.to}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
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