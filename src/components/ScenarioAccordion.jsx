import React, { useState } from "react";

const ScenarioAccordion = ({ scenarios, onToggleScenario }) => {
  const [openIndexes, setOpenIndexes] = useState(new Set());
  const [checked, setChecked] = useState({});

  const toggleAccordion = (index) => {
    const updated = new Set(openIndexes);
    updated.has(index) ? updated.delete(index) : updated.add(index);
    setOpenIndexes(updated);
  };

  const handleCheckboxChange = (index, scenario) => {
    const isChecked = !checked[index];
    const updated = { ...checked, [index]: isChecked };
    setChecked(updated);
    onToggleScenario(scenario, isChecked); // ✅ 체크 여부 전달
  };

  return (
    <div style={{ padding: "40px 80px", maxWidth: "1400px", margin: "0 auto" }}>
      {scenarios.map((item, index) => {
        const isOpen = openIndexes.has(index);
        const decrease = Number(item.decrease);
        const originalCharge = Number(item.originalCharge);
        const reducedCharge = Number(item.reducedCharge);
        const originalPower = Number(item.originalPower);
        const reducedPower = Number(item.reducedPower);

        return (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              transition: "all 0.3s ease",
            }}
          >
            {/* 상단 제목줄 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => toggleAccordion(index)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  checked={!!checked[index]}
                  onClick={(e) => e.stopPropagation()} // ✅ 아코디언 토글 막기
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(index, item); // ✅ 체크 처리
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    transform: "scale(1)",
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: "bold",
                    color: "#054A91",
                  }}
                >
                  [{item.industryName}] {item.solution}
                </span>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#054A91",
                  transition: "transform 0.2s ease",
                }}
              >
                {isOpen ? "▲" : "▼"}
              </div>
            </div>

            {/* 아코디언 내용 */}
            {isOpen && (
              <div style={{ marginTop: "50px", fontSize: "22px", color: "#333" }}>
                <p>{item.detail}</p>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "50px",
                    fontSize: "20px",
                    lineHeight: "1.6",
                    color: "#1f2d3d",
                    border: "1px solid #ccc",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "bold",
                          textAlign: "center",
                          borderRight: "1px solid #ccc",
                          borderBottom: "1px solid #ccc",
                          backgroundColor: "#f9f9f9",
                          width: "25%",
                        }}
                      >
                        📉 절감률
                      </td>
                      <td
                        colSpan="3"
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        {`${decrease.toLocaleString()}%`}
                      </td>
                    </tr>
                    <tr>
                      <td style={cellTitle}>⚡ 절감 전 전력량</td>
                      <td style={cellValue}>
                        {`${Math.round(originalPower).toLocaleString()} kWh`}
                      </td>
                      <td style={cellTitle}>💡 절감 전 전기세</td>
                      <td style={cellValue}>
                        {`${Math.round(originalCharge).toLocaleString()} 원`}
                      </td>
                    </tr>
                    <tr>
                      <td style={cellTitle}>⚡ 절감 후 전력량</td>
                      <td style={cellValue}>
                        {`${Math.round(reducedPower).toLocaleString()} kWh`}
                      </td>
                      <td style={cellTitle}>💡 절감 후 전기세</td>
                      <td style={cellValue}>
                        {`${Math.round(reducedCharge).toLocaleString()} 원`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const cellTitle = {
  padding: "12px",
  fontWeight: "bold",
  textAlign: "center",
  borderRight: "1px solid #ccc",
  borderBottom: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
};

const cellValue = {
  padding: "12px",
  textAlign: "center",
  borderRight: "1px solid #ccc",
  borderBottom: "1px solid #ccc",
};

export default ScenarioAccordion;
