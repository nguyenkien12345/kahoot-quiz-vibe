import { cn } from "@/src/lib/utils";
import React from "react";
import { LucideIcon } from "lucide-react";

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
    onClick
}) => {
    return (
        <div className={cn(
            "group relative bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl flex flex-col justify-between",
            classNameWrapperContainer
        )}
            onClick={onClick}
        >
            <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                    {/* Render Icon */}
                    {
                        Icon && (
                            <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center font-bold group-hover:scale-110 transition-transform", classNameWrapperIcon)}>
                                <Icon className={cn("w-5 h-5", classNameIcon)} />
                            </div>
                        )
                    }

                    {/* Render Text */}
                    {
                        text && (
                            <span className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-full border", classNameWrapperText)}>
                                {text}
                            </span>
                        )
                    }
                </div>

                {/* Content */}
                {/* Title */}
                <h4 className={cn("font-extrabold text-white text-base transition-colors", classNameWrapperTitle)}>
                    {title}
                </h4>

                {/* Description */}
                {
                    description && (
                        <p className={cn("text-xs text-slate-400 leading-relaxed", classNameWrapperDescription)}>
                            {description}
                        </p>
                    )
                }
            </div>

            {/* Actions */}
            {
                showActions && (
                    <div className={cn("mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold", classNameWrapperActions)}>
                        {textAction}
                        {
                            IconAction && (
                                <IconAction className={cn("w-4 h-4 fill-current group-hover:translate-x-1 transition-transform", classNameIconAction)} />
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default GameModeBlock;