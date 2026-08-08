import React, { useState } from "react";
import { Users, QrCode, Play, Eye, EyeOff, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { QuizData, OptionId } from "../../types";

interface GameHostViewProps {
  quiz: QuizData;
  onExitHost: () => void;
}

export const GameHostView: React.FC<GameHostViewProps> = ({ quiz, onExitHost }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const gamePin = "849-201"; // Simulated PIN

  const q = quiz.questions[currentIdx];

  const optionColors: Record<OptionId, { symbol: string; bg: string }> = {
    A: { symbol: "▲", bg: "bg-[#E21B3C]" },
    B: { symbol: "◆", bg: "bg-[#1368CE]" },
    C: { symbol: "●", bg: "bg-[#FFA602]" },
    D: { symbol: "■", bg: "bg-[#26890C]" }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col justify-between space-y-6 animate-fadeIn">
      {/* Host Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onExitHost}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát Màn Hình Host</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-500/40 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-semibold text-purple-300">GAME PIN:</span>
            <span className="font-mono font-black text-lg text-white tracking-widest">{gamePin}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>28 Người chơi đã tham gia</span>
          </div>
        </div>
      </div>

      {/* Main Big Screen Presentation Area */}
      <div className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between space-y-6 text-center max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between text-xs font-black uppercase text-purple-400">
          <span>Trình Chiếu Kahoot! ({currentIdx + 1}/{quiz.questions.length})</span>
          <span>Thời gian: {q.time_limit_sec || 20}s</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {q.question}
        </h1>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {q.options.map((opt) => {
            const isCorrect = q.correct_option_id === opt.id;
            const style = optionColors[opt.id];

            return (
              <div
                key={opt.id}
                className={`p-5 rounded-2xl font-extrabold text-lg text-white border-2 flex items-center gap-4 transition-all ${
                  style.bg
                } ${
                  showAnswer && isCorrect
                    ? "ring-4 ring-emerald-400 shadow-2xl scale-[1.02]"
                    : showAnswer
                    ? "opacity-40"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center text-xl shrink-0">
                  {style.symbol}
                </div>
                <div className="flex-1">{opt.text}</div>
                {showAnswer && isCorrect && (
                  <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-lg uppercase">
                    Đáp án đúng
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation when revealed */}
        {showAnswer && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-300">
            <span className="font-bold text-amber-400 block mb-1">Giải thích đáp án:</span>
            {q.explanation}
          </div>
        )}
      </div>

      {/* Host Controls Footer */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
        >
          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showAnswer ? "Ẩn Đáp Án" : "Hiện Đáp Án Đúng"}</span>
        </button>

        <button
          onClick={() => {
            setShowAnswer(false);
            if (currentIdx + 1 < quiz.questions.length) {
              setCurrentIdx((prev) => prev + 1);
            } else {
              onExitHost();
            }
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all"
        >
          <span>{currentIdx + 1 < quiz.questions.length ? "Câu Tiếp Theo" : "Hoàn Thành Host"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
