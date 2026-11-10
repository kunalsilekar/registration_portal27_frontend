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
    const isPhone = window.matchMedia('(max-width: 760px)').matches;
    const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
    const isTablet = !isPhone && !isDesktop;

    const ctx = gsap.context(() => {
      const navbar = document.querySelector('.landing-navbar-fixed .navbar');
      const scenePanel = track.querySelector('.landing-scene-panel');
      const foreground = track.querySelector('.foreground');
      const about = track.querySelector('.about-scene');
      const stats = track.querySelector('.hero-stats');
      const moduleSection = document.querySelector('.landing-page > .module-section');
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
          // Keep phone movement closely tied to the finger scroll; a full
          // one-second scrub makes the layered scene visibly trail behind.
          scrub: isTablet ? true : isPhone ? 0.2 : 1,
          invalidateOnRefresh: true,
        },
      });

      // Keep the landscape fixed, like desktop; move the foreground, stats,
      // and About together as the scene scrolls into its next section.
      tl.to('.landscape', { y: 0, duration: 18 }, 0)
        .to(foreground, { y: sceneTargetY, duration: 18 }, 0)
        .to(stats, { y: sceneTargetY, duration: 18 }, 0)
        .to(about, { y: sceneTargetY, duration: 18 }, 0)
        .to('.hero-copy', { y: -50, duration: 18 }, 0);

      // On tablets, animate Modules with the same scroll progress as About so
      // their shared edge stays aligned throughout the handoff. Computing the
      // start offset from the current transforms keeps this stable on refresh.
      if (isTablet && moduleSection) {
        const moduleStartY = () => {
          const currentModuleY = Number(gsap.getProperty(moduleSection, 'y')) || 0;
          const currentAboutY = Number(gsap.getProperty(about, 'y')) || 0;
          const panelTop = scenePanel.getBoundingClientRect().top;
          const aboutBottomInPanel =
            about.getBoundingClientRect().bottom - currentAboutY - panelTop;
          const trackDocumentTop = track.getBoundingClientRect().top + window.scrollY;
          const moduleDocumentTop =
            moduleSection.getBoundingClientRect().top - currentModuleY + window.scrollY;
          const moduleTopFromTrack = moduleDocumentTop - trackDocumentTop;

          return aboutBottomInPanel - moduleTopFromTrack;
        };

        tl.fromTo(
          moduleSection,
          { y: moduleStartY },
          {
            // Offset Modules into place, then move it by the same amount as
            // About so their shared edge stays aligned during the handoff.
            y: () => moduleStartY() + window.innerHeight * 1.8 + sceneTargetY(),
            duration: 18,
          },
          0
        );
      }

      // Keep the About reveal effects on desktop. Tablet and phone show the
      // content immediately while retaining the shared scene scroll movement.
      if (isDesktop) {
        tl.fromTo(
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
            { x: 0, duration: 3.6, stagger: 0.32 },
            12
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
              duration: 3.6,
              stagger: 0.32,
            },
            12
          )
          .fromTo(
            '.about-cta',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.5 },
            15
          );
      }
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



