import gsap from 'gsap';

export function initHero() {
    const subtitleEl = document.querySelector('.hero-subtitle');
    // Hide subtitle for typing reveal
    if (subtitleEl) subtitleEl.style.visibility = 'hidden';

    const tl = gsap.timeline();

    // 1. Header entrance (CSS sets initial hidden state)
    tl.to('.site-header', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    })
    // 2. Title clip-path reveal (CSS sets translateY(110%))
    .to('.title-line-inner', {
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out'
    }, '-=0.5')
    // 3. Trigger typing effect after title lands
    .add(() => {
        _initTypingEffect(subtitleEl, 0);
    })
    // 4. CTA slide-up (CSS sets initial hidden state)
    .to('.hero-cta', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    }, '+=1.2')
    // 5. Bottom bar + scroll indicator (CSS sets initial hidden state)
    .to('.hero-bottom-bar > *', {
        y: 0,
        opacity: 1,
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

    // Use quickSetter for batched transform updates
    const setX = gsap.quickSetter(spotlight, 'x', 'px');
    const setY = gsap.quickSetter(spotlight, 'y', 'px');

    section.addEventListener('mouseenter', () => {
        spotlight.style.opacity = '1';
    });

    section.addEventListener('mouseleave', () => {
        spotlight.style.opacity = '0';
    });

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        setX(e.clientX - rect.left - 250);
        setY(e.clientY - rect.top - 250);
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
        // Use lenis if available, fallback to native
        if (window.__lenis) {
            window.__lenis.scrollTo(target);
        } else {
            target.scrollIntoView({ behavior: 'smooth' });
        }
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
