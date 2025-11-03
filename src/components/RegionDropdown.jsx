import React, { useEffect, useState } from "react";
import axios from "axios";

const RegionDropdown = ({ onSelect, selectedRegionId }) => {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/region").then((res) => {
      setRegions(res.data);
    });
  }, []);

  return (
    <select
      onChange={(e) => {
        const selectedId = parseInt(e.target.value);
        const selectedRegion = regions.find((r) => r.regionId === selectedId);
        onSelect(selectedRegion);
      }}
      value={selectedRegionId}
    >
      {regions.map((region) => (
        <option key={region.regionId} value={region.regionId}>
          {region.regionName}
        </option>
      ))}
    </select>
  );
};

export default RegionDropdown;
