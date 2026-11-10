import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import { googleLoginApi, registerApi, setAuthData } from '../utils/api';
import './LoginPage.css';
import './RegistrationPage.css';

// Popular dial codes for international & domestic registration
const COUNTRY_CODES = [
  { code: '+91', label: '+91' },
  { code: '+1', label: '+1' },
  { code: '+44', label: '+44' },
  { code: '+61', label: '+61' },
  { code: '+971', label: '+971' },
  { code: '+65', label: '+65' },
  { code: '+49', label: '+49' },
  { code: '+33', label: '+33' },
  { code: '+81', label: '+81' },
  { code: '+86', label: '+86' },
];

function RegistrationPage() {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const googleAuthBusyRef = useRef(false);
  const [googleAuthError, setGoogleAuthError] = useState('');
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
      navigate(needsCompletion ? '/complete-profile' : '/', { replace: true });
    } catch (error) {
      setGoogleAuthError(error.message || 'Google sign-up failed. Please try again.');
    } finally {
      googleAuthBusyRef.current = false;
      setGoogleAuthBusy(false);
    }
  }, [navigate]);

  useEffect(() => {
    const buttonHost = googleButtonRef.current;
    if (!buttonHost) return undefined;
    if (!googleClientId) {
      setGoogleAuthError('Google sign-up is not configured for this frontend.');
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
        window.google.accounts.id.initialize({ client_id: googleClientId, callback: handleGoogleCredential });
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
      script.onerror = () => setGoogleAuthError('Could not load Google sign-up. Check your internet connection.');
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

  // Multi-step form step tracking (1: Account details, 2: College & Team details)
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Consolidated form state to avoid redundant handlers
  const [formData, setFormData] = useState({
    fullname: '',
    phone_number: '',
    country_code: '+91',
    alternate_phone: '',
    alt_country_code: '+91',
    email: '',
    password: '',
    confirm_password: '',
    team_name: '',
    collegename: '',
    city: '',
    state: '',
  });

  // Single handler for all text inputs and dropdown selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  // Step 1: Validate personal and account credentials before advancing
  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    
    if (!formData.fullname.trim() || !formData.phone_number.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    // Validate email format without loading a separate validator vendor chunk.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setStep(2);
  };

  // Step 2: Submit final registration data to the backend API and proceed to OTP verification
  const handleStepTwoSubmit = async (e) => {
    e.preventDefault();
    if (!formData.team_name.trim() || !formData.collegename.trim() || !formData.city.trim() || !formData.state.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const payload = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        phone_number: `${formData.country_code}${formData.phone_number.trim()}`,
        alternate_phone: formData.alternate_phone ? `${formData.alt_country_code}${formData.alternate_phone.trim()}` : '',
        password: formData.password,
        confirm_password: formData.confirm_password,
        team_name: formData.team_name.trim(),
        collegename: formData.collegename.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      };

      await registerApi(payload);
      const email = formData.email.trim();
      sessionStorage.setItem('alcher_signup_email', email);
      sessionStorage.setItem('alcher_otp_flow', 'signup');
      navigate('/verify-otp', { state: { email, flow: 'signup' } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CommonBackground className="sign-in-layout">
      <section className="sign-in-page" aria-label="Create New Account">
        {step === 1 ? (
          <Link className="sign-in-back" to="/" aria-label="Back to home">
            <picture>
              <source media="(max-width: 768px)" srcSet="/assets/mobile_back.svg" />
              <img src="/assets/back_symbol.svg" alt="" aria-hidden="true" />
            </picture>
          </Link>
        ) : (
          <button
            type="button"
            className="sign-in-back"
            onClick={() => { setError(''); setStep(1); }}
            aria-label="Back to step 1"
          >
            <picture>
              <source media="(max-width: 768px)" srcSet="/assets/mobile_back.svg" />
              <img src="/assets/back_symbol.svg" alt="" aria-hidden="true" />
            </picture>
          </button>
        )}

        <div className="sign-in-card">
          {/* Promo banner aligned with LoginPage & mobile preview */}
          <section className="sign-in-promo" aria-label="Discover Alcheringa 2027">
            <div className="sign-in-promo-copy">
              <p>DISCOVER &amp; DINE IN</p>
              <h1>ALCHERINGA 2027</h1>
              <span>Create account now to not miss any updates !</span>
            </div>
          </section>

          {/* Registration form container */}
          <form
            className="sign-in-form reg-form"
            onSubmit={step === 1 ? handleStepOneSubmit : handleStepTwoSubmit}
            noValidate
          >
            <header className="sign-in-heading">
              <h2>CREATE NEW ACCOUNT</h2>
              <p>
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </header>

            {step === 1 && (
              <>
                <div className={`google-sign-in-control${googleAuthBusy ? ' is-busy' : ''}`}>
                  <div className="google-sign-in-visual" aria-hidden="true">
                    <img src="/assets/google.svg" alt="" />
                    <span>Continue with Google</span>
                  </div>
                  <div className="google-sign-in-host" ref={googleButtonRef} aria-label="Continue with Google to sign up" aria-busy={googleAuthBusy} />
                </div>
                {googleAuthError && <p className="google-sign-in-message" role="alert">{googleAuthError}</p>}
                {googleAuthBusy && <p className="google-sign-in-message" aria-live="polite">Continuing with Google…</p>}
                <div className="sign-in-divider" aria-hidden="true">
                  <span />
                  <small>or</small>
                  <span />
                </div>
              </>
            )}

            {step === 1 ? (
              <>
                <label className="sign-in-field">
                  <span>Full Name</span>
                  <input
                    name="fullname"
                    type="text"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name here"
                    required
                  />
                </label>

                <div className="sign-in-field">
                  <span>Phone Number</span>
                  <div className="reg-phone-group">
                    <select
                      name="country_code"
                      className="reg-country-select"
                      value={formData.country_code}
                      onChange={handleChange}
                      aria-label="Country Code"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code}>{item.label}</option>
                      ))}
                    </select>
                    <input
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Enter 10 digit number"
                      required
                    />
                  </div>
                </div>

                <div className="sign-in-field">
                  <span>Alternative Phone Number</span>
                  <div className="reg-phone-group">
                    <select
                      name="alt_country_code"
                      className="reg-country-select"
                      value={formData.alt_country_code}
                      onChange={handleChange}
                      aria-label="Alternative Phone Country Code"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code}>{item.label}</option>
                      ))}
                    </select>
                    <input
                      name="alternate_phone"
                      type="tel"
                      value={formData.alternate_phone}
                      onChange={handleChange}
                      placeholder="Enter an alternative number"
                    />
                  </div>
                </div>

                <div className="sign-in-field">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    className={emailError ? 'is-invalid' : ''}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={emailError ? 'Invalid input' : 'Enter your email address'}
                    autoComplete="email"
                    required
                  />
                  {emailError && <p className="reg-inline-error">{emailError}</p>}
                </div>

                <label className="sign-in-field">
                  <span>Set your Password</span>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                  />
                  <small className="reg-field-hint">Must be at least 8 characters.</small>
                </label>

                <label className="sign-in-field">
                  <span>Confirm Password</span>
                  <input
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    required
                  />
                </label>
              </>
            ) : (
              <>
                <label className="sign-in-field">
                  <span>Team Name</span>
                  <input
                    name="team_name"
                    type="text"
                    value={formData.team_name}
                    onChange={handleChange}
                    placeholder="Enter your team name"
                    required
                  />
                </label>

                <label className="sign-in-field">
                  <span>College Name</span>
                  <input
                    name="collegename"
                    type="text"
                    value={formData.collegename}
                    onChange={handleChange}
                    placeholder="Enter your college name"
                    required
                  />
                </label>

                <label className="sign-in-field">
                  <span>College City</span>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your college city"
                    required
                  />
                </label>

                <label className="sign-in-field">
                  <span>College State</span>
                  <input
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your college state"
                    required
                  />
                </label>
              </>
            )}

            <p className="reg-mandatory-note">All fields are mandatory*</p>

            <button className="sign-in-submit reg-submit-btn" type="submit" disabled={busy}>
              {busy ? 'Please wait...' : 'Continue'}
            </button>

            {error && <p className="google-sign-in-message" role="alert">{error}</p>}

            {/* 3-step progress bar indicator matching design */}
            <div className="reg-progress" role="img" aria-label={`Step ${step} of 3`}>
              <span className="is-active" />
              <span className={step >= 2 ? 'is-active' : ''} />
              <span />
            </div>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default RegistrationPage;


