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
  const title = section.querySelector('.evolve-title');
  const subtitle = section.querySelector('.evolve-subtitle');
  const centerNode = section.querySelector('.tree-center-node');
  const branches = section.querySelectorAll('.tree-branch');
  const lines = section.querySelectorAll('.tree-line');
  const unlockedNodes = section.querySelectorAll('.tree-node.unlocked');
  const lockedNodes = section.querySelectorAll('.tree-node.locked');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Header
  tl.from(title, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power4.out',
  });

  if (subtitle) {
    tl.from(subtitle, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.3');
  }

  // Center node — scale bounce
  if (centerNode) {
    tl.from(centerNode, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)',
    }, '-=0.1');
  }

  // Connection lines — grow outward
  if (lines.length > 0) {
    tl.from(lines, {
      scaleX: 0,
      opacity: 0,
      duration: 0.3,
      stagger: 0.06,
      ease: 'power2.out',
      transformOrigin: 'left center',
    }, '-=0.2');
  }

  // Unlocked nodes — pop in
  if (unlockedNodes.length > 0) {
    tl.from(unlockedNodes, {
      scale: 0.5,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.5)',
    }, '-=0.2');
  }

  // Locked nodes — subtle fade
  if (lockedNodes.length > 0) {
    tl.from(lockedNodes, {
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out',
    }, '-=0.1');
  }
}
