import React from 'react';

import { cn } from '@/src/lib/utils';

interface StatCardProps {
    classNameWrapper?: string;
    classNameTitle?: string;
    title: string;
    classNamePoint?: string;
    point: string;
    classNameConclusion?: string;
    conclusion?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    classNameWrapper,
    classNameTitle,
    title,
    classNamePoint,
    point,
    classNameConclusion,
    conclusion,
}) => {
    return (
        <div
            className={cn(
                'space-y-1 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center',
                classNameWrapper,
            )}
        >
            <span className={cn('text-[10px] font-bold tracking-wider text-slate-400 uppercase', classNameTitle)}>
                {title}
            </span>
            <div className={cn('font-mono text-2xl font-black', classNamePoint)}>{point}</div>
            <span className={cn('text-[11px] text-slate-500', classNameConclusion)}>{conclusion}</span>
        </div>
    );
};

export default StatCard;
