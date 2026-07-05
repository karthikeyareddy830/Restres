import { useState, useEffect, useCallback } from 'react';
import { adminReservationService } from '../../services/adminReservationService';
import SearchBar from '../../components/admin/SearchBar';
import StatusFilter from '../../components/admin/StatusFilter';
import DateFilter from '../../components/admin/DateFilter';
import Pagination from '../../components/ui/Pagination';
import ReservationDetailsModal from '../../components/admin/ReservationDetailsModal';
import EditReservationModal from '../../components/admin/EditReservationModal';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingState from '../../components/ui/LoadingState';
import Toast from '../../components/ui/Toast';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AdminReservations = () => {
  const [data, setData] = useState({ reservations: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [selectedRes, setSelectedRes] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sort: 'reservationDate'
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      // If a specific date is selected, we use the date route logic, but the admin backend
      // actually needs custom handling. Assuming the backend accepts date filtering natively 
      // or we use the specific route. For simplicity, we use the main GET / with params if the backend supports it, 
      // otherwise fallback to specific date fetching.
      let response;
      if (dateFilter) {
        response = await adminReservationService.getReservations({ ...params, reservationDate: dateFilter });
      } else {
        response = await adminReservationService.getReservations(params);
      }
      
      setData({
        reservations: response.data || [],
        pagination: {
          total: response.total || response.count || 0,
          page,
          limit: params.limit
        }
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg) => setToastMessage(msg);

  // Actions
  const handleView = (res) => {
    setSelectedRes(res);
    setIsDetailsOpen(true);
  };

  const handleEdit = (res) => {
    setSelectedRes(res);
    setIsEditOpen(true);
  };

  const handleCancelClick = (res) => {
    setSelectedRes(res);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRes) return;
    setActionLoading(true);
    try {
      await adminReservationService.cancelReservation(selectedRes._id);
      showToast('Reservation cancelled successfully');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setActionLoading(false);
      setIsCancelOpen(false);
      setSelectedRes(null);
    }
  };

  const handleUpdate = async (formData) => {
    if (!selectedRes) return;
    setActionLoading(true);
    try {
      await adminReservationService.updateReservation(selectedRes._id, formData);
      showToast('Reservation updated successfully');
      fetchReservations();
      setIsEditOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update reservation');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Manage Reservations</h1>
          <p className="mt-2 text-neutral-600">View, edit, and cancel customer reservations.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Filters Bar */}
      <Card className="mb-6 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar onSearch={(val) => { setSearchTerm(val); setPage(1); }} placeholder="Search name or email..." />
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <DateFilter selectedDate={dateFilter} onDateChange={(val) => { setDateFilter(val); setPage(1); }} />
          <StatusFilter currentStatus={statusFilter} onStatusChange={(val) => { setStatusFilter(val); setPage(1); }} />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingState fullHeight />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableHead>Customer Info</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableHeader>
              <TableBody>
                {data.reservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="6" className="py-12 text-center text-neutral-500">
                      No reservations found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.reservations.map((res) => (
                    <TableRow key={res._id}>
                      <TableCell>
                        <div className="font-medium text-neutral-900">{res.user?.name || 'N/A'}</div>
                        <div className="text-neutral-500">{res.user?.email || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-neutral-900">{new Date(res.reservationDate).toLocaleDateString()}</div>
                        <div className="text-neutral-500">{res.timeSlot}</div>
                      </TableCell>
                      <TableCell>{res.guests}</TableCell>
                      <TableCell className="font-medium">
                        {res.table ? `Table ${res.table.tableNumber}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={res.status === 'ACTIVE' ? 'success' : res.status === 'CANCELLED' ? 'error' : 'default'}>
                          {res.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(res)}>
                          View
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(res)}>
                          Edit
                        </Button>
                        {res.status === 'ACTIVE' && (
                          <Button variant="danger" size="sm" onClick={() => handleCancelClick(res)}>
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          </>
        )}
      </Card>

      {/* Modals */}
      <ReservationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        reservation={selectedRes}
      />

      <EditReservationModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdate}
        reservation={selectedRes}
        loading={actionLoading}
      />

      <Modal
        isOpen={isCancelOpen}
        onClose={() => !actionLoading && setIsCancelOpen(false)}
        title="Cancel Customer Reservation"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => !actionLoading && setIsCancelOpen(false)}
              disabled={actionLoading}
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              isLoading={actionLoading}
            >
              Confirm Cancel
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-500">
          Are you sure you want to cancel the reservation for <span className="font-medium text-neutral-900">{selectedRes?.user?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminReservations;
