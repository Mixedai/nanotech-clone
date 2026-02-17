// src/components/use-them.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initUseThem() {
  const section = document.querySelector('.use-them-section');
  if (!section) return;

  _initScrollAnimations(section);
  _initDashboardParallax(section);
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.use-them-title');
  const desc = section.querySelector('.use-them-desc');
  const cta = section.querySelector('.use-them-cta');
  const mockup = section.querySelector('.dashboard-mockup');
  const sidebarTools = section.querySelectorAll('.dash-tool');
  const promptBar = section.querySelector('.dash-prompt-bar');
  const statCards = section.querySelectorAll('.dash-stat-card');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Left side
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

  // Right side: dashboard
  if (mockup) {
    tl.from(mockup, {
      x: 100,
      opacity: 0,
      rotation: 3,
      duration: 0.8,
      ease: 'power4.out',
    }, '-=0.6');
  }

  // Dashboard inner elements stagger
  if (sidebarTools.length > 0) {
    tl.from(sidebarTools, {
      x: -20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.08,
      ease: 'power3.out',
    }, '-=0.4');
  }

  if (promptBar) {
    tl.from(promptBar, {
      y: 15,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.out',
    }, '-=0.2');
  }

  if (statCards.length > 0) {
    tl.from(statCards, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.2');
  }
}

// --- Scroll Parallax on Dashboard ---
function _initDashboardParallax(section) {
  const mockup = section.querySelector('.dashboard-mockup');
  if (!mockup) return;

  gsap.to(mockup, {
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
}
