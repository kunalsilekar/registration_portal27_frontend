import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import { fetchCompetitionDetailApi, getMediaUrl } from '../utils/api';
import './RegistrationSuccessPage.css';

const bgImage = '/assets/competition_Register_bg.jpg';
const textureImage = '/assets/texture.png';
const successLogo = '/assets/successful_logo.svg';

function RegistrationSuccessPage() {
  const { competitionId } = useParams();
  const location = useLocation();

  const [competition, setCompetition] = useState(location.state?.competition || null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (competition) return;

    async function loadCompetition() {
      if (!competitionId) return;
      try {
        const data = await fetchCompetitionDetailApi(competitionId);
        if (!data || !(data.event_name || data.name)) throw new Error('The backend did not return this competition.');
        setCompetition(data);
      } catch (err) {
        setLoadError(err.message || 'Could not load competition details from the backend.');
      }
    }
    loadCompetition();
  }, [competitionId, competition]);

  const competitionName =
    competition?.event_name ||
    competition?.name ||
    competition?.competetion ||
    '';

  const moduleName =
    competition?.moduleName ||
    competition?.module?.module ||
    competition?.module ||
    '';

  const eventDesc =
    competition?.event_desc ||
    competition?.desc ||
    'Competition details are not available.';

  return (
    <div
      className="comp-success-page-wrapper"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL + bgImage})` }}
    >
      {/* Top Navbar */}
      <header className="comp-success-navbar-wrap">
        <Navbar />
      </header>

      {/* Main Container */}
      <main className="comp-success-main">
        <div
          className="comp-success-card"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL + textureImage})` }}
        >
          {/* Top Banner */}
          <div
            className="comp-success-banner"
            style={{
              backgroundImage: `url(${
                competition?.image ? getMediaUrl(competition.image) : undefined
              })`,
            }}
          >
            <div className="comp-banner-overlay">
              <div className="comp-banner-content">
                <h1 className="comp-banner-title">{competitionName.toUpperCase()}</h1>
                <h2 className="comp-banner-module">{String(moduleName).toUpperCase()}</h2>
                <p className="comp-banner-desc">{eventDesc}</p>
              </div>
            </div>
          </div>

          {/* Success Content Body */}
          <div className="comp-success-content">
            <div className="comp-success-tick-wrap">
              <img
                src={process.env.PUBLIC_URL + successLogo}
                alt="Registration Successful"
                className="comp-success-tick-icon"
              />
            </div>

            {loadError && <p className="comp-success-desc" role="alert">{loadError}</p>}

            <h2 className="comp-success-title">
              Registration Submitted Successfully!
            </h2>

            <p className="comp-success-desc">
              Our team is currently reviewing your submission. Once it has been successfully verified and approved, you will receive a notification via email and SMS.
            </p>

            <Link to="/modules" className="comp-success-btn">
              Back to Competitions
            </Link>
          </div>
        </div>
      </main>

      {/* Website Footer */}
      <Footer />
    </div>
  );
}

export default RegistrationSuccessPage;
