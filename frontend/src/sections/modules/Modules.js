import './Module.css';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getApiMediaUrl, getExploreModulesApi } from '../../utils/api';

gsap.registerPlugin(ScrollTrigger);
// stop the pin from re-calculating every time the mobile URL bar shows/hides
ScrollTrigger.config({ ignoreMobileResize: true });

// hovered / tapped card size relative to its resting size (305x390 -> 345x445 in the design)
const ACTIVE_SCALE = { w: 345 / 305, h: 445 / 390 };

// fixed tilts so the stacked deck looks hand-placed (matches the prototype frame)
const STACK_TILTS = [-12, 8, -5, 11, -9, 4, -7, 10];

const ChevronIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Module() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const wrapRef = useRef(null);
    const cardsRef = useRef(null);
    const arrowsRef = useRef(null);

    const hoverTls = useRef([]);      // one reversible timeline per card
    const openIndex = useRef(null);
    const [edge, setEdge] = useState({ start: true, end: false });
    const [moduleCards, setModuleCards] = useState([]);
    const [modulesLoaded, setModulesLoaded] = useState(false);
    const [moduleLoadError, setModuleLoadError] = useState('');

    const canHover = () => window.matchMedia('(hover: hover)').matches;
    const isReady = () => sectionRef.current?.classList.contains('is-ready');

    useEffect(() => {
        let cancelled = false;

        getExploreModulesApi()
            .then(({ modules, allcomp }) => {
                if (cancelled) return;

                const competitionsByModule = new Map();
                allcomp.forEach((competition) => {
                    const moduleId = competition.module?.id;
                    if (!moduleId) return;
                    const key = String(moduleId);
                    if (!competitionsByModule.has(key)) competitionsByModule.set(key, []);
                    if (competition.event_name) competitionsByModule.get(key).push({
                        id: competition.id,
                        name: competition.event_name,
                    });
                });

                const cards = modules.map((backendModule, index) => ({
                    id: backendModule.id || backendModule.module_query_name_without_spaces_all_small || 'module-' + index,
                    category: backendModule.module || 'Module',
                    queryName: backendModule.module_query_name_without_spaces_all_small || '',
                    image: getApiMediaUrl(backendModule.module_icon),
                    activeImage: getApiMediaUrl(backendModule.module_icon_active),
                    competitions: competitionsByModule.get(String(backendModule.id)) || [],
                }));
                setModuleCards(cards);
                setModuleLoadError('');
            })
            .catch((error) => {
                if (!cancelled) setModuleLoadError(error.message || 'Could not load modules.');
            })
            .finally(() => {
                if (!cancelled) setModulesLoaded(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);
    /* ---------- hover / open / close ---------- */
    useEffect(() => {
        if (!modulesLoaded) return undefined;
        const section = sectionRef.current;

        const ctx = gsap.context(() => {
            hoverTls.current = gsap.utils.toArray('.card').map((card) => {
                const title = card.querySelector('.card-category');
                const reveal = card.querySelector('.card-reveal');
                const items = reveal.querySelectorAll('li');

                return gsap
                    .timeline({ paused: true, defaults: { ease: 'power3.out' } })
                    .to(card, {
                        // measured from the card's own CSS size, so it works at every breakpoint
                        width: () => card.offsetWidth * ACTIVE_SCALE.w,
                        height: () => card.offsetHeight * ACTIVE_SCALE.h,
                        flexBasis: () => card.offsetWidth * ACTIVE_SCALE.w,
                        duration: 0.5,
                    }, 0)
                    .to(title, { y: () => -(reveal.scrollHeight + 25), duration: 0.45 }, 0)
                    .to(reveal, { opacity: 1, duration: 0.25 }, 0.1)
                    .to(items, { y: 0, opacity: 1, stagger: 0.06, duration: 0.3, ease: 'power2.out' }, 0.15);
            });
        }, section);

        return () => ctx.revert();
    }, [modulesLoaded, moduleCards]);

    const openCard = (i, el) => {
        if (!isReady() || openIndex.current === i) return;
        if (openIndex.current !== null) closeCard(openIndex.current);
        const tl = hoverTls.current[i];
        const module = moduleCards[i];
        if (module?.activeImage && el) el.style.backgroundImage = 'url("' + module.activeImage + '")';
        if (!tl) return;
        if (tl.progress() === 0) {
            // drop the old inline px sizes (they go stale after a resize / rotate),
            // then re-measure from CSS
            gsap.set(el, { clearProps: 'width,height,flexBasis' });
            tl.invalidate();
        }
        el.classList.add('is-open');
        tl.timeScale(1).play();
        openIndex.current = i;
    };

    const closeCard = (i) => {
        const tl = hoverTls.current[i];
        const module = moduleCards[i];
        const el = cardsRef.current?.children[i];
        if (el) el.style.backgroundImage = module?.image ? 'url("' + module.image + '")' : '';
        if (!tl) return;
        el?.classList.remove('is-open');
        tl.timeScale(1.6).reverse(); // reversing = exact mirror of the open animation
        if (openIndex.current === i) openIndex.current = null;
    };

    /* ---------- scroll animation (pinned + scrubbed) ---------- */
    useEffect(() => {
        if (!modulesLoaded) return undefined;
        const section = sectionRef.current;
        const mm = gsap.matchMedia();

        // Phones and reduced-motion users see the cards immediately, without
        // the pinned scroll / fan-out animation that can feel laggy on mobile.
        mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
            section.classList.add('is-ready');
            gsap.set(arrowsRef.current, { opacity: 1 });
        });

        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            const cards = gsap.utils.toArray('.card', section);

            const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=170%',
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        section.classList.toggle('is-ready', self.progress > 0.97);
                    },
                    onLeaveBack: () => section.classList.remove('is-ready'),
                },
            });

            // 1. title moves up a short distance into place so the next section
            // does not sit blank for too long after About.
            tl.fromTo(
                headerRef.current,
                { y: () => window.innerHeight * 0.12, opacity: 0.25 },
                { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
                0
            )
                // 2. bring the deck into view early with a short rise so it is
                // visible while the cards fan out, instead of starting below the fold.
                .fromTo(wrapRef.current, { y: () => window.innerHeight * 0.12 }, { y: 0, ease: 'power2.out', duration: 0.55 }, 0.15)
                // 3. deck fans out into the row
                .fromTo(
                    cards,
                    {
                        // pull every card onto the screen centre, tilted
                        x: (i, el) => {
                            // use the card's own parent: cardsRef.current can be null
                            // when GSAP re-evaluates values (refresh / StrictMode remount)
                            const left = el.parentElement.getBoundingClientRect().left;
                            return window.innerWidth / 2 - (left + el.offsetLeft + el.offsetWidth / 2);
                        },
                        rotation: (i) => STACK_TILTS[i % STACK_TILTS.length],
                        zIndex: (i) => cards.length - i,
                    },
                    { x: 0, rotation: 0, duration: 1.2, ease: 'power3.inOut', stagger: 0.06 },
                    2.0
                )
                // 4. arrows fade in last
                .fromTo(arrowsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '>-0.3');
        });

        // fonts change the title height -> re-measure the pin
        let cancelled = false;
        document.fonts?.ready.then(() => {
            if (!cancelled) ScrollTrigger.refresh();
        });

        return () => {
            cancelled = true;
            mm.revert();
        };
    }, [modulesLoaded, moduleCards]);

    /* ---------- carousel arrows ---------- */
    const syncEdges = () => {
        const el = cardsRef.current;
        if (!el) return;
        setEdge({
            start: el.scrollLeft <= 4,
            end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
        });
    };

    useEffect(() => {
        if (modulesLoaded) syncEdges();
    }, [modulesLoaded, moduleCards]);
    const scrollCards = (dir) => {
        const el = cardsRef.current;
        const card = el.querySelector('.card');
        const step = (card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 32)) * 2;
        el.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    return (
        <section className="module-section" id="modules" ref={sectionRef} aria-busy={!modulesLoaded}>
            <div className="module-header" ref={headerRef}>
                <h2 className="title">
                    Explore
                    <span>Modules</span>
                </h2>
            </div>

            <div className="cards-wrap" ref={wrapRef}>
                <div className="cards-arrows" ref={arrowsRef}>
                    <button
                        className="arrow-btn"
                        aria-label="Previous modules"
                        disabled={edge.start}
                        onClick={() => scrollCards(-1)}
                    >
                        <span className="arrow-btn-icon arrow-btn-icon--prev" aria-hidden="true"><ChevronIcon /></span>
                    </button>
                    <button
                        className="arrow-btn"
                        aria-label="Next modules"
                        disabled={edge.end}
                        onClick={() => scrollCards(1)}
                    >
                        <span className="arrow-btn-icon" aria-hidden="true"><ChevronIcon /></span>
                    </button>
                </div>

                <div className="cards" ref={cardsRef} onScroll={syncEdges}>
                    {moduleLoadError ? (
                        <p className="module-data-error" role="alert">{moduleLoadError}</p>
                    ) : moduleCards.map((module, index) => (
                        <div
                            key={module.id}
                            className="card"
                            style={{ backgroundImage: module.image ? 'url("' + module.image + '")' : undefined }}
                            tabIndex={0}
                            onMouseEnter={(e) => canHover() && openCard(index, e.currentTarget)}
                            onMouseLeave={() => canHover() && closeCard(index)}
                            // touch devices have no hover: tap toggles
                            onClick={(e) => {
                                if (canHover()) return;
                                openIndex.current === index ? closeCard(index) : openCard(index, e.currentTarget);
                            }}
                            // keyboard: focusing the card (or the link inside) opens it
                            onFocus={(e) => canHover() && openCard(index, e.currentTarget)}
                            onBlur={(e) => {
                                if (canHover() && !e.currentTarget.contains(e.relatedTarget)) closeCard(index);
                            }}
                        >
                            <div className="card-content">
                                <h3 className="card-category">{module.category}</h3>

                                <div className="card-reveal">
                                    <ul className="competition-list">
                                        {module.competitions.map((competition) => (
                                            <li key={competition.id || competition.name}>{competition.name}</li>
                                        ))}
                                    </ul>
                                    <Link
                                        className="explore-btn"
                                        to={'/modules/' + (module.queryName || slugify(module.category))}
                                    >
                                        <span className="eb-icon" aria-hidden="true">
                                            <ChevronIcon />
                                        </span>
                                        <span className="eb-label">Explore More</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
