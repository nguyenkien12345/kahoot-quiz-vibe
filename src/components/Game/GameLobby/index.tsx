import { Layers, Music, Sparkles, Volume2, VolumeX } from 'lucide-react';
import React from 'react';

import Badge from '@/src/components/common/Badge';
import GameModeBlock from '@/src/components/Game/GameLobby/GameModeBlock';
import { CONFIG_DIFFICULTY_LEVEL, CONFIG_MODE_GAME } from '@/src/constants';
import { GameMode, GameSettings, QuizData } from '@/src/types';

interface GameLobbyProps {
    quiz: QuizData;
    onStartGame: (mode: GameMode) => void;
    settings: GameSettings;
    onUpdateSettings: (newSettings: GameSettings) => void;
    onOpenSampleSelector: () => void;
    onOpenEditor: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
    quiz,
    onStartGame,
    settings,
    onUpdateSettings,
    onOpenSampleSelector,
    onOpenEditor,
}) => {
    const totalQuestions = quiz.questions.length;
    const estTimeMin = Math.ceil(quiz.questions.reduce((acc, q) => acc + (q.time_limit_sec || 20), 0) / 60);

    const countMap: Record<string, number> = {
        EASY: quiz.questions.filter((q) => q.difficulty === 'EASY').length,
        MEDIUM: quiz.questions.filter((q) => q.difficulty === 'MEDIUM' || !q.difficulty).length,
        HARD: quiz.questions.filter((q) => q.difficulty === 'HARD').length,
    };

    return (
        <div className="animate-fadeIn mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
            {/* Quiz Banner Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-linear-to-br from-purple-900 via-slate-900 to-pink-950 p-6 shadow-2xl sm:p-8">
                <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

                <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-3 py-1 text-[11px] font-black tracking-wider text-white uppercase shadow-md shadow-purple-500/20">
                            Kahoot! Quiz Mode
                        </span>
                        <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-purple-300">
                            {totalQuestions} Câu hỏi
                        </span>
                        <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-pink-300">
                            ~{estTimeMin} Phút làm bài
                        </span>
                    </div>

                    <h1 className="bg-linear-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-2xl leading-tight font-black tracking-tight text-white sm:text-4xl">
                        {quiz.title}
                    </h1>

                    <p className="max-w-2xl text-sm leading-relaxed font-normal text-slate-300 sm:text-base">
                        {quiz.summary}
                    </p>

                    {/* Difficulty Badge Distribution */}
                    <div className="flex items-center gap-4 pt-2">
                        <span className="text-xs font-bold text-slate-400">Độ khó câu hỏi:</span>

                        <div className="flex items-center gap-2">
                            {CONFIG_DIFFICULTY_LEVEL.map((item) => {
                                const { label, value, color } = item ?? {};

                                const count = countMap[value] ?? 0;

                                return <Badge key={value} label={`${count} ${label}`} className={color} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Select Game Mode */}
            <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-300 uppercase">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span>Chọn Chế Độ Chơi</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {CONFIG_MODE_GAME.map((item) => {
                        const {
                            classNameWrapperContainer,
                            classNameWrapperIcon,
                            icon,
                            classNameWrapperText,
                            text,
                            classNameWrapperTitle,
                            title,
                            description,
                            classNameWrapperActions,
                            textAction,
                            iconAction,
                            mode,
                        } = item ?? {};
                        return (
                            <GameModeBlock
                                key={item.id}
                                classNameWrapperContainer={classNameWrapperContainer}
                                classNameWrapperIcon={classNameWrapperIcon}
                                icon={icon}
                                classNameWrapperText={classNameWrapperText}
                                text={text}
                                classNameWrapperTitle={classNameWrapperTitle}
                                title={title}
                                description={description}
                                classNameWrapperActions={classNameWrapperActions}
                                textAction={textAction}
                                iconAction={iconAction}
                                onClick={() => onStartGame(mode)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Quick Settings Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-semibold transition-all ${
                            settings.soundEnabled
                                ? 'border-purple-500/40 bg-purple-950/60 text-purple-300'
                                : 'border-slate-700 bg-slate-800/60 text-slate-400'
                        }`}
                    >
                        {settings.soundEnabled ? (
                            <Volume2 className="h-3.5 w-3.5" />
                        ) : (
                            <VolumeX className="h-3.5 w-3.5" />
                        )}
                        <span>Âm thanh Game</span>
                    </button>

                    <button
                        onClick={() => onUpdateSettings({ ...settings, bgMusicEnabled: !settings.bgMusicEnabled })}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-semibold transition-all ${
                            settings.bgMusicEnabled
                                ? 'border-pink-500/40 bg-pink-950/60 text-pink-300'
                                : 'border-slate-700 bg-slate-800/60 text-slate-400'
                        }`}
                    >
                        <Music className="h-3.5 w-3.5" />
                        <span>Nhạc nền Kahoot</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onOpenSampleSelector}
                        className="flex items-center gap-1 font-medium text-slate-400 hover:text-white"
                    >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Đổi bộ Quiz mẫu</span>
                    </button>
                    <button
                        onClick={onOpenEditor}
                        className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300"
                    >
                        <span>Chỉnh sửa Quiz này</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
