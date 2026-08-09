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
      rampType = "linear",
    }: {
      type: OscillatorType; // Waveform
      frequency: number; // Tần số (đơn vị Hz)
      startTime: number; // Bắt đầu lúc nào (Nó không phải "sau bao nhiêu milliseconds" mà nó là thời điểm tuyệt đối trên AudioContext timeline)
      duration: number; // Kéo dài bao lâu (Thời gian tone tồn tại ví dụ tone kéo dài 300ms)
      volume: number; // Âm lượng (Mức gain ban đầu. Ví dụ volume: 0.25 → GainNode bắt đầu ở mức 0.25)
      endFrequency?: number; // Tần số kết thúc (nếu có thì thay đổi tuyến tính trong suốt duration)
      rampType?: "linear" | "exponential";
    },
  ) => {
    // Oscillator có nhiệm vụ tạo ra waveform liên tục (tạo sóng âm) (tín hiệu âm thanh)
    // Gain dùng để điều chỉnh mức âm lượng/amplitude (biên độ) của tín hiệu, từ đó kiểm soát mức âm thanh

    // Tạo nguồn phát sóng âm (Oscillator) và node điều chỉnh âm lượng (Gain)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // - Đặt dạng sóng (waveform) và tần số ban đầu (frequency Hz)
    // - oscillator tạo ra khoảng frequency dao động/giây
    //   + frequency xác định số chu kỳ dao động mỗi giây, đơn vị là Hz
    //   + Quan trọng đây không phải một bài nhạc hoàn chỉnh. Nó chỉ là một tone liên tục
    //   + Ví dụ: 440 Hz nghĩa là waveform hoàn thành 440 chu kỳ mỗi giây
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    // Nếu có endFrequency, thay đổi tần số tuyến tính trong suốt duration
    if (endFrequency !== undefined) {
      if (rampType === "exponential") {
        osc.frequency.exponentialRampToValueAtTime(
          endFrequency,
          startTime + duration,
        );
      }

      // Ví dụ: bắt đầu ở 180 Hz và giảm dần xuống còn 110 Hz trong duration. Đây chính là hiệu ứng "rơi tone"
      if (rampType === "linear") {
        osc.frequency.linearRampToValueAtTime(
          endFrequency,
          startTime + duration,
        );
      }
    }

    // Thiết lập mức gain ban đầu cho tone
    gain.gain.setValueAtTime(volume, startTime);
    // Fade out. Nếu bạn chỉ gọi osc.stop(); thì âm thanh có thể bị click/pop vì waveform bị cắt đột ngột
    // Thay vào đó: 0.3 giảm dần xuống còn 0.001 → volume giảm dần trước khi oscillator stop
    // 0.001 thay vì 0 cũng là chủ ý. Vì exponential ramp không thể ramp tới 0 theo cách thông thường
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      startTime + duration,
    );

    // Xây dựng Audio Graph: Oscillator → Gain → Speaker (Oscillator tạo âm thanh và truyền tín hiệu sang GainNode)
    osc.connect(gain);
    // audioCtx.destination chính là audio output cuối cùng, thường là speaker/headphone của người dùng
    gain.connect(audioCtx.destination);

    // Bắt đầu và kết thúc oscillator theo thời gian đã định
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
      withAudioContext((audioCtx) => {
        playTone(audioCtx, {
          type: "sine",
          frequency: 800,
          startTime: audioCtx.currentTime,
          duration: 0.05,
          volume: 0.15,
          endFrequency: 400,
          rampType: "exponential"
        });
      });
    },

    playWarningTick: () => {
      withAudioContext((audioCtx) => {
        playTone(audioCtx, {
          type: "square",
          frequency: 1000,
          startTime: audioCtx.currentTime,
          duration: 0.08,
          volume: 0.2,
        });
      });
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
      withAudioContext((audioCtx) => {
        const arpeggiated = [
          { f: 523.25, t: 0 },
          { f: 659.25, t: 0.12 },
          { f: 783.99, t: 0.24 },
          { f: 1046.5, t: 0.36 },
          { f: 880.0, t: 0.5 },
          { f: 1046.5, t: 0.65 }
        ];
        const startTime = audioCtx.currentTime;

        arpeggiated.forEach((note) => {
          playTone(audioCtx, {
            type: "triangle",
            frequency: note.f,
            startTime: startTime + note.t,
            duration: 0.4,
            volume: 0.2,
          });
        });
      });
    },

    startBgMusic: () => {
      // Không phát nhạc nếu đang mute hoặc background music đã chạy
      if (isMuted || isBgPlaying) return;

      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        bgOscillator = audioCtx.createOscillator();
        bgGain = audioCtx.createGain();

        // - sine: Âm thanh tương đối mềm, đơn giản
        // - 220 dao động/giây (trầm) (220 Hz tương ứng với nốt A3 trong hệ thống tuning chuẩn)
        bgOscillator.type = "sine";
        bgOscillator.frequency.setValueAtTime(220, audioCtx.currentTime);

        // Đặt âm lượng nhạc nền ở mức rất thấp để không lấn át sound effects
        // 0.03 là mức gain khá thấp, khoảng 3% theo giá trị gain tuyến tính
        bgGain.gain.setValueAtTime(0.03, audioCtx.currentTime);

        bgOscillator.connect(bgGain);

        bgGain.connect(audioCtx.destination);

        // Bắt đầu phát nhạc nền và cập nhật trạng thái
        bgOscillator.start();
        isBgPlaying = true;
      } catch { }
    },

    stopBgMusic
  };
};

export const sound = createSoundEngine();
