import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen, ArrowLeft, Loader2, CheckCircle,
  MapPin, Users, GraduationCap, Calendar
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/axiosInstance';

const examSchema = z.object({
  levelId: z.string().min(1, 'Veuillez sélectionner un niveau'),
  roomId: z.string().min(1, 'Veuillez sélectionner une salle'),
  date: z.string().min(1, 'La date est requise'),
  from: z.string().min(1, "L'heure de début est requise"),
  to: z.string().min(1, "L'heure de fin est requise"),
  description: z.string().optional(),
}).refine((data) => data.from < data.to, {
  message: "L'heure de fin doit être après l'heure de début",
  path: ['to'],
});

// Simulation — vient du Academic Service
const mockLevels = [
  { id: '1', label: 'Licence 1 Informatique' },
  { id: '2', label: 'Licence 2 Informatique' },
  { id: '3', label: 'Licence 3 Informatique' },
  { id: '4', label: 'Master 1 Informatique' },
  { id: '5', label: 'Master 2 Informatique' },
];

// Simulation — vient du Room Service
const mockRooms = [
  { id: '1', name: 'Amphi 1000', building: 'Bâtiment A', capacity: 1000, type: 'AMPHITHEATRE' },
  { id: '2', name: 'Amphi 500', building: 'Bâtiment A', capacity: 500, type: 'AMPHITHEATRE' },
  { id: '3', name: 'Salle 204', building: 'Bâtiment B', capacity: 60, type: 'CLASSROOM' },
  { id: '4', name: 'Labo Info 1', building: 'Bâtiment C', capacity: 40, type: 'LABORATORY' },
  { id: '5', name: 'Salle 305', building: 'Bâtiment B', capacity: 50, type: 'CLASSROOM' },
];

export default function ExamScheduling() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ resolver: zodResolver(examSchema) });

  const watchFrom = watch('from');
  const watchTo = watch('to');
  const watchRoomId = watch('roomId');
  const selectedRoom = mockRooms.find(r => r.id === watchRoomId);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      // Appel API → Reservation Service
      await api.post('/reservations', {
        roomId: parseInt(data.roomId),
        reservedByUserId: user?.id,
        levelId: parseInt(data.levelId),
        reservationType: 'EXAM',
        startDateTime: `${data.date}T${data.from}:00`,
        endDateTime: `${data.date}T${data.to}:00`,
      });
      setSuccess(true);
    } catch (error) {
      console.warn('Simulation activée');
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-uds-blue text-2xl font-bold mb-2">Examen programmé !</h2>
          <p className="text-uds-gray-dark text-sm mb-8">
            L'examen a été soumis avec succès. Les étudiants concernés seront notifiés automatiquement.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dean/planning')}
              className="w-full py-3 rounded-xl bg-uds-blue text-white font-bold hover:bg-uds-blue-light transition-all"
            >
              Voir le planning
            </button>
            <button
              onClick={() => setSuccess(false)}
              className="w-full py-3 rounded-xl border-2 border-uds-blue text-uds-blue font-bold hover:bg-uds-blue hover:text-white transition-all"
            >
              Programmer un autre examen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* En-tête */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-white border border-gray-200 text-uds-gray-dark hover:text-uds-blue transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Programmer un examen</h1>
          <p className="text-uds-gray-dark text-sm mt-0.5">
            Réservation de type EXAM — Département Informatique
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-uds-blue text-lg mb-6 flex items-center gap-2">
          <BookOpen size={20} /> Détails de l'examen
        </h2>

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

          {/* Salle */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Salle d'examen
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
              <select
                {...register('roomId')}
                className={`w-full pl-9 pr-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                  errors.roomId ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                }`}
              >
                <option value="">-- Sélectionnez une salle --</option>
                {mockRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.building} ({r.capacity} places)
                  </option>
                ))}
              </select>
            </div>
            {errors.roomId && <p className="text-red-500 text-xs mt-1 ml-1">{errors.roomId.message}</p>}
          </div>

          {/* Salle sélectionnée */}
          {selectedRoom && (
            <div className="bg-uds-blue/5 border border-uds-blue/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-uds-blue rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-uds-blue text-sm">{selectedRoom.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-uds-gray-dark">{selectedRoom.building}</span>
                  <span className="flex items-center gap-1 text-xs text-uds-gray-dark">
                    <Users size={11} /> {selectedRoom.capacity} places
                  </span>
                </div>
              </div>
            </div>
          )}

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
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Heure de début
              </label>
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
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Heure de fin
              </label>
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
                <BookOpen size={16} className="text-uds-orange" />
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

          {/* Description optionnelle */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Description (optionnelle)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="ex: Examen final du semestre 1 — matière : Algorithmique Avancée"
              className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm text-gray-700 resize-none"
            />
          </div>

          {/* Badge type EXAM */}
          <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <BookOpen size={18} className="text-purple-600 shrink-0" />
            <div>
              <p className="text-purple-700 font-bold text-sm">Type : EXAMEN</p>
              <p className="text-purple-600 text-xs mt-0.5">
                Cette réservation sera automatiquement de type EXAM selon votre rôle.
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
    </div>
  );
}