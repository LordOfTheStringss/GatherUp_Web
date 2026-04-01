import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabaseClient } from '../infra/supabase';

const ADMIN_EMAIL = 'admin@gatherup.com';

export default function ProtectedRoute() {
  const location = useLocation();
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthorized'>('loading');

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!mounted) return;

        if (session?.user?.email === ADMIN_EMAIL) {
          setAuthState('authenticated');
        } else {
          setAuthState('unauthorized');
        }
      } catch {
        if (mounted) setAuthState('unauthorized');
      }
    };

    checkSession();

    // Listen for auth state changes (e.g. token refresh, sign out)
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user?.email === ADMIN_EMAIL) {
        setAuthState('authenticated');
      } else {
        setAuthState('unauthorized');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authState === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-[#12121A]">
        <div className="w-12 h-12 border-4 border-purple-200 dark:border-gray-800 border-t-purple-600 dark:border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (authState === 'unauthorized') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
