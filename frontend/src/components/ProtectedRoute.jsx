// ============================================
// frontend/src/components/ProtectedRoute.jsx
// ✅ FIXED: Check token not just user
// ============================================
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const { token, user } = useAuthStore();

  // ✅ Check both token and user
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}