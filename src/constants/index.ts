import { LucideIcon, Play, Shield, Trophy, Users, Zap } from "lucide-react";
import { GameMode } from "../types";

export interface ConfigModeGame {
    id: number;
    name: string;
    classNameWrapperContainer?: string;
    classNameWrapperIcon?: string;
    classNameIcon?: string;
    icon?: LucideIcon;
    classNameWrapperText?: string;
    text?: string;
    classNameWrapperTitle?: string;
    title: string;
    classNameWrapperDescription?: string;
    description: string;
    showActions?: boolean;
    classNameWrapperActions?: string;
    textAction?: string;
    iconAction?: LucideIcon;
    classNameIconAction?: string;
    mode: GameMode
}

export const CONFIG_MODE_GAME: ConfigModeGame[] = [
    {
        id: 1,
        name: "solo-mode",
        classNameWrapperContainer: "hover:border-purple-500/80 hover:shadow-purple-900/20",
        classNameWrapperIcon: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        icon: Zap,
        classNameWrapperText: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        text: "Phổ biến",
        classNameWrapperTitle: "group-hover:text-purple-300",
        title: "Cá Nhân Thử Thách",
        description: "Tự làm bài với đồng hồ tính giờ bấm giờ kịch tính, tính chuỗi điểm Streak & nhân điểm thưởng!",
        classNameWrapperActions: "text-purple-400 group-hover:text-purple-300",
        textAction: "Bắt đầu ngay",
        iconAction: Play,
        mode: "SOLO"
    },
    {
        id: 2,
        name: "host-presentation-mode",
        classNameWrapperContainer: "hover:border-pink-500/80 hover:shadow-pink-900/20",
        classNameWrapperIcon: "bg-pink-500/10 border-pink-500/30 text-pink-400",
        icon: Users,
        classNameWrapperText: "bg-pink-500/20 text-pink-300 border-pink-500/30",
        text: "Lớp học / Host",
        classNameWrapperTitle: "group-hover:text-pink-300",
        title: "Trình Chiếu / Quản Trò (Host)",
        description: "Màn hình lớn chiếu câu hỏi dành cho Giáo viên / Host trình chiếu cho cả lớp cùng tham gia trả lời.",
        classNameWrapperActions: "text-pink-400 group-hover:text-pink-300",
        textAction: "Mở màn hình Host",
        iconAction: Play,
        mode: "HOST"
    },
    {
        id: 3,
        name: "speed-run-mode",
        classNameWrapperContainer: "hover:border-amber-500/80 hover:shadow-amber-900/20",
        classNameWrapperIcon: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        icon: Trophy,
        classNameWrapperText: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        text: "Tốc độ",
        classNameWrapperTitle: "group-hover:text-amber-300",
        title: "Speed Run (Siêu Tốc)",
        description: "Thời gian làm bài giảm một nửa (50%), nhân đôi số điểm thưởng phản xạ siêu nhanh!",
        classNameWrapperActions: "text-amber-400 group-hover:text-amber-300",
        textAction: "Thử thách tốc độ",
        iconAction: Play,
        mode: "SPEED_RUN"
    },
    {
        id: 4,
        name: "practice-mode",
        classNameWrapperContainer: "hover:border-emerald-500/80 hover:shadow-emerald-900/20",
        classNameWrapperIcon: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        icon: Shield,
        classNameWrapperText: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        text: "Thư giãn",
        classNameWrapperTitle: "group-hover:text-emerald-300",
        title: "Chế Độ Luyện Tập (Không Áp Lực)",
        description: "Không giới hạn thời gian đếm ngược, luôn xem gợi ý & giải thích đáp án chi tiết.",
        classNameWrapperActions: "text-emerald-400 group-hover:text-emerald-300",
        textAction: "Luyện tập ngay",
        iconAction: Play,
        mode: "PRACTICE"
    }
]