import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getAuthToken, getMediaUrl } from '../utils/api';
import './CompetitionCard.css';

const FALLBACK_COMPETITION_IMAGE = '/assets/modules/dance.jpg';

function CompetitionCard({ competition }) {
  const navigate = useNavigate();
  const rawImage = competition?.image || competition?.img || competition?.cover;
  const initialImage = rawImage ? getMediaUrl(rawImage) : '';

  const [imgSrc, setImgSrc] = useState(initialImage || FALLBACK_COMPETITION_IMAGE);

  const handleImageError = () => {
    if (imgSrc !== FALLBACK_COMPETITION_IMAGE) setImgSrc(FALLBACK_COMPETITION_IMAGE);
  };

  if (!competition) return null;

  const rawId = competition.id || competition._id || competition.uuid || competition.event_name || 'comp';
  const competitionId = String(rawId);
  const title =
    competition.event_name ||
    competition.name ||
    competition.competetion ||
    competition.title ||
    'Competition';

  const desc =
    competition.event_desc ||
    competition.desc ||
    competition.description ||
    'Details coming soon.';

  const prizePool = competition.prize_worth
    ? `Prize Pool - ${String(competition.prize_worth).trim().startsWith('₹') ? competition.prize_worth : '₹' + competition.prize_worth}`
    : 'Prize Pool details unavailable';

  const competitionPath = '/competitions/' + competitionId;
  const handleCompetitionClick = (event) => {
    if (!getAuthToken()) {
      event.preventDefault();
      navigate('/login', { state: { from: { pathname: competitionPath } } });
    }
  };

  // Generate safe unique clip-path ID for desktop
  const clipId = `card-cutout-${competitionId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <Link
      to={competitionPath}
      onClick={handleCompetitionClick}
      className="competition-card"
      aria-label={`View competition ${title}`}
    >
      {/* Desktop / Tablet Layout: Transparent notched vector cutout with text directly on page background */}
      <div className="competition-card-desktop">
        <div className="competition-card-frame">
          <svg
            viewBox="0 0 302.62 217.25"
            className="competition-card-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id={clipId}>
                <path
                  d="M 18.0 0
                     H 284.62
                     A 18.0 18.0 0 0 1 302.62 18.0
                     V 199.25
                     A 18.0 18.0 0 0 1 284.62 217.25
                     H 234.00
                     A 18.0 18.0 0 0 1 216.00 199.25
                     V 183.00
                     A 14.0 14.0 0 0 0 202.00 169.00
                     H 18.0
                     A 18.0 18.0 0 0 1 0 151.00
                     V 18.0
                     A 18.0 18.0 0 0 1 18.0 0
                     Z"
                />
              </clipPath>
            </defs>

            <image
              href={imgSrc}
              width="302.62"
              height="217.25"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
              className="competition-card-image"
              onError={handleImageError}
            />
          </svg>

          {/* Text placed directly on the page background in the transparent cutout area */}
          <div className="competition-card-text-area">
            <span className="competition-card-title">{title}</span>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Full rounded card with gradient overlay, title, description, prize pool and Register pill */}
      <div className="competition-card-mobile">
        <div className="mobile-card-bg-wrap">
          <img
            src={imgSrc}
            alt=""
            className="mobile-card-bg-img"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="mobile-card-gradient-overlay" />
        </div>

        <div className="mobile-card-content">
          <h3 className="mobile-card-title">{title}</h3>
          <p className="mobile-card-desc">{desc}</p>
          <div className="mobile-card-bottom-row">
            <span className="mobile-card-prize">{prizePool}</span>
            <span className="mobile-card-register-btn">
              Register <ChevronRight size={14} className="mobile-card-chevron" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CompetitionCard;
