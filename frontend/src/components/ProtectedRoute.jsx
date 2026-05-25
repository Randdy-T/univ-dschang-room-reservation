import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ROLE_ALLOWED_PATHS = {
  ADMIN: ['/admin'],
  TEACHER: ['/teacher'],
  ETUDIANT: ['/student'],
  HEAD_OF_DEPT: ['/dean'],
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  // Non connecté → retour au login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Rôle non autorisé → retour au dashboard approprié
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = ROLE_ALLOWED_PATHS[user.role]?.[0] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}