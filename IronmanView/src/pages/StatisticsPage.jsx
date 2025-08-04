import React, { useState, useEffect } from 'react';
import '../styles/StatisticsPage.css';
import axios from 'axios';
import DailyDonutChart from '../components/statistics/DailyDonutChart';
import WeeklyBarChart from '../components/statistics/WeeklyBarChart';

// ✅ 예시용 dummy 데이터 (Main 과 동일하게 시간 단위로 가정)
const dummyData = {
  weeklyStats: [
    { chartData: { '스쿼트': 1.2, '푸쉬업': 0.8 }, errors: { 허리:1, 무릎:0 } },
    { chartData: { '스쿼트': 0.9, '푸쉬업': 0.5 }, errors: { 허리:0, 무릎:0 } },
    { chartData: { '스쿼트': 1.5, '푸쉬업': 1.0 }, errors: { 허리:2, 무릎:1 } },
    { chartData: { '스쿼트': 1.0, '푸쉬업': 0.7, '플랭크': 0.5 }, errors: { 허리:2, 무릎:1 } },
    { chartData: { '푸쉬업': 0.6 }, errors: { 허리:0, 무릎:1 } },
    { chartData: { '스쿼트': 0.4 }, errors: {} },
    { chartData: {}, errors: {} },
  ],
  exerciseColors: {
    '스쿼트': '#FF5C5C',
    '푸쉬업': '#4A90E2',
    '플랭크': '#7ED957',
  }
};

const dayNames = ['일','월','화','수','목','금','토'];

const StatisticsPage = () => {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [exerciseColors, setExerciseColors] = useState({});
  const [selectedDay, setSelectedDay] = useState(3);
  const [dailyStats, setDailyStats] = useState({ chartData: {}, errors: {} });
  const [weekDates, setWeekDates] = useState([]);

  // 오늘을 가운데로 하는 7일
  useEffect(() => {
    const today = new Date();
    const wd = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + (i - 3));
      return d;
    });
    setWeekDates(wd);
  }, []);

  // 통계 데이터 로드
  useEffect(() => {
    const fetchStats = async () => {
      let data;
      try {
        const res = await axios.get('http://localhost:329/web/api/statistics', { withCredentials: true });
        data = res.data;
      } catch {
        console.warn('⚠️ 서버 실패. 더미데이터 사용');
        data = dummyData;
      }
      setWeeklyStats(data.weeklyStats);
      setExerciseColors(data.exerciseColors);
      // 초기 선택: 가운데(3)
      setSelectedDay(3);
      setDailyStats(data.weeklyStats[3]);
    };
    fetchStats();
  }, []);

  const handleDayClick = idx => {
    setSelectedDay(idx);
    setDailyStats(weeklyStats[idx] || dummyData.weeklyStats[idx]);
  };

  const renderLegend = () =>
    Object.entries(exerciseColors).map(([name, color]) => (
      <div className="legend-item" key={name}>
        <span style={{ backgroundColor: color }}></span> {name}
      </div>
    ));

  return (
    <div className="statistics-container">
      <h2 className="page-title">운동 통계</h2>

      {/* 날짜 선택 */}
      <div className="date-selector">
        {weekDates.map((d, idx) => (
          <button
            key={idx}
            className={`date-btn ${selectedDay === idx ? 'active' : ''}`}
            onClick={() => handleDayClick(idx)}
            disabled={d > new Date()}
          >
            {d.getDate()}<br/>{dayNames[d.getDay()]}
          </button>
        ))}
      </div>

      {/* 일간 차트 & 오류 박스 */}
      <div className="chart-error-container">
        <div className="donut-chart">
          {/* 도넛: chartData가 "운동 시간(hrs)" */}
          <DailyDonutChart data={dailyStats.chartData} colors={exerciseColors} />
          <div className="legend">{renderLegend()}</div>
        </div>
        <div className="error-box">
          <div>틀린횟수</div>
          <div>허리: {dailyStats.errors?.허리 || 0}회</div>
          <div>무릎: {dailyStats.errors?.무릎 || 0}회</div>
        </div>
      </div>

      {/* 주간 바 차트: 시간 단위 */}
      <div className="weekly-chart">
        <h3>주간 운동 히스토리</h3>
        <WeeklyBarChart
          stats={weeklyStats}
          exerciseColors={exerciseColors}
          dates={weekDates}
        />
      </div>
    </div>
  );
};

export default StatisticsPage;
