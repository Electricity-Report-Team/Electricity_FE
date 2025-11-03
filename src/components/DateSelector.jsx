import React, { useState, useEffect } from "react";

const DateSelector = ({ year, month, onChange }) => {
  const years = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i);

  const getMonthsByYear = (y) => {
    if (y === 2015) return Array.from({ length: 9 }, (_, i) => i + 4); // 4~12
    if (y === 2025) return Array.from({ length: 3 }, (_, i) => i + 1); // 1~3
    return Array.from({ length: 12 }, (_, i) => i + 1); // 1~12
  };

  const [availableMonths, setAvailableMonths] = useState(getMonthsByYear(year));

  useEffect(() => {
    const newMonths = getMonthsByYear(year);
    setAvailableMonths(newMonths);

    if (!newMonths.includes(month)) {
      onChange({ year, month: newMonths[0] });
    }
  }, [year]);

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <select
        value={year}
        onChange={(e) => onChange({ year: parseInt(e.target.value), month })}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}년
          </option>
        ))}
      </select>

      <select
        value={month}
        onChange={(e) => onChange({ year, month: parseInt(e.target.value) })}
      >
        {availableMonths.map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
