// ✅ ScenarioPage.jsx
import React, { useEffect, useState } from "react";
import RegionDropdown from "../components/RegionDropdown";
import IndustryTop3Chart from "../components/IndustryTop3Chart";
import axios from "axios";
import styles from "./ScenarioPage.module.css";
import IndustryCauseAnalysis from "../components/IndustryCauseAnalysis";
import ScenarioAccordion from "../components/ScenarioAccordion";

const DEFAULT_REGION_ID = 1;

const ScenarioPage = () => {
  const [selectedRegionId, setSelectedRegionId] = useState(DEFAULT_REGION_ID);
  const [regionName, setRegionName] = useState("서울");
  const [top3Industries, setTop3Industries] = useState([]);
  const [totalPower, setTotalPower] = useState(null);
  const [totalCharge, setTotalCharge] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarios, setSelectedScenarios] = useState([]);

  useEffect(() => {
    if (!selectedRegionId) return;

    axios
      .get(`/api/v1/region/${selectedRegionId}/total-prediction`)
      .then((res) => {
        setTotalPower(res.data.predictTotalPower);
        setTotalCharge(res.data.predictTotalCharge);
      });

    axios
      .get(`/api/v1/scenario/${selectedRegionId}/Top3`)
      .then((res) => {
        setTop3Industries(res.data);
        const top3Names = res.data.map((item) => item.industryName);

        axios
          .get(`/api/v1/regions/${selectedRegionId}/scenario`)
          .then((response) => {
            const allScenarios = response.data;
            const filtered = allScenarios.filter((s) =>
              top3Names.includes(s.industryName)
            );
            setScenarios(filtered);
          });
      });
  }, [selectedRegionId]);

  const handleScenarioToggle = (scenario) => {
    setSelectedScenarios((prev) => {
      const exists = prev.find(
        (s) => s.industryName === scenario.industryName && s.solution === scenario.solution
      );
      return exists
        ? prev.filter(
            (s) => !(s.industryName === scenario.industryName && s.solution === scenario.solution)
          )
        : [...prev, scenario];
    });
  };

  const calculateReducedCharge = () => {
    let reduced = totalCharge;
    selectedScenarios.forEach((item) => {
      reduced -= item.originalCharge * (item.decrease / 100);
    });
    return Math.round(reduced);
  };

  const calculateReducedPower = () => {
    let reduced = totalPower;
    selectedScenarios.forEach((item) => {
      reduced -= item.originalPower * (item.decrease / 100);
    });
    return Math.round(reduced);
  };

  return (
    <div className={styles["scenario-page"]} style={{ paddingTop: "200px", paddingBottom: "150px" }}>
      <div className={styles["region-dropdown-fixed"]}>
        <RegionDropdown
          onSelect={(region) => {
            setSelectedRegionId(region.regionId);
            setRegionName(region.regionName);
          }}
          selectedRegionId={selectedRegionId}
        />
      </div>

      {top3Industries.length > 0 && (
        <>
          <div style={{ textAlign: "center" }}>
            <div className={styles["scenario-chart-title"]}>
              2026년 {regionName} TOP3 전력 과소비 산업
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "80px", alignItems: "flex-start", marginTop: "-50px" }}>
            <div className={styles["chart-container"]}>
              <IndustryTop3Chart data={top3Industries} />
            </div>
          </div>
        </>
      )}

      {totalPower != null && totalCharge != null && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#f0f0f0",
            padding: "16px 24px",
            minHeight: "80px",
            textAlign: "right",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <div style={{ fontSize: "25px", color: "#E02828", lineHeight: "1.6" , paddingRight:"50px"}}>
  2026년 {regionName} 총 전력 소비량 {Math.round(calculateReducedPower() / 1_000_000).toLocaleString()} GWh
  <br />
  2026년 {regionName} 총 전기세 {(calculateReducedCharge() / 100_000_000).toFixed(2)} 억원
</div>
        </div>
      )}

      {top3Industries.length > 0 && (
        <IndustryCauseAnalysis top3Industries={top3Industries} />
      )}

      {scenarios.length > 0 && (
        <>
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <div className={styles["scenario-chart-title"]}>
              2026년 {regionName} 절감 시나리오
            </div>
          </div>
          <ScenarioAccordion
  scenarios={scenarios}
  selectedScenarios={selectedScenarios}
  onToggleScenario={handleScenarioToggle} // ✅ 올바른 prop 이름으로 수정!
/>
        </>
      )}
    </div>
  );
};

export default ScenarioPage;
