export type OptionId = "A" | "B" | "C" | "D";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

// - "LOBBY": Sảnh chờ Game (Component GameLobby). Màn hình chính ban đầu. Nơi người chơi xem thông tin bộ Quiz, tùy chỉnh cài đặt (âm thanh, thời gian), chọn chế độ chơi (Solo, Host, Luyện tập, Speed Run) hoặc mở công cụ AI/JSON/Editor
// - "PLAYING": Đang chơi / Trả lời (Component QuestionCard). Màn hình hiển thị câu hỏi hiện tại kèm đồng hồ đếm ngược, 4 lựa chọn A/B/C/D, điểm số hiện tại, chuỗi trả lời đúng (Streak) và gợi ý
// - "RESULT": Kết quả từng câu (Component QuestionResult). Xuất hiện ngay sau khi chọn đáp án hoặc hết giờ. Cho biết đáp án chọn đúng hay sai, hiển thị lời giải thích (explanation), số điểm thưởng đạt được và nút chuyển sang câu tiếp theo
// - "EDITOR": Chỉnh sửa Quiz (Component QuizEditor). Màn hình trình biên tập. Cho phép thêm, sửa, xóa các câu hỏi, chỉnh đáp án đúng, đặt thời gian làm bài, độ khó và lời giải thích
// - "HOST": Màn hình Quản trò (Component GameHostView). Màn hình dành cho người chủ trì phòng game (Host). Giả lập giao diện quản trò Kahoot với mã PIN phòng, danh sách người chơi đã tham gia và nút điều khiển trận đấu
// - "SUMMARY": Tổng kết lượt chơi (Component GameSummary). Xuất hiện khi đã hoàn thành toàn bộ câu hỏi trong bộ Quiz. Hiển thị tổng điểm, phần trăm chính xác, thống kê chi tiết từng câu và các nút tùy chọn Chơi lại hoặc Sửa Quiz
export type ViewMode = "LOBBY" | "PLAYING" | "RESULT" | "EDITOR" | "HOST" | "SUMMARY";

export type GameMode = "SOLO" | "HOST" | "PRACTICE" | "SPEED_RUN";

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
