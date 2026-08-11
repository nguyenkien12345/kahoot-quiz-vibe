import { QuizData, UserAnswer } from "@/src/types";
import { sound } from "@/src/utils/audio";
import { CheckCircle2, Edit3, FileText, RefreshCw, Trophy, XCircle, Zap } from "lucide-react";
import React, { useEffect } from "react";
import StatCard from "./StatCard";

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
  soundEnabled
}) => {
  const totalQuestions = quiz.questions.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracyPct = Math.round((correctCount / totalQuestions) * 100);
  const totalScore = answers.reduce((acc, a) => acc + a.pointsEarned, 0);
  const maxStreak = Math.max(0, ...answers.map((a) => a.streakCount));
  const avgTime = Math.round(
    answers.reduce((acc, a) => acc + a.timeSpentSec, 0) / (answers.length || 1)
  );

  useEffect(() => {
    if (soundEnabled) {
      sound.playFanfare();
    }
  }, [soundEnabled]);

  const getRankTitle = (accuracy: number) => {
    if (accuracy === 100) return "Quán Quân Kahoot Master 🏆";
    if (accuracy >= 80) return "Cao Thủ Bậc Thầy 🌟";
    if (accuracy >= 60) return "Chiến Binh Xuất Sắc ⚡";
    return "Tân Binh Đầy Cố Gắng 💪";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      {/* Top Victory Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-slate-900 to-pink-950 border border-purple-500/40 rounded-3xl p-8 text-center shadow-2xl space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-400/20 transform hover:scale-110 transition-transform">
          <Trophy className="w-10 h-10 fill-current" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
            {getRankTitle(accuracyPct)}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            Hoàn Thành Quiz!
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm mt-1">{quiz.title}</p>
        </div>

        {/* Podium Simulated Score */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-black/40 border border-amber-400/40 text-amber-300 font-black text-2xl sm:text-3xl shadow-inner font-mono">
            <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span>{totalScore.toLocaleString()} ĐIỂM</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Độ chính xác" classNamePoint="text-emerald-400" point={`${accuracyPct}%`} conclusion={`${correctCount}/${totalQuestions} câu đúng`} />
        <StatCard title="Chuỗi kỷ lục" classNamePoint="text-amber-400" point={`${maxStreak}x`} conclusion="Câu đúng liên tiếp" />
        <StatCard title="Thời gian TB" classNamePoint="text-blue-400" point={`${avgTime}s`} conclusion="Mỗi câu hỏi" />
        <StatCard title="Tổng điểm" classNamePoint="text-pink-400" point={`${totalScore}`} conclusion="Kahoot Points" />
      </div>

      {/* Question Breakdown Review */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
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
                className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${isCorrect
                  ? "bg-emerald-950/20 border-emerald-500/40"
                  : "bg-rose-950/20 border-rose-500/40"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>Câu {idx + 1}: {q.question}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300 shrink-0">
                    +{ans?.pointsEarned || 0} pt
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium">
                  <div className="text-slate-400">
                    Bạn chọn:{" "}
                    <span className={userPickId === q.correct_option_id ? "text-emerald-300 font-bold" : "text-rose-300 font-bold"}>
                      {userPickOpt ? `${userPickId}: ${userPickOpt.text}` : "Chưa chọn (Hết giờ)"}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Đáp án đúng:{" "}
                    <span className="text-emerald-300 font-bold">
                      {q.correct_option_id}: {correctOpt?.text}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800">
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
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Chơi Lại Quiz Này</span>
        </button>

        <button
          onClick={onEditQuiz}
          className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4 text-amber-400" />
          <span>Chỉnh Sửa Câu Hỏi</span>
        </button>

        <button
          onClick={onOpenJsonModal}
          className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Tải Quiz JSON Khác</span>
        </button>
      </div>
    </div>
  );
};
