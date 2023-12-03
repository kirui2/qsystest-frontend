import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OperatorDashboard from './OperatorDashboard'; // Import OperatorDashboard component
import MasterDisplay from './MasterDisplay'; // Import MasterDisplay component
import OperatorLoginPage from './OperatorLoginPage';
import App from './App';
import TrendingAnalysis from './TrendingAnalysis';
const MainRoutes = () => {
  return (
    <Router>
    <Routes>
      <Route exact path="/trending-analysis" element={<TrendingAnalysis />} />
      <Route exact path="/" element={<App />} />
      <Route exact path="/operator-login" element={<OperatorLoginPage />} />
      <Route path="/dashboard" element={<OperatorDashboard />} />
      <Route path="/master-display" element={<MasterDisplay />} />
    </Routes>
  </Router>
  )
};

export default MainRoutes;
