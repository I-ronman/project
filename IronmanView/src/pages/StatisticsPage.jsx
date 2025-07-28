import React, { useEffect, useState } from 'react';
import Header from '../components/statistics/Header';
import DateSelector from '../components/statistics/DateSelector';
import DonutChart from '../components/statistics/DonutChart';
import ErrorBox from '../components/statistics/ErrorBox';
import WeeklyBarChart from '../components/statistics/WeeklyBarChart';
import '../styles/StatisticsPage.css';
import axios from 'axios';

const StatisticsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFuture, setIsFuture] = useState(false);
  const [exerciseStats, setExerciseStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);

  useEffect(() => {
    const today = new Date();
    if (selectedDate > today) {
      setIsFuture(true);
      setExerciseStats(null);
      return;
    }

    setIsFuture(false);

    const dateString = selectedDate.toISOString().split('T')[0];
    axios.get(`http://localhost:5000/api/stats/daily?date=${dateString}`)
      .then((res) => setExerciseStats(res.data))
      .catch(() => setExerciseStats(null));

    axios.get(`http://localhost:5000/api/stats/weekly`)
      .then((res) => setWeeklyStats(res.data))
      .catch(() => setWeeklyStats([]));
  }, [selectedDate]);

  return (
    <div className="statistics-container">
      <Header />
      <h2 className="section-title">통계 보기</h2>
      <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {isFuture ? (
        <div className="no-data-box">미래 날짜는 데이터가 없습니다.</div>
      ) : (
        <>
          <div className="chart-section">
            <DonutChart data={exerciseStats?.ratios || []} />
            <ErrorBox errors={exerciseStats?.errors || {}} />
          </div>
          <WeeklyBarChart data={weeklyStats} />
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
