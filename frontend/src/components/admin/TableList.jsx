import Badge from '../ui/Badge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import Button from '../ui/Button';

const TableList = ({ tables, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableHead>Table Number</TableHead>
        <TableHead>Capacity</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Created Date</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableHeader>
      <TableBody>
        {tables.length === 0 ? (
          <TableRow>
            <TableCell colSpan="5" className="py-12 text-center text-neutral-500">
              No tables found matching your criteria.
            </TableCell>
          </TableRow>
        ) : (
          tables.map((table) => (
            <TableRow key={table._id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold">
                    {table.tableNumber}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium text-neutral-900">
                {table.capacity} Seats
              </TableCell>
              <TableCell>
                <Badge variant={table.isActive ? 'success' : 'error'}>
                  {table.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(table.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(table)}>
                  Edit
                </Button>
                {table.isActive && (
                  <Button variant="danger" size="sm" onClick={() => onDelete(table)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableList;
