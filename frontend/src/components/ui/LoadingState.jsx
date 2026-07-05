import React from 'react';

const LoadingState = ({ message = "Loading...", fullHeight = false }) => {
  return (
    <div className={`flex flex-col justify-center items-center p-8 space-y-4 ${fullHeight ? 'min-h-[60vh]' : ''}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      <p className="text-neutral-500 text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
