import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export function useAuth(required = true) {
  const { user, loading, fetchUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) {
      fetchUser();
    }
  }, [loading, fetchUser]);

  if (loading) {
    return { user: null, loading: true, authenticated: false };
  }

  const authenticated = !!user;

  if (required && !authenticated) {
    navigate('/login', { state: { from: location }, replace: true });
    return { user: null, loading: false, authenticated: false };
  }

  if (!required && authenticated) {
    navigate('/', { replace: true });
    return { user, loading: false, authenticated: true };
  }

  return { user, loading: false, authenticated };
}

export function useOptionalAuth() {
  return useAuth(false);
}