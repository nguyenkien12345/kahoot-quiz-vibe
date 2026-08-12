import { LucideIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/src/lib/utils';

export type ButtonVariant = 'gradient' | 'secondary' | 'ghost' | 'amber' | 'emerald' | 'purple';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    isLoading?: boolean;
    fullWidth?: boolean;
    classNameIcon?: string;
}

// bg-linear-to-r: Tạo hình nền chuyển màu dạng tuyến tính (linear gradient) theo hướng từ trái sang phải (to right)
// from-purple-600: Điểm màu bắt đầu (góc bên trái) là màu Tím đậm
// via-pink-600: Điểm màu ở giữa dải gradient là màu Hồng đậm. Việc có via- giúp dải chuyển màu mượt mà qua 3 tông màu: Tím -> Hồng -> Vàng
// to-amber-500: Điểm màu kết thúc (góc bên phải) là màu Vàng hổ phách / Cam vàng

const variantStyles: Record<ButtonVariant, string> = {
    gradient:
        'bg-linear-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-600/30',
    secondary:
        'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-600',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50',
    amber: 'border border-amber-400/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400/70',
    emerald:
        'border border-emerald-500/40 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-500/60',
    purple: 'border border-purple-500/40 bg-purple-950/60 text-purple-300 hover:border-purple-500/60 hover:bg-purple-900/60',
};

const sizeStyles: Record<ButtonSize, string> = {
    lg: 'px-8 py-3.5 text-sm font-black tracking-wider uppercase rounded-2xl gap-2',
    md: 'px-5 py-2 text-xs font-bold tracking-wider rounded-xl shadow-lg gap-2',
    sm: 'px-3 py-2 text-xs font-semibold rounded-xl gap-2',
    icon: 'p-2 text-xs rounded-xl gap-0',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'gradient',
            size = 'lg',
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            isLoading = false,
            fullWidth = false,
            classNameIcon,
            className,
            disabled,
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center font-sans transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth ? 'w-full sm:w-auto' : '',
                    className,
                )}
                {...props}
            >
                {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    LeftIcon && <LeftIcon className={cn('h-4 w-4 shrink-0', classNameIcon)} />
                )}

                {children && <span>{children}</span>}

                {!isLoading && RightIcon && <RightIcon className={cn('h-4 w-4 shrink-0', classNameIcon)} />}
            </button>
        );
    },
);

Button.displayName = 'Button';

export default Button;
