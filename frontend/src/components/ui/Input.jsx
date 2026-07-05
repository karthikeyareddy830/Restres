import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  helpText,
  id,
  className = '',
  wrapperClassName = '',
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = !!error;

  const baseInputStyles = "block w-full rounded-md shadow-sm sm:text-sm transition-colors py-2 px-3";
  const defaultInputStyles = "border-neutral-300 focus:ring-primary-500 focus:border-primary-500 text-neutral-900";
  const errorInputStyles = "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  const disabledStyles = "disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed";

  const inputClasses = `
    ${baseInputStyles}
    ${hasError ? errorInputStyles : defaultInputStyles}
    ${disabledStyles}
    ${className}
  `.trim();

  return (
    <div className={`space-y-1 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {type === 'select' ? (
          <select
            ref={ref}
            id={inputId}
            className={`${inputClasses} bg-white`}
            {...props}
          >
            {props.children}
          </select>
        ) : (
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={inputClasses}
            {...props}
          />
        )}
      </div>
      {helpText && !hasError && (
        <p className="text-sm text-neutral-500">{helpText}</p>
      )}
      {hasError && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
