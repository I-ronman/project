class PCMRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._tmp = [];
    // 기본 샘플레이트(대부분 48kHz). 실제 값은 sampleRate로 읽힘.
    this.inRate = sampleRate;
    this.outRate = 16000;
    this.ratio = this.inRate / this.outRate;
    this._acc = 0;
  }

  // 단순 선형 리샘플링(실시간성 우선)
  _resampleTo16k(ch0) {
    const out = [];
    for (let i = 0; i < ch0.length; i++) {
      this._tmp.push(ch0[i]);
    }
    // 누적 버퍼에서 16k 등간격으로 샘플 추출
    while (this._acc + this.ratio < this._tmp.length) {
      const idx = Math.floor(this._acc);
      const frac = this._acc - idx;
      const s0 = this._tmp[idx];
      const s1 = this._tmp[idx + 1] ?? s0;
      out.push(s0 + (s1 - s0) * frac);
      this._acc += this.ratio;
    }
    // 사용한 앞부분은 버림
    const keepFrom = Math.floor(this._acc);
    this._tmp = this._tmp.slice(keepFrom);
    this._acc -= keepFrom;
    return out;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const ch0 = input[0]; // mono 가정(스테레오면 ch0만 사용)
    const resampled = this._resampleTo16k(ch0);
    if (resampled.length > 0) {
      this.port.postMessage(new Float32Array(resampled));
    }
    return true; // 계속 동작
  }
}
registerProcessor('pcm-recorder', PCMRecorderProcessor);
