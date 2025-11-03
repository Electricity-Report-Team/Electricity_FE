import React, { useEffect, useRef, useState } from "react";
import TooltipBox from "./TooltipBox";
import "./KoreaMap.css";

const KoreaMap = ({ onRegionClick , selectedRegion}) => {
  const svgRef = useRef(null);
  const [tooltipInfo, setTooltipInfo] = useState({ region: null, x: 0, y: 0 });
  const [top5Data, setTop5Data] = useState(null); // ← top5 데이터 상태 추가
  const regionNameToId = {
    서울: 1,
    부산: 2,
    대구: 3,
    인천: 4,
    광주: 5,
    대전: 6,
    울산: 7,
    세종: 8,
    경기: 9,
    강원: 10,
    충북: 11,
    충남: 12,
    전북: 13,
    전남: 14,
    경북: 15,
    경남: 16,
    제주: 17,
  };
  useEffect(() => {
    fetch("/southKoreaHigh_with_labels.svg")
      .then((res) => res.text())
      .then((svgText) => {
        svgRef.current.innerHTML = svgText;
  
        const paths = svgRef.current.querySelectorAll("path");
        const texts = svgRef.current.querySelectorAll("text");
        const circles = svgRef.current.querySelectorAll("circle");
  
        paths.forEach((path) => {
          const regionName =
            path.getAttribute("title") ||
            path.getAttribute("aria-label") ||
            path.getAttribute("id");

            const isSelected = selectedRegion?.regionName === regionName;
            path.style.cursor = "pointer";
            path.style.fill = isSelected ? "#21609E" : "#CCCCCC";
            path.style.transition = "fill 0.3s ease";
  
          // 연결된 텍스트와 점 찾기
          const relatedText = [...texts].find((t) =>
            t.textContent.includes(regionName)
          );
          const relatedCircle = [...circles].find((c) => {
            // 텍스트 기준으로 비교
            if (!relatedText) return false;
          
            const textX = parseFloat(relatedText.getAttribute("x"));
            const textY = parseFloat(relatedText.getAttribute("y"));
            const circleX = parseFloat(c.getAttribute("cx"));
            const circleY = parseFloat(c.getAttribute("cy"));
          
            // 텍스트와 좌표상 가까운 circle만 매칭 (오차 범위 ±15px)
            return (
              Math.abs(textX - circleX) < 15 && Math.abs(textY - circleY) < 15
            );
          });
  
          // 마우스 오버
          path.addEventListener("mouseenter", (e) => {
            path.style.fill = "#21609E";
  
            if (relatedText) relatedText.setAttribute("fill", "#ffffff");
            if (relatedCircle) relatedCircle.setAttribute("fill", "#FFFFFF");
  
            const svgRect = svgRef.current.getBoundingClientRect();
            const adjustedX = e.clientX - svgRect.left - 50;
            const adjustedY = e.clientY - svgRect.top + 10;
            setTooltipInfo({
              region: regionName,
              x: adjustedX,
              y: adjustedY
            });
            const regionId = regionNameToId[regionName];
            if (regionId) {
              fetch(`/api/v1/regions/${regionId}/top5`)
                .then((res) => res.json())
                .then((data) => {
                  console.log("백엔드 응답:", data);
                  setTop5Data(data);
                })
                .catch((err) => {
                  console.error("데이터 요청 실패:", err);
                  setTop5Data(null);
                });
            } else {
              setTop5Data(null);
            }
          });
  
          // 마우스 아웃
          path.addEventListener("mouseleave", () => {
            const isStillSelected = selectedRegion?.regionName === regionName;
            path.style.fill = isStillSelected ? "#21609E" : "#CCCCCC";
          
            if (relatedText) relatedText.setAttribute("fill", "#23374D"); 
            if (relatedCircle) relatedCircle.setAttribute("fill", "#23374D");
          
            setTooltipInfo({ region: null, x: 0, y: 0 });
          });
          path.addEventListener("click", () => {
            if (onRegionClick) {
              const regionId = regionNameToId[regionName];
              if (regionId) {
                onRegionClick({ id: regionId, name: regionName }); // ✅ 객체 전달
              }
            }
          });
        });
      });
  }, [selectedRegion]);
  
  
  
  

  return (
    <div
  className="map-wrapper"
  style={{ display: "flex", flexDirection: "column", alignItems: "center",
  position: "relative" }}
>
  {/* 지도 SVG */}
  <div className="svg-container" ref={svgRef} />

  {/* 툴팁 */}
  <TooltipBox
  region={tooltipInfo.region}
  x={tooltipInfo.x}
  y={tooltipInfo.y}
  industries={top5Data?.top5Industries}
/>

  {/* 👇 추가 문구 (지도 아래에 표시됨) */}
  <p
    style={{
      marginTop: "32px",
      fontSize: "20px",
      color: "#878D96",
      fontFamily: "NanumSquareRound",
      textAlign: "center",
    }}
  >
    지도를 클릭하여 지역별 전력 소비 분석을 확인하세요.
  </p>
</div>
  );
};

export default KoreaMap;
