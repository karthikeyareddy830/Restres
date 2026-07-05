const StatusFilter = ({ currentStatus, onStatusChange }) => {
  return (
    <div className="flex bg-neutral-100 p-1 rounded-md">
      <button
        onClick={() => onStatusChange('')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentStatus === '' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onStatusChange('ACTIVE')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentStatus === 'ACTIVE' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onStatusChange('CANCELLED')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentStatus === 'CANCELLED' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Cancelled
      </button>
    </div>
  );
};

export default StatusFilter;
