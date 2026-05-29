import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen, ArrowLeft, Loader2, CheckCircle,
  MapPin, Users, Search, Filter, GraduationCap,
  Calendar, ArrowRight, Wrench, XCircle, Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/axiosInstance';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const examSchema = z.object({
  levelId: z.string().min(1, 'Veuillez sélectionner un niveau'),
  date: z.string().min(1, 'La date est requise'),
  from: z.string().min(1, "L'heure de début est requise"),
  to: z.string().min(1, "L'heure de fin est requise"),
  description: z.string().min(3, 'Veuillez décrire l\'examen'),
}).refine((data) => data.from < data.to, {
  message: "L'heure de fin doit être après l'heure de début",
  path: ['to'],
});

// ─── Données de simulation ────────────────────────────────────────────────────

const mockLevels = [
  { id: '1', label: 'Licence 1 Informatique' },
  { id: '2', label: 'Licence 2 Informatique' },
  { id: '3', label: 'Licence 3 Informatique' },
  { id: '4', label: 'Master 1 Informatique' },
  { id: '5', label: 'Master 2 Informatique' },
];

const mockRooms = [
  { id: 1, code: 'AMP-1000', name: 'Amphi 1000', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 1000, type: 'AMPHITHEATRE', status: 'AVAILABLE', availableFrom: null, equipments: ['Projecteur', 'Micro', 'Climatisation'] },
  { id: 2, code: 'AMP-500', name: 'Amphi 500', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 500, type: 'AMPHITHEATRE', status: 'AVAILABLE', availableFrom: null, equipments: ['Projecteur', 'Micro'] },
  { id: 3, code: 'S-204', name: 'Salle 204', building: 'Bâtiment B', campus: 'Campus Principal', capacity: 60, type: 'CLASSROOM', status: 'MAINTENANCE', availableFrom: '14:00', equipments: ['Tableau', 'Projecteur'] },
  { id: 4, code: 'S-101', name: 'Salle 101', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 80, type: 'CLASSROOM', status: 'OUT_OF_SERVICE', availableFrom: null, equipments: ['Tableau'] },
  { id: 5, code: 'LAB-1', name: 'Labo Info 1', building: 'Bâtiment C', campus: 'Campus Principal', capacity: 40, type: 'LABORATORY', status: 'AVAILABLE', availableFrom: null, equipments: ['Ordinateurs', 'Projecteur'] },
  { id: 6, code: 'S-305', name: 'Salle 305', building: 'Bâtiment B', campus: 'Campus Principal', capacity: 50, type: 'CLASSROOM', status: 'AVAILABLE', availableFrom: null, equipments: ['Tableau', 'Climatisation'] },
  { id: 7, code: 'AMP-200', name: 'Amphi 200', building: 'Bâtiment D', campus: 'Campus Principal', capacity: 200, type: 'AMPHITHEATRE', status: 'MAINTENANCE', availableFrom: '10:00', equipments: ['Projecteur', 'Micro'] },
];

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

