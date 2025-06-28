import React from "react";
import logo from "../assets/logo.png";
import chatbotIcon from "../assets/ChatBot.svg";
import CarouselText from "./CarouselText";

function Navbar() {
  return (
    <header
    style={{
        position: "fixed", // 상단 고정
        top: 0, // 상단부터
        left: 0,
        width: "100vw",
        backgroundColor: "#21609E",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        fontFamily: "NanumSquareRound",
        zIndex: 1000, // 다른 요소 위에 오도록
      }}
    >
      {/* 왼쪽: 로고 + 텍스트 */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img src={logo} alt="로고" style={{ height: "70px" }} />
        <h2 style={{ color: "white", fontSize: "25px", fontFamily: "NanumSquareRoundEB" }}>우리 전기 리포트</h2>
      </div>

      {/* 가운데: 메뉴들 */}
      <nav style={{ display: "flex", gap: "32px", color: "white", fontSize: "20px", fontFamily: "NanumSquareRoundEB" }}>
        <span>지역 전력 소비량 분석</span>
        <span>전력 절감 시나리오</span>
      </nav>

      {/* 오른쪽: 검색창 + 챗봇 */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <CarouselText />
        
        <button
          style={{
            backgroundColor: "transparent", // ← 흰 배경 → 투명하게 변경
            border: "none",
            padding: "0",                   // 패딩 없애기
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            outline: "none",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <img src={chatbotIcon} style={{ height: "48px", marginRight: "6px"}} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
