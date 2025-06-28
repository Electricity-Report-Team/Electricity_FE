import React from "react";
import Navbar from "./components/Navbar";
import KoreaMap from "./components/KoreaMap";

function App() {
  return (
    <>
      <Navbar />
      <main
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <KoreaMap />
      </main>
    </>
  );
}

export default App;
