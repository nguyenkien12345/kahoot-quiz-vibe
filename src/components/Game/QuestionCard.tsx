import { Award, Flame, HelpCircle } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { KAHOOT_OPTION_STYLES } from '@/src/constants';
import { GameMode, OptionId, QuizQuestion } from '@/src/types';
import { sound } from '@/src/utils/audio';

interface QuestionCardProps {
    question: QuizQuestion; // Thông tin câu hỏi hiện tại (nội dung, đáp án, độ khó, time_limit, hint)
    questionIndex: number; // Chỉ số câu hỏi (ví dụ: 0 cho câu 1)
    totalQuestions: number; // Tổng số câu hỏi của bộ Quiz
    currentScore: number; // Tổng điểm người chơi đang có
    currentStreak: number; // Chuỗi câu trả lời đúng liên tiếp
    gameMode: GameMode; // Chế độ chơi
    timeMultiplier: number; // Hệ số thời gian (ví dụ: 1x, 0.5x cho Speed Run, 2x)
    onSelectOption: (optionId: OptionId | null, timeSpentSec: number) => void; // Callback gửi đáp án người chơi chọn (hoặc null nếu hết giờ) và số giây đã dùng
    soundEnabled: boolean; // Bật / tắt âm thanh tíc tắc
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionIndex,
    totalQuestions,
    currentScore,
    currentStreak,
    gameMode,
    timeMultiplier,
    onSelectOption,
    soundEnabled,
}) => {
    const {
        id: questionId,
        time_limit_sec,
        difficulty: questionDifficulty,
        hint: questionHint,
        question: questionText,
        options: questionOptions,
    } = question ?? {};

    const baseTimeSec = time_limit_sec || 20;
    const totalTimeSec =
        gameMode === 'SPEED_RUN'
            ? Math.max(8, Math.round(baseTimeSec * 0.5)) // Speed Run: Giảm 50% thời gian gốc (thời gian câu hỏi không bao giờ được thấp hơn 8 giây (để người chơi kịp đọc câu hỏi và bấm đáp án)))
            : gameMode === 'PRACTICE'
              ? // Luyện tập: Cho 999s (không lo hết giờ)
                999
              : // Các chế độ chơi thông thường (SOLO, HOST...). Lấy thời gian gốc nhân với hệ số thời gian (timeMultiplier) do người chơi tự chỉnh trong Cài đặt Game
                // Ví dụ với câu hỏi 20s:
                // Cài đặt chuẩn (timeMultiplier = 1): => 20 giây
                // Cài đặt nhanh (timeMultiplier = 0.5): => 10 giây
                // Cài đặt thư thả (timeMultiplier = 2): => 40 giây
                Math.round(baseTimeSec * timeMultiplier);

    // Track previous question ID to adjust state during render when question changes
    const [prevQuestionId, setPrevQuestionId] = useState<number>(questionId); // ID của câu hỏi ở lần render trước đó (câu hỏi cũ vừa trải qua)

    const [timeLeft, setTimeLeft] = useState<number>(totalTimeSec); // Số giây còn lại

    const [showHintModal, setShowHintModal] = useState<boolean>(false); // Đóng/mở Modal gợi ý

    const [selectedOpt, setSelectedOpt] = useState<OptionId | null>(null); // Lựa chọn A/B/C/D đã chọn

    // Tự động reset State khi prop `question.id` thay đổi
    if (prevQuestionId !== questionId) {
        // Bài toán 1: Khi mới bắt đầu Câu 1 (ID = 101)
        // - Component khởi tạo: prevQuestionId = 101
        // - questionId truyền từ prop = 101
        // => Điều kiện if (prevQuestionId !== questionId) là 101 !== 101 => False (Sai) => Component hiển thị Câu 1 bình thường

        // Bài toán 2: Khi chuyển sang Câu 2 (ID = 102)
        // - Prop questionId mới truyền vào là 102
        // - Lúc này, state prevQuestionId vẫn đang giữ giá trị cũ là 101
        // - So sánh: if (101 !== 102) => True (Đúng) => (Phát hiện câu hỏi đã bị thay đổi!)
        // + Component lập tức thực hiện 2 việc:
        // 1) Reset lại State về ban đầu:
        //  - Reset đồng hồ: setTimeLeft(totalTimeSec)
        //  - Bỏ chọn nút cũ: setSelectedOpt(null)
        //  - Đóng gợi ý: setShowHintModal(false)
        // 2) Cập nhật ghi nhớ mới: setPrevQuestionId(102) (Lưu 102 lại để làm mốc so sánh cho câu tiếp theo)

        setPrevQuestionId(questionId);
        setTimeLeft(totalTimeSec);
        setSelectedOpt(null);
        setShowHintModal(false);
    }

    const timerRef = useRef<NodeJS.Timeout | null>(null); // Lưu ID của setInterval để hủy timer

    const startTimeRef = useRef<number>(0); // Lưu mốc thời gian bắt đầu câu hỏi (performance.now)

    const soundEnabledRef = useRef<boolean>(soundEnabled);

    const onSelectOptionRef = useRef(onSelectOption);

    const totalTimeSecRef = useRef<number>(totalTimeSec);

    // Cập nhật giá trị ref khi prop tương ứng thay đổi (giúp timer loop không bị stale closures)
    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    useEffect(() => {
        onSelectOptionRef.current = onSelectOption;
    }, [onSelectOption]);

    useEffect(() => {
        totalTimeSecRef.current = totalTimeSec;
    }, [totalTimeSec]);

    // startTimeRef.current: Mốc thời gian (tính bằng mili-giây) được ghi lại bằng performance.now() ngay khi câu hỏi vừa hiển thị lên màn hình
    // performance.now(): Mốc thời gian hiện tại khi đồng hồ hết giờ

    // Hàm xử lý khi hết giờ (Timeout)
    const handleTimeOut = useCallback(() => {
        // (hiện_tại - bắt_đầu) / 1000 => Lấy mốc hiện tại - mốc bắt đầu = khoảng thời gian người chơi đã trôi qua tính bằng mili-giây (ms) (Chia cho 1000 để quy đổi từ mili-giây sang giây (s))
        // Ví dụ: Bắt đầu lúc 5000ms, hết giờ lúc 25045ms => (25045 - 5000) / 1000 = 20.045s
        const elapsedSec = (performance.now() - startTimeRef.current) / 1000;

        // Gửi null đại diện cho việc không chọn đáp án nào
        // - Math.round(elapsedSec):  Làm tròn số giây thực tế sang số nguyên (ví dụ: 20.045s => 20s)
        // - Math.min(totalTimeSecRef.current, Math.round(elapsedSec): Giả sử tổng thời gian câu hỏi quy định là 20 giây. Do độ trễ của trình duyệt hoặc CPU bị khựng nhẹ, elapsedSec có thể đo ra là 20.8 hoặc 21 giây. Phép toán Math.min(20, 21) sẽ trả về 20. Điều này đảm bảo số giây ghi nhận gửi về hệ thống không bao giờ vượt quá tổng thời gian quy định của câu hỏi
        onSelectOptionRef.current(null, Math.min(totalTimeSecRef.current, Math.round(elapsedSec)));
    }, []);

    useEffect(() => {
        // 1. Ghi lại mốc thời gian bắt đầu câu hỏi. Giá trị này dùng để tính độ chênh lệch thời gian khi người chọn đáp án hoặc khi hết giờ
        startTimeRef.current = performance.now();

        // 2. Nếu là chế độ Luyện Tập -> Bỏ qua, không chạy đồng hồ đếm ngược
        if (gameMode === 'PRACTICE') return;

        // 3. Khởi tạo bộ đếm thời gian lặp lại sau mỗi 1000ms (1 giây)
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                // Trường hợp A: Hết giờ (khi số giây còn lại <= 1)
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current); // Dừng timer ngay
                    handleTimeOut(); // Gọi hàm xử lý hết giờ
                    return 0; // Đưa đồng hồ về 0
                }

                // Trường hợp B: Khi còn thời gian (prev > 1) & Bật âm thanh (soundEnabledRef.current)
                if (soundEnabledRef.current) {
                    if (prev <= 6) {
                        sound.playWarningTick(); // Khi còn <= 6s: Tiếng cảnh báo dồn dập
                    } else if (prev % 2 === 0) {
                        sound.playTick(); // Khi > 6s: Tiếng tíc tắc nhẹ mỗi 2 giây (giây chẵn)
                    }
                }

                // Trừ đi 1 giây
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [questionId, gameMode, handleTimeOut]);

    const pickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handlePick = useCallback(
        (optId: OptionId) => {
            // 1. Chặn click đúp / bấm nhiều lần
            if (selectedOpt !== null) return;

            // 2. Dừng đồng hồ đếm ngược ngay lập tức
            if (timerRef.current) clearInterval(timerRef.current);

            // 3. Lưu đáp án người chơi chọn vào State
            setSelectedOpt(optId);

            // 4. Tính chính xác số giây người chơi đã suy nghĩ đến lúc bấm nút
            // Đo thời gian phản hồi: Lấy mốc thời gian khi ngón tay bấm nút trừ cho mốc thời gian lúc câu hỏi vừa mở
            // Ví dụ: Mở câu hỏi lúc 10000ms, bấm đáp án lúc 13400ms => 3400ms = 3.4s
            const elapsedSec = (performance.now() - startTimeRef.current) / 1000;

            // 5. Trì hoãn 200ms trước khi chuyển sang màn hình Kết quả
            pickTimeoutRef.current = setTimeout(() => {
                onSelectOptionRef.current(optId, Math.min(totalTimeSecRef.current, Math.round(elapsedSec)));
            }, 200);
        },
        [selectedOpt],
    );

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (pickTimeoutRef.current) clearTimeout(pickTimeoutRef.current);
        };
    }, []);

    // - 283 chính là chiều dài của toàn bộ vòng viền hình tròn khi còn đầy 100% thời gian
    // - timeRatio: Tỷ lệ phần trăm thời gian còn lại (nhận giá trị từ 0.0 đến 1.0)
    // - Nếu ở chế độ Luyện tập (PRACTICE) -> timeRatio = 1 (100% thời gian, vòng tròn luôn đầy). Các chế độ khác thì lấy Thời gian còn lại \ Tổng thời gian
    // + sVí dụ với câu hỏi 20 giây:
    // - Lúc mới vào làm câu hỏi (timeLeft = 20s): 20 / 20 = 1.0 (Còn 100% thời gian)
    // - Khi trôi qua một nửa (timeLeft = 10s): 10 / 20 = 0.5 (Còn 50% thời gian)
    // - Khi chuẩn bị hết giờ (timeLeft = 2s): 2 / 20 = 0.1 (Còn 10% thời gian)

    const timeRatio = gameMode === 'PRACTICE' ? 1 : timeLeft / totalTimeSec;
    const strokeDash = 283 * timeRatio;

    return (
        <div className="animate-fadeIn mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
            {/* Top Header Controls & Info */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
                {/* Progress Counter */}
                <div className="flex items-center gap-3">
                    <span className="rounded-xl border border-purple-500/30 bg-purple-600/20 px-3 py-1 text-xs font-black text-purple-300 sm:text-sm">
                        {questionIndex + 1} / {totalQuestions}
                    </span>

                    {currentStreak >= 2 && (
                        <div className="flex animate-bounce items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                            <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span>Chuỗi {currentStreak}x!</span>
                        </div>
                    )}
                </div>

                {/* Current Score Display */}
                <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Điểm:</span>
                    <span className="font-mono text-base font-black text-amber-300">
                        {currentScore.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Question Card Box */}
            <div className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-900 p-6 text-center shadow-2xl sm:p-8">
                {/* Countdown Ring Header */}
                {gameMode !== 'PRACTICE' && (
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" className="fill-none stroke-slate-800" strokeWidth="8" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    className={`fill-none transition-all duration-1000 ${
                                        timeLeft <= 5 ? 'stroke-rose-500' : 'stroke-purple-500'
                                    }`}
                                    strokeWidth="8"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - strokeDash}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span
                                className={`absolute text-lg font-black ${
                                    timeLeft <= 5 ? 'animate-ping-once text-rose-400' : 'text-white'
                                }`}
                            >
                                {timeLeft}
                            </span>
                        </div>
                    </div>
                )}

                {/* Difficulty Badge & Question Title */}
                <div className="mx-auto max-w-3xl space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-purple-300 uppercase">
                            {questionDifficulty === 'EASY'
                                ? 'Dễ'
                                : questionDifficulty === 'HARD'
                                  ? 'Khó'
                                  : 'Trung bình'}
                        </span>
                    </div>

                    <h2 className="text-xl leading-snug font-black tracking-tight text-white sm:text-3xl">
                        {questionText}
                    </h2>
                </div>

                {/* Hint Trigger */}
                {questionHint && (
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={() => setShowHintModal(true)}
                            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                        >
                            <HelpCircle className="h-4 w-4 text-amber-400" />
                            <span>Xem gợi ý</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Kahoot Options 2x2 Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {questionOptions.map((opt) => {
                    const config = KAHOOT_OPTION_STYLES[opt.id];
                    const isSelected = selectedOpt === opt.id;

                    return (
                        <button
                            key={opt.id}
                            onClick={() => handlePick(opt.id)}
                            disabled={selectedOpt !== null}
                            className={`group relative flex min-h-22.5 transform items-start gap-4 rounded-2xl border-2 p-5 text-left text-base font-extrabold text-white shadow-lg transition-all duration-200 active:scale-[0.98] sm:p-6 sm:text-lg ${
                                config.bg
                            } ${config.hoverBg} ${config.border} ${
                                isSelected ? 'scale-[1.02] shadow-2xl ring-4 ring-white' : ''
                            }`}
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/25 text-xl transition-transform group-hover:scale-110">
                                {config.symbol}
                            </div>
                            <div className="flex-1 self-center leading-snug wrap-break-word">{opt.text}</div>
                        </button>
                    );
                })}
            </div>

            {/* Hint Modal */}
            {showHintModal && (
                <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-amber-500/40 bg-slate-900 p-6 text-center shadow-2xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/20 text-amber-400">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <h4 className="text-lg font-extrabold text-white">Gợi Ý Làm Bài</h4>
                        <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-slate-300">
                            "{questionHint}"
                        </p>
                        <button
                            onClick={() => setShowHintModal(false)}
                            className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold tracking-wider text-slate-950 uppercase transition-colors hover:bg-amber-400"
                        >
                            Đã hiểu, quay lại trả lời
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
