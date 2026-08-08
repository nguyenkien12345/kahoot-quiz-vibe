import { QuizData, ValidationResult, OptionId } from "../types";

export function validateQuizJson(jsonString: string): ValidationResult {
  if (!jsonString || !jsonString.trim()) {
    return { isValid: false, error: "Dữ liệu JSON không được để trống." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      isValid: false,
      error: `Cú pháp JSON không hợp lệ: ${message}`
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: false,
      error: "Cấu trúc JSON phải là một đối tượng (Object) chứa 'title', 'summary' và 'questions'."
    };
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.title !== "string" || !obj.title.trim()) {
    return {
      isValid: false,
      error: "Trường 'title' bị thiếu hoặc không phải là chuỗi ký tự."
    };
  }

  if (typeof obj.summary !== "string") {
    return {
      isValid: false,
      error: "Trường 'summary' bị thiếu hoặc không phải là chuỗi ký tự."
    };
  }

  if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
    return {
      isValid: false,
      error: "Trường 'questions' phải là một mảng danh sách câu hỏi và phải chứa ít nhất 1 câu hỏi."
    };
  }

  const validOptionIds: OptionId[] = ["A", "B", "C", "D"];

  for (let i = 0; i < obj.questions.length; i++) {
    const q = obj.questions[i];
    const qIndexStr = `Câu hỏi #${i + 1}`;

    if (typeof q !== "object" || q === null) {
      return {
        isValid: false,
        error: `${qIndexStr} không đúng định dạng đối tượng.`
      };
    }

    const qObj = q as Record<string, unknown>;

    if (typeof qObj.question !== "string" || !qObj.question.trim()) {
      return {
        isValid: false,
        error: `${qIndexStr}: Nội dung 'question' bị thiếu hoặc trống.`
      };
    }

    if (!Array.isArray(qObj.options) || qObj.options.length !== 4) {
      return {
        isValid: false,
        error: `${qIndexStr}: 'options' phải chứa đúng 4 lựa chọn (A, B, C, D).`
      };
    }

    const seenIds = new Set<string>();
    for (let optIdx = 0; optIdx < qObj.options.length; optIdx++) {
      const opt = qObj.options[optIdx];
      if (typeof opt !== "object" || opt === null) {
        return {
          isValid: false,
          error: `${qIndexStr}, lựa chọn thứ ${optIdx + 1}: Định dạng lựa chọn không hợp lệ.`
        };
      }

      const optObj = opt as Record<string, unknown>;
      const optId = String(optObj.id);

      if (!validOptionIds.includes(optId as OptionId)) {
        return {
          isValid: false,
          error: `${qIndexStr}: Định danh Lựa chọn 'id' phải là một trong các giá trị ['A', 'B', 'C', 'D']. Nhận được: '${optId}'.`
        };
      }

      if (seenIds.has(optId)) {
        return {
          isValid: false,
          error: `${qIndexStr}: Phát hiện trùng lặp lựa chọn 'id' '${optId}'.`
        };
      }
      seenIds.add(optId);

      if (typeof optObj.text !== "string" || !optObj.text.trim()) {
        return {
          isValid: false,
          error: `${qIndexStr}, lựa chọn ${optId}: Nội dung 'text' không được để trống.`
        };
      }
    }

    const correctId = String(qObj.correct_option_id);
    if (!validOptionIds.includes(correctId as OptionId)) {
      return {
        isValid: false,
        error: `${qIndexStr}: 'correct_option_id' phải là 'A', 'B', 'C' hoặc 'D'. Nhận được: '${correctId}'.`
      };
    }

    if (typeof qObj.explanation !== "string" || !qObj.explanation.trim()) {
      return {
        isValid: false,
        error: `${qIndexStr}: 'explanation' (giải thích) không được để trống.`
      };
    }

    // Optional fields sanitize
    if (qObj.time_limit_sec !== undefined && qObj.time_limit_sec !== null) {
      const sec = Number(qObj.time_limit_sec);
      if (isNaN(sec) || sec < 5 || sec > 180) {
        qObj.time_limit_sec = 20; // fallback to default safe value
      }
    } else {
      qObj.time_limit_sec = 20;
    }

    if (!qObj.difficulty || !["EASY", "MEDIUM", "HARD"].includes(String(qObj.difficulty))) {
      qObj.difficulty = "MEDIUM";
    }

    if (!qObj.id) {
      qObj.id = i + 1;
    }
  }

  return {
    isValid: true,
    quizData: parsed as QuizData
  };
}

export function formatJsonString(data: object): string {
  return JSON.stringify(data, null, 2);
}
