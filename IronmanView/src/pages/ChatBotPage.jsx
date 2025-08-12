// project/IronmanView/src/pages/ChatBotPage.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatBotPage.css';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

/* ===================== 보조 함수 ===================== */
// 응답 어디에 JSON이 와도 추출
function extractRoutinePayload(data) {
  const candidates = [];
  if (Array.isArray(data?.result)) candidates.push(...data.result);
  candidates.push(data, data?.text, data?.message, data?.payload);

  for (const c of candidates) {
    if (!c) continue;

    if (typeof c === 'object') {
      if (c['루틴 이름'] || c['루틴의 운동']) return c;
      try {
        const clone = JSON.parse(JSON.stringify(c));
        if (clone['루틴 이름'] || clone['루틴의 운동']) return clone;
      } catch {}
    }

    if (typeof c === 'string') {
      const m = c.match(/{[\s\S]*}/); // {...}
      if (m) {
        try {
          const o = JSON.parse(m[0]);
          if (o['루틴 이름'] || o['루틴의 운동']) return o;
        } catch {}
      }
      const a = c.match(/\[[\s\S]*\]/); // [...]
      if (a) {
        try {
          const arr = JSON.parse(a[0]);
          if (Array.isArray(arr) && arr[0]?.['루틴 이름']) return arr[0];
        } catch {}
      }
    }
  }
  return null;
}

function buildCardFromPayload(payload) {
  const title = payload['루틴 이름'] ?? payload['루틴명'] ?? payload['제목'] ?? '추천 루틴';

  const list =
    payload['루틴의 운동']
    ?? payload['루틴내 운동']
    ?? payload['운동 리스트']
    ?? payload['운동목록']
    ?? [];

  const items = list.map((it) => {
    const name = it['운동 이름'] ?? it['운동이름'] ?? it['name'] ?? '';
    const sets = Number(it['세트 수'] ?? it['세트수'] ?? it['sets'] ?? 0);
    const reps = Number(it['운동 횟수'] ?? it['반복 수'] ?? it['reps'] ?? 0);
    const rest = Number(it['휴식시간'] ?? it['rest'] ?? 0);
    return `${name} ${sets}×${reps} · 휴식 ${rest}초`;
  });
  return { title, items };
}


// payload(한글키) -> 기존 routineData 포맷
function toInt(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }

function mapPayloadToRoutineData(payload, routineId = null, titleOverride = null, summaryOverride = '') {
  const list =
    payload?.['루틴의 운동']
    ?? payload?.['루틴내 운동']
    ?? payload?.['운동 리스트']
    ?? payload?.['운동목록']
    ?? [];

  // 총 시간(분) 계산 (세트당 운동시간+휴식) * 세트 수
  const toInt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const totalSeconds = list.reduce((acc, it) => {
    const sets = toInt(it['세트 수'] ?? it['세트수'] ?? it['sets']);
    const per  = toInt(it['세트당 운동시간'] ?? it['timeSec'] ?? it['exerciseTime']);
    const rest = toInt(it['휴식시간'] ?? it['rest']);
    return acc + sets * (per + rest);
  }, 0);

  return {
    // payload 안에 routineId 있으면 그대로 사용, 없으면 인자로 받은 routineId 사용
    routineId: payload?.routineId ?? routineId ?? null,
    title: titleOverride ?? (payload?.['루틴 이름'] ?? payload?.['루틴명'] ?? '추천 루틴'),
    summary: summaryOverride ?? '',
    exerciseTime: Math.max(1, Math.round(totalSeconds / 60)),
    exercises: list.map((it, idx) => ({
      exerciseId: it['exerciseId'] ?? null,
      part: it['part'] ?? null,
      name: it['운동 이름'] ?? it['운동이름'] ?? it['name'] ?? '',
      sets: toInt(it['세트 수'] ?? it['세트수'] ?? it['sets']),
      reps: toInt(it['운동 횟수'] ?? it['반복 수'] ?? it['reps']),
      exerciseTime: toInt(it['세트당 운동시간'] ?? it['timeSec'] ?? it['exerciseTime']),
      breaktime: toInt(it['휴식시간'] ?? it['rest']),
      sequence: idx + 1,
    })),
  };
}




/* ===================== API ===================== */
const api = axios.create({
  baseURL: 'http://localhost:329/web', // 백엔드 고정
  withCredentials: true,               // 세션이면 true, JWT만 쓰면 false도 가능
});
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
async function saveRoutine(routineData) {
  // 백엔드 저장 엔드포인트 확인: /routine 기준
  const { data } = await api.post('/api/routine/save', routineData);
  return data;
}

