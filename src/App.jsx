import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import KoreaMap from "./components/KoreaMap";
import ChartSection from "./components/ChartSection";
import RegionAnalysisPage from "./pages/RegionAnalysisPage";
import ScenarioPage from "./pages/ScenarioPage";
import "./App.css";
import ChatPage from "./pages/ChatPage";

const regionNameToId = {
  서울: 1, 부산: 2, 대구: 3, 인천: 4, 광주: 5, 대전: 6, 울산: 7,
  세종: 8, 경기: 9, 강원: 10, 충북: 11, 충남: 12, 전북: 13,
  전남: 14, 경북: 15, 경남: 16, 제주: 17,
};

function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionClick = ({ id, name }) => {
    setSelectedRegion({ regionName: name, regionId: id });
  };

  return (
    <main className="container">
      <div className={`map-area ${selectedRegion ? "slide-left" : ""}`}>
        <KoreaMap onRegionClick={handleRegionClick} selectedRegion={selectedRegion} />
      </div>
      {selectedRegion && (
        <div className="chart-area">
          <ChartSection region={selectedRegion} />
        </div>
      )}
    </main>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/region-analysis" element={<RegionAnalysisPage />} />
        <Route path="/scenario" element={<ScenarioPage />} />
        <Route path="/chat" element={<ChatPage />} /> {/* ✅ 챗봇 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;
