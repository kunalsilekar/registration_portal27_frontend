import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';
import './SetNewPasswordPage.css';

function SetNewPasswordPage() {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/password-reset-complete');
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
              <p className="desktop-password-hint">Enter New Password. Must be at least 6 characters.</p>
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

            <button className="sign-in-submit set-password-submit" type="submit">Reset</button>

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


