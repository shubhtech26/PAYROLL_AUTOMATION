import { Navigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { useAuth } from '../../hooks/useAuth';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default PrivateRoute;
