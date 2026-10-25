import './AfterMovie.css';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// stop the pin from re-calculating every time the mobile URL bar shows/hides
ScrollTrigger.config({ ignoreMobileResize: true });

/* ---- content ---- */
const POSTER = `${process.env.PUBLIC_URL}/assets/aftermovie/poster.jpg`;
const YOUTUBE_ID = 'xsxBaj4Ebog';
const YOUTUBE_EMBED_URL = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1`;

export default function AfterMovie() {
    const sectionRef = useRef(null);
    const frameRef = useRef(null);
    const headingRef = useRef(null);
    const titleRef = useRef(null);
    const iframeRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [posterOk, setPosterOk] = useState(true);

    const toggleMute = () => {
        if (!iframeRef.current) return;
        const action = isMuted ? 'unMute' : 'mute';
        iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: action, args: [] }),
            '*'
        );
        setIsMuted(!isMuted);
    };

    useEffect(() => {
        const section = sectionRef.current;
        const mm = gsap.matchMedia();

        // where the frame ends up, per screen size
        const finalFrame = (size) => {
            if (size === 'small') {
                // phone design: heading on top, near-square image, big title *below* it
                return { top: '28vh', bottom: '36vh', left: '6%', right: '6%', borderRadius: 14 };
            }
            if (size === 'medium') {
                return { top: '21vh', bottom: '25vh', left: '8%', right: '8%', borderRadius: 16 };
            }
            return { top: '20vh', bottom: '22vh', left: '18%', right: '18%', borderRadius: 16 };
        };

        mm.add(
            {
                reduce: '(prefers-reduced-motion: reduce)',
                small: '(max-width: 767px)',
                medium: '(min-width: 768px) and (max-width: 1024px)',
            },
            (context) => {
                const { reduce, small, medium } = context.conditions;
                const size = small ? 'small' : medium ? 'medium' : 'large';
                const end = finalFrame(size);

                // Reduced motion: show the final, framed layout straight away
                if (reduce) {
                    gsap.set(frameRef.current, end);
                    gsap.set(headingRef.current, { opacity: 1, y: 0, color: '#0F3027' });
                    gsap.set(titleRef.current, { x: 0, color: '#0F3027' });
                    return;
                }

                const tl = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: '+=130%',
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                // 1. full-bleed image shrinks into the framed card
                tl.fromTo(
                    frameRef.current,
                    { top: 0, bottom: 0, left: 0, right: 0, borderRadius: 0 },
                    { ...end, ease: 'power2.inOut', duration: 1 },
                    0
                )
                    // 2. heading rises in; cream over the photo -> green on the cream page
                    .fromTo(
                        headingRef.current,
                        { y: 50, opacity: 0, color: '#F7E7D0' },
                        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
                        0.25
                    )
                    .to(headingRef.current, { color: '#0F3027', duration: 0.4 }, 0.6)
                    // 3. big year title: starts at the bottom-right of the photo, glides to its final spot
                    .fromTo(
                        titleRef.current,
                        {
                            // right edge ends up the same distance from the screen edge as its left edge is
                            x: (i, target) => {
                                const el = target || titleRef.current;
                                if (!el) return 0;
                                return Math.max(0, window.innerWidth - el.offsetLeft * 2 - el.offsetWidth);
                            },
                            // phones: title sits under the image at the end, so start it near the screen bottom
                            y: (i, target) => {
                                if (!small) return 0;
                                const el = target || titleRef.current;
                                if (!el) return 0;
                                return Math.max(0, window.innerHeight * 0.84 - (el.offsetTop + el.offsetHeight));
                            },
                            color: '#F7E7D0',
                        },
                        { x: 0, y: 0, ease: 'power2.inOut', duration: 0.9 },
                        0.1
                    )
                    .to(titleRef.current, { color: '#0F3027', duration: 0.4 }, 0.6);
            }
        );

        const autoPlayTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 85%',
            onEnter: () => setPlaying(true),
            onEnterBack: () => setPlaying(true),
        });

        let cancelled = false;
        document.fonts?.ready.then(() => {
            if (!cancelled) ScrollTrigger.refresh();
        });

        return () => {
            cancelled = true;
            autoPlayTrigger.kill();
            mm.revert();
        };
    }, []);

    return (
        <section className="aftermovie-section" id="aftermovie" ref={sectionRef}>
            <h2 className="am-heading" ref={headingRef}>
                Check out the after movie
            </h2>

            <div className="am-frame" ref={frameRef}>
                {playing ? (
                    <>
                        <iframe
                            ref={iframeRef}
                            className="am-media am-media--youtube"
                            src={YOUTUBE_EMBED_URL}
                            title="Alcheringa after movie"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                        <button
                            type="button"
                            className="am-sound-btn"
                            onClick={toggleMute}
                            aria-label={isMuted ? 'Unmute aftermovie' : 'Mute aftermovie'}
                        >
                            {isMuted ? (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                        <line x1="23" y1="9" x2="17" y2="15" />
                                        <line x1="17" y1="9" x2="23" y2="15" />
                                    </svg>
                                    <span>Sound Off</span>
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                    <span>Sound On</span>
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    posterOk ? (
                        <img
                            className="am-media"
                            src={POSTER}
                            alt="Crowd at Alcheringa watching the main stage"
                            onError={() => setPosterOk(false)}
                        />
                    ) : (
                        <div className="am-media am-fallback" aria-hidden="true" />
                    )
                )}
            </div>

            <p className="am-title" ref={titleRef}>
                Alcheringa&rsquo;26
            </p>
        </section>
    );
}