import { LucideIcon } from 'lucide-react';
import React, { useId } from 'react';

import { cn } from '@/src/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    containerClassName?: string;
    labelClassName?: string;
    iconClassName?: string;
    errorClassName?: string;
    helperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            containerClassName,
            labelClassName,
            iconClassName,
            errorClassName,
            helperClassName,
            className,
            disabled,
            id,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={cn('w-full space-y-1', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            'block text-[11px] font-semibold whitespace-nowrap text-slate-400',
                            labelClassName,
                        )}
                    >
                        {label}
                    </label>
                )}

                <div className="relative flex items-center">
                    {LeftIcon && (
                        <LeftIcon
                            className={cn('pointer-events-none absolute left-3 h-4 w-4 text-slate-500', iconClassName)}
                        />
                    )}

                    <input
                        id={inputId}
                        ref={ref}
                        disabled={disabled}
                        className={cn(
                            'w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-bold text-white transition-colors focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                            LeftIcon && 'pl-9',
                            RightIcon && 'pr-9',
                            error && 'border-rose-500 focus:border-rose-500',
                            className,
                        )}
                        {...props}
                    />

                    {RightIcon && (
                        <RightIcon
                            className={cn('pointer-events-none absolute right-3 h-4 w-4 text-slate-500', iconClassName)}
                        />
                    )}
                </div>

                {error ? (
                    <p className={cn('text-[10px] font-medium text-rose-400', errorClassName)}>{error}</p>
                ) : (
                    helperText && <p className={cn('text-[10px] text-slate-500', helperClassName)}>{helperText}</p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
