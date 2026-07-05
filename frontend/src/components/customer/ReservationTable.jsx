import StatusBadge from '../ui/StatusBadge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import Card from '../ui/Card';

const ReservationTable = ({ reservations, onCancelClick }) => {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableHead>Date & Time</TableHead>
          <TableHead>Guests</TableHead>
          <TableHead>Table</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Booked On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.reservationId}>
              <TableCell>
                <div className="font-medium text-neutral-900">
                  {new Date(reservation.reservationDate).toLocaleDateString()}
                </div>
                <div className="text-neutral-500">{reservation.timeSlot}</div>
              </TableCell>
              <TableCell>
                {reservation.guests}
              </TableCell>
              <TableCell>
                {reservation.table?.tableNumber ? `Table ${reservation.table.tableNumber}` : 'N/A'}
              </TableCell>
              <TableCell>
                <StatusBadge status={reservation.status} />
              </TableCell>
              <TableCell>
                {new Date(reservation.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                {reservation.status === 'ACTIVE' && (
                  <button
                    onClick={() => onCancelClick(reservation.reservationId)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ReservationTable;
