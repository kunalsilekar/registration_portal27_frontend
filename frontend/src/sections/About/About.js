import './About.css';


const concertImg = '/assets/concert.png';
const guitarImg = '/assets/guitar.png';
const guitar2Img = '/assets/guitar2.png';
const guitar3Img = '/assets/guitar3.png';
const stageImg = '/assets/stage.png';

const PHOTOS = [
  { src: guitarImg, x: 90, y: 128, boxWidth: 164.82, boxHeight: 187.63, imageWidth: 128.19, imageHeight: 160.23, tilt: 14.78 },
  { src: guitar2Img, x: 275, y: 286, boxWidth: 100.03, boxHeight: 122.37, imageWidth: 94.22, imageHeight: 117.77, tilt: 2.89 },
  { src: concertImg, x: 345, y: 27, boxWidth: 149.12, boxHeight: 149.12, imageWidth: 135, imageHeight: 135, tilt: -6.36 },
  { src: guitar3Img, x: 228, y: 471, boxWidth: 202.27, boxHeight: 230.21, imageWidth: 160, imageHeight: 198, tilt: -13.67 },
  { src: stageImg, x: 1133, y: 43, boxWidth: 150.34, boxHeight: 169.43, imageWidth: 114.09, imageHeight: 142.61, tilt: -16.75 },
  { src: concertImg, x: 1047, y: 246, boxWidth: 112.79, boxHeight: 112.79, imageWidth: 102.12, imageHeight: 102.12, tilt: -6.36 },
  { src: guitar2Img, x: 1168.98, y: 378.21, boxWidth: 152.82, boxHeight: 186.51, imageWidth: 142, imageHeight: 178, tilt: 3.57 },
  { src: guitar2Img, x: 1033, y: 536, boxWidth: 100.03, boxHeight: 122.37, imageWidth: 94.22, imageHeight: 117.77, tilt: 2.89 },
];
function Ornament() {
  return (
    <svg className="about-ornament" viewBox="0 0 24 24" aria-hidden="true">
      {[0, 60, 120].map((deg) => (
        <rect key={deg} x="10" y="1" width="4" height="22" rx="2" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
} 
function About() {
  return (
    <section className="about-scene">
      <div className="about-copy">
        <h2 className="about-heading">
          <span className="about-heading-small">ABOUT</span>
          <span className="about-heading-big">ALCHERINGA</span>
        </h2>

        <p className="about-text">
          For three decades, IIT Guwahati has turned into India’s loudest stage every winter. Alcheringa brings together dancers, musicians, designers, quizzers and filmmakers from 500+ colleges for four days of competitions, pro-nites and culture you won’t find anywhere else. Alcheringa ‘27 runs [TBD dates], January 2027. Your stage is waiting.
        </p>

         <div className="about-cta">
          <Ornament />
          <button type="button" className="about-button">
            <span className="about-button-bg" />
            <span className="about-button-label">Explore More</span>
            <span className="about-button-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <Ornament />
        </div>
      </div>

      {PHOTOS.map((photo, index) => (
        <div
          key={index}
          className="about-photo"
          data-tilt={photo.tilt}
          style={{
            left: `${(photo.x / 1440) * 100}%`,
            top: `${(photo.y / 757) * 100}%`,
            width: `${(photo.boxWidth / 1440) * 100}%`,
            height: `${(photo.boxHeight / 757) * 100}%`,
          }}
        >
          <img
            className="about-photo-image"
            src={photo.src}
            alt=""
            draggable="false"
            style={{
              width: `${(photo.imageWidth / photo.boxWidth) * 100}%`,
              height: `${(photo.imageHeight / photo.boxHeight) * 100}%`,
            }}
          />
        </div>
      ))}
    </section>
  );
}

export default About;
