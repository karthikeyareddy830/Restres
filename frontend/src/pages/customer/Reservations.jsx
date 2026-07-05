import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationService } from '../../services/reservationService';
import ReservationCard from '../../components/customer/ReservationCard';
import ReservationTable from '../../components/customer/ReservationTable';
import Modal from '../../components/ui/Modal';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import Toast from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const resData = await reservationService.getMyReservations();
      const dataArray = resData.data || [];
      // Sort newest first
      const sorted = dataArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReservations(sorted);
    } catch (err) {
      setError('Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Clear toast after 3s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleCancelClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedId) return;
    
    setCancelLoading(true);
    try {
      await reservationService.cancelReservation(selectedId);
      setToastMessage('Reservation cancelled successfully');
      
      // Update local state without refetching for better UX
      setReservations(prev => 
        prev.map(res => 
          res.reservationId === selectedId 
            ? { ...res, status: 'CANCELLED' } 
            : res
        )
      );
    } catch (err) {
      setError('Failed to cancel reservation. Please try again later.');
    } finally {
      setCancelLoading(false);
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <Toast 
        message={toastMessage} 
        isVisible={!!toastMessage} 
        onClose={() => setToastMessage('')} 
        type="success"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Reservations</h1>
          <p className="mt-2 text-neutral-600">Manage your past and upcoming bookings.</p>
        </div>
        <Button
          as={Link}
          to="/reservations/new"
          icon={<svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>}
        >
          New Booking
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <LoadingState fullHeight />
      ) : reservations.length === 0 ? (
        <EmptyState 
          title="No reservations found"
          description="You haven't made any bookings yet."
          icon={<svg className="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          action={{
            label: "Create Reservation",
            onClick: () => window.location.href = '/reservations/new'
          }}
        />
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {reservations.map(reservation => (
              <ReservationCard 
                key={reservation.reservationId} 
                reservation={reservation} 
                onCancelClick={handleCancelClick}
              />
            ))}
          </div>
          
          {/* Desktop View: Table */}
          <div className="hidden md:block">
            <ReservationTable 
              reservations={reservations} 
              onCancelClick={handleCancelClick}
            />
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !cancelLoading && setIsModalOpen(false)}
        title="Cancel Reservation"
      >
        <p className="text-sm text-neutral-500 mb-4">
          Are you sure you want to cancel this reservation? This action cannot be undone and your assigned table will be released.
        </p>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button
            variant="danger"
            onClick={handleConfirmCancel}
            isLoading={cancelLoading}
            className="w-full sm:w-auto sm:ml-3"
          >
            Cancel Reservation
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            disabled={cancelLoading}
            className="mt-3 w-full sm:w-auto sm:mt-0"
          >
            Keep Reservation
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Reservations;
