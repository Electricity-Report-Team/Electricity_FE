import React from "react";

const MonthSelector = ({ month, onChange }) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1~12

  return (
    <select
      value={month}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {months.map((m) => (
        <option key={m} value={m}>
          {m}월
        </option>
      ))}
    </select>
  );
};

export default MonthSelector;
