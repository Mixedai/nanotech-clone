// src/components/use-them.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initUseThem() {
  const section = document.querySelector('.use-them-section');
  if (!section) return;

  _initScrollAnimations(section);
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.use-them-title');
  const subtitle = section.querySelector('.use-them-subtitle');
  const splitContainer = section.querySelector('.use-them-split');
  const promptSide = section.querySelector('.split-prompt');
  const resultSide = section.querySelector('.split-result');
  const dividerIcon = section.querySelector('.divider-icon');
  const terminal = section.querySelector('.prompt-terminal');
  const toolTags = section.querySelectorAll('.prompt-tool-tag');
  const resultWindow = section.querySelector('.result-window');
  const codeLines = section.querySelectorAll('.code-line');
  const resultMeta = section.querySelector('.result-meta');

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

  // Split container
  if (splitContainer) {
    tl.from(splitContainer, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2');
  }

  // Left side: prompt terminal
  if (terminal) {
    tl.from(terminal, {
      x: -30,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.3');
  }

  if (toolTags.length > 0) {
    tl.from(toolTags, {
      y: 10,
      opacity: 0,
      duration: 0.3,
      stagger: 0.08,
      ease: 'power3.out',
    }, '-=0.2');
  }

  // Divider icon
  if (dividerIcon) {
    tl.from(dividerIcon, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(2)',
    }, '-=0.3');
  }

  // Right side: result window
  if (resultWindow) {
    tl.from(resultWindow, {
      x: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.3');
  }

  // Code lines stagger
  if (codeLines.length > 0) {
    tl.from(codeLines, {
      x: 15,
      opacity: 0,
      duration: 0.2,
      stagger: 0.06,
      ease: 'power2.out',
    }, '-=0.2');
  }

  // Result meta
  if (resultMeta) {
    tl.from(resultMeta, {
      y: 10,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.out',
    }, '-=0.1');
  }
}
