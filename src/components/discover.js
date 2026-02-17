// src/components/discover.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleCanvas } from './particles.js';

gsap.registerPlugin(ScrollTrigger);

export function initDiscover() {
  const section = document.querySelector('.discover-section');
  if (!section) return;

  _initParticles(section);
  _initScrollAnimations(section);
  _initCardTilt(section);
  _initCounter(section);
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
  const pill = section.querySelector('.discover-pill');
  const cards = section.querySelectorAll('.glass-card');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  tl.from(title, {
    y: -40,
    opacity: 0,
    duration: 0.6,
    ease: 'power4.out',
  });

  if (pill) {
    tl.from(pill, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(1.7)',
    }, '-=0.3');
  }

  if (cards.length > 0) {
    tl.from(cards, {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power4.out',
    }, '-=0.2');
  }

  // Parallax: cards move at different speeds
  cards.forEach((card, i) => {
    const speed = 30 + i * 20;
    gsap.to(card, {
      y: -speed,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

// --- 3D Card Tilt ---
function _initCardTilt(section) {
  // Disable on touch devices
  if ('ontouchstart' in window) return;

  const cards = section.querySelectorAll('.glass-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

// --- Animated Counter ---
function _initCounter(section) {
  const counter = section.querySelector('.stats-counter');
  if (!counter) return;

  const target = parseInt(counter.dataset.target, 10);

  ScrollTrigger.create({
    trigger: counter,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          counter.textContent = Math.floor(this.targets()[0].val).toLocaleString() + '+';
        },
      });
    },
  });
}

// --- Glow follows mouse on cards ---
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
      glow.style.left = `${x}%`;
      glow.style.top = `${y}%`;
    });
  });
}

function _createGlow(card) {
  const glow = document.createElement('div');
  glow.className = 'glass-glow';
  glow.style.cssText = `
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: ${card.dataset.glow || '#fff'};
    opacity: 0.08;
    filter: blur(60px);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.2s ease, top 0.2s ease;
    z-index: 0;
  `;
  card.appendChild(glow);
  return glow;
}
