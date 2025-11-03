import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#21609E", "#8DA3B7", "#2A9D8F"];


// 외부 라벨 렌더링
const renderOuterLabel = ({
    cx, cy, midAngle, outerRadius, index, value, name
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={20}
        fontWeight="bold"
      >
        {`${name}: ${Math.round(value / 1_000_000)} GWh`}
      </text>
    );
  };
  
  // 내부 퍼센트 라벨 렌더링
  const renderPercentLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={18}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

const IndustryTop3Chart = ({ data }) => {
  if (!Array.isArray(data)) {
    return <div>산업 데이터가 없습니다.</div>;
  }

  const chartData = data.map((item) => ({
    name: item.industryName,
    value: item.predictAvgPower,
  }));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "30px", // ✅ 여기가 표와 그래프 간 간격
        marginTop: "20px",
      }}
    >
      {/* 원그래프 */}
      <div>
      <PieChart width={800} height={600}>
  {/* 외부 GWh 라벨 */}
  <Pie
    data={chartData}
    cx="50%"
    cy="50%"
    outerRadius={160}
    fill="#8884d8"
    dataKey="value"
    labelLine={true}
    label={renderOuterLabel}
  >
    {chartData.map((_, index) => (
      <Cell key={`outer-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>

  {/* 내부 퍼센트 라벨 */}
  <Pie
    data={chartData}
    cx="50%"
    cy="50%"
    outerRadius={160}
    innerRadius={80}
    fill="#8884d8"
    dataKey="value"
    labelLine={false}
    label={renderPercentLabel}
    isAnimationActive={false} // ← 두 Pie 겹칠 때 깜빡임 방지
  >
    {chartData.map((_, index) => (
      <Cell key={`inner-${index}`} fill="rgba(0,0,0,0)" /> // 투명 처리
    ))}
  </Pie>

  <Legend
  wrapperStyle={{
    marginLeft: "70px", // ← 필요에 따라 조절 (예: 80px, 100px 등)
  }}
/>
</PieChart>
      </div>

      {/* ✅ 표를 div로 감싸서 gap 적용되도록 */}
      <div style={{ width: "1000px", marginTop: "195px", height: "500px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "22px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>순위</th>
              <th style={thStyle}>산업명</th>
              <th style={thStyle}>2026년 예측 전력 소비량</th>
              <th style={thStyle}>2026년 예측 전기세</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{item.rank}</td>
                <td style={tdStyle}>{item.industryName}</td>
                <td style={tdStyle}>{item.predictAvgPower.toLocaleString()} kWh</td>
                <td style={tdStyle}>{item.predictAvgCharge.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
  fontSize: "22px",
  lineHeight: "1.4", 
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
  fontSize: "20px",
  lineHeight: "1.2", 
};

export default IndustryTop3Chart;
