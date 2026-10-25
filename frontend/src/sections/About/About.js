import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import './About.css';


const concertImg = '/assets/concert.png';
const guitarImg = '/assets/guitar.png';
const guitar2Img = '/assets/guitar2.png';
const guitar3Img = '/assets/guitar3.png';
const stageImg = '/assets/stage.png';

gsap.registerPlugin(ScrollTrigger, SplitText);


const PHOTOS = [
  { src: guitarImg,  left: 4,  top: 12, width: 11,  tilt: -18 },
  { src: guitar2Img, left: 20, top: 31, width: 6.5, tilt: -6 },
  { src: concertImg, left: 23, top: 0,  width: 6.5, tilt: -8 },
  { src: guitar3Img, left: 13, top: 58, width: 13,  tilt: 12 },
  { src: stageImg,   left: 82, top: 2,  width: 11,  tilt: 12 },
  { src: concertImg, left: 72, top: 23, width: 8,   tilt: -6 },
  { src: guitar2Img, left: 86, top: 47, width: 11,  tilt: -3 },
  { src: guitar2Img, left: 76, top: 68, width: 8,   tilt: 5 },
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
  const sectionRef = useRef(null);

  useEffect(() => {
   
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;

  
    const ctx = gsap.context(() => {
     
      const isLeft = (el) => el.offsetLeft + el.offsetWidth / 2 < section.offsetWidth / 2;

      
      const tiltOf = (el) => parseFloat(el.dataset.tilt);

      
      SplitText.create('.about-text', {
        type: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            opacity: 0,
            y: 28,
            rotation: 3,
            filter: 'blur(12px)',
            transformOrigin: 'center top',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse', 
            },
          }),
      });

     
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1000',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, 
        },
      });

      tl.fromTo('.about-heading', { scale: 1.36, y: 100 }, { scale: 1, y: 0, duration: 1 }, 0)
        .fromTo('.about-text', { y: 114 }, { y: 0, duration: 1 }, 0)
        .fromTo(
          '.about-photo',
          {
            
            x: (i, el) => (isLeft(el) ? -(el.offsetLeft + el.offsetWidth + 60) : section.offsetWidth - el.offsetLeft + 60),
            rotation: (i, el) => tiltOf(el) + (isLeft(el) ? -30 : 30),
          },
          { x: 0, rotation: (i, el) => tiltOf(el), duration: 0.8, stagger: 0.07 },
          0.15
        )
        .fromTo('.about-cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.85);
    }, sectionRef);

    
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section className="about-scene" ref={sectionRef}>
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
        <img
          key={index}
          className="about-photo"
          src={photo.src}
          alt=""
          data-tilt={photo.tilt}
          style={{
            left: `${photo.left}%`,
            top: `${photo.top}%`,
            width: `${photo.width}vw`,
            transform: `rotate(${photo.tilt}deg)`,
          }}
        />
      ))}
    </section>
  );
}

export default About;