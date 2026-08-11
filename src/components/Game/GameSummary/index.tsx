import { CheckCircle2, Edit3, FileText, RefreshCw, Trophy, XCircle, Zap } from 'lucide-react';
import React, { useEffect } from 'react';

import StatCard from './StatCard';

import { sound } from '@/src/utils/audio';
import { QuizData, UserAnswer } from '@/src/types';

interface GameSummaryProps {
    quiz: QuizData;
    answers: UserAnswer[];
    onPlayAgain: () => void;
    onEditQuiz: () => void;
    onOpenJsonModal: () => void;
    soundEnabled: boolean;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
    quiz,
    answers,
    onPlayAgain,
    onEditQuiz,
    onOpenJsonModal,
    soundEnabled,
}) => {
    const totalQuestions = quiz.questions.length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const accuracyPct = Math.round((correctCount / totalQuestions) * 100);
    const totalScore = answers.reduce((acc, a) => acc + a.pointsEarned, 0);
    const maxStreak = Math.max(0, ...answers.map((a) => a.streakCount));
    const avgTime = Math.round(answers.reduce((acc, a) => acc + a.timeSpentSec, 0) / (answers.length || 1));

    useEffect(() => {
        if (soundEnabled) {
            sound.playFanfare();
        }
    }, [soundEnabled]);

    const getRankTitle = (accuracy: number) => {
        if (accuracy === 100) return 'Quán Quân Kahoot Master 🏆';
        if (accuracy >= 80) return 'Cao Thủ Bậc Thầy 🌟';
        if (accuracy >= 60) return 'Chiến Binh Xuất Sắc ⚡';
        return 'Tân Binh Đầy Cố Gắng 💪';
    };

    return (
        <div className="animate-fadeIn mx-auto max-w-4xl space-y-8 p-4 sm:p-6">
            {/* Top Victory Banner */}
            <div className="relative space-y-4 overflow-hidden rounded-3xl border border-purple-500/40 bg-linear-to-br from-purple-900 via-slate-900 to-pink-950 p-8 text-center shadow-2xl">
                <div className="mx-auto flex h-20 w-20 transform items-center justify-center rounded-3xl bg-linear-to-tr from-amber-400 to-yellow-200 text-slate-950 shadow-xl shadow-amber-400/20 transition-transform hover:scale-110">
                    <Trophy className="h-10 w-10 fill-current" />
                </div>

                <div>
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/20 px-3 py-1 text-xs font-black tracking-wider text-amber-300 uppercase">
                        {getRankTitle(accuracyPct)}
                    </span>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">Hoàn Thành Quiz!</h1>
                    <p className="mt-1 text-xs text-purple-200 sm:text-sm">{quiz.title}</p>
                </div>

                {/* Podium Simulated Score */}
                <div className="pt-2">
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-black/40 px-6 py-3 font-mono text-2xl font-black text-amber-300 shadow-inner sm:text-3xl">
                        <Zap className="h-6 w-6 fill-amber-400 text-amber-400" />
                        <span>{totalScore.toLocaleString()} ĐIỂM</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <StatCard
                    title="Độ chính xác"
                    classNamePoint="text-emerald-400"
                    point={`${accuracyPct}%`}
                    conclusion={`${correctCount}/${totalQuestions} câu đúng`}
                />
                <StatCard
                    title="Chuỗi kỷ lục"
                    classNamePoint="text-amber-400"
                    point={`${maxStreak}x`}
                    conclusion="Câu đúng liên tiếp"
                />
                <StatCard
                    title="Thời gian TB"
                    classNamePoint="text-blue-400"
                    point={`${avgTime}s`}
                    conclusion="Mỗi câu hỏi"
                />
                <StatCard
                    title="Tổng điểm"
                    classNamePoint="text-pink-400"
                    point={`${totalScore}`}
                    conclusion="Kahoot Points"
                />
            </div>

            {/* Question Breakdown Review */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-300 uppercase">
                    <FileText className="h-4 w-4 text-purple-400" />
                    <span>Chi Tiết Đáp Án Từng Câu</span>
                </h3>

                <div className="space-y-3">
                    {quiz.questions.map((q, idx) => {
                        const ans = answers.find((a) => a.questionId === q.id);
                        const isCorrect = ans?.isCorrect ?? false;
                        const userPickId = ans?.selectedOptionId;
                        const correctOpt = q.options.find((o) => o.id === q.correct_option_id);
                        const userPickOpt = q.options.find((o) => o.id === userPickId);

                        return (
                            <div
                                key={q.id}
                                className={`space-y-2 rounded-xl border p-4 text-xs transition-all ${
                                    isCorrect
                                        ? 'border-emerald-500/40 bg-emerald-950/20'
                                        : 'border-rose-500/40 bg-rose-950/20'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                                        {isCorrect ? (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                        ) : (
                                            <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                                        )}
                                        <span>
                                            Câu {idx + 1}: {q.question}
                                        </span>
                                    </div>
                                    <span className="shrink-0 font-mono font-bold text-amber-300">
                                        +{ans?.pointsEarned || 0} pt
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-2 pt-1 font-medium sm:grid-cols-2">
                                    <div className="text-slate-400">
                                        Bạn chọn:{' '}
                                        <span
                                            className={
                                                userPickId === q.correct_option_id
                                                    ? 'font-bold text-emerald-300'
                                                    : 'font-bold text-rose-300'
                                            }
                                        >
                                            {userPickOpt ? `${userPickId}: ${userPickOpt.text}` : 'Chưa chọn (Hết giờ)'}
                                        </span>
                                    </div>
                                    <div className="text-slate-400">
                                        Đáp án đúng:{' '}
                                        <span className="font-bold text-emerald-300">
                                            {q.correct_option_id}: {correctOpt?.text}
                                        </span>
                                    </div>
                                </div>

                                <p className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-[11px] text-slate-400 italic">
                                    {q.explanation}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                    onClick={onPlayAgain}
                    className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-purple-600/30 transition-all hover:from-purple-500 hover:to-pink-500 active:scale-95"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Chơi Lại Quiz Này</span>
                </button>

                <button
                    onClick={onEditQuiz}
                    className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold tracking-wider text-slate-200 uppercase transition-all hover:bg-slate-700"
                >
                    <Edit3 className="h-4 w-4 text-amber-400" />
                    <span>Chỉnh Sửa Câu Hỏi</span>
                </button>

                <button
                    onClick={onOpenJsonModal}
                    className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold tracking-wider text-slate-200 uppercase transition-all hover:bg-slate-700"
                >
                    <FileText className="h-4 w-4 text-purple-400" />
                    <span>Tải Quiz JSON Khác</span>
                </button>
            </div>
        </div>
    );
};
