import "./App.css";
import { lazy, Suspense } from "react";
import GoogleProfileCompletionPage from "./pages/GoogleProfileCompletionPage";
import { Routes, Route } from "react-router-dom";
import CommonBackground from "./sections/Common_Background";
import MyProfile from "./pages/MyProfile";
import Errorpage from "./pages/Errorpage";
import DelayedFallback from "./components/DelayedFallback";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const OtpVerificationPage = lazy(() => import("./pages/OtpVerificationPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const SetNewPasswordPage = lazy(() => import("./pages/SetNewPasswordPage"));
const PasswordResetCompletePage = lazy(
  () => import("./pages/PasswordResetCompletePage"),
);

function App() {
  return (
    <Suspense fallback={<DelayedFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/common-background" element={<CommonBackground />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ResetPasswordPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/set-new-password" element={<SetNewPasswordPage />} />
        <Route
          path="/password-reset-complete"
          element={<PasswordResetCompletePage />}
        />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="*" element={<Errorpage />} />
        <Route
          path="/complete-profile"
          element={<GoogleProfileCompletionPage />}
        />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </Suspense>
  );
}

export default App;
