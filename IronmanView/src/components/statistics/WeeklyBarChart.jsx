import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const WeeklyBarChart = ({ stats, exerciseColors, dates }) => {
  // dates 길이 = 7, stats도 7개라고 가정
  const data = dates.map((d, idx) => {
    const day = stats[idx]?.chartData || {};
    return {
      name: `${d.getDate()}일`,
      ...day
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis
          label={{ value: '시간(hrs)', angle: -90, position: 'insideLeft', offset: 0 }}
          allowDecimals={false}
        />
        <Tooltip formatter={val => `${val}시간`} />
        {Object.entries(exerciseColors).map(([key, color]) => (
          <Bar key={key} dataKey={key} stackId="a" fill={color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyBarChart;
