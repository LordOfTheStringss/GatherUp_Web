import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../infra/supabase';

// ─── Types ──────────────────────────────────────────────────────────────────────
interface AuthState {
  isAuthenticated: boolean;
  adminEmail: string | null;
  isLoading: boolean;
  isBanned: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    adminEmail: null,
    isLoading: true,
    isBanned: false,
    error: null,
  });

  /**
   * BOUNCER LOGIC — runs on every app load / session restoration.
   *
   * 1. Read the admin session from localStorage.
   * 2. Verify the admin still exists in the `admins` table.
   * 3. CRITICAL: Also check the `users` table via supabase.auth.getSession()
   *    to enforce ban lockout for regular users.
   *    If `userProfile.status` is 'BANNED' or 'banned' → force sign-out.
   */
  useEffect(() => {
    validateSession();
  }, []);

  const validateSession = async () => {
    try {
      const adminEmail = localStorage.getItem('gatherup_admin_session');

      // ── Step 1: No localStorage session → not authenticated
      if (!adminEmail) {
        setState({
          isAuthenticated: false,
          adminEmail: null,
          isLoading: false,
          isBanned: false,
          error: null,
        });
        return;
      }

      // ── Step 2: Verify admin still exists and is valid in the admins table
      const { data: adminData, error: adminError } = await supabaseClient
        .from('admins')
        .select('*')
        .eq('email', adminEmail)
        .single();

      if (adminError || !adminData) {
        console.error('Admin session invalid — admin not found:', adminError);
        forceLogout('Your admin session is no longer valid. Please log in again.');
        return;
      }

      // ── Step 3: Check Supabase Auth session for ban enforcement on regular users
      //    This is the CRITICAL bouncer check the user app must perform.
      const { data: sessionData } = await supabaseClient.auth.getSession();

      if (sessionData?.session?.user?.id) {
        const userId = sessionData.session.user.id;

        const { data: userProfile, error: profileError } = await supabaseClient
          .from('users')
          .select('status')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Ban check — profile fetch error:', profileError);
          // Non-blocking: if the profile doesn't exist (admin isn't in users table), skip
        }

        if (userProfile) {
          const status = (userProfile.status as string).toUpperCase();

          if (status === 'BANNED') {
            console.warn('BOUNCER: User is BANNED. Forcing sign-out.');

            // Force Supabase auth sign-out
            await supabaseClient.auth.signOut();

            forceLogout('Your account has been suspended by an administrator.');
            return;
          }
        }
      }

      // ── All checks passed — authenticated
      setState({
        isAuthenticated: true,
        adminEmail,
        isLoading: false,
        isBanned: false,
        error: null,
      });
    } catch (err) {
      console.error('AuthContext validateSession error:', err);
      setState({
        isAuthenticated: false,
        adminEmail: null,
        isLoading: false,
        isBanned: false,
        error: 'Session validation failed.',
      });
    }
  };

  const forceLogout = (message: string) => {
    localStorage.removeItem('gatherup_admin_session');
    setState({
      isAuthenticated: false,
      adminEmail: null,
      isLoading: false,
      isBanned: true,
      error: message,
    });
    navigate('/login', { state: { banMessage: message }, replace: true });
  };

  const logout = () => {
    localStorage.removeItem('gatherup_admin_session');
    setState({
      isAuthenticated: false,
      adminEmail: null,
      isLoading: false,
      isBanned: false,
      error: null,
    });
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ ...state, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
