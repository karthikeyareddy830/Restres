import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ReservationDetailsModal = ({ isOpen, onClose, reservation }) => {
  if (!isOpen || !reservation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reservation Details"
      footer={
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Close
        </Button>
      }
    >
      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Reservation ID</dt>
          <dd className="mt-1 text-sm text-neutral-900 font-mono">{reservation._id}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Status</dt>
          <dd className="mt-1 text-sm text-neutral-900">
            <Badge variant={reservation.status === 'ACTIVE' ? 'success' : reservation.status === 'CANCELLED' ? 'error' : 'default'}>
              {reservation.status}
            </Badge>
          </dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Customer Name</dt>
          <dd className="mt-1 text-sm text-neutral-900">{reservation.user?.name || 'N/A'}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Email Address</dt>
          <dd className="mt-1 text-sm text-neutral-900">{reservation.user?.email || 'N/A'}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Date</dt>
          <dd className="mt-1 text-sm text-neutral-900">{new Date(reservation.reservationDate).toLocaleDateString()}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Time Slot</dt>
          <dd className="mt-1 text-sm text-neutral-900">{reservation.timeSlot}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Guests</dt>
          <dd className="mt-1 text-sm text-neutral-900">{reservation.guests}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-neutral-500">Assigned Table</dt>
          <dd className="mt-1 text-sm font-semibold text-blue-600">{reservation.table ? `Table ${reservation.table.tableNumber} (Capacity: ${reservation.table.capacity})` : 'Not Assigned'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-neutral-500">Created At</dt>
          <dd className="mt-1 text-sm text-neutral-900">{new Date(reservation.createdAt).toLocaleString()}</dd>
        </div>
      </dl>
    </Modal>
  );
};

export default ReservationDetailsModal;
