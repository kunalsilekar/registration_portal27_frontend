import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../utils/api';
import './CompetitionCard.css';

const defaultImage = '/assets/competetion_img.png';

const getDefaultDesc = (title) => {
  const t = (title || '').toUpperCase();
  if (t.includes('STAGE') || t.includes('THEAT') || t.includes('DRAMA')) {
    return 'Theatre that hits harder than a punchline. Stage your best act, from monologue to full ensemble.';
  }
  if (t.includes('DANCE') || t.includes('ABCD') || t.includes('STEP')) {
    return 'Anybody can dance, but can you own the floor? Solo and crew rounds, all styles welcome.';
  }
  if (t.includes('MUSIC') || t.includes('VOICE') || t.includes('ROCK')) {
    return 'From acoustic harmonies to thunderous rock riffs, bring your melody to life on the grand stage.';
  }
  if (t.includes('VOGUE') || t.includes('COUTURE') || t.includes('DRESS')) {
    return 'High fashion meets fierce attitude. Strut the runway with sheer elegance and bespoke style.';
  }
  if (t.includes('ART') || t.includes('SKETCH') || t.includes('PAINT')) {
    return 'Unleash your creativity on canvas, clay, and walls with strokes of pure imagination.';
  }
  return "Talent that doesn't fit in a box. Beatbox, stand-up, magic, whatever makes you you.";
};

function CompetitionCard({ competition }) {
  const rawImage = competition?.image || competition?.img || competition?.cover;
  const initialImage = rawImage ? getMediaUrl(rawImage) : defaultImage;

  const [imgSrc, setImgSrc] = useState(initialImage);

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
    getDefaultDesc(title);

  const prizePool = competition.prize_worth
    ? `Prize Pool - ${String(competition.prize_worth).trim().startsWith('₹') ? competition.prize_worth : '₹' + competition.prize_worth}`
    : 'Prize Pool - ₹[TBD]';

  // Generate safe unique clip-path ID for desktop
  const clipId = `card-cutout-${competitionId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <Link
      to={`/competitions/${competitionId}`}
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
              onError={() => {
                if (imgSrc !== defaultImage) {
                  setImgSrc(defaultImage);
                }
              }}
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
            onError={() => {
              if (imgSrc !== defaultImage) {
                setImgSrc(defaultImage);
              }
            }}
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
