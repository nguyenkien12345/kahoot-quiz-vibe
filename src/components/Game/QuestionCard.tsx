import React, { useState, useEffect, useRef } from "react";
import { HelpCircle, Clock, Flame, Zap, Award } from "lucide-react";
import { QuizQuestion, OptionId, GameMode } from "../../types";
import { sound } from "../../utils/audio";

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
  soundEnabled
}) => {
  const baseTimeSec = question.time_limit_sec || 20;
  const totalTimeSec = gameMode === "SPEED_RUN" 
    ? Math.max(8, Math.round(baseTimeSec * 0.5))
    : gameMode === "PRACTICE"
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

    if (gameMode === "PRACTICE") return;

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

  // Kahoot Shape & Color Mapping
  const kahootOptions: Record<
    OptionId,
    { shape: string; symbol: string; bg: string; hoverBg: string; border: string }
  > = {
    A: {
      shape: "Triangle",
      symbol: "▲",
      bg: "bg-[#E21B3C]",
      hoverBg: "hover:bg-[#c41531]",
      border: "border-red-400/50"
    },
    B: {
      shape: "Diamond",
      symbol: "◆",
      bg: "bg-[#1368CE]",
      hoverBg: "hover:bg-[#0f54a8]",
      border: "border-blue-400/50"
    },
    C: {
      shape: "Circle",
      symbol: "●",
      bg: "bg-[#FFA602]",
      hoverBg: "hover:bg-[#d98d02]",
      border: "border-amber-300/50"
    },
    D: {
      shape: "Square",
      symbol: "■",
      bg: "bg-[#26890C]",
      hoverBg: "hover:bg-[#1f7009]",
      border: "border-emerald-400/50"
    }
  };

  const timeRatio = gameMode === "PRACTICE" ? 1 : timeLeft / totalTimeSec;
  const strokeDash = 283 * timeRatio;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Top Header Controls & Info */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        {/* Progress Counter */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-black text-xs sm:text-sm">
            {questionIndex + 1} / {totalQuestions}
          </span>

          {currentStreak >= 2 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-bounce">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Chuỗi {currentStreak}x!</span>
            </div>
          )}
        </div>

        {/* Current Score Display */}
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Điểm:</span>
          <span className="text-base font-black text-amber-300 font-mono">
            {currentScore.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Question Card Box */}
      <div className="relative bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Countdown Ring Header */}
        {gameMode !== "PRACTICE" && (
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-slate-800 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className={`fill-none transition-all duration-1000 ${
                    timeLeft <= 5 ? "stroke-rose-500" : "stroke-purple-500"
                  }`}
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - strokeDash}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className={`absolute font-black text-lg ${
                  timeLeft <= 5 ? "text-rose-400 animate-ping-once" : "text-white"
                }`}
              >
                {timeLeft}
              </span>
            </div>
          </div>
        )}

        {/* Difficulty Badge & Question Title */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
              {question.difficulty === "EASY"
                ? "Dễ"
                : question.difficulty === "HARD"
                ? "Khó"
                : "Trung bình"}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white leading-snug tracking-tight">
            {question.question}
          </h2>
        </div>

        {/* Hint Trigger */}
        {question.hint && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowHintModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Xem gợi ý</span>
            </button>
          </div>
        )}
      </div>

      {/* Kahoot Options 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((opt) => {
          const config = kahootOptions[opt.id];
          const isSelected = selectedOpt === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handlePick(opt.id)}
              disabled={selectedOpt !== null}
              className={`group relative p-5 sm:p-6 rounded-2xl text-white font-extrabold text-base sm:text-lg text-left shadow-lg transition-all duration-200 transform active:scale-[0.98] border-2 flex items-start gap-4 min-h-[90px] ${
                config.bg
              } ${config.hoverBg} ${config.border} ${
                isSelected ? "ring-4 ring-white scale-[1.02] shadow-2xl" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                {config.symbol}
              </div>
              <div className="flex-1 leading-snug break-words self-center">
                {opt.text}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-white text-lg">Gợi Ý Làm Bài</h4>
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              "{question.hint}"
            </p>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
            >
              Đã hiểu, quay lại trả lời
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
