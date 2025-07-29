import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#ff7675', '#74b9ff', '#55efc4'];

const DonutChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.percentage
  }));

  return (
    <div className="donut-chart">
      <PieChart width={180} height={180}>
        <Pie
          data={chartData}
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
        >
          {chartData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <div className="legend">
        {chartData.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
