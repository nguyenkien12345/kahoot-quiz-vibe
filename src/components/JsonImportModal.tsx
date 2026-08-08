import React, { useState } from "react";
import { X, Upload, CheckCircle2, AlertTriangle, FileText, Copy, Sparkles, Download, Layers } from "lucide-react";
import { validateQuizJson, formatJsonString } from "../utils/jsonValidator";
import { SAMPLE_QUIZZES } from "../constants/samples";
import { QuizData } from "../types";

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadQuiz: (data: QuizData) => void;
  currentJsonString?: string;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({
  isOpen,
  onClose,
  onLoadQuiz,
  currentJsonString = ""
}) => {
  const [rawJson, setRawJson] = useState<string>(currentJsonString);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"UPLOAD" | "PASTE" | "SAMPLES">("UPLOAD");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawJson(text);
      validateAndApply(text);
    };
    reader.onerror = () => {
      setErrorMsg("Không thể đọc tệp tin JSON. Vui lòng kiểm tra lại tệp.");
    };
    reader.readAsText(file);
  };

  const validateAndApply = (jsonText: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = validateQuizJson(jsonText);
    if (!result.isValid) {
      setErrorMsg(result.error || "Dữ liệu JSON không đúng cấu trúc.");
      return false;
    }

    if (result.quizData) {
      setSuccessMsg(`Tải Quiz "${result.quizData.title}" thành công! (${result.quizData.questions.length} câu hỏi)`);
      setTimeout(() => {
        onLoadQuiz(result.quizData!);
        onClose();
      }, 600);
      return true;
    }
    return false;
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(rawJson);
      setRawJson(formatJsonString(parsed));
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg("Cú pháp JSON chưa đúng nên không thể định dạng tự động.");
    }
  };

  const schemaExample = {
    title: "Tai nghe Bluetooth Sony WH-1000XM5",
    summary: "Tai nghe chống ồn cao cấp với thời lượng pin 30 giờ và công nghệ AI khử tiếng ồn.",
    questions: [
      {
        id: 1,
        question: "Thời lượng pin tối đa của Sony WH-1000XM5 khi bật chống ồn là bao nhiêu?",
        options: [
          { id: "A", text: "30 giờ" },
          { id: "B", text: "20 giờ" },
          { id: "C", text: "40 giờ" },
          { id: "D", text: "15 giờ" }
        ],
        correct_option_id: "A",
        explanation: "Sony WH-1000XM5 hỗ trợ phát nhạc liên tục lên đến 30 giờ khi bật tính năng chống ồn ANC.",
        hint: "Nhiều hơn một ngày đêm!",
        difficulty: "EASY",
        time_limit_sec: 20
      }
    ]
  };

  const copySchemaTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(schemaExample, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nhập Dữ Liệu Quiz (JSON)</h3>
              <p className="text-xs text-slate-400">Tải tệp JSON hoặc dán chuỗi JSON theo cấu trúc Kahoot Quiz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab("UPLOAD")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "UPLOAD"
                ? "border-purple-500 text-purple-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải tệp JSON</span>
          </button>
          <button
            onClick={() => setActiveTab("PASTE")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "PASTE"
                ? "border-purple-500 text-purple-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dán / Chỉnh sửa JSON</span>
          </button>
          <button
            onClick={() => setActiveTab("SAMPLES")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "SAMPLES"
                ? "border-purple-500 text-purple-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quiz Mẫu Có Sẵn</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="font-medium">{successMsg}</div>
            </div>
          )}

          {/* TAB 1: UPLOAD FILE */}
          {activeTab === "UPLOAD" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl p-8 text-center transition-all bg-slate-950/40 hover:bg-purple-950/10 group cursor-pointer relative">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Kéo thả tệp JSON vào đây hoặc nhấp để chọn tệp
                </h4>
                <p className="text-xs text-slate-400">
                  Chỉ chấp nhận tệp định dạng .json hợp lệ với cấu trúc Kahoot Quiz
                </p>
              </div>

              {/* Schema help */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Cấu trúc JSON Mẫu Chuẩn
                  </span>
                  <button
                    onClick={copySchemaTemplate}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium bg-purple-950/50 border border-purple-800/40 px-2.5 py-1 rounded-lg"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Đã sao chép!" : "Sao chép mẫu"}
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-slate-900 p-3 rounded-lg text-purple-200/90 overflow-x-auto max-h-40 scrollbar-thin border border-slate-800">
                  {JSON.stringify(schemaExample, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE RAW JSON */}
          {activeTab === "PASTE" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Dán nội dung JSON vào ô bên dưới:
                </label>
                <button
                  onClick={handleFormat}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700"
                >
                  Định dạng đẹp (Prettify)
                </button>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                placeholder="Dán JSON của bạn vào đây..."
                rows={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-purple-200 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 resize-none scrollbar-thin"
              />
            </div>
          )}

          {/* TAB 3: SAMPLES */}
          {activeTab === "SAMPLES" && (
            <div className="grid grid-cols-1 gap-3">
              <p className="text-xs text-slate-400 mb-1">
                Chọn một bộ Quiz mẫu có sẵn để trải nghiệm trò chơi ngay lập tức:
              </p>
              {SAMPLE_QUIZZES.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    setRawJson(JSON.stringify(sample.data, null, 2));
                    onLoadQuiz(sample.data);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-purple-950/30 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors flex items-center gap-2">
                      <span>{sample.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                        {sample.data.questions.length} câu hỏi
                      </span>
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-1">{sample.data.summary}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    Tải Quiz
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Hủy bỏ
          </button>
          {activeTab !== "SAMPLES" && (
            <button
              onClick={() => validateAndApply(rawJson)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận & Bắt Đầu</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
