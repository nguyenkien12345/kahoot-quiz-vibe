/**
 * Factory function tạo ra SoundEngine với closure encapsulation.
 * Giúp đóng gói hoàn toàn state nội bộ (ctx, isMuted, bgOscillator,...)
 * không bị rò rỉ ra ngoài module scope dưới dạng biến 'let' toàn cục.
 */
const createSoundEngine = () => {
  let ctx: AudioContext | null = null; // Instance duy nhất của AudioContext (môi trường xử lý âm thanh chính của Web Audio API)
  let isMuted: boolean = false; // Theo dõi trạng thái bật/tắt âm thanh của SoundEngine
  let bgOscillator: OscillatorNode | null = null; //  Node nguồn phát sóng âm riêng cho nhạc nền (Background Music). OscillatorNode dùng để tạo âm thanh cho nhạc nền
  let bgGain: GainNode | null = null; //  Node điều chỉnh volume cho nhạc nền (Background Music)
  let isBgPlaying: boolean = false; // Theo dõi xem nhạc nền có đang chạy hay không để tránh bật đè lên nhau

  const initCtx = (): AudioContext | null => {
    if (!ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx();
    }

    // "suspended":	AudioContext đang tạm dừng, không xử lý/phát âm thanh
    // "running":	AudioContext đang hoạt động bình thường
    // "closed":	AudioContext đã đóng hoàn toàn, không thể tiếp tục sử dụng
    if (ctx && ctx.state === "suspended") {
      // Browser có thể không cho phép Web Audio phát âm thanh ngay khi trang vừa load nếu chưa có interaction của người dùng

      // Xử lý Autoplay Policy:
      // Trình duyệt có thể tạm dừng AudioContext để ngăn âm thanh tự động phát
      // Gọi resume() để tiếp tục AudioContext, đặc biệt khi hàm này được gọi
      // trong ngữ cảnh có user gesture (ví dụ: click hoặc interaction của người dùng)
      ctx.resume();
    }
    return ctx;
  };

  const withAudioContext = (
    callback: (audioCtx: AudioContext) => void,
  ) => {
    if (isMuted) return;

    try {
      const audioCtx = initCtx();
      if (!audioCtx) return;

      callback(audioCtx);
    } catch {
      // Ignore audio playback errors.
    }
  };

  const playTone = (
    audioCtx: AudioContext,
    {
      type,
      frequency,
      startTime,
      duration,
      volume,
      endFrequency,
    }: {
      type: OscillatorType;
      frequency: number;
      startTime: number;
      duration: number;
      volume: number;
      endFrequency?: number;
    },
  ) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Cấu hình waveform và tần số ban đầu.
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    // Nếu có endFrequency, thay đổi tần số tuyến tính trong suốt duration.
    if (endFrequency !== undefined) {
      osc.frequency.linearRampToValueAtTime(
        endFrequency,
        startTime + duration,
      );
    }

    // Thiết lập volume và fade out.
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      startTime + duration,
    );

    // Xây dựng Audio Graph: Oscillator → Gain → Speaker.
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // Bắt đầu và kết thúc oscillator theo thời gian đã định.
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const stopBgMusic = () => {
    if (bgOscillator) {
      try {
        // Dừng OscillatorNode đang phát nhạc nền
        bgOscillator.stop();

        // Ngắt OscillatorNode khỏi Audio Graph để cleanup resource
        bgOscillator.disconnect();
      } catch {
        // Bỏ qua lỗi nếu OscillatorNode đã được stop hoặc disconnect trước đó
      }

      // Xóa reference đến OscillatorNode đã dừng.
      // Cho phép startBgMusic() tạo một OscillatorNode mới khi cần
      bgOscillator = null;
    }

    // Cập nhật trạng thái: background music hiện không còn phát
    isBgPlaying = false;
  };

  return {
    setMuted: (muted: boolean) => {
      // 1. Lưu trạng thái mute mới
      isMuted = muted;

      // 2. Nếu vừa mute trong lúc nhạc nền đang chạy,
      //    thì dừng nhạc nền ngay lập tức
      if (muted && isBgPlaying) {
        stopBgMusic();
      }
    },

    playTick: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } catch {
        // Audio context policy blocked or not supported
      }
    },

    playWarningTick: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch { }
    },

    playCorrect: () => {
      withAudioContext((audioCtx) => {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        const startTime = audioCtx.currentTime;

        notes.forEach((frequency, idx) => {
          playTone(audioCtx, {
            type: "triangle",
            frequency,
            startTime: startTime + idx * 0.08,
            duration: 0.3,
            volume: 0.25,
          });
        });
      });
    },

    playWrong: () => {
      withAudioContext((audioCtx) => {
        playTone(audioCtx, {
          type: "sawtooth",
          frequency: 180,
          startTime: audioCtx.currentTime,
          duration: 0.35,
          volume: 0.3,
          endFrequency: 110,
        });
      });
    },

    playFanfare: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const arpeggiated = [
          { f: 523.25, t: 0 },
          { f: 659.25, t: 0.12 },
          { f: 783.99, t: 0.24 },
          { f: 1046.5, t: 0.36 },
          { f: 880.0, t: 0.5 },
          { f: 1046.5, t: 0.65 }
        ];

        arpeggiated.forEach((note) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(note.f, audioCtx.currentTime + note.t);

          gain.gain.setValueAtTime(0.2, audioCtx.currentTime + note.t);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.t + 0.4);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + note.t);
          osc.stop(audioCtx.currentTime + note.t + 0.4);
        });
      } catch { }
    },

    startBgMusic: () => {
      // Không phát nhạc nếu đang mute hoặc background music đã chạy
      if (isMuted || isBgPlaying) return;

      try {
        // Khởi tạo hoặc lấy AudioContext hiện tại
        const audioCtx = initCtx();
        if (!audioCtx) return;

        // Oscillator có nhiệm vụ tạo ra waveform liên tục (tạo sóng âm)
        // Gain dùng để điều chỉnh mức âm lượng/amplitude (biên độ).

        // Tạo nguồn âm thanh và node điều chỉnh âm lượng cho nhạc nền
        bgOscillator = audioCtx.createOscillator();
        bgGain = audioCtx.createGain();

        // - Tạo âm thanh nền dạng sine wave với tần số 220 Hz
        // - sine: Âm thanh tương đối mềm, đơn giản
        // - oscillator tạo ra khoảng 220 dao động/giây (trầm) (220 Hz tương ứng với nốt A3 trong hệ thống tuning chuẩn). Quan trọng đây không phải một bài nhạc hoàn chỉnh. Nó chỉ là một tone liên tục
        bgOscillator.type = "sine";
        bgOscillator.frequency.setValueAtTime(220, audioCtx.currentTime);

        // Đặt âm lượng nhạc nền ở mức rất thấp để không lấn át sound effects
        // 0.03 là mức gain khá thấp, khoảng 3% theo giá trị gain tuyến tính
        bgGain.gain.setValueAtTime(0.03, audioCtx.currentTime);

        // Xây dựng Audio Graph: Oscillator → Gain → Speaker (Oscillator tạo âm thanh và truyền tín hiệu sang GainNode)
        bgOscillator.connect(bgGain);

        // audioCtx.destination chính là audio output cuối cùng, thường là speaker/headphone của người dùng
        bgGain.connect(audioCtx.destination);

        // Bắt đầu phát nhạc nền và cập nhật trạng thái
        bgOscillator.start();
        isBgPlaying = true;
      } catch {
        // Bỏ qua lỗi nếu trình duyệt không thể khởi tạo hoặc phát âm thanh
      }
    },

    stopBgMusic
  };
};

export const sound = createSoundEngine();
