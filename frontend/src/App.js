import React from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import ModulesPage from './pages/ModulesPage';
import CompetitionRegisterPage from './pages/CompetitionRegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/modules" element={<ModulesPage />} />
      <Route path="/modules/:moduleSlug" element={<ModulesPage />} />
      <Route path="/competitions" element={<ModulesPage />} />
      <Route path="/competitions/:competitionId" element={<CompetitionRegisterPage />} />
      <Route path="/register/:competitionId" element={<CompetitionRegisterPage />} />
      <Route path="/competitions/:competitionId/success" element={<RegistrationSuccessPage />} />
      <Route path="/registration-success/:competitionId" element={<RegistrationSuccessPage />} />
      <Route path="/registration-success" element={<RegistrationSuccessPage />} />
    </Routes>
  );
}

export default App;
