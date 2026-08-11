import React from 'react';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/src/lib/utils';

interface GameModeBlockProps {
    classNameWrapperContainer?: string;
    classNameWrapperIcon?: string;
    classNameIcon?: string;
    icon?: LucideIcon;
    classNameWrapperText?: string;
    text?: string;
    classNameWrapperTitle?: string;
    title: string;
    classNameWrapperDescription?: string;
    description: string;
    showActions?: boolean;
    classNameWrapperActions?: string;
    textAction?: string;
    iconAction?: LucideIcon;
    classNameIconAction?: string;
    onClick?: () => void;
}

const GameModeBlock: React.FC<GameModeBlockProps> = ({
    classNameWrapperContainer,
    classNameWrapperIcon,
    classNameIcon,
    icon: Icon,
    classNameWrapperText,
    text,
    classNameWrapperTitle,
    title,
    classNameWrapperDescription,
    description,
    showActions = true,
    classNameWrapperActions,
    textAction,
    iconAction: IconAction,
    classNameIconAction,
    onClick,
}) => {
    return (
        <div
            className={cn(
                'group relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:shadow-xl',
                classNameWrapperContainer,
            )}
            onClick={onClick}
        >
            <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                    {/* Render Icon */}
                    {Icon && (
                        <div
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl border font-bold transition-transform group-hover:scale-110',
                                classNameWrapperIcon,
                            )}
                        >
                            <Icon className={cn('h-5 w-5', classNameIcon)} />
                        </div>
                    )}

                    {/* Render Text */}
                    {text && (
                        <span
                            className={cn(
                                'rounded-full border px-2 py-0.5 text-[10px] font-black uppercase',
                                classNameWrapperText,
                            )}
                        >
                            {text}
                        </span>
                    )}
                </div>

                {/* Content */}
                {/* Title */}
                <h4 className={cn('text-base font-extrabold text-white transition-colors', classNameWrapperTitle)}>
                    {title}
                </h4>

                {/* Description */}
                {description && (
                    <p className={cn('text-xs leading-relaxed text-slate-400', classNameWrapperDescription)}>
                        {description}
                    </p>
                )}
            </div>

            {/* Actions */}
            {showActions && (
                <div
                    className={cn(
                        'mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs font-bold',
                        classNameWrapperActions,
                    )}
                >
                    {textAction}
                    {IconAction && (
                        <IconAction
                            className={cn(
                                'h-4 w-4 fill-current transition-transform group-hover:translate-x-1',
                                classNameIconAction,
                            )}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default GameModeBlock;
