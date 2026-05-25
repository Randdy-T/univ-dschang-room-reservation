import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarPlus, MapPin, Users, CheckCircle,
  ArrowLeft, Loader2, BookOpen, GraduationCap
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/axiosInstance';

const reservationSchema = z.object({
  levelId: z.string().min(1, 'Veuillez sélectionner un niveau'),
  reservationType: z.string().min(1, 'Veuillez sélectionner un type'),
  date: z.string().min(1, 'La date est requise'),
  from: z.string().min(1, "L'heure de début est requise"),
  to: z.string().min(1, "L'heure de fin est requise"),
}).refine((data) => data.from < data.to, {
  message: "L'heure de fin doit être après l'heure de début",
  path: ['to'],
});

// Simulation niveaux académiques — vient du Academic Service
const mockLevels = [
  { id: '1', label: 'Licence 1 — Informatique' },
  { id: '2', label: 'Licence 2 — Informatique' },
  { id: '3', label: 'Licence 3 — Informatique' },
  { id: '4', label: 'Master 1 — Informatique' },
  { id: '5', label: 'Master 2 — Informatique' },
  { id: '6', label: 'Licence 1 — Mathématiques' },
  { id: '7', label: 'Licence 3 — Physique' },
  { id: '8', label: 'Master 1 — Réseaux' },
];

const RESERVATION_TYPES = [
  { value: 'COURSE', label: 'Cours' },
  { value: 'EXAM', label: 'Examen' },
  { value: 'EVENT', label: 'Événement' },
];

export default function ReserveRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Salle passée depuis SearchRooms via navigate state
  const room = location.state?.room || null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ resolver: zodResolver(reservationSchema) });

  const watchFrom = watch('from');
  const watchTo = watch('to');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      // Appel réel vers le backend Reservation Service
      await api.post('/reservations', {
        roomId: room?.id,
        reservedByUserId: user?.id,
        levelId: parseInt(data.levelId),
        reservationType: data.reservationType,
        startDateTime: `${data.date}T${data.from}:00`,
        endDateTime: `${data.date}T${data.to}:00`,
      });
      setSuccess(true);
    } catch (error) {
      // Simulation succès tant que le backend n'est pas prêt
      console.warn('Simulation réservation activée');
      setSuccess(true);
    }
  };

  // Écran de succès
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-uds-blue text-2xl font-bold mb-2">Réservation envoyée !</h2>
          <p className="text-uds-gray-dark text-sm mb-2">
            Votre demande de réservation a été soumise avec succès.
          </p>
          <p className="text-uds-gray-dark text-xs mb-8">
            Statut initial : <span className="font-bold text-uds-orange">EN ATTENTE</span> — vous recevrez une confirmation.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/teacher/my-bookings')}
              className="w-full py-3 rounded-xl bg-uds-blue text-white font-bold hover:bg-uds-blue-light transition-all"
            >
              Voir mes réservations
            </button>
            <button
              onClick={() => navigate('/teacher')}
              className="w-full py-3 rounded-xl border-2 border-uds-blue text-uds-blue font-bold hover:bg-uds-blue hover:text-white transition-all"
            >
              Retour au tableau de bord
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
          <h1 className="text-2xl font-bold text-uds-blue">Réserver une salle</h1>
          <p className="text-uds-gray-dark text-sm mt-0.5">
            Remplissez le formulaire pour soumettre votre réservation
          </p>
        </div>
      </div>

      {/* Salle sélectionnée */}
      {room ? (
        <div className="bg-uds-blue rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg">{room.name}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-blue-200 text-xs">
                <MapPin size={12} /> {room.building}
              </span>
              <span className="flex items-center gap-1 text-blue-200 text-xs">
                <Users size={12} /> {room.capacity} places
              </span>
              <span className="text-xs bg-uds-orange text-white px-2 py-0.5 rounded-full font-medium">
                {room.type === 'AMPHITHEATRE' ? 'Amphithéâtre' : room.type === 'LABORATORY' ? 'Laboratoire' : 'Salle de cours'}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/teacher/search')}
            className="text-xs text-blue-200 hover:text-white underline shrink-0"
          >
            Changer
          </button>
        </div>
      ) : (
        <div className="bg-orange-50 border border-uds-orange rounded-2xl p-4 flex items-center gap-3">
          <BookOpen size={20} className="text-uds-orange shrink-0" />
          <div>
            <p className="text-uds-orange font-semibold text-sm">Aucune salle sélectionnée</p>
            <p className="text-uds-gray-dark text-xs mt-0.5">
              Vous pouvez quand même soumettre — ou{' '}
              <button onClick={() => navigate('/teacher/search')} className="underline font-semibold text-uds-orange">
                rechercher une salle d'abord
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-uds-blue text-lg mb-6 flex items-center gap-2">
          <CalendarPlus size={20} />
          Détails de la réservation
        </h2>

        {serverError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Niveau académique */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Niveau académique cible
            </label>
            <div className="relative">
              <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
              <select
                {...register('levelId')}
                className={`w-full pl-9 pr-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                  errors.levelId
                    ? 'border-red-400'
                    : 'border-transparent focus:border-uds-blue focus:bg-white'
                }`}
              >
                <option value="">-- Sélectionnez un niveau --</option>
                {mockLevels.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>
            {errors.levelId && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.levelId.message}</p>
            )}
          </div>

          {/* Type de réservation */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Type de réservation
            </label>
            <div className="flex gap-3">
              {RESERVATION_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('reservationType')}
                    className="sr-only peer"
                  />
                  <div className="text-center py-3 rounded-xl border-2 border-gray-100 bg-uds-gray text-sm font-semibold text-uds-gray-dark peer-checked:border-uds-blue peer-checked:bg-uds-blue peer-checked:text-white transition-all">
                    {type.label}
                  </div>
                </label>
              ))}
            </div>
            {errors.reservationType && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.reservationType.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Date
            </label>
            <input
              type="date"
              {...register('date')}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                errors.date
                  ? 'border-red-400'
                  : 'border-transparent focus:border-uds-blue focus:bg-white'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.date.message}</p>
            )}
          </div>

          {/* Créneau horaire */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Heure de début
              </label>
              <input
                type="time"
                {...register('from')}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                  errors.from
                    ? 'border-red-400'
                    : 'border-transparent focus:border-uds-blue focus:bg-white'
                }`}
              />
              {errors.from && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.from.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Heure de fin
              </label>
              <input
                type="time"
                {...register('to')}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm text-gray-700 ${
                  errors.to
                    ? 'border-red-400'
                    : 'border-transparent focus:border-uds-blue focus:bg-white'
                }`}
              />
              {errors.to && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.to.message}</p>
              )}
            </div>
          </div>

          {/* Résumé créneau */}
          {watchFrom && watchTo && watchFrom < watchTo && (
            <div className="bg-uds-gray rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-uds-orange/20 rounded-lg flex items-center justify-center shrink-0">
                <CalendarPlus size={16} className="text-uds-orange" />
              </div>
              <p className="text-sm text-gray-700">
                Créneau sélectionné :{' '}
                <span className="font-bold text-uds-blue">{watchFrom} → {watchTo}</span>
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

          {/* Bouton soumettre */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-uds-orange text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-uds-orange-light active:scale-95 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
            ) : (
              <><CalendarPlus size={18} /> Confirmer la réservation</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}