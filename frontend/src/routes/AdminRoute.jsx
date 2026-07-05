import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl font-bold text-red-600">Access Denied</div>
      </div>
    );
  }

  return <Outlet />;
};
