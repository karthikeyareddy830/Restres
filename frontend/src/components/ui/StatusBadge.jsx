import Badge from './Badge';

const StatusBadge = ({ status }) => {
  const isCancelled = status === 'CANCELLED';
  
  return (
    <Badge variant={isCancelled ? 'error' : 'success'}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
