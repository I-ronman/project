// src/pages/SchedulePage.jsx
import React, { useState, useEffect, useContext, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/SchedulePage.css';
import defaultProfile from '../images/default_profile.jpg';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../layouts/PageWrapper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

/* ------------------ 유틸 & 더미 ------------------ */
const fmtKey = (d) => new Date(d).toISOString().slice(0, 10);
const getTodayKey = () => fmtKey(new Date());
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const parseList = (list) =>
  Array.isArray(list) ? list : String(list || '').split(',').map(s => s.trim()).filter(Boolean);
const calories = (min) => Math.max(0, Math.round((min || 0) * 8));

const guessCategories = (routine) => {
  if (Array.isArray(routine?.categories) && routine.categories.length) return routine.categories;
  const dict = [
    { k:'상체', keys:['푸쉬업','벤치','랫풀다운','풀업','숄더','덤벨','바벨','로우'] },
    { k:'하체', keys:['스쿼트','런지','레그','데드리프트','카프','힙'] },
    { k:'코어', keys:['플랭크','싯업','크런치','브릿지'] },
    { k:'전신', keys:['버피','케틀벨','스내치'] },
    { k:'유산소', keys:['러닝','런닝','사이클','자전거','로잉','마운틴클라이머','점핑'] },
  ];
  const cats = new Set();
  parseList(routine?.list).forEach(n => {
    dict.forEach(({k,keys}) => keys.some(s => n.includes(s)) && cats.add(k));
  });
  return cats.size ? Array.from(cats) : ['기타'];
};

/** ✅ 과거 더미 루틴(오늘 기준) */
const buildDummyPastMap = () => {
  const today = new Date();
  const map = {};
  map[fmtKey(addDays(today, -1))] = { name: '상체 집중 루틴', list: '푸쉬업, 벤치프레스, 플랭크', duration: 35 };
  map[fmtKey(addDays(today, -3))] = { name: '하체 파워', list: '스쿼트, 런지, 레그프레스', duration: 40 };
  map[fmtKey(addDays(today, -6))] = { name: '코어&유산소', list: '플랭크, 마운틴클라이머, 러닝', duration: 30 };
  return map;
};
/* ------------------------------------------------ */

const SchedulePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');                // month | year | decade
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [routineMap, setRoutineMap] = useState({});
  const [loading, setLoading] = useState(false);

  const selectedKey = useMemo(() => fmtKey(date), [date]);
  const isPast = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(date); d.setHours(0,0,0,0);
    return d < today;
  }, [date]);

  const selectedRoutine = routineMap[selectedKey];

  /* 세션 사용자 */
  useEffect(() => {
    axios.get('http://localhost:329/web/login/user', { withCredentials: true })
      .then(res => {
        const { name, email } = res.data ?? {};
        setUser(prev => ({ ...prev, name, email }));
      })
      .catch(() => navigate('/login'));
  }, [navigate, setUser]);

  /* 초기 부팅 데이터 */
  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const base = addDays(now, -90);
        const local = {};
        for (let i = 0; i <= 120; i++) {
          const d = addDays(base, i);
          if (d > addDays(now, 30)) break;
          const k = fmtKey(d);
          const v = localStorage.getItem(`routine_${k}`);
          if (v) local[k] = JSON.parse(v);
        }
        try {
          const start = fmtKey(addDays(new Date(), -30));
          const end = fmtKey(addDays(new Date(), 60));
          const res = await axios.get('http://localhost:329/web/api/schedules', {
            withCredentials: true, params: { start, end }
          });
          if (Array.isArray(res.data)) {
            res.data.forEach(row => {
              if (row?.date && row?.routine) local[row.date] = row.routine;
            });
          }
        } catch (_) {}
        const dummy = buildDummyPastMap();
        Object.keys(dummy).forEach(k => { if (!local[k]) local[k] = dummy[k]; });
        setRoutineMap(local);
      } finally { setLoading(false); }
    };
    boot();
  }, []);

  /* 선택 날짜의 로컬 저장분 즉시 반영 */
  useEffect(() => {
    const saved = localStorage.getItem(`routine_${selectedKey}`);
    if (saved) setRoutineMap(prev => ({ ...prev, [selectedKey]: JSON.parse(saved) }));
  }, [selectedKey]);

  /* 월 뷰 타일 클래스 */
  const tileClassName = ({ date: d, view: v }) => {
    if (v !== 'month') return undefined;
    const key = fmtKey(d);
    const classes = [];
    const todayKey = getTodayKey();

    if (routineMap[key]) classes.push('has-routine');
    if (key === todayKey) classes.push('is-today');

    const today = new Date(); today.setHours(0,0,0,0);
    const dd = new Date(d); dd.setHours(0,0,0,0);
    if (dd < today) classes.push('is-past');
    return classes.join(' ');
  };

  return (
    <PageWrapper>
      <div className="schedule__container">
        {/* 헤더 */}
        <section className="schedule__header">
          <div className="profile">
            <img src={user?.face || defaultProfile} alt="프로필" className="profile__img" />
            <div className="profile__meta">
              <div className="profile__hello">반가워요,</div>
              <div className="profile__name">{user?.name ?? '홍길동'} 님</div>
              <div className="profile__sub">{user?.email ?? 'welcome@ironman.app'}</div>
            </div>
          </div>

          <div className="todaycard">
            <div className="todaycard__title">오늘 ({getTodayKey()})</div>
            {routineMap[getTodayKey()] ? (
              <>
                <div className="todaycard__name">{routineMap[getTodayKey()].name}</div>
                <div className="todaycard__meta">
                  <span>{parseList(routineMap[getTodayKey()].list).length}개 운동</span>
                  <span>·</span>
                  <span>{routineMap[getTodayKey()].duration ?? 0}분</span>
                  <span>·</span>
                  <span>{calories(routineMap[getTodayKey()].duration)} kcal</span>
                </div>
                <button className="btn btn--primary" onClick={() => navigate('/exercise')}>시작하기</button>
              </>
            ) : (
              <>
                <div className="todaycard__empty">오늘 등록된 루틴이 없어요.</div>
                <button className="btn" onClick={() => navigate('/routine', { state: { selectedDate: getTodayKey() } })}>루틴 추가</button>
              </>
            )}
          </div>
        </section>

        {/* 본문 */}
        <section className="schedule__grid">
          {/* 캘린더 */}
          <div className="calbox card">
            <div className="card__head">
              <h3>운동 스케줄러</h3>
            </div>

            {/* ✅ 뷰 전환은 그대로 허용하되, wrapper 높이를 고정하고
                내부를 grid로 늘려 카드 높이/폭이 항상 동일하게 보이도록 CSS에서 제어 */}
            <Calendar
              className="custom-cal"
              locale="ko-KR"
              view={view}
              onViewChange={({ view }) => setView(view)}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
              value={date}
              onChange={(d) => setDate(d)}
              prev2Label={null}
              next2Label={null}
              onClickMonth={(d) => { setActiveStartDate(d); setView('month'); setDate(d); }}
              onClickYear={(d)  => { setActiveStartDate(d); setView('year');  }}
              onClickDecade={(d)=> { setActiveStartDate(d); setView('decade');}}
              minDetail="decade"     // 년도부터
              maxDetail="month"      // 일 달력까지
              tileClassName={tileClassName}
            />

            <div className="legend">
              <span><i className="dot dot--today" /> 오늘</span>
              <span><i className="dot dot--has" /> 루틴 있음</span>
              <span><i className="dot dot--past" /> 지난 날</span>
            </div>
          </div>

          {/* 오른쪽 상세 */}
          <div className="detailbox card card--contrast">
            <div className="card__head">
              <h3>{selectedKey} 일정</h3>
            </div>

            {loading ? (
              <div className="loading">불러오는 중…</div>
            ) : selectedRoutine ? (
              <div className="routine">
                <div className="routine__row">
                  <div className="routine__name">🏋 루틴명</div>
                  <div className="routine__val">{selectedRoutine.name}</div>
                </div>

                <div className="routine__row">
                  <div className="routine__name">🏷 카테고리</div>
                  <div className="routine__tags">
                    {guessCategories(selectedRoutine).map((c,i)=>(
                      <span key={i} className="pill">#{c}</span>
                    ))}
                  </div>
                </div>

                <div className="routine__row">
                  <div className="routine__name">🗒 구성</div>
                  <div className="routine__list">
                    {parseList(selectedRoutine.list).map((n,i)=>(
                      <span key={i} className="chip">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="routine__stats">
                  <div className="stat">
                    <div className="stat__k">⏱ 총 시간</div>
                    <div className="stat__v">{selectedRoutine.duration ?? 0}분</div>
                  </div>
                  <div className="stat">
                    <div className="stat__k">🔥 예상 칼로리</div>
                    <div className="stat__v">{calories(selectedRoutine.duration)} kcal</div>
                  </div>
                </div>

                {!isPast && (
                  <div className="cta__single">
                    <button
                      className="btn btn--primary"
                      onClick={() => navigate('/exercise', { state: { selectedDate: selectedKey } })}
                    >
                      루틴 수정
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty emphasized">
                <p>이 날짜에는 등록된 루틴이 없습니다.</p>
                {!isPast ? (
                  <button
                  className="btn btn--primary"
                  onClick={() => navigate('/exercise', { state: { selectedDate: selectedKey } })}
                >
                  루틴 등록하기
                </button>
                ) : (
                  <div className="hint">지난 날짜에는 루틴을 등록할 수 없습니다.</div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default SchedulePage;
