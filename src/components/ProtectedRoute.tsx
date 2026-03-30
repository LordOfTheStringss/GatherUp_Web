import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { supabaseClient } from '../infra/supabaseClient'; // Temporarily bypassed

export default function ProtectedRoute() {
  const location = useLocation();

  // Temporary local storage bypass
  const isAuthenticated = localStorage.getItem('gatherup_admin_auth') === 'true';

  /*
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    ...
  */

  if (!isAuthenticated) {
    // Redirect to login but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
