import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { GuestRoute } from './GuestRoute';

import { lazy, Suspense } from 'react';
import LoadingState from '../components/ui/LoadingState';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';

// Auth Pages (Lazy loaded)
const CustomerLogin = lazy(() => import('../pages/auth/CustomerLogin'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));
const Register = lazy(() => import('../pages/auth/Register'));

// Customer Pages (Lazy loaded)
const CustomerDashboard = lazy(() => import('../pages/customer/Dashboard'));
const CustomerReservations = lazy(() => import('../pages/customer/Reservations'));
const CreateReservation = lazy(() => import('../pages/customer/CreateReservation'));

// Admin Pages (Lazy loaded)
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminReservations = lazy(() => import('../pages/admin/Reservations'));
const AdminTables = lazy(() => import('../pages/admin/Tables'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingState message="Loading application..." fullHeight />}>
      <Routes>
        {/* Public / Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login/customer" element={<CustomerLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login" element={<Navigate to="/login/customer" replace />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Root route redirect logic */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<CustomerLayout />}>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/reservations" element={<CustomerReservations />} />
            <Route path="/reservations/new" element={<CreateReservation />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              <Route path="/admin/tables" element={<AdminTables />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<div className="p-10 text-center text-2xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};
