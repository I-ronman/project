import React, { useState, useEffect } from 'react';
import '../styles/StatisticsPage.css';
import axios from 'axios';
import DailyDonutChart from '../components/statistics/DailyDonutChart';
import WeeklyBarChart from '../components/statistics/WeeklyBarChart';

const StatisticsPage = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [exerciseColors, setExerciseColors] = useState({});
  const [dailyStats, setDailyStats] = useState({});
  const days = ['금', '토', '일', '월', '화', '수', '목'];

  const dummyData = {
    weeklyStats: [
      { chartData: { '스쿼트': 3, '푸쉬업': 2 }, errors: { 허리: 1, 무릎: 0 } },
      { chartData: { '스쿼트': 1, '푸쉬업': 1 }, errors: { 허리: 0, 무릎: 0 } },
      { chartData: { '스쿼트': 2, '푸쉬업': 3 }, errors: { 허리: 2, 무릎: 1 } },
      { chartData: { '스쿼트': 2, '푸쉬업': 1, '플랭크': 2 }, errors: { 허리: 2, 무릎: 1 } },
      { chartData: { '푸쉬업': 1 }, errors: { 허리: 0, 무릎: 1 } },
      { chartData: { '스쿼트': 0 }, errors: {} },
      { chartData: {}, errors: {} },
    ],
    exerciseColors: {
      '스쿼트': '#FF5C5C',
      '푸쉬업': '#4A90E2',
      '플랭크': '#7ED957',
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:329/web/api/statistics', {
        withCredentials: true,
      });
      setWeeklyStats(res.data.weeklyStats);
      setExerciseColors(res.data.exerciseColors);
      setSelectedDay(3);
      setDailyStats(res.data.weeklyStats[3] || {});
    } catch (err) {
      console.warn('⚠️ 서버 실패. 더미데이터 사용');
      setWeeklyStats(dummyData.weeklyStats);
      setExerciseColors(dummyData.exerciseColors);
      setSelectedDay(3);
      setDailyStats(dummyData.weeklyStats[3]);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDayClick = (idx) => {
    setSelectedDay(idx);
    setDailyStats(weeklyStats[idx] || {});
  };

  const renderLegend = () => {
    return Object.entries(exerciseColors).map(([name, color]) => (
      <div className="legend-item" key={name}>
        <span style={{ backgroundColor: color }}></span> {name}
      </div>
    ));
  };

  return (
    <div className="statistics-container">
      <h2 className="page-title">운동 통계</h2>

      <div className="section-title">통계 보기</div>
      <div className="date-selector">
        {days.map((day, idx) => (
          <button
            key={idx}
            className={`date-btn ${selectedDay === idx ? 'active' : ''}`}
            onClick={() => handleDayClick(idx)}
          >
            {idx + 1} <br /> {day}
          </button>
        ))}
      </div>

      <div className="chart-error-container">
        <div className="donut-chart">
          <DailyDonutChart data={dailyStats.chartData} colors={exerciseColors} />
          <div className="legend">{renderLegend()}</div>
        </div>
        <div className="error-box">
          <div>틀린횟수</div>
          <div>허리: {dailyStats.errors?.허리 || 0}회</div>
          <div>무릎: {dailyStats.errors?.무릎 || 0}회</div>
        </div>
      </div>

      <div className="weekly-chart">
        <h3>주간 운동 히스토리</h3>
        <WeeklyBarChart stats={weeklyStats} exerciseColors={exerciseColors} />
      </div>
    </div>
  );
};

export default StatisticsPage;
