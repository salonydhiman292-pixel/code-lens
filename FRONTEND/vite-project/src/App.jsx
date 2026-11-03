import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import CodeAnalysis from "./pages/CodeAnalysis";
import RiskPrediction from "./pages/RiskPrediction";
import Security from "./pages/Security";
import TechnicalDebt from "./pages/TechnicalDebt";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Main Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Modules */}
      <Route path="/repositories" element={<Repositories />} />
      <Route path="/analysis" element={<CodeAnalysis />} />
      <Route path="/risk" element={<RiskPrediction />} />
      <Route path="/security" element={<Security />} />
      <Route path="/technical-debt" element={<TechnicalDebt />} />
      <Route path="/assistant" element={<AIAssistant />} />

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;