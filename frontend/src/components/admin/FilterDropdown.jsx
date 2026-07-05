const FilterDropdown = ({ options, currentValue, onChange, label }) => {
  return (
    <div className="flex items-center">
      {label && <label className="mr-2 text-sm font-medium text-gray-700">{label}:</label>}
      <select
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
