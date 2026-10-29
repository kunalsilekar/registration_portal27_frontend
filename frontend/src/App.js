import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CommonBackground from './sections/Common_Background';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/common-background" element={<CommonBackground />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
