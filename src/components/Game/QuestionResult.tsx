import React, { useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Flame, ArrowRight, Award, Lightbulb, Zap } from "lucide-react";
import { QuizQuestion, OptionId, UserAnswer } from "../../types";
import { sound } from "../../utils/audio";

interface QuestionResultProps {
  question: QuizQuestion;
  userAnswer: UserAnswer;
  questionIndex: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  soundEnabled: boolean;
}

export const QuestionResult: React.FC<QuestionResultProps> = ({
  question,
  userAnswer,
  questionIndex,
  totalQuestions,
  onNextQuestion,
  soundEnabled
}) => {
  const isCorrect = userAnswer.isCorrect;
  const isTimeOut = userAnswer.selectedOptionId === null;
  const correctOpt = question.options.find((o) => o.id === question.correct_option_id);

  useEffect(() => {
    if (soundEnabled) {
      if (isCorrect) {
        sound.playCorrect();
      } else {
        sound.playWrong();
      }
    }
  }, [isCorrect, soundEnabled]);

  const optionColors: Record<OptionId, { symbol: string; bg: string; border: string; text: string }> = {
    A: { symbol: "▲", bg: "bg-[#E21B3C]", border: "border-red-500", text: "text-white" },
    B: { symbol: "◆", bg: "bg-[#1368CE]", border: "border-blue-500", text: "text-white" },
    C: { symbol: "●", bg: "bg-[#FFA602]", border: "border-amber-500", text: "text-white" },
    D: { symbol: "■", bg: "bg-[#26890C]", border: "border-emerald-500", text: "text-white" }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Result Status Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-3 shadow-2xl ${
          isCorrect
            ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
            : "bg-rose-950/80 border-rose-500 text-rose-200"
        }`}
      >
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-black/30 text-4xl">
          {isCorrect ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          ) : (
            <XCircle className="w-10 h-10 text-rose-400" />
          )}
        </div>

        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
          {isCorrect ? "Chính Xác!" : isTimeOut ? "Hết Giờ!" : "Chưa Đúng!"}
        </h2>

        {isCorrect && (
          <div className="flex items-center justify-center gap-2 font-black text-xl text-amber-300">
            <Zap className="w-5 h-5 fill-current text-amber-400" />
            <span>+{userAnswer.pointsEarned.toLocaleString()} Điểm!</span>
          </div>
        )}

        {userAnswer.streakCount >= 2 && isCorrect && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Chuỗi trả lời đúng {userAnswer.streakCount} câu liên tiếp!</span>
          </div>
        )}
      </div>

      {/* Correct Answer Display Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Đáp án đúng chuẩn Kahoot:
        </span>

        {correctOpt && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 font-extrabold text-base ${
              optionColors[correctOpt.id].bg
            } ${optionColors[correctOpt.id].text}`}
          >
            <span className="w-8 h-8 rounded-lg bg-black/25 flex items-center justify-center text-lg shrink-0">
              {optionColors[correctOpt.id].symbol}
            </span>
            <span className="flex-1">
              Lựa chọn {correctOpt.id}: {correctOpt.text}
            </span>
          </div>
        )}

        {/* Explanation Section */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Giải thích đáp án:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {question.explanation}
          </p>
        </div>
      </div>

      {/* Next Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNextQuestion}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>
            {questionIndex + 1 < totalQuestions ? "Câu Hỏi Tiếp Theo" : "Xem Kết Quả Quiz"}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
