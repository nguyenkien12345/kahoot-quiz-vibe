import { cn } from "@/src/lib/utils";
import React from "react";

interface BadgeProps {
    label: string;
    className?: string;
    shouldShow?: boolean;
    emptyChild?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
    label,
    className,
    shouldShow = true,
    emptyChild
}) => {
    if (shouldShow) {
        return (
            <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-lg border", className)}>
                {label}
            </span>
        )
    }

    if (emptyChild) return <>{emptyChild}</>;
    return null;
};

export default Badge;