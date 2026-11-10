import "./App.css";
import PageMetadata from "./components/PageMetadata";
import { lazy, Suspense } from "react";
import GoogleProfileCompletionPage from "./pages/GoogleProfileCompletionPage";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { getAuthToken } from "./utils/api";
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
const ModulesPage = lazy(() => import("./pages/ModulesPage"));
const CompetitionRegisterPage = lazy(
  () => import("./pages/CompetitionRegisterPage"),
);
const RegistrationSuccessPage = lazy(
  () => import("./pages/RegistrationSuccessPage"),
);

function RequireAuth({ children }) {
  const location = useLocation();
  return getAuthToken() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

function App() {
  return (
    <>
    <PageMetadata />
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
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/modules/:moduleSlug" element={<ModulesPage />} />
        <Route path="/competitions" element={<ModulesPage />} />
        <Route
          path="/competitions/:competitionId"
          element={
            <RequireAuth>
              <CompetitionRegisterPage />
            </RequireAuth>
          }
        />
        <Route
          path="/register/:competitionId"
          element={
            <RequireAuth>
              <CompetitionRegisterPage />
            </RequireAuth>
          }
        />
        <Route
          path="/competitions/:competitionId/success"
          element={
            <RequireAuth>
              <RegistrationSuccessPage />
            </RequireAuth>
          }
        />
        <Route
          path="/registration-success/:competitionId"
          element={
            <RequireAuth>
              <RegistrationSuccessPage />
            </RequireAuth>
          }
        />
        <Route
          path="/registration-success"
          element={
            <RequireAuth>
              <RegistrationSuccessPage />
            </RequireAuth>
          }
        />
      </Routes>
    </Suspense>
    </>
  );
}
export default App;
