import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';
import './ResetPasswordPage.css';

function ResetPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/verify-otp', { state: { email: event.currentTarget.elements.email.value } });
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

            <button className="sign-in-submit reset-password-submit" type="submit">Request OTP</button>

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
