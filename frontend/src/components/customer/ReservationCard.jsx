import StatusBadge from '../ui/StatusBadge';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ReservationCard = ({ reservation, onCancelClick }) => {
  const { reservationId, reservationDate, timeSlot, guests, table, status, createdAt } = reservation;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {new Date(reservationDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <p className="text-neutral-500 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {timeSlot}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 bg-neutral-50 p-4 rounded-lg">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Guests</p>
            <p className="font-medium text-neutral-900 mt-1">{guests} people</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Table</p>
            <p className="font-medium text-neutral-900 mt-1">Table {table?.tableNumber || 'N/A'}</p>
          </div>
        </div>

        <div className="text-xs text-neutral-400 mb-4">
          Booked on {new Date(createdAt).toLocaleDateString()}
        </div>

        {status === 'ACTIVE' && (
          <Button
            onClick={() => onCancelClick(reservationId)}
            variant="danger"
            fullWidth
            className="mt-2"
          >
            Cancel Reservation
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ReservationCard;
