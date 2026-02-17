import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initCursor } from './components/cursor.js'
import { initHero } from './components/hero.js'
import { initProjects } from './components/projects.js'
import { initDiscover } from './components/discover.js'
import { initLearn } from './components/learn.js'
import { initUseThem } from './components/use-them.js'
import { initEvolve } from './components/evolve.js'
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

  // Init Learn Section (Course Carousel)
  initLearn();

  // Init Use Them Section (Floating Dashboard)
  initUseThem();

  // Init Evolve Section (AI Skill Tree)
  initEvolve();
});
