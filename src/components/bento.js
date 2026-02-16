import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initBentoGrid() {
    const gridPanel = document.querySelector('.bento-grid-panel');
    const cards = document.querySelectorAll('.bento-card');

    if (!gridPanel || cards.length === 0) return;

    // 1. Entrance Animation (Staggered Fade In & Slide Up)
    gsap.from(cards, {
        scrollTrigger: {
            trigger: '.discover-section',
            start: 'top 75%', // Trigger earlier
            toggleActions: 'play none none reverse'
        },
        y: 150, // Deeper start
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        clearProps: 'all' // Clear props after animation to avoid conflict with hover
    });

    // 2. Parallax Effect (Stronger Movement)
    // We animate the panel itself to move slower than scroll (giving depth)
    gsap.fromTo(gridPanel,
        { y: 100 }, // Start slightly lower
        {
            y: -200, // Move up significantly as we scroll past
            ease: 'none',
            scrollTrigger: {
                trigger: '.discover-section',
                start: 'top bottom', // Start when section enters viewport
                end: 'bottom top',   // End when section leaves
                scrub: 1 // Direct scrub
            }
        }
    );
}
