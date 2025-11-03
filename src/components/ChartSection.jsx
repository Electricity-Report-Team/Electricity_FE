import React, { useEffect, useState } from "react";
import DateSelector from "./DateSelector";
import MonthSelector from "./MonthSelector";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./ChartSection.css";
import { Cell } from "recharts";

//상위 3개 인덱스
const getTop3Indices = (data) => {
  return [...data]
    .map((item, index) => ({ ...item, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => item.index);
};

// 지역 이름을 regionId로 매핑
const regionNameToId = {
  서울: 1, 부산: 2, 대구: 3, 인천: 4, 광주: 5, 대전: 6, 울산: 7,
  세종: 8, 경기: 9, 강원: 10, 충북: 11, 충남: 12, 전북: 13,
  전남: 14, 경북: 15, 경남: 16, 제주: 17,
};

const ChartSection = ({ region }) => {
  const [date1, setDate1] = useState({ year: 2025, month: 1 });
  const [month2, setMonth2] = useState(1);
  const [activeTab, setActiveTab] = useState("전력 소비량"); // 탭 상태

  const [data2025, setData2025] = useState([]);
  const [data2026, setData2026] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!region?.regionId) {
          console.warn("Invalid region object:", region);
          return;
        }
        const regionId = region.regionId;

        const endpoint =
          activeTab === "전력 소비량"
            ? `/api/v1/regions/${regionId}/monthly-consumption`
            : `/api/v1/regions/${regionId}/monthly-charge`;
  
        const res = await axios.get(endpoint, {
          params: {
            year: date1.year,
            month: date1.month,
          },
        });

        const key =
          activeTab === "전력 소비량" ? "industriesPower" : "industriesCharge";

        if (res.data && res.data[key]) {
          const formatted = res.data[key].map((item) => ({
            name: item.industryName,
            value:
              activeTab === "전력 소비량" ? item.power : item.charge,
          }));
          setData2025(formatted);
        } else {
          console.warn("Invalid data format:", res.data);
          setData2025([]);
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
        setData2025([]);
      }
    };
  
    fetchData();
  }, [region, date1,activeTab]);
  

  // 2026 예측값 (2025년 기준으로 계산)
  useEffect(() => {
    const fetchPrediction = async () => {
      if (!region?.regionId) return;
    
      try {
        const res = await axios.get(
          `/api/v1/regions/${region.regionId}/predicted-consumption`,
          {
            params: {
              predictMonth: month2,
            },
          }
        );
    
        const key = "industryPower"; // ← 여기 수정!
    
        if (res.data && res.data[key]) {
          const formatted = res.data.industryPower.map((item) => ({
            name: item.industryName,
            value: item.predictPower,
          }));
          setData2026(formatted);
          console.log("📊 예측 데이터 저장됨:", formatted);
        } else {
          console.warn("예측 응답 형식 오류:", res.data);
          setData2026([]);
        }
      } catch (error) {
        console.error("예측 API 호출 실패:", error);
        setData2026([]);
      }
    };
    
  
    fetchPrediction();
  }, [region, month2, activeTab]);

  return (
    <div className="chart-wrapper">
      {/* 2025년 실제 소비 */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-header-top">
            <div className="left-controls">
              <DateSelector
                year={date1.year}
                month={date1.month}
                onChange={setDate1}
              />
            </div>
            <strong className="chart-title">
              {region?.regionName || "지역"} 산업별 {activeTab}
            </strong>
          </div>

          <div className="tab-menu">
            <button
              className={activeTab === "전력 소비량" ? "active" : ""}
              onClick={() => setActiveTab("전력 소비량")}
            >
              전력 소비량
            </button>
            <button
              className={activeTab === "전기세" ? "active" : ""}
              onClick={() => setActiveTab("전기세")}
            >
              전기세
            </button>
          </div>
        </div>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data2025}
              margin={{ top: 50, right: 30, left: 50, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"tick={{ fontSize: 15, fontFamily: 'NanumSquareRoundEB' }}/>
              <YAxis domain={[0, "dataMax"]} tickCount={6}tick={{
                    fontSize: 15,
                    fontFamily: 'NanumSquareRoundEB',
                    }}tickFormatter={(value) =>
                    activeTab === "전기세" ? `${(value / 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}만원`: `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}MWh`
                    }/>
              <Tooltip />
              <Bar dataKey="value" barSize={25}>
                {data2025.map((entry, index) => {
                  const top3 = getTop3Indices(data2025);
                  const color = top3.includes(index)
                    ? "#C85C5C"
                    : "#21609E";
                  return (
                    <Cell key={`cell-2025-${index}`} fill={color} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2026년 예측 소비 */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-header-top">
            <div className="left-controls">
              <select value={2026} disabled className="year-dropdown">
                <option value={2026}>2026년</option>
              </select>
              <MonthSelector month={month2} onChange={setMonth2} />
            </div>
            <strong className="chart-title">
              2026년 산업별 {activeTab} 예측
            </strong>
          </div>

          <div className="tab-menu">
            <button
              className={activeTab === "전력 소비량" ? "active" : ""}
              onClick={() => setActiveTab("전력 소비량")}
            >
              전력 소비량
            </button>
            <button
              className={activeTab === "전기세" ? "active" : ""}
              onClick={() => setActiveTab("전기세")}
            >
              전기세
            </button>
          </div>
        </div>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data2026}
              margin={{ top: 50, right: 30, left: 50, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"tick={{ fontSize: 15, fontFamily: 'NanumSquareRoundEB' }}/>
              <YAxis domain={[0, "dataMax"]} tickCount={6}tick={{
                    fontSize: 15,
                    fontFamily: 'NanumSquareRoundEB',
                    }}tickFormatter={(value) =>
                    activeTab === "전기세" ? `${(value / 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}만원`: `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}MWh`
                    }/>
              <Tooltip />
              <Bar dataKey="value" barSize={25}>
                {data2026.map((entry, index) => {
                  const top3 = getTop3Indices(data2026);
                  const color = top3.includes(index)
                    ? "#C85C5C"
                    : "#21609E";
                  return (
                    <Cell key={`cell-2026-${index}`} fill={color} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;