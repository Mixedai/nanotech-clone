// src/components/evolve.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initEvolve() {
  const section = document.querySelector('.evolve-section');
  if (!section) return;

  _initScrollAnimations(section);
}

function _initScrollAnimations(section) {
  const badge = section.querySelector('.evolve-level-badge');
  const title = section.querySelector('.evolve-title');
  const subtitle = section.querySelector('.evolve-subtitle');
  const xpBar = section.querySelector('.evolve-xp-bar');
  const xpFill = section.querySelector('.xp-fill');
  const centerNode = section.querySelector('.tree-center-node');
  const lines = section.querySelectorAll('.tree-line');
  const unlockedNodes = section.querySelectorAll('.tree-node.unlocked');
  const lockedNodes = section.querySelectorAll('.tree-node.locked');
  const stats = section.querySelectorAll('.evolve-stat');
  const particles = section.querySelectorAll('.e-particle');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Level badge
  if (badge) {
    tl.from(badge, {
      y: -20,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
    });
  }

  // Title with scale
  tl.from(title, {
    y: 30,
    opacity: 0,
    scale: 0.9,
    duration: 0.7,
    ease: 'power4.out',
  }, '-=0.2');

  // Subtitle
  if (subtitle) {
    tl.from(subtitle, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.4');
  }

  // XP bar — fill animates from 0 to 82%
  if (xpBar) {
    tl.from(xpBar, {
      opacity: 0,
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.2');
  }

  if (xpFill) {
    tl.from(xpFill, {
      width: '0%',
      duration: 1,
      ease: 'power2.out',
    }, '-=0.2');
  }

  // Center node — big bounce entrance
  if (centerNode) {
    tl.from(centerNode, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2.5)',
    }, '-=0.5');
  }

  // Connection lines — grow outward with stagger
  if (lines.length > 0) {
    tl.from(lines, {
      scaleX: 0,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.out',
      transformOrigin: 'left center',
    }, '-=0.3');
  }

  // Unlocked nodes — pop in with rotation
  if (unlockedNodes.length > 0) {
    tl.from(unlockedNodes, {
      scale: 0,
      opacity: 0,
      rotation: -15,
      duration: 0.5,
      stagger: 0.12,
      ease: 'back.out(2)',
    }, '-=0.3');
  }

  // Locked nodes — ghostly fade
  if (lockedNodes.length > 0) {
    tl.from(lockedNodes, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=0.2');
  }

  // Stats — count up and fade in
  if (stats.length > 0) {
    tl.from(stats, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power3.out',
    }, '-=0.2');
  }

  // Particles — subtle float in
  if (particles.length > 0) {
    tl.from(particles, {
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power1.out',
    }, '-=0.5');
  }
}
