// src/pages/StatisticsPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/StatisticsPage.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaRunning, FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import { GiMuscleUp, GiLeg, GiHeartBeats } from 'react-icons/gi';
import { buildColorMap, hexToRgba, lightenHex, lightenHsl } from '../utils/colorUtils';

registerLocale('ko', ko);
ChartJS.register(ArcElement, Tooltip, Legend);

// 더미 (백엔드 연동 전)
const dummyData = [
  { date: '2025-08-01', exercise: '스쿼트', category: '하체', time: 1.2, total: 10, success: 8, fail: 2 },
  { date: '2025-08-02', exercise: '푸쉬업', category: '상체', time: 0.8, total: 12, success: 10, fail: 2 },
  { date: '2025-08-03', exercise: '플랭크', category: '코어', time: 0.5, total: 5, success: 5, fail: 0 },
  { date: '2025-08-04', exercise: '버피', category: '전신', time: 0.6, total: 8, success: 6, fail: 2 },
  { date: '2025-08-05', exercise: '러닝', category: '유산소', time: 1.0, total: 1, success: 1, fail: 0 },
  { date: '2025-08-06', exercise: '랫풀다운', category: '상체', time: 0.9, total: 15, success: 12, fail: 3 },
  { date: '2025-08-07', exercise: '레그프레스', category: '하체', time: 1.5, total: 20, success: 18, fail: 2 },
  { date: '2025-08-08', exercise: '데드리프트', category: '전신', time: 1.3, total: 10, success: 7, fail: 3 },
  { date: '2025-08-09', exercise: '벤치프레스', category: '상체', time: 1.0, total: 12, success: 9, fail: 3 },
  { date: '2025-08-10', exercise: '마운틴클라이머', category: '유산소', time: 0.7, total: 8, success: 7, fail: 1 },
];

const categoryList = [
  { name: '상체', color: '#4A90E2', icon: <GiMuscleUp /> },
  { name: '하체', color: '#FF5C5C', icon: <GiLeg /> },
  { name: '코어', color: '#7ED957', icon: <FaDumbbell /> },
  { name: '전신', color: '#FBD157', icon: <FaRunning /> },
  { name: '유산소', color: '#A569BD', icon: <GiHeartBeats /> }
];

