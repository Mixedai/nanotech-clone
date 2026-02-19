import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initProjects() {
    // Use delayedCall instead of arbitrary setTimeout for reliable timing
    gsap.delayedCall(0, () => {
        const items = document.querySelectorAll('.project-title-item');
        const bgs = document.querySelectorAll('.project-bg');

        if (items.length === 0 || bgs.length === 0) return;

        // Ensure defaults
        bgs.forEach(bg => bg.style.opacity = '0');
        items.forEach(item => item.classList.remove('active'));

        // Function to set active
        const setActive = (index) => {
            // Reset all
            bgs.forEach(bg => bg.style.opacity = '0');
            items.forEach(item => item.classList.remove('active'));

            // Set Active
            if (bgs[index]) bgs[index].style.opacity = '1';
            if (items[index]) items[index].classList.add('active');
        };

        items.forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActive(index),
                onEnterBack: () => setActive(index),
            });

            // Keep Hover for desktop mouse users
            item.addEventListener('mouseenter', () => setActive(index));
        });

        ScrollTrigger.refresh();
    });
}
