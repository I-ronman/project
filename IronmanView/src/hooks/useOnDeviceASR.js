// src/hooks/useOnDeviceASR.js
import { useEffect, useRef, useState } from 'react';

// ====== 디버그 스위치 ======
const DEBUG_FORCE_PARTIAL = true;  // ✅ 콜백 파이프 확인용: 주기적으로 partial 방출
const CALL_TIMEOUT_MS = 8000;      // ✅ runWhisper 타임아웃(멈춤 진단)

// VAD: RMS/MSE 계산
function vadMeasure(frame) {
  let sum = 0;
  for (let i = 0; i < frame.length; i++) sum += frame[i] * frame[i];
  const mse = sum / frame.length;
  const rms = Math.sqrt(mse);
  return { rms, mse };
}

export default function useOnDeviceASR({ onPartial, onFinal, runWhisper }) {
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);

  // 오디오/워크렛
  const audioCtxRef = useRef(null);
  const workletNodeRef = useRef(null);
  const streamRef = useRef(null);

  // 버퍼
  const chunkMs = 200;
  const frameSize = Math.round(16000 * (chunkMs / 1000)); // 3200
  const windowMs = 1200;
  const windowSize = Math.round(16000 * (windowMs / 1000)); // 19200

  const frameBufRef = useRef(new Float32Array(0));
  const windowRef = useRef(new Float32Array(0));

  // VAD/상태
  const vadThresholdRef = useRef(0.00005);   // mse 임계값
  const calibratingRef = useRef(true);
  const calibSamplesRef = useRef(0);

  const lastSpeechTsRef = useRef(0);
  const lastFinalAtRef = useRef(0);
  const speechFramesMsRef = useRef(0);
  const silenceFramesMsRef = useRef(0);
  const spokeSinceLastFinalRef = useRef(false);
  const partialDebounceRef = useRef(null);
  const partialTickerRef = useRef(null);     // ✅ 디버그용 주기 타이머

  // 모델 warmup (최대 60s 대기)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        console.time('whisper-warmup');
        const p = runWhisper({ type: 'warmup' });
        const withTimeout = Promise.race([
          p,
          new Promise((_, rej) => setTimeout(() => rej(new Error('warmup-timeout(60s)')), 60000))
        ]);
        await withTimeout;
        console.timeEnd('whisper-warmup');
        if (!cancelled) { console.log('[HOOK] warmup done -> ready=true'); setReady(true); }
      } catch (e) {
        console.error('[INIT] Whisper init error:', e);
      }
    })();
    return () => { cancelled = true; };
  }, [runWhisper]);

  const start = async () => {
    if (!ready || running) return;
    console.log('[HOOK] start() called');

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    await audioCtx.audioWorklet.addModule('/worklets/pcm-recorder.js');
    console.log('[HOOK] worklet loaded');
    const src = audioCtx.createMediaStreamSource(stream);

    const workletNode = new AudioWorkletNode(audioCtx, 'pcm-recorder', { numberOfInputs: 1, numberOfOutputs: 0 });
    workletNodeRef.current = workletNode;
    workletNode.port.onmessage = (ev) => onPCM(ev.data);
    console.log('[HOOK] worklet connected');
    src.connect(workletNode);

    // 상태 초기화
    frameBufRef.current = new Float32Array(0);
    windowRef.current = new Float32Array(0);
    calibratingRef.current = true;
    calibSamplesRef.current = 0;
    speechFramesMsRef.current = 0;
    silenceFramesMsRef.current = 0;
    spokeSinceLastFinalRef.current = false;

    // ✅ 디버그: partial 강제 방출(파이프 확인)
    if (DEBUG_FORCE_PARTIAL) {
      partialTickerRef.current = setInterval(() => {
        if (!running) return;
        emitPartial(true); // force = true → 길이 체크 무시
      }, 600);
    }

    setRunning(true);
    console.log('[HOOK] running=true');
    // 🔎 콜백 배선 체크: 시작 직후 1회 강제 호출
    setTimeout(() => {
        console.log('[HOOK] fire TEST onPartial/onFinal');
        try { onPartial?.({ text: '[TEST] onPartial wiring OK' }); } catch (e) { console.error('onPartial error', e); }
        try { onFinal?.({ text:  '[TEST] onFinal wiring OK'  }); } catch (e) { console.error('onFinal error',  e); }
    }, 100);   
  };

  const stop = () => {
    setRunning(false);
    try { workletNodeRef.current?.disconnect(); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    streamRef.current?.getTracks().forEach(t => t.stop());
    workletNodeRef.current = null;
    audioCtxRef.current = null;
    streamRef.current = null;
    if (partialDebounceRef.current) { clearTimeout(partialDebounceRef.current); partialDebounceRef.current = null; }
    if (partialTickerRef.current)   { clearInterval(partialTickerRef.current); partialTickerRef.current = null; }
  };

  const onPCM = (float32) => {
    if (!onPCM._seen) { console.log('[HOOK] first PCM chunk:', float32.length); onPCM._seen = true; }
    const merged = new Float32Array(frameBufRef.current.length + float32.length);
    merged.set(frameBufRef.current, 0);
    merged.set(float32, frameBufRef.current.length);
    let offset = 0;
    while (offset + frameSize <= merged.length) {
      const frame = merged.subarray(offset, offset + frameSize);
      handleFrame(frame);
      offset += frameSize;
    }
    frameBufRef.current = merged.subarray(offset);
  };

  const handleFrame = (frame) => {
    const now = performance.now();

    // 캘리브레이션(~1s)
    if (calibratingRef.current) {
      const { rms } = vadMeasure(frame);
      calibSamplesRef.current += 1;
      const alpha = 1 / calibSamplesRef.current;
      const currentMSE = rms * rms;
      vadThresholdRef.current = vadThresholdRef.current * (1 - alpha) + currentMSE * alpha;
      if ((calibSamplesRef.current * chunkMs) >= 1000) {
        vadThresholdRef.current = Math.min(0.0008, Math.max(0.00005, vadThresholdRef.current * 2));
        calibratingRef.current = false;
        console.log('[VAD] calibrated threshold(mse) =', vadThresholdRef.current.toExponential(2));
      }
    }

    // VAD
    const { mse } = vadMeasure(frame);
    const speech = mse > (vadThresholdRef.current || 0.00005);

    if (speech) {
      lastSpeechTsRef.current = now;
      spokeSinceLastFinalRef.current = true;
      speechFramesMsRef.current += chunkMs;
      silenceFramesMsRef.current = 0;
    } else {
      silenceFramesMsRef.current += chunkMs;
    }

    // 슬라이딩 윈도우
    const win = windowRef.current;
    const next = new Float32Array(Math.min(win.length + frame.length, windowSize));
    if (win.length + frame.length <= windowSize) {
      next.set(win, 0); next.set(frame, win.length);
    } else {
      const drop = win.length + frame.length - windowSize;
      next.set(win.subarray(drop), 0); next.set(frame, windowSize - frame.length);
    }
    windowRef.current = next;

    // (원래 로직) 말하는 중 partial 300ms 디바운스 — 디버그 중엔 주기 방출이 있으므로 유지/무시 둘 다 무방
    if (!DEBUG_FORCE_PARTIAL && speech) {
      if (!partialDebounceRef.current) {
        partialDebounceRef.current = setTimeout(async () => {
          partialDebounceRef.current = null;
          await emitPartial();
        }, 300);
      }
    }

    // final 트리거
    const minSpeechMs = 300;
    const silenceMs = 700;
    const minFinalInterval = 1000;
    const enoughWindow = next.length > 3200;

    if (spokeSinceLastFinalRef.current &&
        speechFramesMsRef.current >= minSpeechMs &&
        silenceFramesMsRef.current >= silenceMs &&
        enoughWindow &&
        (now - lastFinalAtRef.current) >= minFinalInterval) {
      if (partialDebounceRef.current) { clearTimeout(partialDebounceRef.current); partialDebounceRef.current = null; }
      emitFinal(true); // 디버그: 강제 방출
      windowRef.current = new Float32Array(0);
      spokeSinceLastFinalRef.current = false;
      speechFramesMsRef.current = 0;
      silenceFramesMsRef.current = 0;
      lastFinalAtRef.current = now;
    }
  };

  // ===== runWhisper 호출 래핑 (타임아웃/에러도 콜백으로 보냄) =====
  const callWithTimeout = async (args) => {
    try {
      const res = await Promise.race([
        runWhisper(args),
        new Promise((_, rej) => setTimeout(() => rej(new Error('call-timeout')), CALL_TIMEOUT_MS))
      ]);
      return { ok: true, text: (res ?? '') };
    } catch (e) {
      console.error('[ASR CALL ERROR]', e);
      return { ok: false, text: '' };
    }
  };

  const emitPartial = async (force = false) => {
    if (!running) return;
    if (!force && windowRef.current.length < 3200) return;

    const { ok, text } = await callWithTimeout({
      type: 'stream',
      pcm16k: windowRef.current,
      mode: 'partial'
    });

    // ✅ 반드시 콜백 호출 (비어도)
    onPartial?.({ text: text });
    if (!ok) console.warn('[partial] asr call failed/timeout');
    console.log('[HOOK] calling onPartial, typeof =', typeof onPartial, 'text.len=', (text||'').length);
    try { onPartial?.({ text: text ?? '' }); } catch (e) { console.error('onPartial error', e); }
  };

  const emitFinal = async (force = false) => {
    if (!running) return;
    if (!force && windowRef.current.length < 3200) return;

    const { ok, text } = await callWithTimeout({
      type: 'stream',
      pcm16k: windowRef.current,
      mode: 'final'
    });

    console.log('[HOOK] calling onFinal, typeof =', typeof onFinal, 'text.len=', (text||'').length);
    try { onFinal?.({ text: text ?? '' }); } catch (e) { console.error('onFinal error', e); }
    if (!ok) console.warn('[final] asr call failed/timeout');
  };

  return { ready, running, start, stop };
}
