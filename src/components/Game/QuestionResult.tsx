import { ArrowRight, CheckCircle2, Flame, Lightbulb, XCircle, Zap } from 'lucide-react';
import React, { useEffect } from 'react';

import Button from '@/src/components/ui/Button';
import { KAHOOT_OPTION_STYLES } from '@/src/constants';
import { QuizQuestion, UserAnswer } from '@/src/types';
import { sound } from '@/src/utils/audio';

interface QuestionResultProps {
    question: QuizQuestion; // Thông tin câu hỏi vừa làm (bao gồm danh sách đáp án, đáp án đúng, lời giải thích)
    userAnswer: UserAnswer; // Kết quả trả lời của người chơi (có đúng không, chọn đáp án nào, cộng bao nhiêu điểm, streak bao nhiêu)
    questionIndex: number; // Thứ tự câu hỏi hiện tại (bắt đầu từ 0)
    totalQuestions: number; // Tổng số câu hỏi trong bộ Quiz
    onNextQuestion: () => void; // Hàm callback chạy khi người chơi bấm nút "Câu Hỏi Tiếp Theo"
    soundEnabled: boolean; // Cấu hình bật/tắt âm thanh
}

export const QuestionResult: React.FC<QuestionResultProps> = ({
    question,
    userAnswer,
    questionIndex,
    totalQuestions,
    onNextQuestion,
    soundEnabled,
}) => {
    const { isCorrect, selectedOptionId, pointsEarned, streakCount } = userAnswer ?? {};

    useEffect(() => {
        if (soundEnabled) {
            if (isCorrect) {
                sound.playCorrect();
            } else {
                sound.playWrong();
            }
        }
    }, [isCorrect, soundEnabled]);

    const correctOpt = question.options.find((o) => o.id === question.correct_option_id);
    const correctStyle = correctOpt ? KAHOOT_OPTION_STYLES[correctOpt.id] : null;

    return (
        <div className="animate-fadeIn mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
            {/* Result Status Banner */}
            <div
                className={`space-y-3 rounded-3xl border-2 p-6 text-center shadow-2xl sm:p-8 ${isCorrect ? 'border-emerald-500 bg-emerald-950/80 text-emerald-200' : 'border-rose-500 bg-rose-950/80 text-rose-200'}`}
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black/30 text-4xl">
                    {isCorrect ? (
                        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    ) : (
                        <XCircle className="h-10 w-10 text-rose-400" />
                    )}
                </div>

                <h2 className="text-2xl font-black tracking-tight uppercase sm:text-4xl">
                    {isCorrect
                        ? 'Chính Xác!'
                        : // Người chơi chưa kịp chọn đáp án nào thì đã hết thời gian
                          selectedOptionId === null || selectedOptionId === undefined
                          ? 'Hết Giờ!'
                          : 'Chưa Đúng!'}
                </h2>

                {/* Hiển thị số điểm kiếm được */}
                {isCorrect && (
                    <div className="flex items-center justify-center gap-2 text-xl font-black text-amber-300">
                        <Zap className="h-5 w-5 fill-current text-amber-400" />
                        <span>+{pointsEarned.toLocaleString()} Điểm!</span>
                    </div>
                )}

                {/* Huy hiệu Chuỗi câu đúng - Streak  */}
                {streakCount >= 2 && isCorrect && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-extrabold text-amber-300">
                        <Flame className="h-4 w-4 fill-amber-400" />
                        <span>Chuỗi trả lời đúng {streakCount} câu liên tiếp!</span>
                    </div>
                )}
            </div>

            {/* Correct Answer Display Box */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Đáp án đúng chuẩn Kahoot:
                </span>

                {correctOpt && correctStyle && (
                    <div
                        className={`flex items-center gap-3 rounded-xl border p-4 text-base font-extrabold ${
                            correctStyle.bg
                        } ${correctStyle.text}`}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/25 text-lg">
                            {correctStyle.symbol}
                        </span>
                        <span className="flex-1">
                            Lựa chọn {correctOpt.id}: {correctOpt.text}
                        </span>
                    </div>
                )}

                {/* Explanation Section */}
                <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        <span>Giải thích đáp án:</span>
                    </div>
                    <p className="text-xs leading-relaxed font-normal text-slate-300 sm:text-sm">
                        {question.explanation}
                    </p>
                </div>
            </div>

            {/* Next Action Button */}
            <div className="flex justify-end pt-2">
                <Button onClick={onNextQuestion} rightIcon={ArrowRight} classNameIcon="h-5 w-5" fullWidth>
                    {questionIndex + 1 < totalQuestions ? 'Câu Hỏi Tiếp Theo' : 'Xem Kết Quả Quiz'}
                </Button>
            </div>
        </div>
    );
};
