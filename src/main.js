import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initCursor } from './components/cursor.js'
import { initHero } from './components/hero.js'
import { initProjects } from './components/projects.js'
import { initBentoGrid } from './components/bento.js'

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Init Custom Cursor
  initCursor();

  // Init Hero Animations
  initHero();

  // Init Project List Logic
  initProjects();

  // Init AI Bento Grid Logic (Parallax)
  initBentoGrid();
});
