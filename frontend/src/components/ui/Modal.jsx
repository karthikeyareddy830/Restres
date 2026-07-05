import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-neutral-900 opacity-50 backdrop-blur-sm" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        <div className={`relative z-10 inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-xl shadow-2xl sm:my-8 sm:align-middle ${maxWidth}`}>
          {title && (
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
              <button 
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
