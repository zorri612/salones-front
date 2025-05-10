import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import DetalleSalon from "./DetalleSalon";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salon/:nombre" element={<DetalleSalon />} />
      </Routes>
    </Router>
  );
}

export default App;
