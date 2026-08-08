import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini API client
  const getGeminiAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  };

  // API Endpoint to auto-generate Kahoot Quiz JSON matching user's exact schema
  app.post("/api/generate-quiz", async (req, res) => {
    try {
      const { topic, text, numQuestions = 5 } = req.body;

      if (!topic && !text) {
        return res.status(400).json({
          error: "Vui lòng nhập tên sản phẩm, bài viết hoặc chủ đề cần tạo Quiz."
        });
      }

      const ai = getGeminiAi();

      const promptText = `
Bạn là một chuyên gia sáng tạo nội dung Quiz trắc nghiệm phong cách Kahoot hấp dẫn, kịch tính và thu hút người chơi.
Hãy tạo một bộ câu hỏi trắc nghiệm bằng tiếng Việt theo yêu cầu sau:

Tên sản phẩm / Chủ đề / Bài viết: ${topic || "Sản phẩm/Bài viết được cung cấp"}
Nội dung chi tiết (nếu có): ${text || "Hãy tự suy luận thông tin nổi bật nhất về chủ đề này."}
Số lượng câu hỏi cần tạo: ${numQuestions} câu.

YÊU CẦU ĐỊNH DẠNG BẮT BUỘC (STRICT JSON SCHEMA):
Trả về đối tượng JSON khớp CHÍNH XÁC cấu trúc sau:
{
  "title": "Tên sản phẩm hoặc tiêu đề bài viết",
  "summary": "Tóm tắt ngắn gọn 1-3 câu về điểm nổi bật",
  "questions": [
    {
      "id": 1,
      "question": "Câu hỏi giật gân, ngắn gọn, hấp dẫn kiểu Kahoot",
      "options": [
        { "id": "A", "text": "Phương án A" },
        { "id": "B", "text": "Phương án B" },
        { "id": "C", "text": "Phương án C" },
        { "id": "D", "text": "Phương án D" }
      ],
      "correct_option_id": "A", // Chỉ nhận A, B, C hoặc D
      "explanation": "Giải thích ngắn gọn tại sao đáp án này đúng",
      "hint": "Gợi ý cho câu hỏi (nếu có)",
      "difficulty": "EASY", // Chỉ nhận "EASY", "MEDIUM", hoặc "HARD"
      "time_limit_sec": 20 // Số giây làm bài (từ 10 đến 60)
    }
  ]
}

LƯU Ý QUAN TRỌNG:
1. Mỗi câu hỏi BẮT BUỘC phải có đúng 4 phương án A, B, C, D.
2. 'correct_option_id' chỉ được mang giá trị "A", "B", "C" hoặc "D".
3. 'id' của câu hỏi đánh số từ 1, 2, 3...
4. Câu hỏi và các đáp án phải cô đọng, dễ đọc nhanh trên màn hình di động.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING, enum: ["A", "B", "C", "D"] },
                          text: { type: Type.STRING }
                        },
                        required: ["id", "text"]
                      }
                    },
                    correct_option_id: { type: Type.STRING, enum: ["A", "B", "C", "D"] },
                    explanation: { type: Type.STRING },
                    hint: { type: Type.STRING, nullable: true },
                    difficulty: { type: Type.STRING, enum: ["EASY", "MEDIUM", "HARD"] },
                    time_limit_sec: { type: Type.INTEGER }
                  },
                  required: ["id", "question", "options", "correct_option_id", "explanation"]
                }
              }
            },
            required: ["title", "summary", "questions"]
          }
        }
      });

      const jsonString = response.text?.trim() || "";
      const parsedData = JSON.parse(jsonString);

      return res.json({
        success: true,
        data: parsedData,
        rawJson: jsonString
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error generating quiz:", errorMessage);
      return res.status(500).json({
        error: "Không thể tạo Quiz bằng AI. Vui lòng kiểm tra lại GEMINI_API_KEY hoặc thử lại sau.",
        details: errorMessage
      });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite Dev Server or Production Static Files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kahoot Quiz Master Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
