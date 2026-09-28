import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'action-cyan'
  | 'action-purple'
  | 'action-emerald';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyle =
    'inline-flex items-center justify-center font-semibold rounded transition-all duration-150 select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle =
        'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-sm focus:ring-2 focus:ring-[#0284c7] focus:ring-offset-2';
      break;
    case 'secondary':
      variantStyle =
        'bg-[#1e293b] hover:bg-[#334155] text-slate-50 focus:ring-2 focus:ring-slate-700';
      break;
    case 'outline':
      variantStyle =
        'bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-800 focus:ring-2 focus:ring-sky-500';
      break;
    case 'destructive':
      variantStyle =
        'bg-[#e11d48] hover:bg-[#be123c] text-white focus:ring-2 focus:ring-rose-500';
      break;
    case 'action-cyan':
      variantStyle =
        'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200';
      break;
    case 'action-purple':
      variantStyle =
        'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200';
      break;
    case 'action-emerald':
      variantStyle =
        'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-2.5 py-1 text-xs gap-1.5 min-h-[30px]';
      break;
    case 'md':
      sizeStyle = 'px-3.5 py-1.5 text-xs sm:text-sm gap-2 min-h-[36px]';
      break;
    case 'lg':
      sizeStyle = 'px-5 py-2.5 text-sm sm:text-base gap-2.5 min-h-[44px]';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && icon && iconPosition === 'right' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
    </button>
  );
};
