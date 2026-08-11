import { ArrowLeft, Award, CheckCircle2, Clock, Download, Plus, Save, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ComboboxOption, SearchableCombobox } from './ui/SearchableCombobox';

import { DifficultyLevel, OptionId, OptionStyle, QuizData, QuizQuestion } from '@/src/types';
import { formatJsonString } from '@/src/utils/jsonValidator';
import { cn } from '@/src/lib/utils';

const DIFFICULTY_OPTIONS: ComboboxOption<DifficultyLevel>[] = [
    { value: 'EASY', label: 'Dễ (EASY)' },
    { value: 'MEDIUM', label: 'Trung bình (MEDIUM)' },
    { value: 'HARD', label: 'Khó (HARD)' },
];

const optionColors: Record<OptionId, OptionStyle> = {
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
                [field]: val,
            };
            return { ...prev, questions: nextQList };
        });
    };

    const updateOptionText = (optId: OptionId, text: string) => {
        if (!currentQ) return;
        setData((prev) => {
            const nextQList = [...prev.questions];
            const q = nextQList[activeQuestionIdx];
            const nextOpts = q.options.map((opt) => (opt.id === optId ? { ...opt, text } : opt));
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
            questions: [...prev.questions, newQ],
        }));
        setActiveQuestionIdx(data.questions.length);
    };

    const removeQuestion = (idx: number) => {
        if (data.questions.length <= 1) {
            alert('Bộ Quiz phải chứa ít nhất 1 câu hỏi!');
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
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.title.toLowerCase().replace(/[^a-z0-0]/g, '_') || 'quiz'}.json`;
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
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại Game</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={downloadJson}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700"
                    >
                        <Download className="h-4 w-4 text-purple-400" />
                        <span>Tải tệp JSON</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:from-purple-500 hover:to-pink-500"
                    >
                        <Save className="h-4 w-4" />
                        <span>Lưu & Áp Dụng</span>
                    </button>
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

                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                                Tiêu đề sản phẩm / bài viết:
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                            />
                        </div>

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
                    {currentQ ? (
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
                                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2 py-0.5">
                                        <Award className="ml-1 h-3.5 w-3.5 shrink-0 text-amber-400" />
                                        <SearchableCombobox<DifficultyLevel>
                                            options={DIFFICULTY_OPTIONS}
                                            value={currentQ.difficulty || 'MEDIUM'}
                                            onChange={(val) => updateCurrentQuestion('difficulty', val)}
                                            showSearch={true}
                                        />
                                    </div>

                                    {/* Time Limit */}
                                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1">
                                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                                        <input
                                            type="number"
                                            min={10}
                                            max={60}
                                            value={currentQ.time_limit_sec || 20}
                                            onChange={(e) =>
                                                updateCurrentQuestion('time_limit_sec', parseInt(e.target.value) || 20)
                                            }
                                            className="w-10 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                                        />
                                        <span className="text-[11px] font-medium text-slate-400">giây</span>
                                    </div>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-300">
                                    Nội dung câu hỏi:
                                </label>
                                <textarea
                                    value={currentQ.question}
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
                                    {currentQ.options.map((opt) => {
                                        const isCorrect = currentQ.correct_option_id === opt.id;
                                        const style = optionColors[opt.id];

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
                                                <input
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={(e) => updateOptionText(opt.id, e.target.value)}
                                                    className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
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
                                    value={currentQ.explanation}
                                    onChange={(e) => updateCurrentQuestion('explanation', e.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Hint */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-300">
                                    Gợi ý câu hỏi (Tùy chọn):
                                </label>
                                <input
                                    type="text"
                                    value={currentQ.hint || ''}
                                    onChange={(e) => updateCurrentQuestion('hint', e.target.value)}
                                    placeholder="Gợi ý ngắn để người chơi dùng nút trợ giúp..."
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
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
