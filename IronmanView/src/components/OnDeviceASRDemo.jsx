import { useState, useMemo } from 'react';
import useOnDeviceASR from '../hooks/useOnDeviceASR.js';
import { createWhisperAdapter } from '../lib/whisperAdapter.js';

export default function OnDeviceASRDemo() {
  const [interim, setInterim] = useState('');
  const [finals, setFinals] = useState([]);

  const runWhisper = useMemo(() => createWhisperAdapter(), []);
  const { ready, running, start, stop } = useOnDeviceASR({
    runWhisper,
    onPartial: ({ text }) => {
      console.log("[COMP] partial raw =",JSON.stringify(text));
      setInterim(text);
    },
    onFinal:   ({ text }) => {
      console.log('[COMP] final raw   =', JSON.stringify(text))
      if (!text) return;
      setFinals(prev => [...prev, text]);
      setInterim('');
      console.log("파이널호출")
      console.log(text)
    }
  });

  return (
    <div style={{ padding: 16 }}>
      <h3>온디바이스 음성 인식(브라우저)</h3>
      <div>상태: {ready ? '모델 로드 완료' : '로딩 중...'}</div>
      <div style={{ marginTop: 8 }}>
        {!running
          ? <button disabled={!ready || running} onClick={()=>{console.log('[UI] start clicked'); start(); }}>마이크 시작</button>
          : <button onClick={() => { console.log('[UI] stop clicked'); stop(); }}>중지</button>}
      </div>

      <div style={{ marginTop: 16, opacity: 0.6 }}>
        실시간: {interim}
      </div>
      <div style={{ marginTop: 8 }}>
        {finals.map((t,i)=><div key={i}>• {t}</div>)}
      </div>
    </div>
  );
}
