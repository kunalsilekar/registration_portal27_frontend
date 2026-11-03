import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import SetNewPasswordPage from './pages/SetNewPasswordPage';
import PasswordResetCompletePage from './pages/PasswordResetCompletePage';
import CommonBackground from './sections/Common_Background';
import RegistrationPage from "./pages/RegistrationPage"
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/common-background" element={<CommonBackground />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ResetPasswordPage />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />
      <Route path="/set-new-password" element={<SetNewPasswordPage />} />
      <Route path="/password-reset-complete" element={<PasswordResetCompletePage />} />
      <Route path="/signup" element={<RegistrationPage />} />
    </Routes>
  );
}

export default App;
