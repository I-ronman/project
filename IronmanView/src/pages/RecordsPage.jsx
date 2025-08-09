// src/pages/RecordsPage.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import PageWrapper from '../layouts/PageWrapper';
import '../styles/RecordsPage.css';
import { fetchDailyRecords } from '../api/recordsApi';
import { colorForTag } from '../utils/tagColor';
import { AuthContext } from '../context/AuthContext';

registerLocale('ko', ko);

const RecordsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  // 기본 기간: 최근 14일
  const today = useMemo(() => new Date(), []);
  const twoWeeksAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 13);
    d.setHours(0,0,0,0);
    return d;
  }, []);

  const [startDate, setStartDate] = useState(twoWeeksAgo);
  const [endDate, setEndDate] = useState(today);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({}); // 날짜별 상세 토글

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchDailyRecords({
        userId: user?.id ?? 1,
        startDate, endDate
      });
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // 최초 1회

  const onSearch = () => load();

  const goStats = () => {
    navigate('/statistics', { state: { startDate, endDate } });
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
              onChange={(date) => {
                setStartDate(date);
                if (!endDate) setTimeout(() => endPickerRef.current?.setOpen(true), 140);
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
              onChange={(date) => setEndDate(date)}
              onFocus={() => !startDate ? startPickerRef.current?.setOpen(true) : endPickerRef.current?.setOpen(true)}
              className="records-date-picker-input"
              ref={endPickerRef}
            />
          </div>
          <button className="records-btn-search" onClick={onSearch} disabled={loading}>
            {loading ? '불러오는 중…' : '검색'}
          </button>
          <button className="records-btn-stat" onClick={goStats}>통계 확인</button>
        </div>

        <div className="records-list">
          {records.length ? records.map((rec) => {
            const isOpen = expanded[rec.date] ?? true; // 기본 펼침
            return (
              <div key={rec.id} className="record-item">
                {/* 헤더: 날짜 + 총 시간 */}
                <div className="record-header">
                  <div className="record-date">{rec.date}</div>
                  <div className="record-tags">
                    {rec.tags?.map((t,i)=>(
                      <span key={i} className="tag-pill"
                        style={{ background: `${colorForTag(t)}22`, borderColor: colorForTag(t) }}
                      >{t}</span>
                    ))}
                  </div>
                  <div className="record-total">{rec.totalMinutes}분</div>
                </div>

                {/* 본문: (루틴명 / 개별) + 토글 */}
                <div className="record-title-row">
                  <button
                    className="routine-toggle"
                    onClick={() => setExpanded(prev => ({ ...prev, [rec.date]: !isOpen }))}
                    aria-label="상세 토글"
                  >
                    {isOpen ? '▼' : '▶'}
                  </button>
                  <div className="record-title">
                    {rec.type === 'routine' ? (rec.title ?? '루틴') : '개별 운동'}
                  </div>
                </div>

                {/* 상세: 운동별 시간 + 카테고리 */}
                {isOpen && (
                  <div className="entry-table">
                    <div className="entry-head">
                      <div>운동</div>
                      <div>카테고리</div>
                      <div className="ta-right">시간(분)</div>
                    </div>
                    {rec.entries?.map((e, idx) => (
                      <div className="entry-row" key={idx}>
                        <div className="entry-name">{e.name}</div>
                        <div className="entry-cat">
                          <span className="tag-pill" style={{ background: `${colorForTag('#'+e.category)}22`, borderColor: colorForTag('#'+e.category) }}>
                            #{e.category}
                          </span>
                        </div>
                        <div className="entry-min ta-right">{e.minutes}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }) : (
            <p className="no-records">{loading ? '불러오는 중…' : '해당 기간의 기록이 없습니다.'}</p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default RecordsPage;
