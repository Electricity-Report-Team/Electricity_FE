// RegionAnalysisPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import RegionDropdown from "../components/RegionDropdown";
import IndustryComparisonChart from "../components/IndustryComparisonChart";
import IndustryTrendChart from "../components/IndustryTrendChart";
import "./RegionAnalysisPage.css";

const RegionAnalysisPage = () => {
  const [selectedRegion, setSelectedRegion] = useState({ regionId: 1, regionName: "서울" });
  const [chartData, setChartData] = useState([]);
  const [trendRawData, setTrendRawData] = useState([]);
  const [hoveredIndustry, setHoveredIndustry] = useState(null); // ✅ 추가
  const [hoveredData, setHoveredData] = useState(null);

  useEffect(() => {
    if (selectedRegion.regionId) {
      axios
        .get(`/api/v1/region/${selectedRegion.regionId}/industry-avg-comparison`)
        .then((res) => {
          const rawData = res.data;
          const maxVal = Math.max(...rawData.map(d => Math.max(d.localAvg, d.nationAvg)));

          const normalizedData = rawData.map((item) => ({
            industryName: item.industryName,
            localRatio: (item.localAvg / maxVal) * 100,
            nationRatio: (item.nationAvg / maxVal) * 100,
            deviationPercent: item.deviationPercent,
          }));

          setChartData(normalizedData);
        })
        .catch((err) => {
          console.error("데이터 요청 중 오류:", err);
        });
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedRegion.regionId) {
      axios
        .get(`/api/v1/region/${selectedRegion.regionId}/industry-trend`)
        .then((res) => {
          const raw = res.data;
          const yearlyMap = {};

          raw.forEach((industry) => {
            const { industryName, yearlyData } = industry;
            yearlyData.forEach(({ year, avgPower }) => {
              if (!yearlyMap[year]) yearlyMap[year] = { year };
              yearlyMap[year][industryName] = Math.round(avgPower);
            });
          });

          const chartData = Object.values(yearlyMap).sort((a, b) => a.year - b.year);
          setTrendRawData(chartData);
        });
    }
  }, [selectedRegion]);

  return (
    <div className="region-analysis-page">
      <div className="region-dropdown-fixed">
      <RegionDropdown
  onSelect={(region) => {
    setSelectedRegion(region); // ✅ 지역 ID와 이름을 한꺼번에 저장
  }}
  selectedRegionId={selectedRegion.regionId} // ✅ 선택된 지역 ID 전달
/>
      </div>

      <div className="chart-container">
        <div className="chart-half">
          <h3 className="local-chart-title">
            {selectedRegion.regionName}의 전력 소비량 비교
          </h3>
          {chartData.length > 0 && <IndustryComparisonChart data={chartData} />}
        </div>

        <div className="chart-half">
          <h3 className="trend-chart-title">
            {selectedRegion.regionName} 산업별 전력 사용량 10년 추이
          </h3>
          {trendRawData.length > 0 && (
            <IndustryTrendChart
            data={trendRawData}
            hoveredIndustry={hoveredIndustry}       // ✅ 전달
            hoveredData={hoveredData}               // ✅ 전달
            setHoveredIndustry={setHoveredIndustry} // ✅ 전달
            setHoveredData={setHoveredData}         // ✅ 전달
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionAnalysisPage;
