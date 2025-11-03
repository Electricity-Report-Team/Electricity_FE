import React from "react";

const TooltipBox = ({ region, industries, x, y }) => {
  if (!region) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "#ffffff",
        border: "2px solid #f1c40f",
        borderRadius: "12px",
        padding: "16px 20px",
        boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        pointerEvents: "none",
        minWidth: "200px",
        fontFamily: "NanumSquareRoundB, sans-serif",
        lineHeight: "1.8",
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <strong
        style={{
          fontFamily: "NanumSquareRoundEB",
          fontWeight: 700,
          fontSize: "16px",
          color: "#1A3F66",
          display: "block",
          marginBottom: "12px",
        }}
      >
        ⚡ {region} 전력 사용량 TOP 5
      </strong>

      {industries ? (
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#333" }}>
          {industries.map((item, index) => (
            <li key={index} style={{ marginBottom: "6px" }}>
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <p style={{ marginTop: "8px", color: "#888" }}>데이터 불러오는 중...</p>
      )}
    </div>
  );
};

export default TooltipBox;
