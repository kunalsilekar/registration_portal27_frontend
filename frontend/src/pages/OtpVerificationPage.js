import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';
import './OtpVerificationPage.css';
import { requestPasswordResetApi, setAuthData, verifyOtpApi } from '../utils/api';

function OtpVerificationPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const flow = location.state?.flow || sessionStorage.getItem('alcher_otp_flow') || 'password-reset';
  const isSignup = flow === 'signup';
  const signupEmail = isSignup ? sessionStorage.getItem('alcher_signup_email') : null;
  const email = location.state?.email || signupEmail || sessionStorage.getItem('alcher_password_reset_email') || '';
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const updateDigit = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    if (digit && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (!pastedDigits.length) return;

    event.preventDefault();
    setDigits([...pastedDigits, '', '', '', '', '', ''].slice(0, 6));
    inputRefs.current[Math.min(pastedDigits.length, 6) - 1]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const firstEmptyDigit = digits.findIndex((digit) => !digit);
    if (firstEmptyDigit !== -1) {
      inputRefs.current[firstEmptyDigit]?.focus();
      return;
    }
    if (!email) {
      setError('Email is missing. Please request a new verification code.');
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await verifyOtpApi(email, digits.join(''));
      if (isSignup) {
        if (!result?.access) throw new Error('The server did not return an access token after verification.');
        setAuthData(result.access, result.user);
        if (result.refresh) localStorage.setItem('alcher_refresh_token', result.refresh);
        sessionStorage.removeItem('alcher_signup_email');
        sessionStorage.removeItem('alcher_otp_flow');
        navigate('/', { replace: true });
        return;
      }
      if (!result.reset_token) throw new Error('The server did not return a password reset token.');
      sessionStorage.setItem('alcher_password_reset_token', result.reset_token);
      navigate('/set-new-password', { state: { resetToken: result.reset_token } });
    } catch (verificationError) {
      setError(verificationError.message || 'The code is invalid or has expired.');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (isSignup) {
      setNotice('To request a new signup code, return to registration and submit the same details again.');
      return;
    }
    if (!email) {
      setError('Email is missing. Please request a new verification code.');
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await requestPasswordResetApi(email);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setNotice('A new code has been sent to your email.');
    } catch (resendError) {
      setError(resendError.message || 'Could not resend the code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CommonBackground className="sign-in-layout otp-layout" showFooter={false}>
      <section className="sign-in-page otp-page" aria-label="OTP verification">
        <Link className="sign-in-back" to={isSignup ? "/signup" : "/forgot-password"} aria-label={isSignup ? "Back to sign up" : "Back to reset password"}>
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

          <form className="otp-form" onSubmit={handleSubmit}>
            <img className="otp-mail-symbol" src="/assets/mail_symbol.svg" alt="" aria-hidden="true" />

            <header className="otp-heading">
              <h2>OTP VERIFICATION!</h2>
              <p>Please check your inbox and enter the code below.</p>
            </header>

            <div className="otp-code-inputs" aria-label="Enter your six-digit code" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { inputRefs.current[index] = element; }}
                  aria-label={`Digit ${index + 1}`}
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  inputMode="numeric"
                  maxLength={1}
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                />
              ))}
            </div>

            <button className="sign-in-submit otp-continue" type="submit" disabled={busy}>
              {busy ? 'Checking...' : 'Continue'}
            </button>

            <p className="otp-resend">
              Didn’t receive the mail? <button type="button" onClick={handleResend} disabled={busy}>Click to Resend</button>
            </p>
            {error && <p className="google-sign-in-message" role="alert">{error}</p>}
            {notice && <p className="google-sign-in-message" role="status">{notice}</p>}

            <div className="otp-progress" role="img" aria-label={isSignup ? "Step 3 of 3" : "Step 2 of 4"}>
              {isSignup ? (
                <>
                  <span className="is-current" />
                  <span className="is-current" />
                  <span className="is-current" />
                </>
              ) : (
                <>
                  <span />
                  <span className="is-current" />
                  <span />
                  <span />
                </>
              )}
            </div>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default OtpVerificationPage;
