import { Edit3, FileJson, Play, Sparkles, Volume2, VolumeX } from 'lucide-react';
import React from 'react';

import Button from '../ui/Button';

import { QuizData, ViewMode } from '@/src/types';

interface HeaderProps {
    currentQuiz: QuizData;
    soundEnabled: boolean;
    onToggleSound: () => void;
    onOpenJsonModal: () => void;
    onOpenAiModal: () => void;
    onOpenEditor: () => void;
    onResetGame: () => void;
    viewMode: ViewMode;
}

export const Header: React.FC<HeaderProps> = ({
    currentQuiz,
    soundEnabled,
    onToggleSound,
    onOpenJsonModal,
    onOpenAiModal,
    onOpenEditor,
    onResetGame,
    viewMode,
}) => {
    return (
        <header className="sticky top-0 z-40 border-b border-purple-900/40 bg-slate-900/90 text-white shadow-xl backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                {/* Logo & Brand */}
                <div
                    onClick={onResetGame}
                    className="group flex shrink-0 cursor-pointer items-center gap-3 select-none"
                >
                    <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-purple-500/20 transition-transform duration-200 group-hover:scale-105">
                        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-xl font-black text-transparent">
                            K!
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 bg-linear-to-r from-purple-300 via-pink-200 to-amber-200 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                            Kahoot! Quiz Master
                        </div>
                        <p className="max-w-45 truncate text-[10px] font-medium text-purple-300/70 sm:max-w-xs">
                            {currentQuiz.title}
                        </p>
                    </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Sound Toggle */}
                    <Button
                        variant={soundEnabled ? 'purple' : 'secondary'}
                        size="icon"
                        title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                        onClick={onToggleSound}
                        className="hidden md:flex"
                    >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>

                    {/* Editor Button */}
                    <Button
                        variant={viewMode === 'EDITOR' ? 'amber' : 'secondary'}
                        size="sm"
                        leftIcon={Edit3}
                        classNameIcon="text-amber-400"
                        onClick={onOpenEditor}
                        className="hidden md:flex"
                    >
                        <span className="hidden sm:inline">Chỉnh sửa Quiz</span> AI
                    </Button>

                    {/* AI Creator */}
                    <Button
                        variant="gradient"
                        size="sm"
                        leftIcon={Sparkles}
                        classNameIcon="animate-pulse text-amber-300"
                        onClick={onOpenAiModal}
                        className="text-purple-200"
                    >
                        <span className="hidden sm:inline">Tạo bằng</span> AI
                    </Button>

                    {/* JSON Import Button */}
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={FileJson}
                        classNameIcon="text-purple-400"
                        onClick={onOpenJsonModal}
                        className="text-purple-200"
                    >
                        <span className="hidden sm:inline">Nhập</span> JSON
                    </Button>

                    {/* Home / Lobby button */}
                    {viewMode !== 'LOBBY' && (
                        <Button
                            variant="emerald"
                            size="sm"
                            leftIcon={Play}
                            classNameIcon="fill-current"
                            onClick={onResetGame}
                        >
                            Chơi Game
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
