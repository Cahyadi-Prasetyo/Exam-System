import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, icon, className = '', ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = props.id || generatedId;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
              block w-full rounded-md border px-3 py-2 text-sm
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-destructive' : 'border-input bg-background'}
              ${icon ? 'pl-10' : ''}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-sm text-destructive">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
