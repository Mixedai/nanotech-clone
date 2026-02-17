// src/components/learn.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLearn() {
  const section = document.querySelector('.learn-section');
  if (!section) return;

  _initScrollAnimations(section);
  _initDragScroll(section);
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.learn-title');
  const desc = section.querySelector('.learn-desc');
  const viewAll = section.querySelector('.learn-view-all');
  const cards = section.querySelectorAll('.course-card');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  tl.from(title, {
    y: -30,
    opacity: 0,
    duration: 0.6,
    ease: 'power4.out',
  });

  if (desc) {
    tl.from(desc, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.3');
  }

  if (viewAll) {
    tl.from(viewAll, {
      opacity: 0,
      duration: 0.3,
    }, '-=0.2');
  }

  if (cards.length > 0) {
    tl.from(cards, {
      x: 60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power4.out',
    }, '-=0.3');
  }
}

// --- Drag to Scroll ---
function _initDragScroll(section) {
  const carousel = section.querySelector('.learn-carousel');
  if (!carousel) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });
}
