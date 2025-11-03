import React, { useEffect, useState } from "react";
import axios from "axios";
import industryImageMap from "../utils/industryImageMap";
import styles from "./IndustryCauseAnalysis.module.css"; // 스타일링도 필요

const IndustryCauseAnalysis = ({ top3Industries }) => {
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    console.log("📦 top3Industries:", top3Industries);
  
    const fetchCauses = async () => {
      try {
        const results = await Promise.all(
            top3Industries.map((industry) => {
                const url = `/api/v1/industries/${industry.industryId}/cause`;
                console.log("🌐 요청 URL:", url); // ← 여기 중요
                return axios.get(url);
              })
        );
  
        const causeData = results.map((res) => res.data);
        console.log("🎯 원인 API 응답 데이터:", causeData); // ✅ 이 부분 수정됨
        setCauses(causeData);
      } catch (err) {
        console.error("❌ 원인 정보 가져오기 실패:", err);
      }
    };
  
    if (top3Industries.length > 0) {
      fetchCauses();
    }
  }, [top3Industries]);

  return (
    <div className={styles.container}>
      <h2 className={styles["cause-title"]}>전력 과소비 원인 추정</h2>
      <div className={styles.cardWrapper}>
        {causes.map((item) => (
          <div key={item.industryId} className={styles.card}>
            <img
              src={industryImageMap[item.industryName]}
              alt={item.industryName}
              className={styles.image}
            />
            <h3>{item.industryName}</h3>
            <p className={styles.cause}>{item.cause}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustryCauseAnalysis;
