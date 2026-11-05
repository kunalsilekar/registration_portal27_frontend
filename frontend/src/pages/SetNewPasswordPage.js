import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';
import './SetNewPasswordPage.css';
import { confirmPasswordResetApi } from '../utils/api';

function SetNewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { newPassword, confirmPassword } = event.currentTarget.elements;
    if (newPassword.value !== confirmPassword.value) {
      setError('The passwords do not match.');
      return;
    }
    const token = location.state?.resetToken || sessionStorage.getItem('alcher_password_reset_token');
    if (!token) {
      setError('Your reset session has expired. Please request a new code.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await confirmPasswordResetApi(token, newPassword.value, confirmPassword.value);
      sessionStorage.removeItem('alcher_password_reset_token');
      sessionStorage.removeItem('alcher_password_reset_email');
      navigate('/password-reset-complete', { replace: true });
    } catch (resetError) {
      setError(resetError.message || 'Could not reset the password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CommonBackground className="sign-in-layout set-password-layout" showFooter={false}>
      <section className="sign-in-page set-password-page" aria-label="Set a new password">
        <Link className="sign-in-back" to="/verify-otp" aria-label="Back to OTP verification">
          <picture>
            <source media="(max-width: 768px)" srcSet="/assets/mobile_back.svg" />
            <img src="/assets/back_symbol.svg" alt="" aria-hidden="true" />
          </picture>
        </Link>

        <div className="sign-in-card">
          <section className="sign-in-promo" aria-label="Discover Alcheringa 2027">
            <div className="sign-in-promo-copy">
              <p>DISCOVER &amp; DINE IN</p>
              <h1>ALCHERINGA 2027</h1>
              <span>Create account now to not miss any updates !</span>
            </div>
          </section>

          <form className="set-password-form" onSubmit={handleSubmit}>
            <div className="set-password-lock-icon" aria-hidden="true">
              <div className="set-password-lock-art">
                <img className="set-password-lock" src="/assets/lock.svg" alt="" />
                <img className="set-password-lock-hole" src="/assets/lock_hole.svg" alt="" />
              </div>
            </div>

            <header className="set-password-heading">
              <h2>SET NEW PASSWORD</h2>
              <p className="desktop-password-hint">Enter New Password. Must be at least 8 characters.</p>
              <p className="mobile-password-hint">Enter new password. Must be at least 8 characters.</p>
            </header>

            <label className="sign-in-field set-password-field">
              <span>New Password</span>
              <input name="newPassword" type="password" placeholder="Enter new password" autoComplete="new-password" minLength={8} required />
            </label>

            <label className="sign-in-field set-password-field">
              <span>Confirm Password</span>
              <input name="confirmPassword" type="password" placeholder="Re-enter new password" autoComplete="new-password" minLength={8} required />
            </label>

            <button className="sign-in-submit set-password-submit" type="submit" disabled={busy}>
              {busy ? 'Resetting...' : 'Reset'}
            </button>
            {error && <p className="google-sign-in-message" role="alert">{error}</p>}

            <div className="set-password-progress" role="img" aria-label="Step 3 of 4">
              <span />
              <span />
              <span className="is-current" />
              <span />
            </div>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default SetNewPasswordPage;


