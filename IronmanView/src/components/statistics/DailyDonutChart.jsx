import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DailyDonutChart = ({ data = {}, colors = {} }) => {
  const labels = Object.keys(data || {});
  const values = Object.values(data || {});
  const chartColors = labels.map((label) => colors[label] || '#ccc');

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default DailyDonutChart;
