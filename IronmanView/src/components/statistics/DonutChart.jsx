// project/IronmanView/src/components/statistics/DonutChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ data }) => {
  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);

  const colors = ['#f87171', '#60a5fa', '#4ade80', '#c084fc', '#fb923c', '#14b8a6'];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, values.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { color: '#fff' } },
    },
  };

  return (
    <div style={{ width: 180, height: 180 }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default DonutChart;
