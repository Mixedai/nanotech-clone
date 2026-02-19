import '../style.css';
import './pages/tools.css';
import gsap from 'gsap';
import { initCursor } from './components/cursor.js';
import { initToolsPage } from './pages/tools-page.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initToolsPage();

  // BATCH 2: Coordinated hero entrance timeline
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.tools-hero-title', {
    y: 60,
    opacity: 0,
    duration: 0.9,
  })
  .from('.tools-hero-subtitle', {
    x: -20,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
  }, '-=0.5')
  .from('.tools-search-wrapper', {
    scale: 0.95,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
  }, '-=0.35')
  .from('.tools-stats-bar', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.3')
  .from('.tools-featured-section', {
    y: 40,
    scale: 0.98,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.2')
  .from('.tools-filter-bar', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.4');
});
