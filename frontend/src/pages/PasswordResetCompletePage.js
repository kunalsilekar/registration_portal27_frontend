import React from 'react';
import { Link } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';
import './PasswordResetCompletePage.css';

function PasswordResetCompletePage() {
  return (
    <CommonBackground className="sign-in-layout password-reset-done-layout" showFooter={false}>
      <section className="sign-in-page password-reset-done-page" aria-label="Password reset complete">
        <Link className="sign-in-back" to="/set-new-password" aria-label="Back to set new password">
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

          <section className="password-reset-done-content" aria-labelledby="password-reset-done-title">
            <header className="password-reset-done-heading">
              <h2 id="password-reset-done-title">ALL DONE !</h2>
              <p>Your Password has been successfully reset.<br />You can now login with your new password.</p>
            </header>

            <svg className="password-reset-done-check" viewBox="0 0 64 64" role="img" aria-label="Success">
              <path d="M48.4 15.6A25 25 0 1 0 56.8 32" />
              <path d="m18.5 31.5 10.2 10.2L53 17.4" />
            </svg>

            <Link className="sign-in-submit password-reset-done-login" to="/login">Back to Login</Link>

            <div className="password-reset-done-progress" role="img" aria-label="Step 4 of 4">
              <span />
              <span />
              <span />
              <span className="is-current" />
            </div>
          </section>
        </div>
      </section>
    </CommonBackground>
  );
}

export default PasswordResetCompletePage;