/* ===================== 컴포넌트 ===================== */
export default function ChatBotPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([
    { sender: 'bot', type: 'text', text: '안녕하세요. 루틴 생성을 도와드리는 챗봇입니다. 원하시는 목표 체형이 무엇인지 알려주세요.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastRecommendedRoutine, setLastRecommendedRoutine] = useState(null);

  const quickChips = ['운동 루틴 추천', '식단 가이드', '스케줄 수정'];
  const recommendedMessages = [
    '운동 일정은 어떻게 변경할 수 있어?',
    '단백질은 얼마나 섭취해야 해?',
    '운동 루틴 추천해줘'
  ];

  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = (msg) => {
    const content = msg || input.trim();
    if (!content) return;

    setMessages((prev) => [...prev, { sender: 'user', type: 'text', text: content }]);
    setInput('');
    setIsTyping(true);

    fetch('http://localhost:456/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('[CHAT RAW]', data);

        // 1) 텍스트
        const botText =
          (Array.isArray(data?.result) && data.result.find(v => typeof v === 'string')) ||
          data?.text || data?.message || '응답을 불러오지 못했어요.';

        // 2) 추천 루틴 JSON 추출
        const payload = extractRoutinePayload(data);
        console.log('[ROUTINE PAYLOAD]', payload);

        let card = null;
        if (payload) {
          const { title, items } = buildCardFromPayload(payload);
          card = { sender: 'bot', type: 'routineCard', title, meta: '추천 루틴', items };
          setLastRecommendedRoutine(payload);
        }

        setMessages((prev) => [
          ...prev,
          { sender: 'bot', type: 'text', text: botText },
          ...(card ? [card] : []),
        ]);
      })
      .catch((err) => {
        console.error(err);
        setMessages((prev) => [...prev, { sender: 'bot', type: 'text', text: '에러가 발생했어요. 잠시 후 다시 시도해주세요.' }]);
      })
      .finally(() => setIsTyping(false));
  };

  const startToday = () => {
    alert('오늘 루틴 시작!');
  };

const addToRoutine = async () => {
  // 추천 루틴 데이터 체크
  if (
    !lastRecommendedRoutine ||
    !Array.isArray(
      lastRecommendedRoutine['루틴내 운동'] ??
      lastRecommendedRoutine['루틴의 운동'] ??
      lastRecommendedRoutine['운동 리스트'] ??
      lastRecommendedRoutine['운동목록']
    )
  ) {
    alert('저장할 추천 루틴이 없습니다. 먼저 추천을 받아주세요.');
    return;
  }

  try {
    // routineId를 함께 전달해서 null 방지
    const routineData = mapPayloadToRoutineData(
      lastRecommendedRoutine,
      lastRecommendedRoutine?.routineId ?? null
    );

    console.log('[SAVE routineData]', routineData);
    await saveRoutine(routineData);
    alert('추천 루틴을 저장했습니다.');
  } catch (e) {
    console.error(e);
    alert('루틴 저장에 실패했습니다.');
  }
};




  return (
    <PageWrapper>
      <div className="coach-layout">
        {/* 좌측 코치 패널 */}
        <aside className="coach-panel">
          <h3>코치</h3>

          <section className="panel-card">
            <div className="panel-title">오늘 목표</div>
            <ul className="goals">
              <li>하체 루틴 30분</li>
              <li>단백질 120g</li>
            </ul>
            <div className="panel-actions">
              <button className="btn btn-brand" onClick={startToday}>루틴 시작</button>
              <button className="btn" onClick={() => navigate('/schedule')}>주간 계획</button>
            </div>
          </section>

          <section className="panel-card">
            <div className="panel-title">빠른 질문</div>
            <div className="chips">
              {['운동 루틴 추천', '식단 가이드', '스케줄 수정'].map((c) => (
                <button key={c} className="chip" onClick={() => handleSend(c)}>{c}</button>
              ))}
            </div>
          </section>

          <section className="panel-card">
            <div className="panel-title">팁</div>
            <p className="muted">스쿼트는 힙힌지 각도를 먼저 고정하세요.</p>
          </section>
        </aside>

        {/* 우측 대화 피드 */}
        <section className="chat-surface">
          <div className="chat-feed">
            {messages.map((msg, idx) => {
              if (msg.type === 'routineCard') {
                return (
                  <div key={idx} className="bot-card">
                    <div className="card-head">
                      <h4>{msg.title}</h4>
                      <span className="muted">{msg.meta}</span>
                    </div>
                    <ul className="card-list">
                      {msg.items?.map((it, i) => <li key={i}>{it}</li>)}
                    </ul>
                    <div className="card-actions">
                      <button className="btn">미리보기</button>
                      <button className="btn" onClick={addToRoutine}>루틴에 추가</button>
                      <button className="btn btn-brand" onClick={startToday}>오늘 시작</button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className={`bubble ${msg.sender}`} style={{ whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
              );
            })}
            {isTyping && <div className="typing"><i/><i/><i/></div>}
            <div ref={bottomRef} />
          </div>

          {/* 입력 영역 */}
          <div className="composer">
            <div className="quickchips">
              {['운동 일정은 어떻게 변경할 수 있어?', '단백질은 얼마나 섭취해야 해?', '운동 루틴 추천해줘'].map((q) => (
                <button key={q} className="chip" onClick={() => handleSend(q)}>{q}</button>
              ))}
            </div>
            <div className="composer-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="AI 코치에게 무엇이든 물어보세요!"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              />
              <button className="btn btn-brand" onClick={() => handleSend()}>전송</button>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
