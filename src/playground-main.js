import '../style.css';
import './pages/playground.css';
import gsap from 'gsap';
import { initCursor } from './components/cursor.js';
import { initPlayground } from './pages/playground-page.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initPlayground();

  // Entrance animations
  gsap.from('.pg-sidebar', {
    x: -30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.2,
  });

  gsap.from('.pg-input-section', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.3,
  });

  gsap.from('.pg-output-section', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.4,
  });
});
