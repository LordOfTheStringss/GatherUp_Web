import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ShieldOff } from 'lucide-react';

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading, isBanned, error } = useAuth();

  // Show loading spinner while session is being validated
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-[#12121A] transition-colors">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Validating session...
        </p>
      </div>
    );
  }

  // Show ban message if user was kicked out
  if (isBanned) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-[#12121A] transition-colors px-4">
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full text-center">
          <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center rounded-2xl mb-4">
            <ShieldOff className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Account Suspended
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {error || 'Your account has been suspended by an administrator.'}
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // All checks passed → render protected content
  return <Outlet />;
}
