import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import "./Testinomials.css";

const AVATAR =
  "https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=300&q=80";

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Cheesecake shortbread bonbon bonbon cake croissant jelly beans cake. Cookie tootsie roll muffin pie chupa chups dessert marshmallow chocolate bar.",
    name: "Lorem Ipsum",
    role: "(Lorem Ipsum)",
    rating: 3,
    avatar: AVATAR,
  },
  {
    id: 2,
    quote:
      "Cheesecake shortbread bonbon bonbon cake croissant jelly beans cake. Cookie tootsie roll muffin pie chupa chups dessert marshmallow chocolate bar.",
    name: "Lorem Ipsum",
    role: "(Lorem Ipsum)",
    rating: 3,
    avatar: AVATAR,
  },
  {
    id: 3,
    quote:
      "Cheesecake shortbread bonbon bonbon cake croissant jelly beans cake. Cookie tootsie roll muffin pie chupa chups dessert marshmallow chocolate bar.",
    name: "Lorem Ipsum",
    role: "(Lorem Ipsum)",
    rating: 3,
    avatar: AVATAR,
  },
  {
    id: 4,
    quote:
      "Performing under the twilight lights of IIT Guwahati was unforgettable. The crowd energy and stage production at Alcheringa are unmatched anywhere.",
    name: "Aarav Sharma",
    role: "(Rock-O-Phonix Finalist)",
    rating: 5,
    avatar: AVATAR,
  },
  {
    id: 5,
    quote:
      "Three days of art, music, and fierce competition. Even beyond the trophies, the friendships and memories we made on campus stayed with us forever.",
    name: "Diya Nair",
    role: "(Haute Couture Winner)",
    rating: 5,
    avatar: AVATAR,
  },
];

const MOBILE_BP = 820; // must match the CSS media query

// Ribbon shapes traced from the desktop (1440) and phone (402) Figma frames
const TICKERS = {
  desktop: {
    viewBox: "0 0 1440 340",
    ribbon: "M -60,87 C -40,95.4 -35,97.8 0,112.5 C 35,127.2 100,156.1 150,175 C 200,193.9 250,211.7 300,226 C 350,240.3 400,253.6 450,261 C 500,268.4 555,270.5 600,270.5 C 645,270.5 670,270.2 720,261 C 770,251.8 845,230.9 900,215.5 C 955,200.1 1000,180.8 1050,168.5 C 1100,156.2 1150,146.2 1200,142 C 1250,137.8 1310.2,140.5 1350,143 C 1389.8,145.5 1414,153 1439,157 C 1464,161 1479.8,163.7 1500,167",
    text: "M -70.3,111.4 C -43.6,122.8 -17,134.1 9.7,145.4 C 36.4,156.8 63,168.6 89.7,179.5 C 116.4,190.3 143,200.8 169.7,210.6 C 196.4,220.5 223,229.8 249.7,238.4 C 276.4,246.9 303,254.7 329.7,261.8 C 356.4,268.9 383,275.8 409.7,280.9 C 436.4,286 463,289.7 489.7,292.4 C 516.4,295 543,296 569.7,296.7 C 596.4,297.3 623,298 649.7,296.2 C 676.4,294.5 703,290.9 729.7,286.1 C 756.4,281.4 783,274.3 809.7,267.6 C 836.4,260.9 863,253.6 889.7,245.9 C 916.4,238.2 943,229.6 969.7,221.2 C 996.4,212.9 1023,203.1 1049.7,195.9 C 1076.4,188.8 1103,183 1129.7,178.3 C 1156.4,173.6 1183,169.8 1209.7,167.8 C 1236.4,165.9 1263,166.1 1289.7,166.7 C 1316.4,167.3 1343,168.3 1369.7,171.4 C 1396.4,174.6 1423,180.9 1449.7,185.6 C 1476.4,190.2 1503.1,195 1529.7,199.7",
    close: "L 1500,-40 L -60,-40 Z",
  },
  mobile: {
    viewBox: "0 0 402 122",
    ribbon: "M -60,15 C -45,22 -15,36 0,43 C 15,50 20,53 30,57 C 40,61 50,64 60,67 C 70,70 80,72.5 90,75 C 100,77.5 110,80.5 120,82 C 130,83.5 140,83.8 150,84 C 160,84.2 170,84 180,83 C 190,82 200,80.3 210,78 C 220,75.7 230,72.2 240,69 C 250,65.8 260,61.8 270,59 C 280,56.2 290,53.8 300,52 C 310,50.2 320,48.7 330,48 C 340,47.3 350,47.3 360,48 C 370,48.7 378.3,50.3 390,52 C 401.7,53.7 416.7,56 430,58 C 443.3,60 458.3,62.3 470,64 C 481.7,65.7 490,66.7 500,68",
    text: "M -64.2,24.1 C -54.2,28.7 -44.2,33.4 -34.2,38.1 C -24.2,42.7 -14.2,47.4 -4.2,52.1 C 5.8,56.7 15.8,62.1 25.8,66.1 C 35.8,70.1 45.8,73.1 55.8,76.2 C 65.8,79.2 75.8,81.7 85.8,84.3 C 95.8,86.8 105.8,89.8 115.8,91.4 C 125.8,93.1 135.8,93.6 145.8,93.9 C 155.8,94.2 165.8,94.2 175.8,93.4 C 185.8,92.6 195.8,91.3 205.8,89.2 C 215.8,87.1 225.8,83.9 235.8,80.9 C 245.8,77.8 255.8,73.7 265.8,70.8 C 275.8,67.8 285.8,65.1 295.8,63 C 305.8,60.9 315.8,59.2 325.8,58.4 C 335.8,57.5 345.8,57.3 355.8,57.8 C 365.8,58.3 375.8,60.1 385.8,61.5 C 395.8,62.9 405.8,64.5 415.8,66 C 425.8,67.5 435.8,69 445.8,70.5 C 455.8,72 465.8,73.4 475.8,74.9 C 485.8,76.4 495.8,77.8 505.8,79.3",
    close: "L 500,-40 L -60,-40 Z",
  },
};

