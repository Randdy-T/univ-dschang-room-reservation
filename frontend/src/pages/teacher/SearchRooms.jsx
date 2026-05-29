import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Users, Filter, CheckCircle,
  XCircle, Wrench, ArrowRight, CalendarPlus, Clock
} from 'lucide-react';

const ROOM_TYPES = [
  { value: '', label: 'Tous les types' },
  { value: 'AMPHITHEATRE', label: 'Amphithéâtre' },
  { value: 'CLASSROOM', label: 'Salle de cours' },
  { value: 'LABORATORY', label: 'Laboratoire' },
];

const STATUS_CONFIG = {
  AVAILABLE: { label: 'Disponible', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-orange-100 text-uds-orange', icon: Wrench },
  OUT_OF_SERVICE: { label: 'Hors service', color: 'bg-red-100 text-red-600', icon: XCircle },
};

const TYPE_LABELS = {
  AMPHITHEATRE: 'Amphithéâtre',
  CLASSROOM: 'Salle de cours',
  LABORATORY: 'Laboratoire',
};

const mockRooms = [
  { id: 1, code: 'AMP-1000', name: 'Amphi 1000', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 1000, type: 'AMPHITHEATRE', status: 'AVAILABLE', availableFrom: null, equipments: ['Projecteur', 'Micro', 'Climatisation'] },
  { id: 2, code: 'AMP-500', name: 'Amphi 500', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 500, type: 'AMPHITHEATRE', status: 'AVAILABLE', availableFrom: null, equipments: ['Projecteur', 'Micro'] },
  { id: 3, code: 'S-204', name: 'Salle 204', building: 'Bâtiment B', campus: 'Campus Principal', capacity: 60, type: 'CLASSROOM', status: 'MAINTENANCE', availableFrom: '14:00', equipments: ['Tableau', 'Projecteur'] },
  { id: 4, code: 'S-101', name: 'Salle 101', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 80, type: 'CLASSROOM', status: 'OUT_OF_SERVICE', availableFrom: null, equipments: ['Tableau'] },
  { id: 5, code: 'LAB-1', name: 'Labo Info 1', building: 'Bâtiment C', campus: 'Campus Principal', capacity: 40, type: 'LABORATORY', status: 'AVAILABLE', availableFrom: null, equipments: ['Ordinateurs', 'Projecteur', 'Climatisation'] },
  { id: 6, code: 'LAB-2', name: 'Labo Info 2', building: 'Bâtiment C', campus: 'Campus Principal', capacity: 35, type: 'LABORATORY', status: 'OUT_OF_SERVICE', availableFrom: null, equipments: ['Ordinateurs'] },
  { id: 7, code: 'S-305', name: 'Salle 305', building: 'Bâtiment B', campus: 'Campus Principal', capacity: 50, type: 'CLASSROOM', status: 'AVAILABLE', availableFrom: null, equipments: ['Tableau', 'Climatisation'] },
  { id: 8, code: 'AMP-200', name: 'Amphi 200', building: 'Bâtiment D', campus: 'Campus Principal', capacity: 200, type: 'AMPHITHEATRE', status: 'MAINTENANCE', availableFrom: '10:00', equipments: ['Projecteur', 'Micro', 'Climatisation'] },
];

export default function SearchRooms() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    date: '',
    from: '',
    to: '',
    capacity: '',
    type: '',
  });
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      let filtered = mockRooms;
      if (filters.type) filtered = filtered.filter(r => r.type === filters.type);
      if (filters.capacity) filtered = filtered.filter(r => r.capacity >= parseInt(filters.capacity));
      setResults(filtered);
      setLoading(false);
    }, 800);
  };

  const handleReserve = (room) => {
    navigate('/teacher/reserve', { state: { room } });
  };

  const availableCount = results.filter(r => r.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-uds-blue">Rechercher une salle</h1>
        <p className="text-uds-gray-dark text-sm mt-1">
          Trouvez une salle disponible selon vos critères
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Filter size={18} className="text-uds-blue" />
          <h2 className="font-bold text-uds-blue">Critères de recherche</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
            />
          </div>

          {/* Heure début */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Heure de début
            </label>
            <input
              type="time"
              name="from"
              value={filters.from}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
            />
          </div>

          {/* Heure fin */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Heure de fin
            </label>
            <input
              type="time"
              name="to"
              value={filters.to}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
            />
          </div>

          {/* Capacité minimale */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Capacité minimale
            </label>
            <input
              type="number"
              name="capacity"
              value={filters.capacity}
              onChange={handleChange}
              placeholder="ex: 100"
              min="1"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
            />
          </div>

          {/* Type de salle */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Type de salle
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
            >
              {ROOM_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Bouton recherche */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-uds-blue text-white font-bold text-sm hover:bg-uds-blue-light transition-all shadow-md disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Search size={16} /> Rechercher</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {searched && !loading && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-uds-blue text-lg">
              Résultats
              <span className="ml-2 text-sm font-normal text-uds-gray-dark">
                {availableCount} salle(s) disponible(s) sur {results.length}
              </span>
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-uds-gray-dark" />
              </div>
              <p className="text-uds-blue font-bold text-lg">Aucune salle trouvée</p>
              <p className="text-uds-gray-dark text-sm mt-1">Modifiez vos critères et relancez la recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map((room) => {
                const status = STATUS_CONFIG[room.status];
                const StatusIcon = status.icon;
                const isAvailable = room.status === 'AVAILABLE';
                return (
                  <div
                    key={room.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                      isAvailable
                        ? 'border-gray-100 hover:border-uds-orange hover:shadow-md'
                        : 'border-gray-100 opacity-70'
                    }`}
                  >
                    {/* Header carte */}
                    <div className="bg-uds-blue px-5 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-bold">{room.name}</p>
                          <p className="text-blue-200 text-xs mt-0.5">{room.code}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Corps carte */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-uds-gray-dark shrink-0" />
                        <span>{room.building} — {room.campus}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={14} className="text-uds-gray-dark shrink-0" />
                        <span>{room.capacity} places</span>
                        <span className="mx-1 text-gray-300">·</span>
                        <span className="text-xs bg-uds-blue/10 text-uds-blue px-2 py-0.5 rounded-full font-medium">
                          {TYPE_LABELS[room.type]}
                        </span>
                      </div>

                      {/* Équipements */}
                      <div className="flex flex-wrap gap-1.5">
                        {room.equipments.map((eq) => (
                          <span key={eq} className="text-xs bg-uds-gray text-uds-gray-dark px-2 py-0.5 rounded-full">
                            {eq}
                          </span>
                        ))}
                      </div>

                      {/* Disponibilité */}
                      {!isAvailable && room.availableFrom && (
                        <div className="flex items-center gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-xl">
                          <Clock size={14} className="text-uds-orange shrink-0" />
                          <p className="text-xs text-uds-orange font-semibold">
                            Disponible à partir de <span className="font-bold">{room.availableFrom}</span>
                          </p>
                        </div>
                      )}

                      {!isAvailable && !room.availableFrom && (
                        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                          <XCircle size={14} className="text-red-500 shrink-0" />
                          <p className="text-xs text-red-500 font-semibold">
                            Indisponible — aucune plage libre aujourd'hui
                          </p>
                        </div>
                      )}

                      {/* Bouton réserver */}
                      <button
                        onClick={() => handleReserve(room)}
                        disabled={!isAvailable}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          isAvailable
                            ? 'bg-uds-orange text-white hover:bg-uds-orange-light shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? (
                          <><CalendarPlus size={15} /> Réserver cette salle <ArrowRight size={14} /></>
                        ) : (
                          'Non disponible'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* État initial */}
      {!searched && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-uds-blue" />
          </div>
          <p className="text-uds-blue font-bold text-lg">Lancez une recherche</p>
          <p className="text-uds-gray-dark text-sm mt-1">
            Renseignez vos critères ci-dessus et cliquez sur Rechercher
          </p>
        </div>
      )}

    </div>
  );
}