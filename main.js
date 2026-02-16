import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis' // Updated to new package name
import { initProjects } from './src/components/projects.js'
import { initPreloader, initMenu } from './src/components/ui.js'

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  paddingBottom: 20, // Avoid bottom cut-off
  smoothWheel: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Initialize Components on Load
window.addEventListener('DOMContentLoaded', () => {
  console.log("Main.js: initializing components...");

  // UI (Preloader, Menu)
  initPreloader();
  initMenu();

  // Projects Logic
  initProjects();

  // Custom Cursor Logic
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Hover Effect on Links
    const links = document.querySelectorAll('a, .project-title-item, .menu-toggle, .menu-close');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => cursor.classList.add('active'));
      link.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }
});
