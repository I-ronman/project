// project/IronmanView/src/pages/ChatBotPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import '../styles/ChatBotPage.css';
import PageWrapper from '../layouts/PageWrapper';

function ChatBotPage() {
  const navigate = useNavigate(); // ✅ 추가

  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요. 루틴 생성을 도와드리는 챗봇입니다. 원하시는 목표 체형이 무엇인지 알려주세요.' },
  ]);
    
  const [input, setInput] = useState('');

  const recommendedMessages = [
    '운동 일정은 어떻게 변경할 수 있어?',
    '단백질은 얼마나 섭취해야 해?',
    '운동 루틴 추천해줘'
  ];

  const handleSend = (msg) => {
    if (!msg) return;
    const newMessages = [...messages, { sender: 'user', text: msg }];
    setMessages(newMessages);
    setInput('');

    fetch('http://localhost:456/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.result }]);
      })
      .catch((err) => {
        setMessages((prev) => [...prev, { sender: 'bot', text: '에러가 발생했어요.' }]);
        console.error(err);
      });
  };

  return (
    <PageWrapper>
      <div className="chat-container">
        

        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.sender}`} style={{ whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-recommend">
          {recommendedMessages.map((rec, i) => (
            <button key={i} className="rec-btn" onClick={() => handleSend(rec)}>
              {rec}
            </button>
          ))}
        </div>
          
        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AI 코치에게 무엇이든 물어보세요!"
          />
          <button onClick={() => handleSend(input)}>전송</button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ChatBotPage;
