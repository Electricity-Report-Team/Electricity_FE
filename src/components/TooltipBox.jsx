import React from "react";

const TooltipBox = ({ region, industries, x, y }) => {
  if (!region) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        pointerEvents: "none",
        minWidth: "160px",
      }}
    >
      <strong>⚡ {region} 전력 사용량 TOP 5</strong>
      {industries ? (
        <ol style={{ marginTop: "5px" }}>
          {industries.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      ) : (
        <p style={{ marginTop: "8px", color: "#888" }}>데이터 불러오는 중...</p>
      )}
    </div>
  );
};

export default TooltipBox;