/*
  Card geometry measured from the Figma frames.
  Desktop (1440 design): cards 464 x 136, 170px apart, active card shifted 85px left.
  Phone (402 design):    cards 366 x 145, 170px apart, all cards aligned (no shift).
  Everything is multiplied by u = viewportWidth / designWidth so it scales
  exactly like the design.
*/
const getGeometry = () => {
  const w = window.innerWidth;
  if (w <= MOBILE_BP) {
    const u = w / 402;
    return { shift: 0, pitch: 170 * u, hidden: 340 * u, offX: 0 };
  }
  const u = w / 1440;
  return { shift: 85 * u, pitch: 170 * u, hidden: 340 * u, offX: 24 * u };
};

// slot keys: -1 hidden above, 0 top card, 1 active middle card, 2 bottom card, 3 hidden below
const getSlot = (key, g) => {
  switch (key) {
    case -1:
      return { x: g.offX, y: -g.hidden, scale: 0.92, opacity: 0, zIndex: 1 };
    case 0:
      return { x: 0, y: -g.pitch, scale: 1, opacity: 1, zIndex: 2 };
    case 1:
      return { x: -g.shift, y: 0, scale: 1, opacity: 1, zIndex: 4 };
    case 2:
      return { x: 0, y: g.pitch, scale: 1, opacity: 1, zIndex: 2 };
    default:
      return { x: g.offX, y: g.hidden, scale: 0.92, opacity: 0, zIndex: 1 };
  }
};

// Rating icon: /public/assets/vector.svg
const StarRating = ({ rating = 3, max = 5 }) => (
  <div
    className="alcher-card__stars"
    role="img"
    aria-label={`Rating: ${rating} out of ${max}`}
  >
    {Array.from({ length: max }).map((_, idx) => (
      <img
        key={idx}
        src="/assets/vector.svg"
        alt=""
        draggable={false}
        className={`alcher-card__star ${idx < rating ? "is-filled" : "is-empty"}`}
      />
    ))}
  </div>
);

