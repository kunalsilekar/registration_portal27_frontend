import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';

gsap.registerPlugin(ScrollTrigger);

function LandingScene() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const navbarWrapper = track.querySelector('.navbar-animation-wrapper');
      const navbar = track.querySelector('.navbar');
      const foreground = track.querySelector('.foreground');
      const about = track.querySelector('.about-scene');
      const stats = track.querySelector('.hero-stats');
      const photos = gsap.utils.toArray('.about-photo');
      const photoImages = gsap.utils.toArray('.about-photo-image');

      const isLeft = (el) =>
        el.offsetLeft + el.offsetWidth / 2 < about.offsetWidth / 2;
      const tiltOf = (el) => parseFloat(el.dataset.tilt);
      const attachedTargetY = () =>
        navbar.offsetTop - (foreground.offsetTop + foreground.offsetHeight);
      const sceneTargetY = () =>
        window.matchMedia('(max-width: 760px)').matches
          ? navbar.offsetTop - about.offsetTop
          : attachedTargetY();

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.8,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Move the foreground, stats, and About together; on mobile they form one vertical stack.
      tl.fromTo(navbarWrapper, { y: 24 }, { y: 0, duration: 1.8 }, 0)
        .to('.landscape', { y: -140, duration: 18 }, 0)
        .to(foreground, { y: sceneTargetY, duration: 18 }, 0)
        .to(stats, { y: sceneTargetY, duration: 18 }, 0)
        .to(about, { y: sceneTargetY, duration: 18 }, 0)
        .to('.hero-copy', { y: -50, duration: 18 }, 0)
        .fromTo(
          '.about-heading',
          { scale: 1.36, y: 100 },
          { scale: 1, y: 0, duration: 4 },
          10
        )
        .fromTo(
          '.about-text',
          { y: 114, opacity: 0 },
          { y: 0, opacity: 1, duration: 4 },
          10.2
        )
        .fromTo(
          photos,
          {
            x: (i, el) =>
              isLeft(el)
                ? -(el.offsetLeft + el.offsetWidth + 60)
                : about.offsetWidth - el.offsetLeft + 60,
          },
          {
            x: 0,
            duration: 1.2,
            stagger: 0.2,
          },
          8
        )
        .fromTo(
          photoImages,
          {
            rotation: (i, el) => {
              const frame = el.parentElement;
              return tiltOf(frame) + (isLeft(frame) ? -30 : 30);
            },
          },
          {
            rotation: (i, el) => tiltOf(el.parentElement),
            duration: 1.2,
            stagger: 0.2,
          },
          8
        )
        .fromTo(
          '.about-cta',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.5 },
          15
        );
    }, track);

    const refresh = () => ScrollTrigger.refresh();
    const refreshFrame = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    return () => {
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div className="landing-scene-track" ref={trackRef}>
      <div className="landing-scene-panel">
        <Hero />
      </div>
    </div>
  );
}

export default LandingScene;



