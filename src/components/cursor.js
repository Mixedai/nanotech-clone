import gsap from 'gsap';

export function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, .project-item, button');

    if (!cursor) return;

    // Follow mouse
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Hover effects
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });
}
