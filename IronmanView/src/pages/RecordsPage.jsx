// project/IronmanView/src/pages/RecordsPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecordsPage.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const RecordsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:329/api/records', { withCredentials: true })
      .then(res => {
        // 백엔드에서 [{ id, date, detail }, …] 형태로 받는다고 가정
        setRecords(res.data);
      })
      .catch(() => {
        // 실패 시 더미 유지 or 에러 처리
      });
  }, []);

  return (
    <div className="records-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로</button>
      <h2>운동 기록 확인</h2>
      {records.length === 0
        ? <p className="no-records">등록된 운동 기록이 없습니다.</p>
        : (
          <ul className="records-list">
            {records.map(r => (
              <li key={r.id} className="record-item">
                <span className="record-date">{r.date}</span>
                <span className="record-detail">{r.detail}</span>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
};

export default RecordsPage;
