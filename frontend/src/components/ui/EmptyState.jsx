import React from 'react';

const EmptyState = ({ 
  title = 'No data found', 
  description = 'There is currently no data to display here.',
  icon,
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-neutral-100 rounded-xl shadow-sm border-dashed">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-neutral-50 text-neutral-400">
        {icon || (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
