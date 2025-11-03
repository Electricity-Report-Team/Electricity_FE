import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const renderDeviationLabel = ({ x, y, width, value }) => {
  if (value === undefined || isNaN(value)) return null;

  const isPositive = value >= 0;
  const color = isPositive ? "#D9534F" : "#5CB85C"; // 빨강 / 초록
  const icon = isPositive ? "▲" : "▼";
  const formatted = `${icon} ${Math.abs(value).toFixed(1)}%`;

  return (
    <g>
      <rect
        x={x + width + 5}
        y={y}
        width={70}
        height={20}
        rx={5}
        ry={5}
        fill={color}
        opacity={0.15}
      />
      <text
        x={x + width + 35}
        y={y + 14}
        textAnchor="middle"
        fill={color}
        fontWeight="bold"
        fontSize={14}
        fontFamily="NanumSquareRoundB"
      >
        {formatted}
      </text>
    </g>
  );
};

const IndustryComparisonChart = ({ data }) => {
    return (
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <ResponsiveContainer width={950} height={637}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 80, left: 20, bottom: 35 }}
            barCategoryGap="30%"
            barSize={15}
            barGap={4}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontFamily: "NanumSquareRoundEB" }}
            />
            <YAxis
              dataKey="industryName"
              type="category"
              tick={{ fontSize: 18, fontFamily: "NanumSquareRoundEB" }}
              width={100}
            />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: 20,
                fontSize: "18px",
                fontFamily: "NanumSquareRoundEB",
              }}
            />
            <Bar dataKey="nationRatio" fill="#8DA3B7" name="전국 평균 (%)" />
            <Bar dataKey="localRatio" fill="#21609E" name="지역 평균 (%)">
              <LabelList
                dataKey="deviationPercent"
                content={renderDeviationLabel}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

export default IndustryComparisonChart;
