import gsap from 'gsap';

export function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, .project-item, button');

    if (!cursor) return;

    // Use quickTo for efficient per-frame updates (no new tween per event)
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });

    document.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
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
