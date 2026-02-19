import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
    const subtitleEl = document.querySelector('.hero-subtitle');
    // Hide subtitle for typing reveal
    if (subtitleEl) subtitleEl.style.visibility = 'hidden';

    const tl = gsap.timeline();

    // 1. Header entrance
    tl.from('.site-header', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    })
    // 2. Title clip-path reveal (line by line mask)
    .from('.title-line-inner', {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out'
    }, '-=0.5')
    // 3. Trigger typing effect after title lands
    .add(() => {
        _initTypingEffect(subtitleEl, 0);
    })
    // 4. CTA slide-up (1.2s after typing starts)
    .from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '+=1.2')
    // 5. Bottom bar + scroll indicator
    .from('.hero-bottom-bar > *', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.3');

    _initSpotlight();
    _initCTAScroll();
    _initHeroParallax();
}

function _initSpotlight() {
    if ('ontouchstart' in window) return;

    const section = document.querySelector('.hero-section');
    const spotlight = document.querySelector('.hero-spotlight');
    if (!section || !spotlight) return;

    section.addEventListener('mouseenter', () => {
        spotlight.style.opacity = '1';
    });

    section.addEventListener('mouseleave', () => {
        spotlight.style.opacity = '0';
    });

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlight.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    });
}

function _initTypingEffect(subtitleEl, delay) {
    if (!subtitleEl) return;
    const fullHTML = subtitleEl.innerHTML;
    subtitleEl.innerHTML = '';
    subtitleEl.style.visibility = 'visible';

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';

    const text = fullHTML.replace(/<br\s*\/?>/gi, '\n');
    const stripped = text.replace(/<[^>]*>/g, '');
    subtitleEl.textContent = '';
    subtitleEl.appendChild(cursor);

    let i = 0;
    const speed = 30;

    setTimeout(() => {
        const interval = setInterval(() => {
            if (i < stripped.length) {
                const char = stripped[i];
                if (char === '\n') {
                    cursor.before(document.createElement('br'));
                } else {
                    cursor.before(document.createTextNode(char));
                }
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    cursor.style.opacity = '0';
                }, 3000);
            }
        }, speed);
    }, delay);
}

function _initCTAScroll() {
    const cta = document.querySelector('.hero-cta');
    const target = document.querySelector('.discover-section');
    if (!cta || !target) return;

    cta.addEventListener('click', (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
}

function _initHeroParallax() {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
        const section = document.querySelector('.hero-section');
        if (!section) return;

        // Title — fastest layer (deepest depth)
        gsap.to('.hero-title', {
            y: -120,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            },
        });

        // Subtitle — medium speed, early fade
        gsap.to('.hero-subtitle', {
            y: -80,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '70% top',
                scrub: 1,
            },
        });

        // CTA — medium, scale down
        gsap.to('.hero-cta', {
            y: -60,
            opacity: 0,
            scale: 0.95,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '70% top',
                scrub: 1,
            },
        });

        // Bottom bar — slowest, first to disappear
        gsap.to('.hero-bottom-bar', {
            y: -30,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '50% top',
                scrub: 0.8,
            },
        });

        // Overall hero content subtle scale-down
        gsap.to('.hero-content', {
            scale: 0.97,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });
    });
}
