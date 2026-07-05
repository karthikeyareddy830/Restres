import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { reservationService } from '../../services/reservationService';
import LoadingState from '../../components/ui/LoadingState';
import Card from '../../components/ui/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resData = await reservationService.getMyReservations();
        const reservations = resData.data || [];
        
        const total = reservations.length;
        const active = reservations.filter(r => r.status === 'ACTIVE').length;
        const cancelled = reservations.filter(r => r.status === 'CANCELLED').length;
        
        setStats({ total, active, cancelled });
      } catch (err) {
        setError('Failed to load dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingState fullHeight />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Here's an overview of your reservations.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex items-center hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Reservations</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Active Reservations</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.active}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Cancelled Reservations</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.cancelled}</p>
          </div>
        </Card>
      </div>

      {/* Navigation Cards */}
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/reservations/new" className="group block h-full">
          <Card className="p-6 hover:shadow-lg hover:border-primary-200 transition-all h-full flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-full bg-primary-50 text-primary-600 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Create Reservation</h3>
              <p className="text-neutral-600">Book a new table for your upcoming visit to our restaurant.</p>
            </div>
            <div className="mt-4 text-primary-600 font-medium flex items-center group-hover:text-primary-700">
              Book Now <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </Card>
        </Link>

        <Link to="/reservations" className="group block h-full">
          <Card className="p-6 hover:shadow-lg hover:border-blue-200 transition-all h-full flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">My Reservations</h3>
              <p className="text-neutral-600">View your booking history, check upcoming reservations, or cancel existing ones.</p>
            </div>
            <div className="mt-4 text-blue-600 font-medium flex items-center group-hover:text-blue-700">
              View All <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
