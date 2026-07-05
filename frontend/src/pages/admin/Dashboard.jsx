import { useState, useEffect } from 'react';
import { adminReservationService } from '../../services/adminReservationService';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import LoadingState from '../../components/ui/LoadingState';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, recentData] = await Promise.all([
          adminReservationService.getStatistics(),
          adminReservationService.getReservations({ limit: 5, sort: '-createdAt' })
        ]);
        
        setStats(statsData);
        setRecentReservations(recentData.data || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingState fullHeight />;
  if (error) return <div className="p-8 text-red-600 bg-red-50 rounded-lg max-w-7xl mx-auto mt-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="mt-2 text-neutral-600">System overview and latest reservation activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatsCard 
          title="Total Reservations" 
          value={stats?.totalReservations || 0}
          color="bg-blue-50 text-blue-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
        />
        <AdminStatsCard 
          title="Active Reservations" 
          value={stats?.activeReservations || 0}
          color="bg-green-50 text-green-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <AdminStatsCard 
          title="Cancelled Reservations" 
          value={stats?.cancelledReservations || 0}
          color="bg-red-50 text-red-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <AdminStatsCard 
          title="Today's Reservations" 
          value={stats?.todayReservations || 0}
          color="bg-purple-50 text-purple-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100">
          <h3 className="text-lg leading-6 font-medium text-neutral-900">Recent Reservations</h3>
        </div>
        <Table>
          <TableHeader>
            <TableHead>Customer</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>
          <TableBody>
            {recentReservations.map((res) => (
              <TableRow key={res._id}>
                <TableCell className="font-medium text-neutral-900">{res.user?.name || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(res.reservationDate).toLocaleDateString()} at {res.timeSlot}
                </TableCell>
                <TableCell>{res.guests}</TableCell>
                <TableCell>{res.table ? res.table.tableNumber : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={res.status === 'ACTIVE' ? 'success' : 'error'}>
                    {res.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {recentReservations.length === 0 && (
              <TableRow>
                <TableCell colSpan="5" className="text-center text-neutral-500 py-6">
                  No recent reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminDashboard;
