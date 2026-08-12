import { ArrowLeft, Award, CheckCircle2, Clock, Download, Plus, Save, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';
import { ComboboxOption, SearchableCombobox } from '@/src/components/ui/SearchableCombobox';
import { cn } from '@/src/lib/utils';
import { DifficultyLevel, OptionId, OptionStyle, QuizData, QuizQuestion } from '@/src/types';
import { formatJsonString } from '@/src/utils/jsonValidator';

const DIFFICULTY_OPTIONS: ComboboxOption<DifficultyLevel>[] = [
    { value: 'EASY', label: 'Dễ (EASY)' },
    { value: 'MEDIUM', label: 'Trung bình (MEDIUM)' },
    { value: 'HARD', label: 'Khó (HARD)' },
];

const OPTION_COLORS: Record<OptionId, OptionStyle> = {
    A: { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400' },
    B: { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400' },
    C: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400' },
    D: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400' },
};

interface QuizEditorProps {
    quizData: QuizData;
    onSaveQuiz: (updated: QuizData) => void;
    onCancel: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ quizData, onSaveQuiz, onCancel }) => {
    const [data, setData] = useState<QuizData>(JSON.parse(JSON.stringify(quizData)));

    // Lưu vị trí của câu hỏi đang được mở
    const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
    const [notification, setNotification] = useState<string | null>(null);

    // Hàm cập nhật tiêu đề bộ Quiz
    const handleTitleChange = useCallback((val: string) => {
        setData((prev) => ({ ...prev, title: val }));
    }, []);

    // Hàm cập nhật phần tóm tắt bộ Quiz
    const handleSummaryChange = useCallback((val: string) => {
        setData((prev) => ({ ...prev, summary: val }));
    }, []);

    const currentQuestion = data.questions[activeQuestionIdx];

    // Hàm cập nhật bất kỳ thuộc tính nào (field) của câu hỏi đang được mở với giá trị mới (val)
    const updateCurrentQuestion = useCallback(
        (field: keyof QuizQuestion, val: unknown) => {
            if (!currentQuestion) return;

            setData((prev) => {
                // Tạo một mảng mới sao chép tất cả các phần tử từ mảng prev.questions
                const nextQList = [...prev.questions];

                // nextQList[activeQuestionIdx]: Truy cập đến câu hỏi tại vị trí đang chọn
                // { ...nextQList[activeQuestionIdx] }: Tạo một object câu hỏi mới bằng cách sao chép lại toàn bộ thông tin cũ của câu hỏi đó (id, question, options, explanation,...)
                // [field]: val: Tùy thuộc vào tham số field truyền vào là gì, nó sẽ ghi đè (override) đúng thuộc tính đó bằng giá trị val
                nextQList[activeQuestionIdx] = {
                    ...nextQList[activeQuestionIdx],
                    [field]: val,
                };

                // ...prev: Giữ nguyên các thông tin chung của Quiz (title, summary)
                // questions: nextQList: Thay mảng questions cũ bằng mảng nextQList mới vừa được cập nhật câu hỏi ở bước trên
                return { ...prev, questions: nextQList };
            });
        },
        [activeQuestionIdx, currentQuestion],
    );

    // Hàm cập nhật nội dung 1 lựa chọn A, B, C hoặc D
    const updateOptionText = useCallback(
        (optId: OptionId, text: string) => {
            if (!currentQuestion) return;

            // Duyệt qua mảng options của câu hỏi hiện tại, tìm option có id match với optId và thay đổi field `text`
            setData((prev) => {
                const nextQList = [...prev.questions];

                const q = nextQList[activeQuestionIdx];

                const nextOpts = q.options.map((opt) => (opt.id === optId ? { ...opt, text } : opt));

                nextQList[activeQuestionIdx] = { ...q, options: nextOpts };

                return { ...prev, questions: nextQList };
            });
        },
        [activeQuestionIdx, currentQuestion],
    );

    const addNewQuestion = useCallback(() => {
        const newId = data.questions.length + 1;

        const newQuestion: QuizQuestion = {
            id: newId,
            question: `Câu hỏi mới số ${newId}`,
            options: [
                { id: 'A', text: 'Phương án A' },
                { id: 'B', text: 'Phương án B' },
                { id: 'C', text: 'Phương án C' },
                { id: 'D', text: 'Phương án D' },
            ],
            correct_option_id: 'A',
            explanation: 'Giải thích tại sao đáp án A đúng.',
            hint: 'Gợi ý đơn giản',
            difficulty: 'MEDIUM',
            time_limit_sec: 20,
        };

        setData((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));

        setActiveQuestionIdx(data.questions.length);
    }, [data.questions.length]);

    const removeQuestion = useCallback(
        (idx: number) => {
            if (data.questions.length <= 1) {
                alert('Bộ Quiz phải chứa ít nhất 1 câu hỏi!');
                return;
            }

            const updatedList = data.questions.filter((_, i) => i !== idx);

            // re-index
            // Sau khi xoá câu hỏi tại vị trí idx, hàm tự động đánh lại số ID (re-index) từ 1 đến N để đảm bảo tính nhất quán dữ liệu
            const reindexed = updatedList.map((question, i) => ({ ...question, id: i + 1 }));
            setData((prev) => ({ ...prev, questions: reindexed }));

            // Khi bạn xóa câu hỏi ở vị trí idx, việc tự động lùi lại 1 vị trí (idx - 1) giúp giao diện tự chuyển sự chú ý (focus) sang câu hỏi ngay phía trước nó
            // Đồng thời đảm bảo chỉ số index không bị âm (< 0)
            setActiveQuestionIdx(Math.max(0, idx - 1));
        },
        [data.questions],
    );

    const downloadJson = () => {
        const jsonStr = formatJsonString(data);

        // Tạo một đối tượng Blob (Binary Large Object - Đối tượng lưu trữ dữ liệu nhị phân) từ chuỗi jsonStr
        // { type: 'application/json' }: Đánh dấu kiểu MIME của tệp tin là tệp dữ liệu JSON để hệ điều hành và trình duyệt nhận diện đúng
        const blob = new Blob([jsonStr], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${
            data.title
                .toLowerCase()
                .trim()
                // Tìm tất cả ký tự không phải là chữ cái tiếng Anh (a-z) hoặc chữ số (0-9) và thay bằng dấu gạch dưới _
                .replace(/[^a-z0-0]/g, '_') || 'quiz'
        }.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleSave = () => {
        onSaveQuiz(data);
        setNotification('Đã lưu các thay đổi cho bộ Quiz!');
        setTimeout(() => setNotification(null), 2000);
    };

    return (
        <div className="animate-fadeIn mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
            {/* Top Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
                <Button size="md" variant="ghost" onClick={onCancel} leftIcon={ArrowLeft} className="font-semibold">
                    Quay lại Game
                </Button>

                <div className="flex items-center gap-3">
                    <Button
                        size="md"
                        variant="secondary"
                        onClick={downloadJson}
                        leftIcon={Download}
                        classNameIcon="text-purple-400"
                        className="font-semibold"
                    >
                        Tải tệp JSON
                    </Button>
                    <Button size="md" variant="gradient" onClick={handleSave} leftIcon={Save}>
                        Lưu & Áp Dụng
                    </Button>
                </div>
            </div>

            {notification && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>{notification}</span>
                </div>
            )}

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Sidebar: Quiz Info & Question List */}
                <div className="space-y-4 lg:col-span-4">
                    {/* Quiz Metadata Box */}
                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <h4 className="text-xs font-bold tracking-wider text-purple-400 uppercase">
                            Thông Tin Tổng Quan Quiz
                        </h4>

                        <Input
                            type="text"
                            label="Tiêu đề sản phẩm / bài viết:"
                            value={data.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        />

                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                                Tóm tắt ngắn gọn:
                            </label>
                            <textarea
                                value={data.summary}
                                onChange={(e) => handleSummaryChange(e.target.value)}
                                rows={2}
                                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                Danh sách ({data.questions.length} câu)
                            </span>
                            <button
                                onClick={addNewQuestion}
                                className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-400 transition-colors hover:bg-purple-500/20 hover:text-purple-300"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Thêm</span>
                            </button>
                        </div>

                        <div className="max-h-100 scrollbar-thin space-y-2 overflow-y-auto pr-1">
                            {data.questions.map((q, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveQuestionIdx(idx)}
                                    className={cn(
                                        'flex cursor-pointer items-center justify-between gap-2 rounded-xl border p-3 transition-all',
                                        activeQuestionIdx === idx
                                            ? 'border-purple-500/80 bg-purple-950/60 text-white shadow-md shadow-purple-900/20'
                                            : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200',
                                    )}
                                >
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-purple-300">
                                            {idx + 1}
                                        </span>
                                        <span className="truncate text-xs font-medium">{q.question}</span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeQuestion(idx);
                                        }}
                                        title="Xóa câu hỏi"
                                        className="shrink-0 rounded p-1 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Area: Question Editor */}
                <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:col-span-8">
                    {currentQuestion ? (
                        <>
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                    <span className="rounded-lg border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-black text-purple-300">
                                        Câu hỏi #{activeQuestionIdx + 1}
                                    </span>
                                    <span>Chỉnh sửa nội dung</span>
                                </h3>

                                <div className="flex items-center gap-3">
                                    {/* Difficulty Picker */}
                                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1">
                                        <Award className="h-3.5 w-3.5 text-amber-400" />
                                        <SearchableCombobox<DifficultyLevel>
                                            options={DIFFICULTY_OPTIONS}
                                            value={currentQuestion.difficulty || 'MEDIUM'}
                                            onChange={(val) => updateCurrentQuestion('difficulty', val)}
                                            showSearch={true}
                                        />
                                    </div>

                                    {/* Time Limit */}
                                    <Input
                                        type="number"
                                        min={10}
                                        max={60}
                                        value={currentQuestion.time_limit_sec || 20}
                                        onChange={(e) =>
                                            updateCurrentQuestion('time_limit_sec', parseInt(e.target.value) || 20)
                                        }
                                        leftIcon={Clock}
                                        iconClassName="h-3.5 w-3.5 text-blue-400"
                                        suffixText="giây"
                                    />
                                </div>
                            </div>

                            {/* Question Text */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-300">
                                    Nội dung câu hỏi:
                                </label>
                                <textarea
                                    value={currentQuestion.question}
                                    onChange={(e) => updateCurrentQuestion('question', e.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-medium text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Options A, B, C, D Grid */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-300">
                                    4 Lựa chọn trả lời & Đáp án đúng:
                                </label>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {currentQuestion.options.map((opt) => {
                                        const isCorrect = currentQuestion.correct_option_id === opt.id;
                                        const style = OPTION_COLORS[opt.id];

                                        return (
                                            <div
                                                key={opt.id}
                                                className={cn(
                                                    'rounded-xl border p-3 transition-all',
                                                    isCorrect
                                                        ? 'border-emerald-500/80 bg-emerald-950/40 ring-1 ring-emerald-500/50'
                                                        : `${style.bg} ${style.border}`,
                                                )}
                                            >
                                                <div className="mb-1.5 flex items-center justify-between">
                                                    <span className={cn('text-xs font-black', `${style.text}`)}>
                                                        Lựa chọn {opt.id}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateCurrentQuestion('correct_option_id', opt.id)
                                                        }
                                                        className={cn(
                                                            'rounded-lg border px-2 py-0.5 text-[10px] font-bold transition-all',
                                                            isCorrect
                                                                ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                                                                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white',
                                                        )}
                                                    >
                                                        {isCorrect ? '✓ Đáp án đúng' : 'Đánh dấu đúng'}
                                                    </button>
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={(e) => updateOptionText(opt.id, e.target.value)}
                                                    className="rounded-lg bg-slate-950/80 px-2.5 py-1.5 text-xs"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Explanation */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-300">
                                    Giải thích đáp án (Hiển thị sau khi người chơi trả lời):
                                </label>
                                <textarea
                                    value={currentQuestion.explanation}
                                    onChange={(e) => updateCurrentQuestion('explanation', e.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Hint */}
                            <Input
                                type="text"
                                label="Gợi ý câu hỏi (Tùy chọn):"
                                placeholder="Gợi ý ngắn để người chơi dùng nút trợ giúp..."
                                value={currentQuestion.hint || ''}
                                onChange={(e) => updateCurrentQuestion('hint', e.target.value)}
                                className="text-slate-300"
                            />
                        </>
                    ) : (
                        <div className="py-12 text-center text-sm text-slate-500">
                            Chưa chọn câu hỏi nào để chỉnh sửa.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
