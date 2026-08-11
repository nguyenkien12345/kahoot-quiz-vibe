import React from 'react';

import { cn } from '@/src/lib/utils';

interface BadgeProps {
    label: string;
    className?: string;
    shouldShow?: boolean;
    emptyChild?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ label, className, shouldShow = true, emptyChild }) => {
    if (shouldShow) {
        return <span className={cn('rounded-lg border px-2.5 py-0.5 text-[11px] font-bold', className)}>{label}</span>;
    }

    if (emptyChild) return <>{emptyChild}</>;
    return null;
};

export default Badge;
