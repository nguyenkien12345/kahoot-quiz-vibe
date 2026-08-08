export type OptionId = "A" | "B" | "C" | "D";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export interface QuizOption {
  id: OptionId;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correct_option_id: OptionId;
  explanation: string;
  hint?: string | null;
  difficulty?: DifficultyLevel;
  time_limit_sec?: number;
}

export interface QuizData {
  title: string;
  summary: string;
  questions: QuizQuestion[];
}

export type GameMode = "SOLO" | "HOST" | "PRACTICE" | "SPEED_RUN";

export interface UserAnswer {
  questionId: number;
  selectedOptionId: OptionId | null;
  isCorrect: boolean;
  timeSpentSec: number;
  pointsEarned: number;
  streakCount: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  bgMusicEnabled: boolean;
  timeMultiplier: number; // 1 = normal, 0.5 = speed run, 2 = relaxed
  showHints: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  quizData?: QuizData;
}
