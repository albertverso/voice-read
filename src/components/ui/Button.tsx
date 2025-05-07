import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          // Size variations
          {
            'px-3 py-2 text-sm h-9': size === 'sm',
            'px-4 py-2 text-base h-10': size === 'md',
            'px-6 py-3 text-lg h-12': size === 'lg',
            'p-2 h-10 w-10': size === 'icon',
          },
          // Variant variations
          {
            'bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90': 
              variant === 'primary',
            'bg-secondary text-white hover:bg-secondary/90 dark:bg-secondary dark:text-white dark:hover:bg-secondary/90': 
              variant === 'secondary',
            'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800': 
              variant === 'outline',
            'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800': 
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700': 
              variant === 'destructive',
          },
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };