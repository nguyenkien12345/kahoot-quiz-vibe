import React from "react";
import { Sparkles, FileJson, Volume2, VolumeX, Edit3, Play } from "lucide-react";
import { QuizData, ViewMode } from "../types";

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
  viewMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-purple-900/40 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div 
          onClick={onResetGame}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              K!
            </div>
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200 bg-clip-text text-transparent flex items-center gap-1.5">
              Kahoot! Quiz Master
            </div>
            <p className="text-[10px] text-purple-300/70 font-medium truncate max-w-[180px] sm:max-w-xs">
              {currentQuiz.title}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            className={`p-2 rounded-xl transition-all duration-200 border ${
              soundEnabled
                ? "bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/60"
                : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-700/60"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Editor Button */}
          <button
            onClick={onOpenEditor}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              viewMode === "EDITOR"
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                : "bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-700/60"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Chỉnh sửa Quiz</span>
          </button>

          {/* AI Creator */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-600/30 transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Tạo bằng</span> AI
          </button>

          {/* JSON Import Button */}
          <button
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-purple-200 hover:bg-purple-950/50 hover:border-purple-500/50 transition-all duration-200"
          >
            <FileJson className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Nhập</span> JSON
          </button>

          {/* Home / Lobby button */}
          {viewMode !== "LOBBY" && (
            <button
              onClick={onResetGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 transition-all duration-200"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Chơi Game</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
