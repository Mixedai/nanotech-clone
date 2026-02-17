import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initCursor } from './components/cursor.js'
import { initHero } from './components/hero.js'
import { initProjects } from './components/projects.js'
import { initDiscover } from './components/discover.js'
import { initLightSwitch } from './components/light-switch.js'

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Init Custom Cursor
  initCursor();

  // Init Hero Animations
  initHero();

  // Init Light Switch
  initLightSwitch();

  // Init Project List Logic
  initProjects();

  // Init Discover Section (Particles + Glassmorphism)
  initDiscover();
});
