import React, { useState } from "react";
import { X, Sparkles, Loader2, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { QuizData } from "../types";

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizGenerated: (quiz: QuizData) => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onQuizGenerated
}) => {
  const [topic, setTopic] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !text.trim()) {
      setErrorMsg("Vui lòng nhập tên sản phẩm, bài viết hoặc thông tin chủ đề.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic,
          text,
          numQuestions
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo bộ Quiz. Vui lòng thử lại.");
      }

      onQuizGenerated(data.data as QuizData);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const setPresetTopic = (presetTopic: string, presetText: string) => {
    setTopic(presetTopic);
    setText(presetText);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900/40 via-slate-900 to-pink-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Tạo Quiz Bằng AI Gemini</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold uppercase">
                  Tự động
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Nhập thông tin sản phẩm hoặc bài viết để AI tự tạo Kahoot Quiz chuẩn cấu trúc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleGenerate} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">
              Chủ đề gợi ý nhanh:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPresetTopic("iPhone 16 Pro Max", "Thiết kế Titan sa mạc, chip A18 Pro, nút Camera Control, camera tiềm vọng 5x, thời lượng pin tốt nhất lịch sử iPhone.")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/50 text-[11px] font-medium text-slate-300 transition-colors"
              >
                📱 iPhone 16 Pro Max
              </button>
              <button
                type="button"
                onClick={() => setPresetTopic("Xe điện Tesla Model S Plaid", "Động cơ 3 motor 1020 mã lực, tăng tốc 0-100km/h trong 2.1 giây, màn hình giải trí gaming, tầm hoạt động 600km.")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/50 text-[11px] font-medium text-slate-300 transition-colors"
              >
                🏎️ Tesla Model S
              </button>
              <button
                type="button"
                onClick={() => setPresetTopic("Cà phê Muối Huế", "Món thức uống đặc sản Cố đô Huế kết hợp giữa vị đắng cà phê, vị béo của kem tươi và vị mặn nhẹ của muối tinh.")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/50 text-[11px] font-medium text-slate-300 transition-colors"
              >
                ☕ Cà phê Muối Huế
              </button>
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              Tên sản phẩm / Tiêu đề bài viết: <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Tai nghe Bluetooth Sony WH-1000XM5"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Detail Text Input */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              Nội dung tóm tắt hoặc đặc điểm sản phẩm/bài viết:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập mô tả tính năng nổi bật, thông số kỹ thuật hoặc dán đoạn văn bản để AI tạo câu hỏi sát nhất..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Number of Questions */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              Số lượng câu hỏi cần tạo:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 8, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumQuestions(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    numQuestions === num
                      ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Đang suy luận & tạo Quiz...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-amber-300" />
                  <span>Tạo Bộ Quiz Ngay</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
