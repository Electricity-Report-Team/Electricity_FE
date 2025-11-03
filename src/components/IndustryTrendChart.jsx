import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

const industryColorMap = {
  IT업: "#7B3F98",
  건설업: "#C85C5C",
  교육업: "#F2C94C",
  금융업: "#21609E",
  농림어업: "#4CAF50",
  도소매업: "#56CCF2",
  보건복지업: "#EB5757",
  숙박음식업: "#F2994A",
  운수창고업: "#2D9CDB",
  제조업: "#4F4F4F",
};

// ✅ 강조된 점 (배경색 = 산업 색상)
const CustomActiveDot = ({ cx, cy, fill }) => (
  <circle
    cx={cx}
    cy={cy}
    r={6}
    fill={fill}         // 내부 채우기: 산업 색상
    stroke="#fff"       // 흰 테두리로 강조
    strokeWidth={2}
  />
);

// ✅ 일반 도트 (Hover 트리거용)
const CustomDot = ({
    cx,
    cy,
    payload,
    value,
    stroke,
    dataKey,
    onHover,
    onLeave,
  }) => {
    return (
      <g
        onMouseEnter={() =>
          onHover({
            x: cx,
            y: cy,
            label: payload.year,
            name: dataKey,
            value,
            color: stroke,
            year: payload.year,
            industryName: dataKey,
          })
        }
        onMouseLeave={onLeave}
        style={{ cursor: "pointer" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="white"
          stroke={stroke}
          strokeWidth={2}
        />
      </g>
    );
  };

const IndustryTrendChart = ({ data }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    label: "",
    name: "",
    value: 0,
    color: "",
    year: null,
    industryName: "",
  });

  return (
    <div
  style={{
    position: "relative",
    backgroundColor: "#f9f9f9",         // 밝은 회색 배경
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  }}
>
      <ResponsiveContainer width={950} height={637}>
        <LineChart
        onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
          data={data}
          margin={{ top: 20, right: 40, left: 0, bottom: 40 }}
        >
          <XAxis dataKey="year" tick={{ fontFamily: "NanumSquareRoundEB" }} />
          <YAxis
            tick={{ fontSize: 18, fontFamily: "NanumSquareRoundEB" }}
            tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: 10,
              paddingLeft: 35,
              fontSize: 18,
              fontFamily: "NanumSquareRoundEB",
            }}
          />

          {/* 라인 + 도트 */}
          {Object.keys(data[0] || {})
            .filter((key) => key !== "year")
            .map((industry) => (
              <Line
                key={industry}
                type="monotone"
                dataKey={industry}
                strokeWidth={2}
                stroke={industryColorMap[industry]}
                name={industry}
                isAnimationActive={true} // ✅ 초기만 애니메이션
                dot={({ cx, cy, payload, value }) => (
                  <CustomDot
                    cx={cx}
                    cy={cy}
                    payload={payload}
                    value={value}
                    stroke={industryColorMap[industry]}
                    dataKey={industry}
                    onHover={(info) => setTooltip({ ...info, visible: true })}
                    onLeave={() =>
                      setTooltip((prev) => ({ ...prev, visible: false }))
                    }
                  />
                )}
                activeDot={(props) => {
                  const isActive =
                    tooltip.visible &&
                    props.payload.year === tooltip.year &&
                    props.dataKey === tooltip.industryName;
                  return isActive ? (
                    <CustomActiveDot
                      {...props}
                      fill={industryColorMap[industry]} // ✅ 내부 색상 강제 지정
                    />
                  ) : null;
                }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>

      {/* ✅ 툴팁 */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y - 100, 
            left: tooltip.x,
            transform: "translate(-50%, 0)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "8px",
            fontSize: "18px",
            fontFamily: "NanumSquareRoundEB",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            lineHeight: "1.5",  
          }}
        >
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>{tooltip.label}년</strong>
          </p>
          <p style={{ margin: 0, color: tooltip.color }}>
            {tooltip.name} : {tooltip.value.toLocaleString()} kWh
          </p>
        </div>
      )}
    </div>
  );
};

export default IndustryTrendChart;
