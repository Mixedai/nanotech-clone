import gsap from 'gsap';

export function initHero() {
    const tl = gsap.timeline();

    tl.from('.site-header', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    })
        .from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out'
        }, '-=0.5')
        .from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=1')
        .from('.hero-bottom-bar > div', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.5');
}
