import React from 'react';
import { Sparkles, FileJson, Volume2, VolumeX, Edit3, Play } from 'lucide-react';

import { QuizData, ViewMode } from '../types';

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
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-purple-500/20 transition-transform duration-200 group-hover:scale-105">
                        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-xl font-black text-transparent">
                            K!
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                            Kahoot! Quiz Master
                        </div>
                        <p className="max-w-[180px] truncate text-[10px] font-medium text-purple-300/70 sm:max-w-xs">
                            {currentQuiz.title}
                        </p>
                    </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Sound Toggle */}
                    <button
                        onClick={onToggleSound}
                        title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                        className={`rounded-xl border p-2 transition-all duration-200 ${
                            soundEnabled
                                ? 'border-purple-500/40 bg-purple-950/60 text-purple-300 hover:bg-purple-900/60'
                                : 'border-slate-700/60 bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'
                        }`}
                    >
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </button>

                    {/* Editor Button */}
                    <button
                        onClick={onOpenEditor}
                        className={`hidden items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 md:flex ${
                            viewMode === 'EDITOR'
                                ? 'border-amber-400/50 bg-amber-500/20 text-amber-300'
                                : 'border-slate-700/60 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60'
                        }`}
                    >
                        <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                        <span>Chỉnh sửa Quiz</span>
                    </button>

                    {/* AI Creator */}
                    <button
                        onClick={onOpenAiModal}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition-all duration-200 hover:from-purple-500 hover:to-pink-500 active:scale-95"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
                        <span className="hidden sm:inline">Tạo bằng</span> AI
                    </button>

                    {/* JSON Import Button */}
                    <button
                        onClick={onOpenJsonModal}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-purple-200 transition-all duration-200 hover:border-purple-500/50 hover:bg-purple-950/50"
                    >
                        <FileJson className="h-3.5 w-3.5 text-purple-400" />
                        <span className="hidden sm:inline">Nhập</span> JSON
                    </button>

                    {/* Home / Lobby button */}
                    {viewMode !== 'LOBBY' && (
                        <button
                            onClick={onResetGame}
                            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-3 py-2 text-xs font-semibold text-emerald-300 transition-all duration-200 hover:bg-emerald-600/30"
                        >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>Chơi Game</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
