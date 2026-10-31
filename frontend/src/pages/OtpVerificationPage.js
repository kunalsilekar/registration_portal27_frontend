import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import './LoginPage.css';
import './OtpVerificationPage.css';

function OtpVerificationPage() {
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

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
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4).split('');
    if (!pastedDigits.length) return;

    event.preventDefault();
    setDigits([...pastedDigits, '', '', '', ''].slice(0, 4));
    inputRefs.current[Math.min(pastedDigits.length, 4) - 1]?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const firstEmptyDigit = digits.findIndex((digit) => !digit);
    if (firstEmptyDigit !== -1) {
      inputRefs.current[firstEmptyDigit]?.focus();
      return;
    }
    navigate('/set-new-password');
  };

  return (
    <CommonBackground className="sign-in-layout otp-layout" showFooter={false}>
      <section className="sign-in-page otp-page" aria-label="OTP verification">
        <Link className="sign-in-back" to="/forgot-password" aria-label="Back to reset password">
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

            <div className="otp-code-inputs" aria-label="Enter your four-digit code" onPaste={handlePaste}>
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

            <button className="sign-in-submit otp-continue" type="submit">Continue</button>

            <p className="otp-resend">
              Didn’t receive the mail? <button type="button">Click to Resend</button>
            </p>

            <div className="otp-progress" role="img" aria-label="Step 2 of 4">
              <span />
              <span className="is-current" />
              <span />
              <span />
            </div>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default OtpVerificationPage;

