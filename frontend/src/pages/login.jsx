import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/axiosInstance';

const loginSchema = z.object({
  email: z.string().min(1, 'Ce champ est requis'),
  password: z.string().min(4, 'Mot de passe trop court'),
});

const ROLE_ROUTES = {
  TEACHER: '/teacher',
  ETUDIANT: '/student',
  ADMIN: '/admin',
  HEAD_OF_DEPT: '/dean',
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      const { token, user } = response.data;
      login(user, token);
      navigate(ROLE_ROUTES[user.role] || '/');
    } catch (error) {
      // Simulation tant que le backend n'est pas prêt
      const mockUsers = {
      'admin@uds.cm': { id: 1, nom: 'Administrateur', role: 'ADMIN' },
      'prof@uds.cm': { id: 2, nom: 'Dr. Tagne', role: 'TEACHER' },
      'etudiant@uds.cm': { id: 3, nom: 'Jean Kamga', role: 'ETUDIANT' },
      'chef@uds.cm': { id: 4, nom: 'Pr. Mbarga', role: 'HEAD_OF_DEPT' },
    };
      const mockUser = mockUsers[data.email];
      if (mockUser && data.password === '1234') {
        login(mockUser, 'mock-jwt-token-' + mockUser.role);
        navigate(ROLE_ROUTES[mockUser.role] || '/');
      } else {
        setServerError('Email ou mot de passe incorrect.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* PANNEAU GAUCHE — Branding */}
      <div className="hidden lg:flex w-1/2 bg-uds-blue flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-uds-blue-light opacity-30" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-uds-orange opacity-20" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="w-28 h-28 bg-white rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <GraduationCap size={56} className="text-uds-blue" />
          </div>

          <h1 className="text-white text-4xl font-bold uppercase tracking-wide leading-tight mb-3">
            Université<br />de Dschang
          </h1>
          <div className="w-16 h-1 bg-uds-orange rounded-full mx-auto my-5" />
          <p className="text-blue-100 text-lg opacity-90 font-medium">
            Système de Réservation<br />des Salles
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            {[
              { label: 'Campus', value: '1' },
              { label: 'Salles', value: '50+' },
              { label: 'Enseignants', value: '200+' },
              { label: 'Étudiants', value: '10k+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-uds-orange text-2xl font-bold">{stat.value}</p>
                <p className="text-blue-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PANNEAU DROIT — Formulaire */}
      <div className="w-full lg:w-1/2 bg-uds-gray flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Header mobile uniquement */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-uds-blue rounded-full mx-auto mb-3 flex items-center justify-center">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-uds-blue text-xl font-bold uppercase">Université de Dschang</h1>
            <p className="text-uds-gray-dark text-sm">Système de Réservation des Salles</p>
          </div>

          {/* Carte formulaire */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-uds-blue text-2xl font-bold">Connexion</h2>
              <p className="text-uds-gray-dark text-sm mt-1">
                Accédez à votre espace personnel
              </p>
            </div>

            {serverError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email ou Matricule
                </label>
                <input
                  type="text"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all bg-uds-gray placeholder:text-gray-400 text-gray-800 ${
                    errors.email
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-transparent focus:border-uds-blue focus:bg-white'
                  }`}
                  placeholder="ex: p.nom@univ-dschang.cm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Mot de passe
                  </label>
                  <a href="#" className="text-xs text-uds-orange hover:underline font-semibold">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 outline-none transition-all bg-uds-gray placeholder:text-gray-400 text-gray-800 ${
                      errors.password
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-transparent focus:border-uds-blue focus:bg-white'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-uds-blue transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Bouton connexion */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 bg-uds-blue hover:bg-uds-blue-light active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-2"
              >
                {isSubmitting
                  ? <><Loader2 size={20} className="animate-spin" /> Connexion...</>
                  : 'SE CONNECTER'
                }
              </button>
            </form>

            {/* Comptes de test */}
            <div className="mt-6 p-4 bg-uds-gray rounded-xl border border-dashed border-gray-300">
              <p className="text-xs font-bold text-uds-gray-dark mb-2 uppercase tracking-wide">
                Comptes de test
              </p>
              <div className="space-y-1">
                {[
                  { email: 'admin@uds.cm', role: 'Admin' },
                  { email: 'prof@uds.cm', role: 'Enseignant' },
                  { email: 'etudiant@uds.cm', role: 'Étudiant' },
                  { email: 'chef@uds.cm', role: 'Chef de Département / Doyen' },
                ].map((u) => (
                  <div key={u.email} className="flex justify-between text-xs text-uds-gray-dark">
                    <span className="font-medium text-uds-orange">{u.role}</span>
                    <span>{u.email} / <strong>1234</strong></span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <p className="text-center text-xs text-uds-gray-dark mt-6">
            © 2025 Direction des Affaires Académiques — Université de Dschang
          </p>
        </div>
      </div>
    </div>
  );
}