export default function Testimonials({
  testimonials = DEFAULT_TESTIMONIALS,
  tickerText = "ENTER THE AIR OF ALCHERINGA27",
  tickerSpeed = 18,
  backgroundImage = "",
  autoPlayInterval = 4500,
}) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [layoutTick, setLayoutTick] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= MOBILE_BP
  );

  const sectionRef = useRef(null);
  const textPathRef = useRef(null);
  const tickerTweenRef = useRef(null);
  const cardsRef = useRef([]);
  const stageRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const wheelLockRef = useRef(false);
  const snapRef = useRef(true); // true = place cards instantly (first render / resize)
  const touchStartY = useRef(null);

  const total = testimonials.length;
  const ticker = isMobile ? TICKERS.mobile : TICKERS.desktop;

  // Repeated phrase for the seamless SVG ticker loop
  const singlePhrase = `${tickerText} \u00A0.\u00A0 `;
  const repeatedTickerContent = Array.from({ length: 12 })
    .map(() => singlePhrase)
    .join("");

  // 1. Curved ticker (measured after fonts load so the loop distance is right)
  useEffect(() => {
    const textPathEl = textPathRef.current;
    if (!textPathEl) return;
    let ctx;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        let unitDistance = isMobile ? 350 : 920;
        try {
          const fullLength = textPathEl.getComputedTextLength();
          if (fullLength > 0) unitDistance = fullLength / 12;
        } catch (e) {
          unitDistance = isMobile ? 350 : 920;
        }

        tickerTweenRef.current = gsap.fromTo(
          textPathEl,
          { attr: { startOffset: 0 } },
          {
            attr: { startOffset: -unitDistance * 2 },
            duration: tickerSpeed,
            ease: "none",
            repeat: -1,
          }
        );
      }, sectionRef);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [tickerText, tickerSpeed, isMobile]);

  const handleTickerMouseEnter = () => {
    if (tickerTweenRef.current) {
      gsap.to(tickerTweenRef.current, {
        timeScale: 1.65,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  const handleTickerMouseLeave = () => {
    if (tickerTweenRef.current) {
      gsap.to(tickerTweenRef.current, {
        timeScale: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  // Re-layout cards when the viewport size changes
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        snapRef.current = true;
        setIsMobile(window.innerWidth <= MOBILE_BP);
        setLayoutTick((t) => t + 1);
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const getRelativeSlot = useCallback(
    (index, currentActive) => {
      let diff = (index - currentActive) % total;
      if (diff < 0) diff += total;

      if (diff === 0) return 1; // active middle card
      if (diff === total - 1) return 0; // top card
      if (diff === 1) return 2; // bottom card
      if (diff === total - 2) return -1; // hidden above
      return 3; // hidden below
    },
    [total]
  );

  // 2. Card stack + scrollbar thumb
  useLayoutEffect(() => {
    const g = getGeometry();
    const instant = snapRef.current;

    testimonials.forEach((_, idx) => {
      const cardEl = cardsRef.current[idx];
      if (!cardEl) return;
      const slot = getSlot(getRelativeSlot(idx, activeIndex), g);

      gsap.to(cardEl, {
        x: slot.x,
        y: slot.y,
        scale: slot.scale,
        opacity: slot.opacity,
        zIndex: slot.zIndex,
        duration: instant ? 0 : 0.72,
        ease: "power3.out",
        overwrite: "auto",
      });
    });

    if (thumbRef.current && trackRef.current) {
      const trackHeight = trackRef.current.clientHeight || 285;
      const thumbHeight = Math.max(28, trackHeight * 0.15);
      const maxTravel = trackHeight - thumbHeight;
      const progress = total > 1 ? activeIndex / (total - 1) : 0;

      gsap.to(thumbRef.current, {
        height: thumbHeight,
        y: progress * maxTravel,
        duration: instant ? 0 : 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    snapRef.current = false;
  }, [activeIndex, testimonials, total, getRelativeSlot, layoutTick]);

  // 3. Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".alcher-testimonials__title", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
      gsap.from(".alcher-testimonials__subtitle, .alcher-testimonials__desc", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Auto-play
  useEffect(() => {
    if (isPaused || !autoPlayInterval) return;
    const timer = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, handleNext]);

  // Wheel navigation (native, non-passive so the page doesn't scroll along)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 18) return;
      e.preventDefault();
      if (wheelLockRef.current) return;

      wheelLockRef.current = true;
      if (e.deltaY > 0) handleNext();
      else handlePrev();

      setTimeout(() => {
        wheelLockRef.current = false;
      }, 650);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [handleNext, handlePrev]);

  // Touch swipe (vertical on desktop, horizontal on phone where the page scrolls vertically)
  const touchStartX = useRef(null);

  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(delta) > 40) {
      if (delta < 0) handleNext();
      else handlePrev();
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  const handleTrackClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setActiveIndex(Math.round(ratio * (total - 1)));
  };

  return (
    <section
      ref={sectionRef}
      className="alcher-testimonials"
      style={
        backgroundImage
          ? { "--alcher-bg-image": `url(${backgroundImage})` }
          : undefined
      }
    >
      {/* Background atmosphere */}
      <div className="alcher-testimonials__bg-scene" aria-hidden="true">
        <div className="alcher-testimonials__sky-glow" />
        <div className="alcher-testimonials__gate-silhouette" />
        <div className="alcher-testimonials__foliage-vignette" />
      </div>

      {/* Top curved ticker. Ribbon + text paths are traced from the Figma frame. */}
      <div
        className="alcher-ticker-wrapper"
        onMouseEnter={handleTickerMouseEnter}
        onMouseLeave={handleTickerMouseLeave}
      >
        <svg
          key={isMobile ? "m" : "d"}
          className="alcher-ticker-svg"
          viewBox={ticker.viewBox}
          preserveAspectRatio="xMidYMin slice"
          aria-label={tickerText}
        >
          <defs>
            {/* centre line of the dark band */}
            <path id="alcher-RibbonCurvePath" d={ticker.ribbon} />
            {/* text baseline: band centre line moved so the capitals sit in the middle of the band */}
            <path id="alcher-TextCurvePath" d={ticker.text} />
          </defs>

          {/* cream paper above the ribbon */}
          <path
            className="alcher-ticker-svg__cream-top"
            d={`${ticker.ribbon} ${ticker.close}`}
          />

          {/* dark forest-green band */}
          <use href="#alcher-RibbonCurvePath" className="alcher-ticker-svg__band" />

          {/* flowing text glued to the path */}
          <text className="alcher-ticker-svg__text">
            <textPath
              ref={textPathRef}
              href="#alcher-TextCurvePath"
              startOffset="0"
            >
              {repeatedTickerContent}
            </textPath>
          </text>
        </svg>
      </div>

      {/* Main content */}
      <div className="alcher-testimonials__container">
        {/* Left column */}
        <div className="alcher-testimonials__left">
          <h2 className="alcher-testimonials__title">TESTIMONIALS</h2>

          <div className="alcher-testimonials__copy">
            <h3 className="alcher-testimonials__subtitle">
              What our Previous
              <br />
              Participants say
            </h3>
            <p className="alcher-testimonials__desc">
              Thousands have competed on Alcher&apos;s stages. Here&apos;s what
              they took home, besides the trophies.
            </p>
          </div>
        </div>

        {/* Right column: cards + scroll nav */}
        <div
          className="alcher-testimonials__right"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={stageRef}
            className="alcher-cards-stage"
            role="region"
            aria-label="Participant Testimonials"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {testimonials.map((item, idx) => {
              const slotKey = getRelativeSlot(idx, activeIndex);
              const isActive = slotKey === 1;
              const clickable = slotKey === 0 || slotKey === 2;
              const hidden = slotKey < 0 || slotKey > 2;

              return (
                <article
                  key={item.id || idx}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className={`alcher-card ${
                    isActive ? "alcher-card--active" : "alcher-card--muted"
                  } ${hidden ? "alcher-card--hidden" : ""}`}
                  onClick={() => {
                    if (slotKey === 0) handlePrev();
                    if (slotKey === 2) handleNext();
                  }}
                  onKeyDown={(e) => {
                    if (clickable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      if (slotKey === 0) handlePrev();
                      else handleNext();
                    }
                  }}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : -1}
                  aria-hidden={hidden}
                >
                  <div className="alcher-card__avatar-wrap">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="alcher-card__avatar"
                      loading="lazy"
                    />
                  </div>

                  <div className="alcher-card__body">
                    <p className="alcher-card__quote">
                      &ldquo; {item.quote} &rdquo;
                    </p>

                    <div className="alcher-card__footer">
                      <div className="alcher-card__author">
                        <h4 className="alcher-card__name">{item.name}</h4>
                        <span className="alcher-card__role">{item.role}</span>
                      </div>

                      <StarRating rating={item.rating} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="alcher-scroll-nav" aria-label="Testimonial controls">
            <button
              type="button"
              className="alcher-scroll-nav__btn"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <polyline
                  points="18 15 12 9 6 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              ref={trackRef}
              className="alcher-scroll-nav__track"
              onClick={handleTrackClick}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={total - 1}
              aria-valuenow={activeIndex}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") handlePrev();
                if (e.key === "ArrowDown") handleNext();
              }}
            >
              <div ref={thumbRef} className="alcher-scroll-nav__thumb" />
            </div>

            <button
              type="button"
              className="alcher-scroll-nav__btn"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <polyline
                  points="6 9 12 15 18 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}