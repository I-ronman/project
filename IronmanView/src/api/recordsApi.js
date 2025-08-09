// src/api/recordsApi.js
// 프론트 전용 어댑터: 백 연결 전에는 더미를, 연결되면 동일 포맷으로 변환해 반환합니다.
// 반환 포맷 (RecordsPage에서 사용):
// {
//   id, date: 'YYYY-MM-DD', type: 'routine'|'individual', title?: string,
//   totalMinutes: number,
//   tags: string[],                  // ['#상체', '#코어'] — 카테고리 해시태그
//   entries: [                       // 날짜별 운동 상세
//     { name: '스쿼트', minutes: 12, category: '하체' },
//     ...
//   ]
// }
import axios from 'axios';

// ---------- 더미 데이터(대시보드 카드 요구사항 반영: 총시간 + 운동별 시간 + 카테고리) ----------
const DUMMY_DAILY_DETAIL = [
  {
    id: 1,
    date: '2025-08-12',
    type: 'routine',
    title: '루틴 B',
    entries: [
      { name: '런지', minutes: 12, category: '하체' },
      { name: '버피', minutes: 8, category: '전신' }
    ]
  },
  {
    id: 2,
    date: '2025-08-11',
    type: 'individual',
    entries: [
      { name: '플랭크', minutes: 15, category: '코어' },
      { name: '푸쉬업', minutes: 20, category: '상체' }
    ]
  },
  {
    id: 3,
    date: '2025-08-10',
    type: 'routine',
    title: '루틴 A',
    entries: [
      { name: '스쿼트', minutes: 12, category: '하체' },
      { name: '푸쉬업', minutes: 10, category: '상체' },
      { name: '플랭크', minutes: 8, category: '코어' }
    ]
  }
].map(r => ({
  ...r,
  totalMinutes: r.entries.reduce((a, b) => a + b.minutes, 0),
  tags: Array.from(new Set(r.entries.map(e => `#${e.category}`)))
}));

// ---------- 유틸 ----------
const toISODate = (d) => {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x.toISOString().slice(0,10);
};

const randomId = (seed='') => `${seed}-${Math.random().toString(16).slice(2)}`;

// ---------- 백엔드(A: /records, B: /stats(WorkoutLog)) → 프론트 포맷으로 변환 ----------
/**
 * WorkoutLog[] -> DailyDetail[] 로 집계
 * WorkoutLog 예시: { date:'2025-08-12', exercise:'스쿼트', category:'하체', timeHours:1.2 }
 */
const reduceLogsToDailyDetail = (logs) => {
  // 날짜 → 운동명 → { minutes, category(우선 첫 값) }
  const byDate = new Map();
  logs.forEach(l => {
    const date = l.date;
    const ex = l.exercise ?? '운동';
    const cat = l.category ?? '기타';
    const minutes = Math.round(((l.timeHours ?? l.time ?? 0) * 60));

    if (!byDate.has(date)) byDate.set(date, new Map());
    const byEx = byDate.get(date);
    if (!byEx.has(ex)) byEx.set(ex, { minutes: 0, category: cat });
    const cur = byEx.get(ex);
    cur.minutes += minutes;
    if (!cur.category && cat) cur.category = cat;
  });

  const out = [];
  for (const [date, byEx] of byDate.entries()) {
    const entries = Array.from(byEx.entries()).map(([name, v]) => ({
      name,
      minutes: v.minutes,
      category: v.category
    })).sort((a,b)=> b.minutes - a.minutes);

    out.push({
      id: randomId(date),
      date,
      type: 'individual',  // 루틴 테이블이 없으니 일단 individual로 표기(백 연동 시 교체)
      title: null,
      totalMinutes: entries.reduce((a,b)=>a+b.minutes,0),
      tags: Array.from(new Set(entries.map(e=>`#${e.category}`))),
      entries
    });
  }

  return out.sort((a,b)=> b.date.localeCompare(a.date));
};

// ---------- 공개 함수 ----------
export const fetchDailyRecords = async ({ baseURL = (import.meta.env.VITE_API_BASE || 'http://localhost:329'), userId = 1, startDate, endDate }) => {
  const start = toISODate(startDate ?? new Date());
  const end   = toISODate(endDate ?? new Date());

  // A. /web/api/records 가 이미 DailyDetail 형태로 내려주는 경우
  try {
    const res = await axios.get(`${baseURL}/web/api/records`, { params: { userId, start, end }, withCredentials: true });
    const arr = Array.isArray(res.data) ? res.data : [];
    if (arr.length) {
      // totalMinutes/tags 누락되어도 방어
      return arr.map((r, i) => ({
        id: r.id ?? i,
        date: r.date,
        type: r.type ?? 'individual',
        title: r.title ?? null,
        entries: r.entries ?? [],
        totalMinutes: r.totalMinutes ?? (r.entries ?? []).reduce((a,b)=>a+(b.minutes||0),0),
        tags: r.tags ?? Array.from(new Set((r.entries ?? []).map(e=>`#${e.category}`)))
      })).sort((a,b)=> b.date.localeCompare(a.date));
    }
  } catch (_) {}

  // B. /web/api/stats 가 WorkoutLog[] 를 주는 경우 → 프론트에서 집계
  try {
    const res2 = await axios.get(`${baseURL}/web/api/stats`, { params: { userId, start, end }, withCredentials: true });
    const logs = Array.isArray(res2.data) ? res2.data : [];
    if (logs.length) return reduceLogsToDailyDetail(logs);
  } catch (_) {}

  // C. 더미
  return DUMMY_DAILY_DETAIL.filter(d => d.date >= start && d.date <= end)
    .sort((a,b)=> b.date.localeCompare(a.date));
};
