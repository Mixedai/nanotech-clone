// src/components/learn.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLearn() {
  const section = document.querySelector('.learn-section');
  if (!section) return;

  _initScrollAnimations(section);
  _initParallax(section);
  _initDragScroll(section);
  _initCarouselNav(section);
  _initProgressBar(section);
}

function _initParallax(section) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const title = section.querySelector('.learn-title');
    const circle1 = section.querySelector('.learn-circle-1');
    const circle2 = section.querySelector('.learn-circle-2');

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

    if (circle1) {
      gsap.to(circle1, {
        y: 100,
        x: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }

    if (circle2) {
      gsap.to(circle2, {
        y: -80,
        x: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }
  });
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.learn-title');
  const desc = section.querySelector('.learn-desc');
  const viewAll = section.querySelector('.learn-view-all');
  const cards = section.querySelectorAll('.course-card');
  const nav = section.querySelector('.carousel-nav');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  tl.from(title, {
    y: 40,
    opacity: 0,
    duration: 0.7,
    ease: 'power4.out',
  });

  if (desc) {
    tl.from(desc, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.4');
  }

  if (viewAll) {
    tl.from(viewAll, {
      x: -20,
      opacity: 0,
      duration: 0.4,
    }, '-=0.3');
  }

  if (cards.length > 0) {
    tl.from(cards, {
      x: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power4.out',
    }, '-=0.4');
  }

  if (nav) {
    tl.from(nav, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
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

// --- Arrow Navigation ---
function _initCarouselNav(section) {
  const carousel = section.querySelector('.learn-carousel');
  const prevBtn = section.querySelector('.carousel-prev');
  const nextBtn = section.querySelector('.carousel-next');
  if (!carousel || !prevBtn || !nextBtn) return;

  const scrollAmount = 344; // card width + gap

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

// --- Progress Bar ---
function _initProgressBar(section) {
  const carousel = section.querySelector('.learn-carousel');
  const progressBar = section.querySelector('.carousel-progress-bar');
  if (!carousel || !progressBar) return;

  const updateProgress = () => {
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    if (scrollWidth <= 0) {
      progressBar.style.width = '100%';
      return;
    }
    const progress = (carousel.scrollLeft / scrollWidth) * 100;
    const barWidth = Math.max(20, Math.min(100, 20 + progress * 0.8));
    progressBar.style.width = `${barWidth}%`;
  };

  carousel.addEventListener('scroll', updateProgress);
  updateProgress();
}