const StatisticsPage = () => {
  const location = useLocation();
  const today = new Date();

  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  const [startDate, setStartDate] = useState(location.state?.startDate ? new Date(location.state.startDate) : today);
  const [endDate, setEndDate] = useState(location.state?.endDate ? new Date(location.state.endDate) : today);

  const [data, setData] = useState(dummyData);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // TODO: 백엔드 연동 시 axios로 교체
    setData(dummyData);
  }, []);

  const filteredData = useMemo(() => {
    const s = new Date(startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(endDate);   e.setHours(23, 59, 59, 999);
    return data.filter(d => {
      const dt = new Date(d.date);
      return dt >= s && dt <= e;
    });
  }, [data, startDate, endDate]);

  // 운동별 합계(시간)
  const exerciseTotals = useMemo(() => {
    const acc = {};
    filteredData.forEach(d => {
      acc[d.exercise] = (acc[d.exercise] || 0) + d.time;
    });
    return acc;
  }, [filteredData]);

  // 라벨: 많이 한 순
  const chartLabels = useMemo(
    () => Object.entries(exerciseTotals).sort((a,b)=>b[1]-a[1]).map(([name]) => name),
    [exerciseTotals]
  );

  // 팔레트 시그니처(기간+라벨셋)
  const signature = useMemo(() => {
    const startSig = startDate ? startDate.toISOString().slice(0,10) : '';
    const endSig = endDate ? endDate.toISOString().slice(0,10) : '';
    return `${startSig}_${endSig}__${chartLabels.join('|')}`;
  }, [startDate, endDate, chartLabels]);

  // 동적 색상 매핑
  const colorMap = useMemo(() => buildColorMap(chartLabels, signature), [chartLabels, signature]);

  // 차트 데이터
  const chartData = useMemo(() => {
    const values = chartLabels.map((label) => exerciseTotals[label]);
    const bg = chartLabels.map((label) => colorMap[label]);
    const borders = bg.map((c) => c.startsWith('#') ? hexToRgba(c, 0.45) : lightenHsl(c, 6));
    return {
      labels: chartLabels,
      datasets: [{
        data: values,
        backgroundColor: bg,
        borderColor: borders,
        borderWidth: 2,
        hoverOffset: 10,
        hoverBackgroundColor: bg.map(c => c.startsWith('#') ? lightenHex(c, 10) : lightenHsl(c, 8)),
      }]
    };
  }, [chartLabels, exerciseTotals, colorMap]);

  // 상세(운동 선택)
  const selectedExerciseData = useMemo(
    () => filteredData.filter(d => d.exercise === selectedExercise),
    [filteredData, selectedExercise]
  );
  const totalAttempts = useMemo(() => selectedExerciseData.reduce((s,c)=>s+c.total,0), [selectedExerciseData]);
  const totalSuccess  = useMemo(() => selectedExerciseData.reduce((s,c)=>s+c.success,0), [selectedExerciseData]);
  const totalFail     = useMemo(() => selectedExerciseData.reduce((s,c)=>s+c.fail,0), [selectedExerciseData]);
  const successRate   = useMemo(() => totalAttempts>0 ? ((totalSuccess/totalAttempts)*100).toFixed(1) : 0, [totalAttempts, totalSuccess]);

  // 카테고리
  const categoryData = useMemo(() => filteredData.filter(d => d.category === selectedCategory), [filteredData, selectedCategory]);
  const categoryTotalAttempts = useMemo(() => categoryData.reduce((s,c)=>s+c.total,0), [categoryData]);
  const categoryTotalSuccess  = useMemo(() => categoryData.reduce((s,c)=>s+c.success,0), [categoryData]);
  const categoryTotalFail     = useMemo(() => categoryData.reduce((s,c)=>s+c.fail,0), [categoryData]);
  const categorySuccessRate   = useMemo(() => categoryTotalAttempts>0 ? ((categoryTotalSuccess/categoryTotalAttempts)*100).toFixed(1) : 0, [categoryTotalAttempts, categoryTotalSuccess]);

  const exerciseArray = useMemo(() => {
    const map = {};
    categoryData.forEach(d => {
      if (!map[d.exercise]) map[d.exercise] = { total: 0, success: 0 };
      map[d.exercise].total += d.total;
      map[d.exercise].success += d.success;
    });
    return Object.entries(map).map(([name, stats]) => ({
      name,
      total: stats.total,
      success: stats.success,
      rate: stats.total > 0 ? (stats.success / stats.total * 100).toFixed(1) : 0
    }));
  }, [categoryData]);

  const mostCount = useMemo(() => [...exerciseArray].sort((a,b)=>b.total-a.total)[0], [exerciseArray]);
  const leastCount= useMemo(() => [...exerciseArray].sort((a,b)=>a.total-b.total)[0], [exerciseArray]);
  const bestRate  = useMemo(() => [...exerciseArray].sort((a,b)=>b.rate-a.rate)[0], [exerciseArray]);
  const worstRate = useMemo(() => [...exerciseArray].sort((a,b)=>a.rate-b.rate)[0], [exerciseArray]);

  const totalTime = useMemo(() => Object.values(exerciseTotals).reduce((a,b)=>a+b,0).toFixed(1), [exerciseTotals]);
  const avgSuccessRate = useMemo(() => {
    const total = filteredData.reduce((s,c)=>s+c.total,0);
    const succ  = filteredData.reduce((s,c)=>s+c.success,0);
    return total>0 ? ((succ/total)*100).toFixed(1) : 0;
  }, [filteredData]);

  return (
    <div className="stats-dashboard">
      <div className="top-panel">
        <div className="stats-date-range">
          <div className="stats-date-input">
            <FaCalendarAlt className="stats-icon" />
            <DatePicker
              locale="ko"
              dateFormat="yyyy.MM.dd"
              selected={startDate}
              onChange={(date) => {
                const d = date || today;
                setStartDate(d);
                if (!endDate && endPickerRef.current) {
                  setTimeout(() => endPickerRef.current.setOpen(true), 100);
                }
              }}
              className="stats-date-picker-input"
              ref={startPickerRef}
              maxDate={endDate || undefined}
              placeholderText="시작일"
              showPopperArrow={false}
            />
          </div>
          <span className="date-sep">~</span>
          <div className="stats-date-input">
            <FaCalendarAlt className="stats-icon" />
            <DatePicker
              locale="ko"
              dateFormat="yyyy.MM.dd"
              selected={endDate}
              onChange={(date) => setEndDate(date || today)}
              onFocus={() => { if (!startDate && startPickerRef.current) startPickerRef.current.setOpen(true); }}
              className="stats-date-picker-input"
              ref={endPickerRef}
              minDate={startDate || undefined}
              placeholderText="종료일"
              showPopperArrow={false}
            />
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            총 운동시간
            <span>{totalTime} 시간</span>
          </div>
          <div className="summary-card">
            평균 성공률
            <span>{avgSuccessRate}%</span>
          </div>
          <div className="summary-card">
            총 시도 횟수
            <span>{filteredData.reduce((sum, cur) => sum + cur.total, 0)}</span>
          </div>
        </div>
      </div>

      <div className="main-chart-panel">
        <div className="chart-container">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }, // 커스텀 레전드 사용
                tooltip: { enabled: true }
              },
              layout: { padding: 8 },
              onClick: (_, elements) => {
                if (elements?.length) {
                  const idx = elements[0].index;
                  setSelectedExercise(chartData.labels[idx]);
                }
              }
            }}
          />
        </div>

        <div className="detail-card">
          {selectedExercise ? (
            <>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="legend-dot" style={{ background: colorMap[selectedExercise] }} />
                {selectedExercise}
              </h3>
              <p>성공률: {successRate}%</p>
              <p>총 횟수: {totalAttempts}</p>
              <p>성공 횟수: {totalSuccess}</p>
              <p>실패 횟수: {totalFail}</p>
              <button className="reset-btn" onClick={() => setSelectedExercise(null)}>선택 해제</button>
            </>
          ) : (
            <p className="empty-hint">도넛 차트에서 운동을 클릭하면 상세 정보가 표시됩니다.</p>
          )}
        </div>
      </div>

      {/* 커스텀 레전드 */}
      <div className="dynamic-legend">
        {chartLabels.map((label) => (
          <button
            key={label}
            type="button"
            className={`legend-item ${selectedExercise === label ? 'active' : ''}`}
            onClick={() => setSelectedExercise(prev => prev === label ? null : label)}
            aria-pressed={selectedExercise === label}
            title={`${label} 선택/해제`}
          >
            <span className="legend-dot" style={{ background: colorMap[label] }} />
            <span className="legend-text">{label}</span>
          </button>
        ))}
      </div>

      <h3 className="category-section-title">카테고리별 세부 통계</h3>
      <div className="category-panel">
        {categoryList.map(cat => (
          <button
            key={cat.name}
            type="button"
            className={`category-card ${selectedCategory === cat.name ? 'active' : ''}`}
            style={{ background: cat.color }}
            onClick={() => setSelectedCategory(cat.name)}
            aria-pressed={selectedCategory === cat.name}
          >
            <div className="icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="category-detail-card">
          <div className="category-detail-header">
            <h3>{selectedCategory} 통계</h3>
            <button className="reset-btn" onClick={() => setSelectedCategory(null)}>선택 해제</button>
          </div>

          <div className="category-stats grid-3">
            <div className="kv"><span className="k">성공률</span><span className="v">{categorySuccessRate}%</span></div>
            <div className="kv"><span className="k">총 횟수</span><span className="v">{categoryTotalAttempts}</span></div>
            <div className="kv"><span className="k">성공/실패</span><span className="v">{categoryTotalSuccess}/{categoryTotalFail}</span></div>
          </div>

          <div className="highlight-cards">
            <div className="highlight-card">
              <strong>가장 많이 한 운동</strong>
              <p>{mostCount?.name ?? '-'}</p>
              <small>{mostCount ? `총 ${mostCount.total}회 · 성공률 ${mostCount.rate}%` : '데이터 없음'}</small>
            </div>
            <div className="highlight-card">
              <strong>가장 적게 한 운동</strong>
              <p>{leastCount?.name ?? '-'}</p>
              <small>{leastCount ? `총 ${leastCount.total}회 · 성공률 ${leastCount.rate}%` : '데이터 없음'}</small>
            </div>
            <div className="highlight-card">
              <strong>성공률 최고</strong>
              <p>{bestRate?.name ?? '-'}</p>
              <small>{bestRate ? `성공률 ${bestRate.rate}% · ${bestRate.total}회` : '데이터 없음'}</small>
            </div>
            <div className="highlight-card">
              <strong>성공률 최저</strong>
              <p>{worstRate?.name ?? '-'}</p>
              <small>{worstRate ? `성공률 ${worstRate.rate}% · ${worstRate.total}회` : '데이터 없음'}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;
