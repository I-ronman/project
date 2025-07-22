import React, { useState } from 'react';
import '../styles/ChatBotPage.css';

function ChatBotPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요. 무엇을 도와드릴까요?' }
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

    // 실제 백엔드 연동 준비 (Flask 연동 시)
    fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      })
      .catch((err) => {
        setMessages((prev) => [...prev, { sender: 'bot', text: '에러가 발생했어요.' }]);
        console.error(err);
      });
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <img src="/src/assets/logo.png" alt="로고" className="chat-logo" />
          <h3>챗 봇</h3>
          <button className="chat-exit" onClick={() => navigate('/HomePage')}>나가기</button>
        </div>

        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.sender}`}>
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
    </div>
  );
}

export default ChatBotPage;
