import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { JsonImportModal } from "./components/JsonImportModal";
import { AiGeneratorModal } from "./components/AiGeneratorModal";
import { QuizEditor } from "./components/QuizEditor";
import { GameLobby } from "./components/Game/GameLobby";
import { QuestionCard } from "./components/Game/QuestionCard";
import { QuestionResult } from "./components/Game/QuestionResult";
import { GameHostView } from "./components/Game/GameHostView";
import { GameSummary } from "./components/Game/GameSummary";

import { QuizData, OptionId, GameMode, GameSettings, UserAnswer } from "./types";
import { SAMPLE_QUIZZES } from "./constants/samples";
import { formatJsonString } from "./utils/jsonValidator";
import { sound } from "./utils/audio";

export default function App() {
  const [quizData, setQuizData] = useState<QuizData>(SAMPLE_QUIZZES[0].data);
  const [viewMode, setViewMode] = useState<"LOBBY" | "PLAYING" | "RESULT" | "EDITOR" | "HOST" | "SUMMARY">("LOBBY");
  
  // Game Play State
  const [gameMode, setGameMode] = useState<GameMode>("SOLO");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  // Settings & Modals
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    bgMusicEnabled: false,
    timeMultiplier: 1,
    showHints: true
  });

  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  useEffect(() => {
    sound.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    if (settings.bgMusicEnabled && settings.soundEnabled && viewMode === "PLAYING") {
      sound.startBgMusic();
    } else {
      sound.stopBgMusic();
    }
  }, [settings.bgMusicEnabled, settings.soundEnabled, viewMode]);

  const handleStartGame = (mode: GameMode) => {
    if (mode === "HOST") {
      setViewMode("HOST");
      return;
    }

    setGameMode(mode);
    setCurrentQuestionIdx(0);
    setUserAnswers([]);
    setCurrentScore(0);
    setCurrentStreak(0);
    setViewMode("PLAYING");
  };

  const handleSelectOption = (selectedOptionId: OptionId | null, timeSpentSec: number) => {
    const q = quizData.questions[currentQuestionIdx];
    const isCorrect = selectedOptionId === q.correct_option_id;

    let pointsEarned = 0;
    let newStreak = currentStreak;

    if (isCorrect) {
      newStreak += 1;
      const basePoints = 500;
      const totalTimeSec = q.time_limit_sec || 20;
      const timeBonus = Math.max(0, Math.round(500 * (1 - timeSpentSec / totalTimeSec)));
      const streakBonus = Math.min(500, newStreak * 100);

      const multiplier = gameMode === "SPEED_RUN" ? 2 : 1;
      pointsEarned = (basePoints + timeBonus + streakBonus) * multiplier;
    } else {
      newStreak = 0;
    }

    const answerObj: UserAnswer = {
      questionId: q.id,
      selectedOptionId,
      isCorrect,
      timeSpentSec,
      pointsEarned,
      streakCount: newStreak
    };

    setUserAnswers((prev) => [...prev, answerObj]);
    setCurrentScore((prev) => prev + pointsEarned);
    setCurrentStreak(newStreak);

    if (gameMode === "PRACTICE") {
      // In practice mode, advance directly or show result
      setViewMode("RESULT");
    } else {
      setViewMode("RESULT");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < quizData.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setViewMode("PLAYING");
    } else {
      setViewMode("SUMMARY");
    }
  };

  const handleLoadQuiz = (data: QuizData) => {
    setQuizData(data);
    setViewMode("LOBBY");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white flex flex-col">
      {/* Navigation Header */}
      {viewMode !== "HOST" && (
        <Header
          currentQuiz={quizData}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
          }
          onOpenJsonModal={() => setIsJsonModalOpen(true)}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          onOpenEditor={() => setViewMode("EDITOR")}
          onResetGame={() => setViewMode("LOBBY")}
          viewMode={viewMode}
        />
      )}

      {/* Main View Container */}
      <main className="flex-1 pb-12 pt-4">
        {viewMode === "LOBBY" && (
          <GameLobby
            quiz={quizData}
            onStartGame={handleStartGame}
            settings={settings}
            onUpdateSettings={setSettings}
            onOpenSampleSelector={() => setIsJsonModalOpen(true)}
            onOpenEditor={() => setViewMode("EDITOR")}
          />
        )}

        {viewMode === "PLAYING" && (
          <QuestionCard
            question={quizData.questions[currentQuestionIdx]}
            questionIndex={currentQuestionIdx}
            totalQuestions={quizData.questions.length}
            currentScore={currentScore}
            currentStreak={currentStreak}
            gameMode={gameMode}
            timeMultiplier={settings.timeMultiplier}
            onSelectOption={handleSelectOption}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {viewMode === "RESULT" && (
          <QuestionResult
            question={quizData.questions[currentQuestionIdx]}
            userAnswer={userAnswers[userAnswers.length - 1]}
            questionIndex={currentQuestionIdx}
            totalQuestions={quizData.questions.length}
            onNextQuestion={handleNextQuestion}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {viewMode === "HOST" && (
          <GameHostView
            quiz={quizData}
            onExitHost={() => setViewMode("LOBBY")}
          />
        )}

        {viewMode === "SUMMARY" && (
          <GameSummary
            quiz={quizData}
            answers={userAnswers}
            onPlayAgain={() => handleStartGame(gameMode)}
            onEditQuiz={() => setViewMode("EDITOR")}
            onOpenJsonModal={() => setIsJsonModalOpen(true)}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {viewMode === "EDITOR" && (
          <QuizEditor
            quizData={quizData}
            onSaveQuiz={(updated) => {
              setQuizData(updated);
              setViewMode("LOBBY");
            }}
            onCancel={() => setViewMode("LOBBY")}
          />
        )}
      </main>

      {/* JSON Modal */}
      <JsonImportModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onLoadQuiz={handleLoadQuiz}
        currentJsonString={formatJsonString(quizData)}
      />

      {/* AI Generator Modal */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onQuizGenerated={handleLoadQuiz}
      />
    </div>
  );
}
