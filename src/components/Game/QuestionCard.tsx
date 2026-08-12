import { Award, Flame, HelpCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { KAHOOT_OPTION_STYLES } from '@/src/constants';
import { GameMode, OptionId, QuizQuestion } from '@/src/types';
import { sound } from '@/src/utils/audio';

interface QuestionCardProps {
    question: QuizQuestion;
    questionIndex: number;
    totalQuestions: number;
    currentScore: number;
    currentStreak: number;
    gameMode: GameMode;
    timeMultiplier: number;
    onSelectOption: (optionId: OptionId, timeSpentSec: number) => void;
    soundEnabled: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionIndex,
    totalQuestions,
    currentScore,
    currentStreak,
    gameMode,
    timeMultiplier,
    onSelectOption,
    soundEnabled,
}) => {
    const baseTimeSec = question.time_limit_sec || 20;
    const totalTimeSec =
        gameMode === 'SPEED_RUN'
            ? Math.max(8, Math.round(baseTimeSec * 0.5))
            : gameMode === 'PRACTICE'
              ? 999
              : Math.round(baseTimeSec * timeMultiplier);

    const [timeLeft, setTimeLeft] = useState<number>(totalTimeSec);
    const [showHintModal, setShowHintModal] = useState<boolean>(false);
    const [selectedOpt, setSelectedOpt] = useState<OptionId | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        setTimeLeft(totalTimeSec);
        setSelectedOpt(null);
        setShowHintModal(false);
        startTimeRef.current = Date.now();

        if (gameMode === 'PRACTICE') return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleTimeOut();
                    return 0;
                }

                if (soundEnabled) {
                    if (prev <= 6) {
                        sound.playWarningTick();
                    } else if (prev % 2 === 0) {
                        sound.playTick();
                    }
                }

                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [question.id, gameMode]);

    const handleTimeOut = () => {
        const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
        onSelectOption(null, Math.min(totalTimeSec, Math.round(elapsedSec)));
    };

    const handlePick = (optId: OptionId) => {
        if (selectedOpt !== null) return;
        if (timerRef.current) clearInterval(timerRef.current);

        setSelectedOpt(optId);
        const elapsedSec = (Date.now() - startTimeRef.current) / 1000;

        setTimeout(() => {
            onSelectOption(optId, Math.min(totalTimeSec, Math.round(elapsedSec)));
        }, 200);
    };

    const timeRatio = gameMode === 'PRACTICE' ? 1 : timeLeft / totalTimeSec;
    const strokeDash = 283 * timeRatio;

    return (
        <div className="animate-fadeIn mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
            {/* Top Header Controls & Info */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
                {/* Progress Counter */}
                <div className="flex items-center gap-3">
                    <span className="rounded-xl border border-purple-500/30 bg-purple-600/20 px-3 py-1 text-xs font-black text-purple-300 sm:text-sm">
                        {questionIndex + 1} / {totalQuestions}
                    </span>

                    {currentStreak >= 2 && (
                        <div className="flex animate-bounce items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                            <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span>Chuỗi {currentStreak}x!</span>
                        </div>
                    )}
                </div>

                {/* Current Score Display */}
                <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Điểm:</span>
                    <span className="font-mono text-base font-black text-amber-300">
                        {currentScore.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Question Card Box */}
            <div className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-900 p-6 text-center shadow-2xl sm:p-8">
                {/* Countdown Ring Header */}
                {gameMode !== 'PRACTICE' && (
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" className="fill-none stroke-slate-800" strokeWidth="8" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    className={`fill-none transition-all duration-1000 ${
                                        timeLeft <= 5 ? 'stroke-rose-500' : 'stroke-purple-500'
                                    }`}
                                    strokeWidth="8"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - strokeDash}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span
                                className={`absolute text-lg font-black ${
                                    timeLeft <= 5 ? 'animate-ping-once text-rose-400' : 'text-white'
                                }`}
                            >
                                {timeLeft}
                            </span>
                        </div>
                    </div>
                )}

                {/* Difficulty Badge & Question Title */}
                <div className="mx-auto max-w-3xl space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-purple-300 uppercase">
                            {question.difficulty === 'EASY'
                                ? 'Dễ'
                                : question.difficulty === 'HARD'
                                  ? 'Khó'
                                  : 'Trung bình'}
                        </span>
                    </div>

                    <h2 className="text-xl leading-snug font-black tracking-tight text-white sm:text-3xl">
                        {question.question}
                    </h2>
                </div>

                {/* Hint Trigger */}
                {question.hint && (
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={() => setShowHintModal(true)}
                            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                        >
                            <HelpCircle className="h-4 w-4 text-amber-400" />
                            <span>Xem gợi ý</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Kahoot Options 2x2 Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {question.options.map((opt) => {
                    const config = KAHOOT_OPTION_STYLES[opt.id];
                    const isSelected = selectedOpt === opt.id;

                    return (
                        <button
                            key={opt.id}
                            onClick={() => handlePick(opt.id)}
                            disabled={selectedOpt !== null}
                            className={`group relative flex min-h-[90px] transform items-start gap-4 rounded-2xl border-2 p-5 text-left text-base font-extrabold text-white shadow-lg transition-all duration-200 active:scale-[0.98] sm:p-6 sm:text-lg ${
                                config.bg
                            } ${config.hoverBg} ${config.border} ${
                                isSelected ? 'scale-[1.02] shadow-2xl ring-4 ring-white' : ''
                            }`}
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/25 text-xl transition-transform group-hover:scale-110">
                                {config.symbol}
                            </div>
                            <div className="flex-1 self-center leading-snug break-words">{opt.text}</div>
                        </button>
                    );
                })}
            </div>

            {/* Hint Modal */}
            {showHintModal && (
                <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-amber-500/40 bg-slate-900 p-6 text-center shadow-2xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/20 text-amber-400">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <h4 className="text-lg font-extrabold text-white">Gợi Ý Làm Bài</h4>
                        <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-slate-300">
                            "{question.hint}"
                        </p>
                        <button
                            onClick={() => setShowHintModal(false)}
                            className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold tracking-wider text-slate-950 uppercase transition-colors hover:bg-amber-400"
                        >
                            Đã hiểu, quay lại trả lời
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
