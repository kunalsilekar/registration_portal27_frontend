import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonBackground from '../sections/Common_Background';
import {
  completeGoogleProfileApi,
  getAuthToken,
  getStoredUser,
  setAuthData,
} from '../utils/api';
import './LoginPage.css';
import './RegistrationPage.css';
import './GoogleProfileCompletionPage.css';

const COUNTRY_CODES = ['+91', '+1', '+44', '+61', '+971', '+65', '+49', '+33', '+81', '+86'];

function GoogleProfileCompletionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleUser = getStoredUser() || {};
  const [formData, setFormData] = useState(() => ({
    fullname: googleUser.fullname || '',
    phone_number: '',
    country_code: '+91',
    alternate_phone: '',
    alternate_country_code: '+91',
    team_name: googleUser.team_name || '',
    collegename: googleUser.collegename || '',
    city: googleUser.city || '',
    state: googleUser.state || '',
  }));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) navigate('/login', { replace: true });
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const required = ['fullname', 'phone_number', 'team_name', 'collegename', 'city', 'state'];
    if (required.some((field) => !String(formData[field] || '').trim())) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^\d{7,15}$/.test(formData.phone_number.trim())) {
      setError('Enter a valid phone number.');
      return;
    }
    if (formData.alternate_phone.trim() && !/^\d{7,15}$/.test(formData.alternate_phone.trim())) {
      setError('Enter a valid alternate phone number.');
      return;
    }

    setBusy(true);
    try {
      const result = await completeGoogleProfileApi({
        fullname: formData.fullname.trim(),
        phone_number: formData.country_code + formData.phone_number.trim(),
        alternate_phone: formData.alternate_phone.trim()
          ? formData.alternate_country_code + formData.alternate_phone.trim()
          : '',
        team_name: formData.team_name.trim(),
        collegename: formData.collegename.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      });

      if (result.user) setAuthData(getAuthToken(), result.user);
      localStorage.removeItem('alcher_needs_completion');
      const requestedPath = location.state?.from;
      const returnPath = requestedPath
        ? requestedPath.pathname + (requestedPath.search || '') + (requestedPath.hash || '')
        : '/';
      navigate(returnPath, { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Could not save your profile details.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CommonBackground className="sign-in-layout google-profile-completion-layout">
      <section className="sign-in-page" aria-label="Complete your Google account profile">
        <div className="sign-in-card">
          <section className="sign-in-promo" aria-label="Discover Alcheringa 2027">
            <div className="sign-in-promo-copy">
              <p>DISCOVER &amp; DINE IN</p>
              <h1>ALCHERINGA 2027</h1>
              <span>Create your account to join Alcheringa.</span>
            </div>
          </section>

          <form className="sign-in-form reg-form google-profile-form" onSubmit={handleSubmit} noValidate>
            <header className="sign-in-heading">
              <h2>COMPLETE YOUR PROFILE</h2>
              <p>Just a few details to continue.</p>
            </header>

            <label className="sign-in-field">
              <span>Full Name</span>
              <input
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>

            <label className="sign-in-field">
              <span>Google Email</span>
              <input type="email" value={googleUser.email || ''} readOnly aria-readonly="true" />
            </label>

            <div className="sign-in-field">
              <span>Phone Number</span>
              <div className="reg-phone-group">
                <select
                  className="reg-country-select"
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  aria-label="Phone country code"
                >
                  {COUNTRY_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
                </select>
                <input
                  name="phone_number"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel-national"
                  required
                />
              </div>
            </div>

            <div className="sign-in-field">
              <span>Alternate Phone Number <small>(Optional)</small></span>
              <div className="reg-phone-group">
                <select
                  className="reg-country-select"
                  name="alternate_country_code"
                  value={formData.alternate_country_code}
                  onChange={handleChange}
                  aria-label="Alternate phone country code"
                >
                  {COUNTRY_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
                </select>
                <input
                  name="alternate_phone"
                  type="tel"
                  inputMode="numeric"
                  value={formData.alternate_phone}
                  onChange={handleChange}
                  placeholder="Enter alternate number"
                  autoComplete="tel"
                />
              </div>
            </div>

            <label className="sign-in-field">
              <span>Team Name</span>
              <input name="team_name" type="text" value={formData.team_name} onChange={handleChange} required />
            </label>

            <label className="sign-in-field">
              <span>College Name</span>
              <input name="collegename" type="text" value={formData.collegename} onChange={handleChange} required />
            </label>

            <label className="sign-in-field">
              <span>College City</span>
              <input name="city" type="text" value={formData.city} onChange={handleChange} required />
            </label>

            <label className="sign-in-field">
              <span>College State</span>
              <input name="state" type="text" value={formData.state} onChange={handleChange} required />
            </label>

            {error && <p className="google-sign-in-message" role="alert">{error}</p>}

            <button className="sign-in-submit reg-submit-btn" type="submit" disabled={busy}>
              {busy ? 'Saving...' : 'Click to Continue'}
            </button>
          </form>
        </div>
      </section>
    </CommonBackground>
  );
}

export default GoogleProfileCompletionPage;