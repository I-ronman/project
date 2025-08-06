import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import PageWrapper from '../layouts/PageWrapper';
import PostureFeedbackPage from './PostureFeedbackPage';
import '../styles/RecordsPage.css';

registerLocale('ko', ko);

const dummyRecords = [
  { id: 1, date: '2025-08-12', type: 'routine', title: '루틴 B', exercises: ['런지', '버피'] },
  { id: 2, date: '2025-08-11', type: 'individual', exercises: ['플랭크', '푸쉬업'] },
  { id: 3, date: '2025-08-10', type: 'routine', title: '루틴 A', exercises: ['스쿼트', '푸쉬업', '플랭크'] },
];

const RecordsPage = () => {
  const navigate = useNavigate();
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [allRecords] = useState([...dummyRecords].sort((a, b) => b.date.localeCompare(a.date)));
  const [records, setRecords] = useState(allRecords);
  const [feedbackRecordId, setFeedbackRecordId] = useState(null);
  const [expandedRecords, setExpandedRecords] = useState({});

  const onSearch = () => {
    if (!startDate || !endDate) {
      setRecords(allRecords);
      return;
    }
    setRecords(
      allRecords.filter(r => {
        const d = new Date(r.date);
        return d >= startDate && d <= endDate;
      })
    );
  };

  const goStats = () => {
    navigate('/statistics', { state: { startDate, endDate } });
  };

  const closeFeedback = () => setFeedbackRecordId(null);

  const toggleExpand = id => {
    setExpandedRecords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageWrapper>
      <div className="records-container">
        <h2 className="records-title">운동 기록 확인</h2>

        <div className="records-date-range">
          <div className="records-date-input">
            <FaCalendarAlt className="icon" />
            <DatePicker
              locale="ko"
              dateFormat="yyyy.MM.dd"
              placeholderText="시작일"
              selected={startDate}
              onChange={date => {
                setStartDate(date);
                if (!endDate) {
                  setTimeout(() => endPickerRef.current.setOpen(true), 200);
                }
              }}
              className="records-date-picker-input"
              ref={startPickerRef}
            />
          </div>
          <span className="tilde">~</span>
          <div className="records-date-input">
            <FaCalendarAlt className="icon" />
            <DatePicker
              locale="ko"
              dateFormat="yyyy.MM.dd"
              placeholderText="종료일"
              selected={endDate}
              onChange={date => setEndDate(date)}
              onFocus={() => {
                if (!startDate) {
                  startPickerRef.current.setOpen(true);
                } else {
                  endPickerRef.current.setOpen(true);
                }
              }}
              className="records-date-picker-input"
              ref={endPickerRef}
            />
          </div>
          <button className="records-btn-search" onClick={onSearch}>검색</button>
          <button className="records-btn-stat" onClick={goStats}>통계 확인</button>
        </div>

        <div className="records-list">
          {records.length ? (
            records.map(rec => (
              <div key={rec.id} className="record-item">
                <div className="record-header">
                  <span className="record-date">{rec.date}</span>
                  <button className="btn-feedback" onClick={() => setFeedbackRecordId(rec.id)}>상세보기</button>
                </div>
                <div className="record-body">
                  {rec.type === 'routine' && (
                    <button className="routine-toggle" onClick={() => toggleExpand(rec.id)}>
                      {expandedRecords[rec.id] ? '▼' : '▶'}
                    </button>
                  )}
                  {rec.type === 'routine'
                    ? <span className="routine-label">{rec.title}</span>
                    : <span className="indiv-label">{rec.exercises.join(', ')}</span>
                  }
                </div>
                {rec.type === 'routine' && expandedRecords[rec.id] && (
                  <ul className="exercise-list">
                    {rec.exercises.map((ex, i) => <li key={i}>{ex}</li>)}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="no-records">해당 기간의 기록이 없습니다.</p>
          )}
        </div>
      </div>

      {feedbackRecordId != null && (
        <div className="modal-backdrop" onClick={closeFeedback}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeFeedback}>×</button>
            <PostureFeedbackPage recordId={feedbackRecordId} />
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default RecordsPage;
