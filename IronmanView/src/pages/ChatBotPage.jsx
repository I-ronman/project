// project/IronmanView/src/pages/ChatBotPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatBotPage.css';
import PageWrapper from '../layouts/PageWrapper';

export default function ChatBotPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { sender: 'bot', type: 'text', text: '안녕하세요. 루틴 생성을 도와드리는 챗봇입니다. 원하시는 목표 체형이 무엇인지 알려주세요.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickChips = ['운동 루틴 추천', '식단 가이드', '스케줄 수정'];
  const recommendedMessages = [
    '운동 일정은 어떻게 변경할 수 있어?',
    '단백질은 얼마나 섭취해야 해?',
    '운동 루틴 추천해줘'
  ];

  // ✅ 스크롤 제어
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
        // 기본 텍스트 응답
        const botText = data?.result[0] || '응답을 불러오지 못했어요.';
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', type: 'text', text: botText },

          // 예시: 카드형 루틴 제안(데모). 서버에서 카드 데이터를 주면 그걸로 대체 가능
          
          {
            sender: 'bot',
            type: 'routineCard',
            title: '초보 하체 루틴 (35분)',
            meta: '난이도 · 초급',
            items: [
              '스쿼트 4×12 · 휴식 60초',
              '런지 3×10 · 휴식 60초',
              '레그 레이즈 3×15 · 휴식 45초',
            ],
          },
        ]);
      })
      .catch((err) => {
        console.error(err);
        setMessages((prev) => [...prev, { sender: 'bot', type: 'text', text: '에러가 발생했어요. 잠시 후 다시 시도해주세요.' }]);
      })
      .finally(() => setIsTyping(false));
  };

  // 카드 CTA (필요 시 API 연동)
  const startToday = () => {
    // TODO: 루틴 시작 API
    alert('오늘 루틴 시작!');
  };
  const addToRoutine = () => {
    // TODO: 루틴에 추가 API
    alert('루틴에 추가되었습니다.');
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
              {quickChips.map((c) => (
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
                <div
                  key={idx}
                  className={`bubble ${msg.sender}`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              );
            })}

            {isTyping && (
              <div className="typing"><i/><i/><i/></div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력 영역 */}
          <div className="composer">
            <div className="quickchips">
              {recommendedMessages.map((q) => (
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
