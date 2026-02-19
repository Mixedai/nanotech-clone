// src/components/discover.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleCanvas } from './particles.js';

export function initDiscover() {
  const section = document.querySelector('.discover-section');
  if (!section) return;

  _initParticles(section);
  _initScrollAnimations(section);
  _initCardTilt(section);
  _initGlowTracking(section);
}

// --- Particle Background ---
function _initParticles(section) {
  const canvas = section.querySelector('.particle-canvas');
  if (!canvas) return;

  canvas.style.pointerEvents = 'none';

  new ParticleCanvas(canvas, {
    count: window.innerWidth < 768 ? 60 : 120,
    color: '255, 255, 255',
    lineMaxDist: 150,
    repelDist: 80,
  });
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.discover-title');
  const desc = section.querySelector('.discover-desc');
  const cta = section.querySelector('.discover-cta');
  const card = section.querySelector('.glass-card');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Left side: text animations
  tl.from(title, {
    x: -60,
    opacity: 0,
    duration: 0.7,
    ease: 'power4.out',
  });

  if (desc) {
    tl.from(desc, {
      x: -40,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.4');
  }

  if (cta) {
    tl.from(cta, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.2');
  }

  // Right side: card animation
  if (card) {
    tl.from(card, {
      x: 80,
      opacity: 0,
      rotation: 3,
      duration: 0.8,
      ease: 'power4.out',
    }, '-=0.6');

    // Parallax on card
    gsap.to(card, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  _initParallaxLayers(section);
}

function _initParallaxLayers(section) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const title = section.querySelector('.discover-title');
    const desc = section.querySelector('.discover-desc');

    if (title) {
      gsap.to(title, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    if (desc) {
      gsap.to(desc, {
        y: -15,
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

// --- 3D Card Tilt ---
function _initCardTilt(section) {
  if ('ontouchstart' in window) return;

  const cards = section.querySelectorAll('.glass-card');

  cards.forEach((card) => {
    // Use gsap.quickTo for batched compositor-only updates
    const setRotateX = gsap.quickTo(card, 'rotateX', { duration: 0.15, ease: 'power2.out' });
    const setRotateY = gsap.quickTo(card, 'rotateY', { duration: 0.15, ease: 'power2.out' });
    const setZ = gsap.quickTo(card, 'z', { duration: 0.15, ease: 'power2.out' });

    gsap.set(card, { transformPerspective: 1000 });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setRotateX(((y - centerY) / centerY) * -8);
      setRotateY(((x - centerX) / centerX) * 8);
      setZ(10);
    });

    card.addEventListener('mouseleave', () => {
      setRotateX(0);
      setRotateY(0);
      setZ(0);
    });
  });
}

// --- Glow follows mouse on card ---
function _initGlowTracking(section) {
  if ('ontouchstart' in window) return;

  const cards = section.querySelectorAll('.glass-card');
  cards.forEach((card) => {
    const glowColor = card.dataset.glow;
    if (glowColor) {
      card.style.setProperty('--card-glow', glowColor);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = card.querySelector('.glass-glow') || _createGlow(card);
      // Use transform instead of left/top (compositor-only, no layout reflow)
      glow.style.transform = `translate(calc(${x}% - 50%), calc(${y}% - 50%))`;
    });
  });
}

function _createGlow(card) {
  const glow = document.createElement('div');
  glow.className = 'glass-glow';
  glow.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: ${card.dataset.glow || '#fff'};
    opacity: 0.08;
    filter: blur(60px);
    pointer-events: none;
    transition: transform 0.2s ease;
    z-index: 0;
  `;
  card.appendChild(glow);
  return glow;
}