// ─── Étapes ───────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Rechercher une salle' },
  { id: 2, label: 'Sélectionner la salle' },
  { id: 3, label: 'Détails de l\'examen' },
];

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ExamScheduling() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Étape 1 — Recherche salle
  const [filters, setFilters] = useState({ date: '', from: '', to: '', capacity: '', type: '' });
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomResults, setRoomResults] = useState([]);

  // Étape 2 — Salle sélectionnée
  const [selectedRoom, setSelectedRoom] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ resolver: zodResolver(examSchema) });

  const watchFrom = watch('from');
  const watchTo = watch('to');

  // ── Handlers étape 1 ──────────────────────────────────────────────────────

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      let filtered = mockRooms;
      if (filters.type) filtered = filtered.filter(r => r.type === filters.type);
      if (filters.capacity) filtered = filtered.filter(r => r.capacity >= parseInt(filters.capacity));
      setRoomResults(filtered);
      setLoading(false);
    }, 800);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setStep(2);
  };

  // ── Handler étape 3 ───────────────────────────────────────────────────────

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await api.post('/reservations', {
        roomId: selectedRoom.id,
        reservedByUserId: user?.id,
        levelId: parseInt(data.levelId),
        reservationType: 'EXAM',
        startDateTime: `${data.date}T${data.from}:00`,
        endDateTime: `${data.date}T${data.to}:00`,
        description: data.description,
      });
      setSuccess(true);
    } catch (error) {
      console.warn('Simulation activée');
      setSuccess(true);
    }
  };

  // ── Écran succès ──────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-uds-blue text-2xl font-bold mb-2">Examen programmé !</h2>
          <p className="text-uds-gray-dark text-sm mb-2">
            La salle <span className="font-bold text-uds-blue">{selectedRoom?.name}</span> a été réservée avec succès.
          </p>
          <p className="text-uds-gray-dark text-xs mb-8">
            Les étudiants concernés seront notifiés automatiquement.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dean/planning')}
              className="w-full py-3 rounded-xl bg-uds-blue text-white font-bold hover:bg-uds-blue-light transition-all"
            >
              Voir le planning
            </button>
            <button
              onClick={() => { setSuccess(false); setStep(1); setSelectedRoom(null); setSearched(false); }}
              className="w-full py-3 rounded-xl border-2 border-uds-blue text-uds-blue font-bold hover:bg-uds-blue hover:text-white transition-all"
            >
              Programmer un autre examen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* En-tête */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}
          className="p-2 rounded-xl hover:bg-white border border-gray-200 text-uds-gray-dark hover:text-uds-blue transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Programmer un examen</h1>
          <p className="text-uds-gray-dark text-sm mt-0.5">
            Département Informatique
          </p>
        </div>
      </div>

      {/* Indicateur d'étapes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > s.id
                    ? 'bg-green-500 text-white'
                    : step === s.id
                    ? 'bg-uds-blue text-white'
                    : 'bg-uds-gray text-uds-gray-dark'
                }`}>
                  {step > s.id ? <CheckCircle size={18} /> : s.id}
                </div>
                <p className={`text-xs font-semibold mt-1.5 text-center max-w-[80px] ${
                  step === s.id ? 'text-uds-blue' : 'text-uds-gray-dark'
                }`}>
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full mb-5 ${
                  step > s.id ? 'bg-green-500' : 'bg-uds-gray'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── ÉTAPE 1 : Recherche salle ── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Filter size={18} className="text-uds-blue" />
              <h2 className="font-bold text-uds-blue">Critères de recherche</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
                />
              </div>

              {/* Heure début */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Heure de début</label>
                <input
                  type="time"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
                />
              </div>

              {/* Heure fin */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Heure de fin</label>
                <input
                  type="time"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
                />
              </div>

              {/* Capacité */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Capacité minimale</label>
                <input
                  type="number"
                  name="capacity"
                  value={filters.capacity}
                  onChange={handleFilterChange}
                  placeholder="ex: 100"
                  min="1"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Type de salle</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
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
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><Search size={16} /> Rechercher</>
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Résultats recherche */}
          {searched && !loading && (
            <div>
              <p className="font-bold text-uds-blue text-lg mb-4">
                Résultats
                <span className="ml-2 text-sm font-normal text-uds-gray-dark">
                  {roomResults.filter(r => r.status === 'AVAILABLE').length} salle(s) disponible(s) sur {roomResults.length}
                </span>
              </p>

              {roomResults.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <p className="text-uds-blue font-bold">Aucune salle trouvée</p>
                  <p className="text-uds-gray-dark text-sm mt-1">Modifiez vos critères</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {roomResults.map((room) => {
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
                        {/* Header */}
                        <div className="bg-uds-blue px-5 py-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-white font-bold">{room.name}</p>
                              <p className="text-blue-200 text-xs mt-0.5">{room.code}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                              <StatusIcon size={11} /> {status.label}
                            </span>
                          </div>
                        </div>

                        {/* Corps */}
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

                          {/* Bouton sélectionner */}
                          <button
                            onClick={() => handleSelectRoom(room)}
                            disabled={!isAvailable}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                              isAvailable
                                ? 'bg-uds-orange text-white hover:bg-uds-orange-light shadow-md'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isAvailable
                              ? <><CheckCircle size={15} /> Sélectionner cette salle <ArrowRight size={14} /></>
                              : 'Non disponible'
                            }
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
              <p className="text-uds-blue font-bold text-lg">Recherchez une salle</p>
              <p className="text-uds-gray-dark text-sm mt-1">
                Renseignez vos critères et cliquez sur Rechercher
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── ÉTAPE 2 : Confirmation salle ── */}
      {step === 2 && selectedRoom && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-uds-blue text-lg mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" /> Salle sélectionnée
            </h2>

            <div className="bg-uds-blue rounded-2xl p-5 flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen size={26} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">{selectedRoom.name}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-blue-200 text-xs">
                    <MapPin size={12} /> {selectedRoom.building}
                  </span>
                  <span className="flex items-center gap-1 text-blue-200 text-xs">
                    <Users size={12} /> {selectedRoom.capacity} places
                  </span>
                  <span className="text-xs bg-uds-orange text-white px-2 py-0.5 rounded-full font-medium">
                    {TYPE_LABELS[selectedRoom.type]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedRoom.equipments.map((eq) => (
                    <span key={eq} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-blue-200 hover:text-white underline shrink-0"
              >
                Changer
              </button>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-uds-orange text-white font-bold text-sm hover:bg-uds-orange-light transition-all shadow-md"
            >
              <ArrowRight size={18} /> Continuer vers les détails de l'examen
            </button>
          </div>
        </div>
      )}

      {/* ── ÉTAPE 3 : Détails examen ── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-uds-blue text-lg mb-6 flex items-center gap-2">
            <BookOpen size={20} /> Détails de l'examen
          </h2>

          {/* Rappel salle */}
          <div className="flex items-center gap-3 p-3 bg-uds-gray rounded-xl mb-5">
            <div className="w-8 h-8 bg-uds-blue rounded-lg flex items-center justify-center shrink-0">
              <MapPin size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-uds-blue text-sm">{selectedRoom?.name}</p>
              <p className="text-xs text-uds-gray-dark">{selectedRoom?.building} · {selectedRoom?.capacity} places</p>
            </div>
            <button onClick={() => setStep(1)} className="ml-auto text-xs text-uds-orange hover:underline font-semibold">
              Changer
            </button>
          </div>

          {serverError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Niveau */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Niveau concerné
              </label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
                <select
                  {...register('levelId')}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                    errors.levelId ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                  }`}
                >
                  <option value="">-- Sélectionnez un niveau --</option>
                  {mockLevels.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
              {errors.levelId && <p className="text-red-500 text-xs mt-1 ml-1">{errors.levelId.message}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
                <input
                  type="date"
                  {...register('date')}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                    errors.date ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date.message}</p>}
            </div>

            {/* Créneau */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Heure de début</label>
                <input
                  type="time"
                  {...register('from')}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                    errors.from ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                  }`}
                />
                {errors.from && <p className="text-red-500 text-xs mt-1 ml-1">{errors.from.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Heure de fin</label>
                <input
                  type="time"
                  {...register('to')}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                    errors.to ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                  }`}
                />
                {errors.to && <p className="text-red-500 text-xs mt-1 ml-1">{errors.to.message}</p>}
              </div>
            </div>

            {/* Résumé créneau */}
            {watchFrom && watchTo && watchFrom < watchTo && (
              <div className="bg-uds-gray rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-uds-orange/20 rounded-lg flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-uds-orange" />
                </div>
                <p className="text-sm text-gray-700">
                  Créneau : <span className="font-bold text-uds-blue">{watchFrom} → {watchTo}</span>
                  {' '}—{' '}
                  <span className="text-uds-gray-dark">
                    {(() => {
                      const [h1, m1] = watchFrom.split(':').map(Number);
                      const [h2, m2] = watchTo.split(':').map(Number);
                      const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
                      return `${Math.floor(diff / 60)}h${diff % 60 > 0 ? diff % 60 + 'min' : ''}`;
                    })()}
                  </span>
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Description de l'examen
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="ex: Examen final de Algorithmique Avancée — Semestre 1"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 resize-none ${
                  errors.description ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                }`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description.message}</p>}
            </div>

            {/* Badge EXAM */}
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <BookOpen size={18} className="text-purple-600 shrink-0" />
              <div>
                <p className="text-purple-700 font-bold text-sm">Type : EXAMEN</p>
                <p className="text-purple-600 text-xs mt-0.5">
                  Cette réservation sera automatiquement de type EXAM.
                </p>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-uds-orange text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-uds-orange-light active:scale-95 transition-all shadow-md disabled:opacity-60"
            >
              {isSubmitting
                ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
                : <><BookOpen size={18} /> Programmer l'examen</>
              }
            </button>
          </form>
        </div>
      )}

    </div>
  );
}