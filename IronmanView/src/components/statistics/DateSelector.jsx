// project/IronmanView/src/components/statistics/DateSelector.jsx
import React from 'react';

const DateSelector = ({ selectedDate, setSelectedDate }) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - 3 + i);
    return date;
  });

  return (
    <div className="date-selector">
      {days.map((day, idx) => {
        const dayStr = day.getDate();
        const dayName = day.toLocaleDateString('ko-KR', { weekday: 'short' });
        const isSelected = day.toDateString() === selectedDate.toDateString();
        return (
          <button
            key={idx}
            className={`date-btn ${isSelected ? 'active' : ''}`}
            onClick={() => setSelectedDate(day)}
          >
            <div>{dayStr}</div>
            <div>{dayName}</div>
          </button>
        );
      })}
    </div>
  );
};

export default DateSelector;
