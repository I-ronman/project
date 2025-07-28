import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#ff7675', '#74b9ff', '#55efc4'];

const WeeklyBarChart = ({ data }) => {
  return (
    <div className="weekly-chart">
      <h3>주간 운동 히스토리</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {['스쿼트', '플랭크', '푸쉬업'].map((type, idx) => (
            <Bar key={type} dataKey={type} stackId="a" fill={COLORS[idx % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyBarChart;
