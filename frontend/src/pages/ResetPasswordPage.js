import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';
import './ResetPasswordPage.css';
import { requestPasswordResetApi } from '../utils/api';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.currentTarget.elements.email.value.trim();
    setBusy(true);
    setError('');
    try {
      await requestPasswordResetApi(email);
      sessionStorage.setItem('alcher_password_reset_email', email);
      sessionStorage.setItem('alcher_otp_flow', 'password-reset');
      navigate('/verify-otp', { state: { email, flow: 'password-reset' } });
    } catch (requestError) {
      setError(requestError.message || 'Could not send the reset code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CommonBackground className="sign-in-layout reset-password-layout" showFooter={false}>
      <section className="sign-in-page reset-password-page" aria-label="Reset password">
        <Link className="sign-in-back" to="/login" aria-label="Back to sign in">
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

          <form className="reset-password-form" onSubmit={handleSubmit}>
            <header className="reset-password-heading">
              <h2>RESET PASSWORD</h2>
              <p>No worries! Enter your email address below and we’ll send you a confirmation code to reset your password.</p>
            </header>

            <label className="sign-in-field reset-password-field">
              <span>Email</span>
              <input name="email" type="email" placeholder="Enter your email address here" autoComplete="email" required />
            </label>

            <button className="sign-in-submit reset-password-submit" type="submit" disabled={busy}>
              {busy ? 'Sending...' : 'Request OTP'}
            </button>
            {error && <p className="google-sign-in-message" role="alert">{error}</p>}

            <div className="reset-password-progress" role="img" aria-label="Step 1 of 4">
              <span className="is-current" />
              <span />
              <span />
              <span />
            </div>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default ResetPasswordPage;
