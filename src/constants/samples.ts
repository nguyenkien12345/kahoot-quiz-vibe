import { QuizData } from "../types";

export const SAMPLE_QUIZZES: { id: string; name: string; data: QuizData }[] = [
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 (Mẫu từ yêu cầu)",
    data: {
      title: "Tai nghe Bluetooth Sony WH-1000XM5",
      summary: "Tai nghe chống ồn cao cấp với thời lượng pin 30 giờ và công nghệ AI khử tiếng ồn đỉnh cao.",
      questions: [
        {
          id: 1,
          question: "Thời lượng pin tối đa của Sony WH-1000XM5 khi bật tính năng chống ồn (ANC) là bao nhiêu?",
          options: [
            { id: "A", text: "30 giờ" },
            { id: "B", text: "20 giờ" },
            { id: "C", text: "40 giờ" },
            { id: "D", text: "15 giờ" }
          ],
          correct_option_id: "A",
          explanation: "Sony WH-1000XM5 hỗ trợ phát nhạc liên tục lên đến 30 giờ khi bật tính năng chống ồn ANC và lên đến 40 giờ khi tắt ANC.",
          hint: "Nhiều hơn một ngày đêm phát nhạc liên tục!",
          difficulty: "EASY",
          time_limit_sec: 20
        },
        {
          id: 2,
          question: "Sony WH-1000XM5 trang bị bao nhiêu micro để phục vụ công nghệ thu âm và chống ồn?",
          options: [
            { id: "A", text: "4 micro" },
            { id: "B", text: "6 micro" },
            { id: "C", text: "8 micro" },
            { id: "D", text: "10 micro" }
          ],
          correct_option_id: "C",
          explanation: "WH-1000XM5 sở hữu hệ thống 8 micro kết hợp với bộ xử lý chống ồn HD QN1 và V1 giúp lọc tiếng ồn vượt trội.",
          hint: "Số micro gấp đôi thế hệ trước ở mỗi bên tai nghe.",
          difficulty: "MEDIUM",
          time_limit_sec: 20
        },
        {
          id: 3,
          question: "Tính năng thông minh nào tự động dừng nhạc khi bạn bắt đầu nói chuyện?",
          options: [
            { id: "A", text: "Speak-to-Chat" },
            { id: "B", text: "Quick Attention" },
            { id: "C", text: "Adaptive Sound Control" },
            { id: "D", text: "Auto Voice Mute" }
          ],
          correct_option_id: "A",
          explanation: "Tính năng Speak-to-Chat tự động nhận diện giọng nói của bạn, tạm dừng nhạc và mở chế độ xuyên âm để bạn trò chuyện mà không cần tháo tai nghe.",
          hint: "Tên tính năng kết hợp giữa 'Nói' và 'Trò chuyện'.",
          difficulty: "MEDIUM",
          time_limit_sec: 25
        },
        {
          id: 4,
          question: "Thời gian sạc nhanh 3 phút bằng củ sạc USB-PD tương thích mang lại bao nhiêu giờ sử dụng?",
          options: [
            { id: "A", text: "1 giờ" },
            { id: "B", text: "3 giờ" },
            { id: "C", text: "5 giờ" },
            { id: "D", text: "30 phút" }
          ],
          correct_option_id: "B",
          explanation: "Chỉ với 3 phút sạc bằng bộ sạc USB Power Delivery (USB-PD) chuẩn, tai nghe có thể hoạt động liên tục trong 3 giờ.",
          hint: "Số phút sạc tương ứng trực tiếp với số giờ nghe nhạc!",
          difficulty: "HARD",
          time_limit_sec: 20
        },
        {
          id: 5,
          question: "Chuẩn codec âm thanh không dây độ phân giải cao độc quyền của Sony hỗ trợ trên XM5 là gì?",
          options: [
            { id: "A", text: "aptX HD" },
            { id: "B", text: "LDAC" },
            { id: "C", text: "AAC Plus" },
            { id: "D", text: "SBC Ultra" }
          ],
          correct_option_id: "B",
          explanation: "LDAC là công nghệ mã hóa âm thanh độc quyền của Sony, truyền dữ liệu nhiều hơn gấp 3 lần so với Bluetooth SBC thông thường.",
          hint: "Viết tắt của Lossless High-Resolution Audio Codec do Sony phát triển.",
          difficulty: "MEDIUM",
          time_limit_sec: 20
        }
      ]
    }
  },
  {
    id: "ai-revolution-2026",
    name: "Trí Tuệ Nhân Tạo & Công Nghệ AI",
    data: {
      title: "Trí Tuệ Nhân Tạo & Kỷ Nguyên AI",
      summary: "Bộ câu hỏi thú vị về Mô hình ngôn ngữ lớn (LLM), Generative AI và sự phát triển vượt bậc của trí tuệ nhân tạo.",
      questions: [
        {
          id: 1,
          question: "Thuật ngữ 'LLM' trong lĩnh vực AI là viết tắt của từ nào?",
          options: [
            { id: "A", text: "Large Language Model" },
            { id: "B", text: "Logic & Learning Machine" },
            { id: "C", text: "Linear Learning Module" },
            { id: "D", text: "Linked Language Memory" }
          ],
          correct_option_id: "A",
          explanation: "Large Language Model (Mô hình ngôn ngữ lớn) là loại mô hình trí tuệ nhân tạo được huấn luyện trên khối lượng dữ liệu văn bản khổng lồ.",
          hint: "Liên quan đến 'Ngôn ngữ' và 'Kích thước lớn'.",
          difficulty: "EASY",
          time_limit_sec: 15
        },
        {
          id: 2,
          question: "Kiến trúc mạng thần kinh nào ra đời năm 2017 tạo nên bước ngoặt bùng nổ cho GenAI ngày nay?",
          options: [
            { id: "A", text: "CNN (Convolutional Network)" },
            { id: "B", text: "RNN (Recurrent Network)" },
            { id: "C", text: "Transformer" },
            { id: "D", text: "Autoencoder" }
          ],
          correct_option_id: "C",
          explanation: "Kiến trúc Transformer giới thiệu bởi Google năm 2017 với cơ chế Attention (Chú ý) đã cách mạng hóa xử lý ngôn ngữ tự nhiên.",
          hint: "Trùng tên với loạt phim người máy biến hình nổi tiếng!",
          difficulty: "MEDIUM",
          time_limit_sec: 20
        },
        {
          id: 3,
          question: "Hiện tượng AI đưa ra câu trả lời sai hoặc tự bịa ra thông tin không có thật gọi là gì?",
          options: [
            { id: "A", text: "Amnesia (Mất trí nhớ)" },
            { id: "B", text: "Hallucination (Ảo giác)" },
            { id: "C", text: "Overfitting (Quá khớp)" },
            { id: "D", text: "Drifting (Trôi dạt)" }
          ],
          correct_option_id: "B",
          explanation: "Hallucination (Ảo giác AI) mô tả hiện tượng AI tạo ra thông tin trông có vẻ tự tin và hợp lý nhưng hoàn toàn sai sự thật.",
          hint: "Một hiện tượng thị giác/thính giác bất thường ở con người.",
          difficulty: "EASY",
          time_limit_sec: 20
        },
        {
          id: 4,
          question: "Kỹ thuật 'RAG' giúp cải thiện độ chính xác của AI bằng cách kết nối dữ liệu bên ngoài là viết tắt của gì?",
          options: [
            { id: "A", text: "Retrieval-Augmented Generation" },
            { id: "B", text: "Random Algorithmic Guidance" },
            { id: "C", text: "Rapid Automated Generation" },
            { id: "D", text: "Recursive Reasoning Agent" }
          ],
          correct_option_id: "A",
          explanation: "RAG (Retrieval-Augmented Generation) giúp mô hình truy xuất tài liệu nội bộ hoặc dữ liệu mới nhất trước khi tổng hợp câu trả lời.",
          hint: "Gồm từ 'Retrieval' (Truy xuất) và 'Generation' (Tạo).",
          difficulty: "HARD",
          time_limit_sec: 25
        }
      ]
    }
  },
  {
    id: "space-universe",
    name: "Vũ Trụ & Thiên Văn Học",
    data: {
      title: "Hành Trình Khám Phá Vũ Trụ",
      summary: "Khám phá các bí ẩn kỳ thú về Hệ Mặt Trời, ngôi sao và vận tốc ánh sáng qua bộ trắc nghiệm Kahoot hấp dẫn.",
      questions: [
        {
          id: 1,
          question: "Hành tinh nào trong Hệ Mặt Trời được mệnh danh là 'Hành tinh Đỏ'?",
          options: [
            { id: "A", text: "Sao Kim (Venus)" },
            { id: "B", text: "Sao Hỏa (Mars)" },
            { id: "C", text: "Sao Mộc (Jupiter)" },
            { id: "D", text: "Sao Thủy (Mercury)" }
          ],
          correct_option_id: "B",
          explanation: "Sao Hỏa có màu đỏ do bề mặt chứa lượng lớn sắt oxit (gỉ sắt) tạo nên vẻ ngoài đỏ cam rực rỡ.",
          hint: "Tên vị thần chiến tranh trong thần thoại La Mã.",
          difficulty: "EASY",
          time_limit_sec: 15
        },
        {
          id: 2,
          question: "Ánh sáng từ Mặt Trời mất khoảng bao lâu để di chuyển đến Trái Đất?",
          options: [
            { id: "A", text: "8 phút 20 giây" },
            { id: "B", text: "1 giây" },
            { id: "C", text: "1 giờ 15 phút" },
            { id: "D", text: "24 giờ" }
          ],
          correct_option_id: "A",
          explanation: "Với khoảng cách xấp xỉ 150 triệu km và tốc độ ánh sáng ~300.000 km/s, ánh sáng mất khoảng 500 giây (~8 phút 20 giây) để tới Trái Đất.",
          hint: "Ít hơn 10 phút một chút!",
          difficulty: "MEDIUM",
          time_limit_sec: 20
        },
        {
          id: 3,
          question: "Kính thiên văn không gian hàng đầu thế giới được phóng năm 2021 thay thế cho Hubble có tên là gì?",
          options: [
            { id: "A", text: "Kepler" },
            { id: "B", text: "James Webb (JWST)" },
            { id: "C", text: "Spitzer" },
            { id: "D", text: "Chandra" }
          ],
          correct_option_id: "B",
          explanation: "Kính thiên văn James Webb (JWST) quan sát ở dải sóng hồng ngoại, giúp chụp những bức ảnh vũ trụ sâu chưa từng có.",
          hint: "Đặt theo tên vị quản trị viên thứ 2 của NASA.",
          difficulty: "EASY",
          time_limit_sec: 15
        }
      ]
    }
  }
];
