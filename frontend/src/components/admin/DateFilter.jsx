const DateFilter = ({ selectedDate, onDateChange }) => {
  return (
    <div className="flex items-center">
      <label htmlFor="dateFilter" className="sr-only">Filter by Date</label>
      <input
        type="date"
        id="dateFilter"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="block w-full py-2 px-3 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-neutral-900"
      />
      {selectedDate && (
        <button
          onClick={() => onDateChange('')}
          className="ml-2 text-sm text-neutral-500 hover:text-neutral-700"
          title="Clear Date"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      )}
    </div>
  );
};

export default DateFilter;
