// src/components/bento.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initBento() {
  const section = document.querySelector('.bento-section');
  if (!section) return;

  _initScrollAnimations(section);
  _initParallax(section);
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.bento-title');
  const subtitle = section.querySelector('.bento-subtitle');
  const cards = section.querySelectorAll('.bento-card');

  if (title) {
    gsap.from(title, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  if (subtitle) {
    gsap.from(subtitle, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  if (cards.length) {
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section.querySelector('.bento-grid'),
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }
}

// --- Parallax (desktop only) ---
function _initParallax(section) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const title = section.querySelector('.bento-title');
    const grid = section.querySelector('.bento-grid');

    if (title) {
      gsap.to(title, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    if (grid) {
      gsap.to(grid, {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  });
}
