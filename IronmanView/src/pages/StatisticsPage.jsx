// src/pages/StatisticsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/StatisticsPage.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaRunning, FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import { GiMuscleUp, GiLeg, GiHeartBeats } from 'react-icons/gi'; 

registerLocale('ko', ko);
ChartJS.register(ArcElement, Tooltip, Legend);

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
  { name: '하체', color: '#FF5C5C', icon: <GiLeg /> }, // ✅ 하체 아이콘 변경
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
    setData(dummyData);
  }, []);

  const filteredData = data.filter(d => {
    const date = new Date(d.date);
    return date >= startDate && date <= endDate;
  });

  const exerciseTotals = {};
  filteredData.forEach(d => {
    if (!exerciseTotals[d.exercise]) exerciseTotals[d.exercise] = 0;
    exerciseTotals[d.exercise] += d.time;
  });

  const chartData = {
    labels: Object.keys(exerciseTotals),
    datasets: [{
      data: Object.values(exerciseTotals),
      backgroundColor: ['#FF5C5C', '#4A90E2', '#7ED957', '#FBD157', '#A569BD', '#50E3C2', '#F5A623'],
      borderWidth: 2,
      borderColor: '#ffffff33',
      hoverOffset: 12
    }]
  };

  const selectedExerciseData = filteredData.filter(d => d.exercise === selectedExercise);
  const totalAttempts = selectedExerciseData.reduce((sum, cur) => sum + cur.total, 0);
  const totalSuccess = selectedExerciseData.reduce((sum, cur) => sum + cur.success, 0);
  const totalFail = selectedExerciseData.reduce((sum, cur) => sum + cur.fail, 0);
  const successRate = totalAttempts > 0 ? ((totalSuccess / totalAttempts) * 100).toFixed(1) : 0;

  const categoryData = filteredData.filter(d => d.category === selectedCategory);
  const categoryTotalAttempts = categoryData.reduce((sum, cur) => sum + cur.total, 0);
  const categoryTotalSuccess = categoryData.reduce((sum, cur) => sum + cur.success, 0);
  const categoryTotalFail = categoryData.reduce((sum, cur) => sum + cur.fail, 0);
  const categorySuccessRate = categoryTotalAttempts > 0 ? ((categoryTotalSuccess / categoryTotalAttempts) * 100).toFixed(1) : 0;

  const categoryExerciseStats = {};
  categoryData.forEach(d => {
    if (!categoryExerciseStats[d.exercise]) {
      categoryExerciseStats[d.exercise] = { total: 0, success: 0 };
    }
    categoryExerciseStats[d.exercise].total += d.total;
    categoryExerciseStats[d.exercise].success += d.success;
  });

  const exerciseArray = Object.entries(categoryExerciseStats).map(([name, stats]) => ({
    name,
    total: stats.total,
    success: stats.success,
    rate: stats.total > 0 ? (stats.success / stats.total * 100).toFixed(1) : 0
  }));

  const mostCount = [...exerciseArray].sort((a, b) => b.total - a.total)[0];
  const leastCount = [...exerciseArray].sort((a, b) => a.total - b.total)[0];
  const bestRate = [...exerciseArray].sort((a, b) => b.rate - a.rate)[0];
  const worstRate = [...exerciseArray].sort((a, b) => a.rate - b.rate)[0];

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
                setStartDate(date);
                if (!endDate) setTimeout(() => endPickerRef.current.setOpen(true), 200);
              }}
              className="stats-date-picker-input"
              ref={startPickerRef}
            />
          </div>
          <span>~</span>
          <div className="stats-date-input">
            <FaCalendarAlt className="stats-icon" />
            <DatePicker
              locale="ko"
              dateFormat="yyyy.MM.dd"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              onFocus={() => { if (!startDate) startPickerRef.current.setOpen(true); }}
              className="stats-date-picker-input"
              ref={endPickerRef}
            />
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">총 운동시간<span>{Object.values(exerciseTotals).reduce((a, b) => a + b, 0).toFixed(1)} 시간</span></div>
          <div className="summary-card">평균 성공률<span>{filteredData.length > 0 ? ((filteredData.reduce((sum, cur) => sum + cur.success, 0) / filteredData.reduce((sum, cur) => sum + cur.total, 0)) * 100).toFixed(1) : 0}%</span></div>
          <div className="summary-card">총 시도 횟수<span>{filteredData.reduce((sum, cur) => sum + cur.total, 0)}</span></div>
        </div>
      </div>

      <div className="main-chart-panel">
        <div className="chart-container">
          <Doughnut
            data={chartData}
            options={{
              onClick: (evt, elements) => {
                if (elements.length) setSelectedExercise(chartData.labels[elements[0].index]);
              },
              plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } }
            }}
          />
        </div>
        <div className="detail-card">
          {selectedExercise ? (
            <>
              <h3>{selectedExercise}</h3>
              <p>성공률: {successRate}%</p>
              <p>총 횟수: {totalAttempts}</p>
              <p>성공 횟수: {totalSuccess}</p>
              <p>실패 횟수: {totalFail}</p>
            </>
          ) : <p>차트에서 운동을 클릭하면 상세 정보가 표시됩니다.</p>}
        </div>
      </div>

      <h3 className="category-section-title">카테고리별 세부 통계</h3>
      <div className="category-panel">
        {categoryList.map(cat => (
          <div key={cat.name} className="category-card" style={{ backgroundColor: cat.color }} onClick={() => setSelectedCategory(cat.name)}>
            <div className="icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="category-detail-card">
          <h3>{selectedCategory} 통계</h3>
          <p>성공률: {categorySuccessRate}%</p>
          <p>총 횟수: {categoryTotalAttempts}</p>
          <p>성공 횟수: {categoryTotalSuccess}</p>
          <p>실패 횟수: {categoryTotalFail}</p>

          <div className="highlight-cards">
            <div className="highlight-card"><strong>가장 많이 한 운동</strong><p>{mostCount?.name} - {mostCount?.total}회</p><small>성공률: {mostCount?.rate}%</small></div>
            <div className="highlight-card"><strong>가장 적게 한 운동</strong><p>{leastCount?.name} - {leastCount?.total}회</p><small>성공률: {leastCount?.rate}%</small></div>
            <div className="highlight-card"><strong>성공률 최고</strong><p>{bestRate?.name} - {bestRate?.rate}%</p><small>횟수: {bestRate?.total}</small></div>
            <div className="highlight-card"><strong>성공률 최저</strong><p>{worstRate?.name} - {worstRate?.rate}%</p><small>횟수: {worstRate?.total}</small></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;
