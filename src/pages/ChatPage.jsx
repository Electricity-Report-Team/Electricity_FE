import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("/api/v1/chat", { message: input });
      const gptMsg = { role: "assistant", content: res.data.replace(/^GPT:\s*/, "") };
      setMessages((prev) => [...prev, gptMsg]);
    } catch (err) {
      const errorMsg = { role: "assistant", content: "GPT 응답 실패!" };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setInput("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        padding: "180px 20px",
        fontFamily: "NanumSquareRoundB",
        margin: "0 auto",
        maxWidth: "1200px",
      }}
    >
      <h2
        style={{
          fontSize: "34px",
          fontFamily: "NanumSquareRoundEB",
          marginBottom: "36px",
          textAlign: "center",
        }}
      >
        무엇을 알려드릴까요?
      </h2>

      {/* 메시지 영역 */}
      <div
        style={{
          maxHeight: "660px",
          maxWidth: "1000px",
          overflowY: "auto",
          marginBottom: "36px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              backgroundColor: msg.role === "user" ? "#D9E9FF" : "#F4F4F4",
              padding: "24px 28px",
              marginBottom: "20px",
              borderRadius: "24px",
              fontSize: "20px",
              lineHeight: "2.2",
              whiteSpace: "pre-wrap",
              maxWidth: "90%",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              textAlign: msg.role === "user" ? "right" : "left",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              wordBreak: "break-word",
              fontFamily: "NanumSquareRoundEB",
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      {/* 입력창 */}
      <div style={{ display: "flex", gap: "12px",maxWidth: "1200px", }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="궁금한 내용을 입력하세요"
          style={{
            flex: 1,
            padding: "18px",
            fontSize: "18px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontFamily: "NanumSquareRoundB",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "18px 28px",
            backgroundColor: "#21609E",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "18px",
            fontFamily: "NanumSquareRoundEB",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
