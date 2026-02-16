import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initProjects() {
    setTimeout(() => {
        const items = document.querySelectorAll('.project-title-item');
        const bgs = document.querySelectorAll('.project-bg');

        console.log(`Init Projects: ${items.length} items, ${bgs.length} bgs`);

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
                start: "top center", // When top of item hits center
                end: "bottom center", // When bottom of item hits center
                onEnter: () => setActive(index),
                onEnterBack: () => setActive(index),
                // optional: onLeave: () => hide(index) if we want solid black gaps
            });

            // Keep Hover for desktop mouse users
            item.addEventListener('mouseenter', () => setActive(index));
        });

        ScrollTrigger.refresh();

    }, 300);
}
