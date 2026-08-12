import { LucideIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/src/lib/utils';

export type ButtonVariant = 'gradient';
export type ButtonSize = 'lg';

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
};

const sizeStyles: Record<ButtonSize, string> = {
    lg: 'px-8 py-3.5 text-sm font-black tracking-wider uppercase rounded-2xl gap-2',
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
                    'inline-flex items-center justify-center font-sans transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50',
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

                {!isLoading && RightIcon && <RightIcon className={(cn('h-4 w-4 shrink-0'), classNameIcon)} />}
            </button>
        );
    },
);

Button.displayName = 'Button';

export default Button;
