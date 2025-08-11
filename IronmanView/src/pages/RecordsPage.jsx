// src/pages/RecordsPage.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

import PageWrapper from '../layouts/PageWrapper';
import '../styles/RecordsPage.css';

import { AuthContext } from '../context/AuthContext';
// import { fetchDailyRecords } from '../api/recordsApi';

registerLocale('ko', ko);

// ──────────────────────────────────────────────────────────────
// 더미데이터
const DUMMY_IMG = '/images/dummy.jpg';

const dummyRecords = [
  {
    id: 101,
    date: '2025-08-12',
    type: 'routine',
    title: '루틴 B',
    tags: ['#하체', '#전신'],
    totalMinutes: 20,
    entries: [
      { name: '런지', category: '하체', minutes: 12 },
      { name: '버피', category: '전신', minutes: 8 },
    ],
    feedback: {
      good: [
        { img: DUMMY_IMG, text: '허리 중립을 잘 유지했어요. 시선은 정면 고정, 발뒤꿈치로 밀어 올림이 좋아요.' },
        { img: DUMMY_IMG, text: '무릎-발끝 정렬이 안정적입니다. 호흡 리듬도 일정합니다.' },
      ],
      bad: [
        { img: DUMMY_IMG, text: '상체가 앞으로 많이 숙여집니다. 코어를 조여 척추 중립을 유지하세요.' },
        { img: DUMMY_IMG, text: '무릎이 안쪽으로 모입니다. 무릎-발끝 방향을 맞춰 주세요.' },
      ],
    },
  },
  {
    id: 102,
    date: '2025-08-11',
    type: 'individual',
    title: '개별 운동',
    tags: ['#코어', '#상체'],
    totalMinutes: 35,
    entries: [
      { name: '플랭크', category: '코어', minutes: 15 },
      { name: '푸쉬업', category: '상체', minutes: 20 },
    ],
    feedback: {
      good: [
        { img: DUMMY_IMG, text: '어깨-엉덩이-발뒤꿈치 라인이 곧게 유지되었어요.' },
        { img: DUMMY_IMG, text: '팔꿈치 각도와 손목 정렬이 안정적이에요.' },
      ],
      bad: [
        { img: DUMMY_IMG, text: '허리가 꺼집니다. 복부에 힘을 주고 골반을 말아 올리세요.' },
        { img: DUMMY_IMG, text: '목이 꺾입니다. 정수리로 길게 뻗는 느낌으로 시선을 낮춰요.' },
      ],
    },
  },
  {
    id: 103,
    date: '2025-08-10',
    type: 'routine',
    title: '루틴 A',
    tags: ['#하체', '#상체', '#코어'],
    totalMinutes: 30,
    entries: [
      { name: '스쿼트', category: '하체', minutes: 12 },
      { name: '푸쉬업', category: '상체', minutes: 10 },
      { name: '플랭크', category: '코어', minutes: 8 },
    ],
    feedback: {
      good: [
        { img: DUMMY_IMG, text: '스쿼트 하강 시 무게중심이 발 중앙에 잘 실립니다.' },
        { img: DUMMY_IMG, text: '푸쉬업에서 견갑 안정화가 좋았어요.' },
      ],
      bad: [
        { img: DUMMY_IMG, text: '플랭크에서 엉덩이가 들립니다. 갈비 내리고 코어 조이기.' },
        { img: DUMMY_IMG, text: '스쿼트 상단에서 무릎을 잠그지 않도록 주의하세요.' },
      ],
    },
  },
  {
    id: 104,
    date: '2025-08-09',
    type: 'individual',
    title: '개별 운동',
    tags: ['#유산소'],
    totalMinutes: 18,
    entries: [{ name: '마운틴클라이머', category: '유산소', minutes: 18 }],
    feedback: {
      good: [
        { img: DUMMY_IMG, text: '리듬이 안정적이고 호흡이 좋아요.' },
        { img: DUMMY_IMG, text: '무릎 드라이브가 좋습니다. 코어도 유지돼요.' },
      ],
      bad: [
        { img: DUMMY_IMG, text: '골반이 좌우로 흔들립니다. 복압을 유지하며 중심을 잡으세요.' },
        { img: DUMMY_IMG, text: '손목에 부담이 큽니다. 손가락으로 바닥을 눌러 분산하세요.' },
      ],
    },
  },
];
// ──────────────────────────────────────────────────────────────

const RecordsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  const today = useMemo(() => new Date(), []);
  const twoWeeksAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 13);
    d.setHours(0,0,0,0);
    return d;
  }, []);

  const [startDate, setStartDate] = useState(twoWeeksAgo);
  const [endDate, setEndDate] = useState(today);

  const [records, setRecords] = useState([...dummyRecords].sort((a, b) => b.date.localeCompare(a.date)));
  const [loading] = useState(false);
  const [expanded, setExpanded] = useState({});

  // 상세 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRecord, setModalRecord] = useState(null);
  const [modalTab, setModalTab] = useState('good'); // 'good' | 'bad'
  const [slideIndex, setSlideIndex] = useState(0);

  const onSearch = () => {
    if (!startDate || !endDate) {
      setRecords([...dummyRecords].sort((a, b) => b.date.localeCompare(a.date)));
      return;
    }
    setRecords(
      dummyRecords
        .filter(r => {
          const d = new Date(r.date);
          return d >= startDate && d <= endDate;
        })
        .sort((a, b) => b.date.localeCompare(a.date))
    );
  };

  const goStats = () => {
    navigate('/statistics', { state: { startDate, endDate } });
  };

  const openModal = (rec) => {
    setModalRecord(rec);
    setModalTab('good');
    setSlideIndex(0);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const currentSlides = modalRecord ? modalRecord.feedback?.[modalTab] ?? [] : [];
  const prevSlide = () => setSlideIndex((i) => (i - 1 + currentSlides.length) % currentSlides.length);
  const nextSlide = () => setSlideIndex((i) => (i + 1) % currentSlides.length);

  // 키보드 내비게이션(모달 열렸을 때만)
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, currentSlides.length]);

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
            const isOpen = expanded[rec.id] ?? true; // 기본 펼침
            return (
              <div key={rec.id} className="record-item">
                {/* 헤더: 날짜 + 총 시간 + 태그 */}
                <div className="record-header">
                  <div className="record-date">{rec.date}</div>
                  <div className="record-tags">
                    {rec.tags?.map((t,i)=>(
                      <span key={i} className="tag-pill">{t}</span>
                    ))}
                  </div>
                  <div className="record-total">{rec.totalMinutes}분</div>
                </div>

                {/* 본문: (루틴명 / 개별) + 토글 + 상세보기 버튼 */}
                <div className="record-title-row">
                  <button
                    className="routine-toggle"
                    onClick={() => setExpanded(prev => ({ ...prev, [rec.id]: !isOpen }))}
                    aria-label="상세 토글"
                  >
                    {isOpen ? '▼' : '▶'}
                  </button>
                  <div className="record-title">
                    {rec.type === 'routine' ? (rec.title ?? '루틴') : '개별 운동'}
                  </div>
                  <button className="btn-feedback" onClick={() => openModal(rec)}>상세보기</button>
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
                          <span className="tag-pill">#{e.category}</span>
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

      {/* 상세 모달 */}
      {modalOpen && modalRecord && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {/* ✖ 위치는 그대로(우상단 고정) */}
            <button className="modal-close" onClick={closeModal} aria-label="닫기">×</button>

            {/* ✅ 헤더를 좌우 배치로 변경: 좌측 제목, 우측에 날짜(✖과 겹치지 않도록 우측 패딩 확보) */}
            <div className="modal-header">
              <h3>자세 확인하기</h3>
              <div className="modal-date">날짜: {modalRecord.date}</div>
            </div>

            {/* 탭: 좋은 자세 / 나쁜 자세 */}
            <div className="posture-tabs" role="tablist">
              <button
                className={`posture-tab ${modalTab === 'good' ? 'active' : ''}`}
                onClick={() => { setModalTab('good'); setSlideIndex(0); }}
                role="tab"
                aria-selected={modalTab === 'good'}
              >
                좋은 자세
              </button>
              <button
                className={`posture-tab ${modalTab === 'bad' ? 'active' : ''}`}
                onClick={() => { setModalTab('bad'); setSlideIndex(0); }}
                role="tab"
                aria-selected={modalTab === 'bad'}
              >
                나쁜 자세
              </button>
            </div>

            {/* 미디어 + 네비게이션 */}
            <div className="gallery-wrap">
              <span className="ai-badge">AI 분석 결과 반영</span>

              {currentSlides.length > 1 && (
                <>
                  <button className="gallery-nav nav-prev" onClick={prevSlide} aria-label="이전">&lsaquo;</button>
                  <button className="gallery-nav nav-next" onClick={nextSlide} aria-label="다음">&rsaquo;</button>
                </>
              )}

              <div className="gallery-stage">
                {currentSlides.length > 0 ? (
                  <img
                    src={currentSlides[slideIndex].img}
                    alt={`${modalTab === 'good' ? '좋은' : '나쁜'} 자세 이미지 ${slideIndex + 1}`}
                    className="gallery-img"
                  />
                ) : (
                  <div className="gallery-empty">표시할 이미지가 없습니다.</div>
                )}
              </div>
            </div>

            {/* 설명 패널 */}
            <div className="feedback-panel">
              <p className="feedback-text">
                {currentSlides.length ? currentSlides[slideIndex].text : '설명 없음'}
              </p>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default RecordsPage;
