import React from "react";
import { Play, Sparkles, Trophy, Users, Zap, Shield, HelpCircle, Layers, Settings, Music, Volume2, VolumeX } from "lucide-react";
import { QuizData, GameMode, GameSettings } from "../../types";
import { CONFIG_MODE_GAME } from "@/src/constants";
import { GameMode as GameModeComponent } from "../common/GameMode";

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
  onOpenEditor
}) => {
  const totalQuestions = quiz.questions.length;
  const easyCount = quiz.questions.filter((q) => q.difficulty === "EASY").length;
  const mediumCount = quiz.questions.filter((q) => q.difficulty === "MEDIUM" || !q.difficulty).length;
  const hardCount = quiz.questions.filter((q) => q.difficulty === "HARD").length;

  const estTimeMin = Math.ceil(
    quiz.questions.reduce((acc, q) => acc + (q.time_limit_sec || 20), 0) / 60
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Quiz Banner Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-slate-900 to-pink-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-[11px] uppercase tracking-wider shadow-md shadow-purple-500/20">
              Kahoot! Quiz Mode
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-purple-300 text-xs font-semibold">
              {totalQuestions} Câu hỏi
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-pink-300 text-xs font-semibold">
              ~{estTimeMin} Phút làm bài
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
            {quiz.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            {quiz.summary}
          </p>

          {/* Difficulty Badge Distribution */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-slate-400">Độ khó câu hỏi:</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {easyCount} Dễ
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {mediumCount} Trung bình
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {hardCount} Khó
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Select Game Mode */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Chọn Chế Độ Chơi</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {
            CONFIG_MODE_GAME.map((item) => {
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
                mode
              } = item ?? {};
              return (
                <GameModeComponent
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
              )
            })
          }
        </div>
      </div>

      {/* Quick Settings Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
            }
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-semibold transition-all ${
              settings.soundEnabled
                ? "bg-purple-950/60 border-purple-500/40 text-purple-300"
                : "bg-slate-800/60 border-slate-700 text-slate-400"
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Âm thanh Game</span>
          </button>

          <button
            onClick={() =>
              onUpdateSettings({ ...settings, bgMusicEnabled: !settings.bgMusicEnabled })
            }
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-semibold transition-all ${
              settings.bgMusicEnabled
                ? "bg-pink-950/60 border-pink-500/40 text-pink-300"
                : "bg-slate-800/60 border-slate-700 text-slate-400"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Nhạc nền Kahoot</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSampleSelector}
            className="text-slate-400 hover:text-white font-medium flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Đổi bộ Quiz mẫu</span>
          </button>
          <button
            onClick={onOpenEditor}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Chỉnh sửa Quiz này</span>
          </button>
        </div>
      </div>
    </div>
  );
};
