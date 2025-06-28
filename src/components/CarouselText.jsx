import React, { useState, useEffect } from "react";

const phrases = [
  "우리 지역의 전력 소비량을 알려줘",
  "전력 절감 방법을 추천해줘",
  "산업별 소비 전력을 보고 싶어",
];

function CarouselText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        borderRadius: "24px",
        padding: "8px 16px",
        width: "400px",
        backgroundColor: "#EEEEEE",
        fontSize: "14px",
        color: "#878D96",
        fontFamily: "NanumSquareRound",
        height: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s ease",
      }}
    >
      {`“${phrases[index]}”`}
    </div>
  );
}

export default CarouselText;
