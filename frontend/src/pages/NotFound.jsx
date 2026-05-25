import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, ArrowLeft } from 'lucide-react';

const ROLE_ROUTES = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  ETUDIANT: '/student',
  HEAD_OF_DEPT: '/dean',
};

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      navigate(ROLE_ROUTES[user.role] || '/');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-uds-gray flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center border border-gray-100">

        {/* Illustration */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="w-32 h-32 bg-uds-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-5xl">404</span>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-uds-orange rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">!</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-uds-blue mb-2">
          Page introuvable
        </h1>
        <p className="text-uds-gray-dark text-sm mb-2">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <p className="text-uds-gray-dark text-xs mb-8">
          Université de Dschang — Système de Réservation des Salles
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-uds-blue text-white font-bold hover:bg-uds-blue-light transition-all shadow-md"
          >
            <Home size={18} />
            {isAuthenticated ? 'Mon tableau de bord' : 'Page de connexion'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-uds-blue text-uds-blue font-bold hover:bg-uds-blue hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}