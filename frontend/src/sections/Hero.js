import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import '../App.css';

gsap.registerPlugin(ScrollTrigger);

function AnimatedStatNumber({ value, suffix = '', started }) {
    const [display, setDisplay] = useState('0');
    const frameRef = useRef(null);

    useEffect(() => {
        if (!started) return;

        const startTime = performance.now();
        const duration = 2000;

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = eased * value;

            setDisplay(
                current.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                })
            );

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick);
            }
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [started, value]);

    return (
        <span className="hero-stat-number">
            {display}
            {suffix}
        </span>
    );
}

function Hero() {
    const sectionRef = useRef(null);
    const landscapeRef = useRef(null);
    const foregroundRef = useRef(null);
    const navbarRef = useRef(null);
    const letterRefs = useRef([]);
    const hoveredLetterRef = useRef(null);
    const titleText = 'ALCHERINGA';
    const heroCopyRef = useRef(null);
    const statsRef = useRef(null);
    const [statsStarted, setStatsStarted] = useState(false);

    const spring = {
        type: 'spring',
        stiffness: 360,
        damping: 14,
        mass: 0.8,
    };

    const baseAnimation = {
        scaleY: 1,
        scaleX: 1,
        skewX: 0,
        x: 0,
        y: 0,
    };

    const animateLetter = (index, target) => {
        const letter = letterRefs.current[index];
        if (letter) animate(letter, target, spring);
    };

    const handleLetterEnter = (index) => {
        const previous = hoveredLetterRef.current;
        hoveredLetterRef.current = index;

        const previousAffected =
            previous === null ? [] : [previous - 1, previous, previous + 1];
        const nextAffected = [index - 1, index, index + 1];

        previousAffected
            .filter(
                (i) =>
                    i >= 0 &&
                    i < titleText.length &&
                    !nextAffected.includes(i)
            )
            .forEach((i) => animateLetter(i, baseAnimation));

        nextAffected
            .filter((i) => i >= 0 && i < titleText.length)
            .forEach((i) =>
                animateLetter(i, {
                    ...baseAnimation,
                    scaleY: i === index ? 1.6 : 1.3,
                })
            );
    };

    const handleTitlePointerLeave = () => {
        const previous = hoveredLetterRef.current;
        hoveredLetterRef.current = null;

        if (previous === null) return;

        [previous - 1, previous, previous + 1]
            .filter((i) => i >= 0 && i < titleText.length)
            .forEach((i) => animateLetter(i, baseAnimation));
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Navbar starts lower and moves up during the initial scroll.
            gsap.fromTo(
                navbarRef.current,
                { y: 24 },
                {
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: '+=180',
                        scrub: 1,
                    },
                }
            );

            // Existing landscape and foreground parallax animation.
            const animation = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=800',
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                },
            });

            animation
                .to(
                    landscapeRef.current,
                    {
                        y: -50,
                        ease: 'none',
                    },
                    0
                )
                .to(
                    foregroundRef.current,
                    {
                        y: () => (window.matchMedia('(max-width: 760px)').matches ? -(window.innerHeight * 0.2 + 376) : -350),
                        ease: 'none',
                    },
                    0
                )
                .to(
                    heroCopyRef.current,
                    {
                        y: -50, ease: 'none'
                    },
                    0
                )
                .to(
                    statsRef.current,
                    {
                        y: () => (window.matchMedia('(max-width: 760px)').matches ? -(window.innerHeight * 0.2 + 376) : -350),
                        ease: 'none',
                    },
                    0
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const stats = statsRef.current;
        if (!stats) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(stats);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="hero-scene" ref={sectionRef}>
            <picture>
                <source
                    media="(max-width: 768px)"
                    srcSet="/assets/landscape-mobile.jpeg"
                />
                <img
                    ref={landscapeRef}
                    className="landscape"
                    src="/assets/landscape.jpeg"
                    alt="Sunset landscape with mountains and waterfalls"
                />
            </picture>

            <picture>
                <source
                    media="(max-width: 768px)"
                    srcSet="/assets/foreground-mobile.jpeg"
                />
                <img
                    ref={foregroundRef}
                    className="foreground"
                    src="/assets/foreground.jpeg"
                    alt=""
                />
            </picture>

            <div ref={heroCopyRef} className="hero-copy">
                <h1
                    className="hero-title"
                    aria-label={titleText}
                    onPointerLeave={handleTitlePointerLeave}
                >
                    {[...titleText].map((letter, index) => (
                        <span
                            key={index}
                            ref={(el) => {
                                letterRefs.current[index] = el;
                            }}
                            className="hero-title-letter"
                            onPointerEnter={() => handleLetterEnter(index)}
                            aria-hidden="true"
                        >
                            {letter}
                        </span>
                    ))}
                </h1>

                <div className="hero-intro">
                    <p className="hero-tagline">
                        Northeast India’s biggest cultural fest is back. Bring your crew, bring your craft.
                    </p>
                    <button type="button" className="hero-register-button">
                        <span className="hero-register-label">REGISTER</span>
                    </button>
                </div>
            </div>

            <div ref={statsRef} className="hero-stats">
                <div className="hero-stat">
                    <AnimatedStatNumber value={140} suffix="K" started={statsStarted} />
                    <span className="hero-stat-label">FOOTFALL</span>
                </div>
                <div className="hero-stat">
                    <AnimatedStatNumber value={100} suffix="+" started={statsStarted} />
                    <span className="hero-stat-label">Events</span>
                </div>
                <div className="hero-stat">
                    <AnimatedStatNumber value={500} suffix="+" started={statsStarted} />
                    <span className="hero-stat-label">COLLEGE</span>
                </div>
                <div className="hero-stat">
                    <AnimatedStatNumber value={45} suffix="+" started={statsStarted} />
                    <span className="hero-stat-label">COMPETITIONS</span>
                </div>
                <div className="hero-stat hero-stat-featured">
                    <AnimatedStatNumber value={3000} suffix="+" started={statsStarted} />
                    <span className="hero-stat-label">PARTICIPANTS</span>
                </div>
            </div>



            <div ref={navbarRef} className="navbar-animation-wrapper">
                <Navbar />
            </div>
        </section>
    );
}

export default Hero;
