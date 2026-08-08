import React, { useState } from "react";
import { Plus, Trash2, Save, Download, ArrowLeft, HelpCircle, Clock, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { QuizData, QuizQuestion, OptionId, DifficultyLevel } from "../types";
import { formatJsonString } from "../utils/jsonValidator";

interface QuizEditorProps {
  quizData: QuizData;
  onSaveQuiz: (updated: QuizData) => void;
  onCancel: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({
  quizData,
  onSaveQuiz,
  onCancel
}) => {
  const [data, setData] = useState<QuizData>(JSON.parse(JSON.stringify(quizData)));
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setData((prev) => ({ ...prev, title: val }));
  };

  const handleSummaryChange = (val: string) => {
    setData((prev) => ({ ...prev, summary: val }));
  };

  const currentQ = data.questions[activeQuestionIdx];

  const updateCurrentQuestion = (field: keyof QuizQuestion, val: unknown) => {
    if (!currentQ) return;
    setData((prev) => {
      const nextQList = [...prev.questions];
      nextQList[activeQuestionIdx] = {
        ...nextQList[activeQuestionIdx],
        [field]: val
      };
      return { ...prev, questions: nextQList };
    });
  };

  const updateOptionText = (optId: OptionId, text: string) => {
    if (!currentQ) return;
    setData((prev) => {
      const nextQList = [...prev.questions];
      const q = nextQList[activeQuestionIdx];
      const nextOpts = q.options.map((opt) =>
        opt.id === optId ? { ...opt, text } : opt
      );
      nextQList[activeQuestionIdx] = { ...q, options: nextOpts };
      return { ...prev, questions: nextQList };
    });
  };

  const addNewQuestion = () => {
    const newId = data.questions.length + 1;
    const newQ: QuizQuestion = {
      id: newId,
      question: `Câu hỏi mới số ${newId}`,
      options: [
        { id: "A", text: "Phương án A" },
        { id: "B", text: "Phương án B" },
        { id: "C", text: "Phương án C" },
        { id: "D", text: "Phương án D" }
      ],
      correct_option_id: "A",
      explanation: "Giải thích tại sao đáp án A đúng.",
      hint: "Gợi ý đơn giản",
      difficulty: "MEDIUM",
      time_limit_sec: 20
    };

    setData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ]
    }));
    setActiveQuestionIdx(data.questions.length);
  };

  const removeQuestion = (idx: number) => {
    if (data.questions.length <= 1) {
      alert("Bộ Quiz phải chứa ít nhất 1 câu hỏi!");
      return;
    }
    const updated = data.questions.filter((_, i) => i !== idx);
    // re-index
    const reindexed = updated.map((q, i) => ({ ...q, id: i + 1 }));
    setData((prev) => ({ ...prev, questions: reindexed }));
    setActiveQuestionIdx(Math.max(0, idx - 1));
  };

  const downloadJson = () => {
    const jsonStr = formatJsonString(data);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/[^a-z0-0]/g, "_") || "quiz"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSaveQuiz(data);
    setNotification("Đã lưu các thay đổi cho bộ Quiz!");
    setTimeout(() => setNotification(null), 2000);
  };

  const optionColors: Record<OptionId, { bg: string; border: string; text: string }> = {
    A: { bg: "bg-rose-500/10", border: "border-rose-500/40", text: "text-rose-400" },
    B: { bg: "bg-blue-500/10", border: "border-blue-500/40", text: "text-blue-400" },
    C: { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-400" },
    D: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-400" }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Game</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Tải tệp JSON</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Lưu & Áp Dụng</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Quiz Info & Question List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quiz Metadata Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Thông Tin Tổng Quan Quiz
            </h4>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Tiêu đề sản phẩm / bài viết:
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Tóm tắt ngắn gọn:
              </label>
              <textarea
                value={data.summary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Danh sách ({data.questions.length} câu)
              </span>
              <button
                onClick={addNewQuestion}
                className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg transition-colors border border-purple-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {data.questions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveQuestionIdx(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    activeQuestionIdx === idx
                      ? "bg-purple-950/60 border-purple-500/80 text-white shadow-md shadow-purple-900/20"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 text-purple-300">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium truncate">
                      {q.question}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(idx);
                    }}
                    title="Xóa câu hỏi"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area: Question Editor */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          {currentQ ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black">
                    Câu hỏi #{activeQuestionIdx + 1}
                  </span>
                  <span>Chỉnh sửa nội dung</span>
                </h3>

                <div className="flex items-center gap-3">
                  {/* Difficulty Picker */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <select
                      value={currentQ.difficulty || "MEDIUM"}
                      onChange={(e) =>
                        updateCurrentQuestion("difficulty", e.target.value as DifficultyLevel)
                      }
                      className="bg-transparent text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="EASY" className="bg-slate-900">Dễ (EASY)</option>
                      <option value="MEDIUM" className="bg-slate-900">Trung bình (MEDIUM)</option>
                      <option value="HARD" className="bg-slate-900">Khó (HARD)</option>
                    </select>
                  </div>

                  {/* Time Limit */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <input
                      type="number"
                      min={10}
                      max={60}
                      value={currentQ.time_limit_sec || 20}
                      onChange={(e) =>
                        updateCurrentQuestion("time_limit_sec", parseInt(e.target.value) || 20)
                      }
                      className="w-10 bg-transparent text-xs font-bold text-white focus:outline-none text-center"
                    />
                    <span className="text-[11px] text-slate-400 font-medium">giây</span>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Nội dung câu hỏi:
                </label>
                <textarea
                  value={currentQ.question}
                  onChange={(e) => updateCurrentQuestion("question", e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-medium focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Options A, B, C, D Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  4 Lựa chọn trả lời & Đáp án đúng:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => {
                    const isCorrect = currentQ.correct_option_id === opt.id;
                    const style = optionColors[opt.id];

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isCorrect
                            ? "bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50"
                            : `${style.bg} ${style.border}`
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-black ${style.text}`}>
                            Lựa chọn {opt.id}
                          </span>
                          <button
                            onClick={() => updateCurrentQuestion("correct_option_id", opt.id)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                              isCorrect
                                ? "bg-emerald-500 text-slate-950 border-emerald-400"
                                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                            }`}
                          >
                            {isCorrect ? "✓ Đáp án đúng" : "Đánh dấu đúng"}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => updateOptionText(opt.id, e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Giải thích đáp án (Hiển thị sau khi người chơi trả lời):
                </label>
                <textarea
                  value={currentQ.explanation}
                  onChange={(e) => updateCurrentQuestion("explanation", e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Hint */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Gợi ý câu hỏi (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={currentQ.hint || ""}
                  onChange={(e) => updateCurrentQuestion("hint", e.target.value)}
                  placeholder="Gợi ý ngắn để người chơi dùng nút trợ giúp..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                />
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              Chưa chọn câu hỏi nào để chỉnh sửa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
