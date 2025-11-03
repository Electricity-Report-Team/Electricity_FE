// src/components/Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import chatbotIcon from "../assets/ChatBot.svg";
import CarouselText from "./CarouselText";

function Navbar() {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false); // ✅ 상태 추가

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        backgroundColor: "#21609E",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        fontFamily: "NanumSquareRound",
        zIndex: 1000,
      }}
    >
      {/* 로고 */}
      <div
        onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
      >
        <img src={logo} alt="로고" style={{ height: "70px" }} />
        <h2 style={{ color: "white", fontSize: "30px", fontFamily: "NanumSquareRoundEB" }}>
          우리 전기 리포트
        </h2>
      </div>

      {/* 메뉴 */}
      <nav
        style={{
          display: "flex",
          gap: "120px",
          color: "white",
          fontSize: "24px",
          fontFamily: "NanumSquareRoundEB",
        }}
      >
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/region-analysis")}>
          지역 전력 소비량 분석
        </span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/scenario")}>
          전력 절감 시나리오
        </span>
      </nav>

      {/* 검색 + 챗봇 */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <CarouselText />
        <button
          onClick={() => navigate("/chat")} 
          style={{
            backgroundColor: "transparent",
            border: "none",
            padding: "0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            outline: "none",
          }}
        >
          <img src={chatbotIcon} style={{ height: "48px", marginRight: "6px" }} alt="chatbot" />
        </button>
      </div>

      {/* ✅ ChatModal은 헤더 외부에 띄우도록 렌더링 */}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
    </header>
  );
}

export default Navbar;
