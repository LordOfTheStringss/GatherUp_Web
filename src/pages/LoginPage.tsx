import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseClient } from '../infra/supabase';
import { CalendarDays, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Temporary hardcoded bypass for development
      /*
      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user?.email !== 'admin@gatherup.com') {
        await supabaseClient.auth.signOut();
        throw new Error('Unauthorized Access: Only the system administrator can access this panel.');
      }
      */

      if (email === 'admin@gatherup.com' && password === 'admin123') {
        localStorage.setItem('gatherup_admin_auth', 'true');
        navigate('/admin/overview', { replace: true });
      } else {
        throw new Error('Invalid admin credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#12121A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group w-fit mx-auto">
          <CalendarDays className="w-10 h-10 text-purple-600 dark:text-purple-500 group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">GatherUp</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold tracking-tight mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Sign in to access the system administration panel.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-[#1A1A24]/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-purple-900/5 dark:shadow-none border border-gray-100 dark:border-gray-800/80 sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#12121A] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm transition-colors"
                  placeholder="admin@gatherup.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#12121A] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-purple-600 focus:ring-purple-500 bg-white dark:bg-[#12121A]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember Me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-purple-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-purple-500/30 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                &larr; Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
