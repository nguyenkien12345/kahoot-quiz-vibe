import { cn } from "@/src/lib/utils";
import React from "react";

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
    conclusion
}) => {
    return (
        <div className={cn("bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1", classNameWrapper)}>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider text-slate-400", classNameTitle)}>{title}</span>
            <div className={cn("text-2xl font-black font-mono", classNamePoint)}>{point}</div>
            <span className={cn("text-[11px] text-slate-500", classNameConclusion)}>{conclusion}</span>
        </div>
    )
};

export default StatCard;