// src/lib/whisperAdapter.js
import { pipeline, env } from '@xenova/transformers';

// 성능/호환 설정
env.allowLocalModels = false;     // 로컬에 모델 두지 않을 때
env.allowRemoteModels = true;     // CDN에서 자동 로드
env.backends.onnx.preferredBackend = navigator.gpu ? 'webgpu' : 'wasm'; // WebGPU 우선, 미지원시 WASM
// WASM 성능 옵션(멀티스레드; COEP 설정 시 더 효과적)
env.backends.onnx.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);
// 필요 시 wasm 파일 경로를 지정할 수 있음(기본 CDN 사용)
// env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@3.3.0/dist/';

let asr = null;
let initialized = false;

/**
 * createWhisperAdapter
 * runWhisper({ type:'warmup' | 'stream', pcm16k: Float32Array, mode:'partial'|'final' })
 */
export function createWhisperAdapter() {
  async function initOnce() {
    if (initialized) return;
    console.log('[ASR] init start. backend =', env.backends.onnx.preferredBackend);
    console.time('[ASR] load');
    // 모델 크기/정확도 균형: tiny → base → small … (ko 인식은 tiny/base부터 시작 권장)
    // quantized: 메모리/로딩시간↓
    asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base', {
      quantized: true,
    });
    console.timeEnd('[ASR] load');

    initialized = true;
    console.log('[ASR] ready. backend:', env.backends.onnx.preferredBackend);
  }

  return async function runWhisper({ type, pcm16k, mode }) {
    await initOnce();
    if (type === 'warmup') return true;
    if (!pcm16k || pcm16k.length === 0) return '';

    // transformers.js는 Float32Array(16kHz mono) 직접 입력 가능
    const audio = { audio: pcm16k, sampling_rate: 16000 };

    // 실시간 느낌을 위해 window(≈1.2s)를 그대로 넣어 추론
    // 필요 시 chunk/stride 옵션으로 긴 오디오 스트리밍 가능
    const out = await asr(audio, {
      // mode에 따라 내부 파라미터를 달리할 수도 있음(여기선 동일)
      task: 'transcribe',
      language: 'ko',
      // 아래 두 옵션은 긴 녹음 분할 스트리밍용(현재는 짧은 윈도우 추론이므로 기본값)
      // chunk_length_s: 5,
      // stride_length_s: 1,
      return_timestamps: false,
      // 지연↓ 정확도↓ 절충 파라미터(필요 시 조절)
      // temperature: 0,
      // condition_on_previous_text: false,
    });
    return (out?.text || '').trim();
  };
}
