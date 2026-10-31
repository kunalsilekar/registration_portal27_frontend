import React from 'react';
import { Link } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';

function LoginPage() {
  const handleSubmit = (event) => event.preventDefault();

  return (
    <CommonBackground className="sign-in-layout">
      <section className="sign-in-page" aria-label="Sign in to Alcheringa">
        <Link className="sign-in-back" to="/" aria-label="Back to home">
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

          <form className="sign-in-form" onSubmit={handleSubmit}>
            <header className="sign-in-heading">
              <h2>SIGN IN</h2>
              <p>
                Don’t have an account ? <Link to="/signup">Sign Up</Link>
              </p>
            </header>

            <button className="sign-in-google" type="button">
              <img src="/assets/google.svg" alt="" aria-hidden="true" />
              <span>Signup with Google</span>
            </button>

            <div className="sign-in-divider" aria-hidden="true">
              <span />
              <small>or</small>
              <span />
            </div>

            <label className="sign-in-field">
              <span>Name</span>
              <input name="name" type="text" placeholder="Enter your full name here" autoComplete="name" />
            </label>

            <label className="sign-in-field">
              <span>Password</span>
              <input name="password" type="password" placeholder="Enter your password here" autoComplete="current-password" />
            </label>

            <Link className="sign-in-reset" to="/forgot-password">Reset Password ?</Link>

            <button className="sign-in-submit" type="submit">SignIn</button>

            <div className="sign-in-create-account">
              or <Link to="/signup">Create New Account ?</Link>
            </div>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default LoginPage;
