import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import { googleLoginApi, loginApi, setAuthData } from '../utils/api';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const googleAuthBusyRef = useRef(false);
  const [googleAuthError, setGoogleAuthError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [googleAuthBusy, setGoogleAuthBusy] = useState(false);
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleGoogleCredential = useCallback(async (response) => {
    if (!response?.credential || googleAuthBusyRef.current) return;

    googleAuthBusyRef.current = true;
    setGoogleAuthBusy(true);
    setGoogleAuthError('');
    try {
      const auth = await googleLoginApi(response.credential);
      if (!auth.access) throw new Error('The server did not return an access token.');

      setAuthData(auth.access, auth.user);
      if (auth.refresh) localStorage.setItem('alcher_refresh_token', auth.refresh);
      const needsCompletion = Boolean(auth.needs_completion);
      localStorage.setItem('alcher_needs_completion', String(needsCompletion));
      navigate(needsCompletion ? '/complete-profile' : '/profile', { replace: true });
    } catch (error) {
      setGoogleAuthError(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      googleAuthBusyRef.current = false;
      setGoogleAuthBusy(false);
    }
  }, [navigate]);

  useEffect(() => {
    const buttonHost = googleButtonRef.current;
    if (!buttonHost) return undefined;

    if (!googleClientId) {
      setGoogleAuthError('Google sign-in is not configured for this frontend.');
      return undefined;
    }

    let cancelled = false;
    let resizeObserver;
    let initializedGoogle = false;
    let lastRenderedWidth = 0;
    let script = document.getElementById('google-identity-services');

    const renderGoogleButton = () => {
      if (cancelled || !window.google?.accounts?.id || !buttonHost.isConnected) return;
      const width = Math.max(180, Math.min(400, Math.floor(buttonHost.getBoundingClientRect().width)));
      if (!initializedGoogle) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
        });
        initializedGoogle = true;
      }
      if (lastRenderedWidth === width && buttonHost.childElementCount > 0) return;
      lastRenderedWidth = width;
      buttonHost.replaceChildren();
      window.google.accounts.id.renderButton(buttonHost, {
        theme: 'outline',
        size: window.matchMedia('(max-width: 768px)').matches ? 'large' : 'medium',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else if (!script) {
      script = document.createElement('script');
      script.id = 'google-identity-services';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      script.onerror = () => setGoogleAuthError('Could not load Google sign-in. Check your internet connection.');
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', renderGoogleButton, { once: true });
    }

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(renderGoogleButton);
      resizeObserver.observe(buttonHost);
    }

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      script?.removeEventListener('load', renderGoogleButton);
    };
  }, [googleClientId, handleGoogleCredential]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError('');
    try {
      const { email, password } = event.currentTarget.elements;
      const auth = await loginApi(email.value.trim(), password.value);
      if (!auth.access) throw new Error('The server did not return an access token.');
      setAuthData(auth.access, auth.user);
      if (auth.refresh) localStorage.setItem('alcher_refresh_token', auth.refresh);
      navigate('/profile', { replace: true });
    } catch (error) {
      setLoginError(error.message || 'Sign in failed. Please try again.');
    } finally {
      setLoginBusy(false);
    }
  };

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
            </header>

            <div className={`google-sign-in-control${googleAuthBusy ? ' is-busy' : ''}`}>
              <div
                className="google-sign-in-host"
                ref={googleButtonRef}
                aria-label="Sign up or sign in with Google"
                aria-busy={googleAuthBusy}
              />
            </div>
            {googleAuthError && <p className="google-sign-in-message" role="alert">{googleAuthError}</p>}
            {googleAuthBusy && <p className="google-sign-in-message" aria-live="polite">Signing you in…</p>}

            <div className="sign-in-divider" aria-hidden="true">
              <span />
              <small>or</small>
              <span />
            </div>

            <label className="sign-in-field">
              <span>Email</span>
              <input name="email" type="email" placeholder="Enter your email address here" autoComplete="email" required />
            </label>

            <label className="sign-in-field">
              <span>Password</span>
              <input name="password" type="password" placeholder="Enter your password here" autoComplete="current-password" required />
            </label>

            <Link className="sign-in-reset" to="/forgot-password">Reset Password ?</Link>

            <button className="sign-in-submit" type="submit" disabled={loginBusy}>
              {loginBusy ? 'Signing in...' : 'SignIn'}
            </button>
            {loginError && <p className="google-sign-in-message" role="alert">{loginError}</p>}

            <Link to="/signup" className='signup_button'>
              <div className="sign-in-create-account">
                or <span className="signup-button-label">Create New Account ?</span>
              </div>
            </Link>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default LoginPage;

