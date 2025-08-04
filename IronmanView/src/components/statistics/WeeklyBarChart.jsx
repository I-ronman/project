// src/components/statistics/WeeklyBarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const WeeklyBarChart = ({ stats, exerciseColors }) => {
  if (!stats || stats.length === 0) return <div className="no-data-box">주간 데이터 없음</div>;

  const labels = ['금', '토', '일', '월', '화', '수', '목'];

  // 운동 이름 리스트 추출
  const exerciseNames = Object.keys(exerciseColors);

  // 데이터셋 구성
  const datasets = exerciseNames.map((exercise) => ({
    label: exercise,
    data: stats.map((day) => day.chartData?.[exercise] || 0),
    backgroundColor: exerciseColors[exercise] || 'gray',
  }));

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default WeeklyBarChart;
