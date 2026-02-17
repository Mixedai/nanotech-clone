# DISCOVER Section Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the beige bento grid DISCOVER section with a dark, immersive glassmorphism experience featuring canvas particle animations, 3D card tilt, and scroll-driven entrance animations.

**Architecture:** Canvas-based particle system as background layer, glassmorphism cards on top with 3D tilt on hover, GSAP ScrollTrigger for entrance/parallax. One new JS module (`discover.js`) replaces `bento.js`, containing particle class + card interactions + scroll animations.

**Tech Stack:** Vanilla JS, Canvas API, GSAP + ScrollTrigger, CSS backdrop-filter

---

### Task 1: Create Particle Canvas System

**Files:**
- Create: `src/components/particles.js`

**Step 1: Create the particle canvas module**

```javascript
// src/components/particles.js

export class ParticleCanvas {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.animationId = null;
    this.isVisible = false;

    this.config = {
      count: options.count || 120,
      color: options.color || '255, 255, 255',
      lineMaxDist: options.lineMaxDist || 150,
      repelDist: options.repelDist || 80,
      minSize: 1,
      maxSize: 3,
      speed: 0.3,
    };

    this._onResize = this._resize.bind(this);
    this._onMouse = this._trackMouse.bind(this);
    this._onLeave = () => { this.mouse.x = null; this.mouse.y = null; };

    this._init();
  }

  _init() {
    this._resize();
    this._createParticles();
    window.addEventListener('resize', this._onResize);
    this.canvas.parentElement.addEventListener('mousemove', this._onMouse);
    this.canvas.parentElement.addEventListener('mouseleave', this._onLeave);
    this._observeVisibility();
  }

  _resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
  }

  _createParticles() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 60 : this.config.count;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  _trackMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  _observeVisibility() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this._animate();
        } else {
          this.isVisible = false;
          if (this.animationId) cancelAnimationFrame(this.animationId);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(this.canvas.parentElement);
  }

  _animate() {
    if (!this.isVisible) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._updateParticles();
    this._drawLines();
    this._drawParticles();
    this.animationId = requestAnimationFrame(() => this._animate());
  }

  _updateParticles() {
    const { width, height } = this.canvas;
    const { repelDist } = this.config;

    for (const p of this.particles) {
      // Mouse repel
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repelDist && dist > 0) {
          const force = (repelDist - dist) / repelDist;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }
      }

      // Dampen velocity
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Minimum speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed < this.config.speed * 0.3) {
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  _drawParticles() {
    const { color } = this.config;
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      this.ctx.fill();
    }
  }

  _drawLines() {
    const { lineMaxDist, color } = this.config;
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < lineMaxDist) {
          const opacity = (1 - dist / lineMaxDist) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(${color}, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    this.canvas.parentElement.removeEventListener('mousemove', this._onMouse);
    this.canvas.parentElement.removeEventListener('mouseleave', this._onLeave);
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}
```

**Step 2: Verify** — File compiles without errors (will be tested visually in Task 4).

**Step 3: Commit**

```bash
git add src/components/particles.js
git commit -m "feat: add canvas particle system for discover section"
```

---

### Task 2: Update HTML Structure

**Files:**
- Modify: `index.html:99-154` (replace discover-section content)

**Step 1: Replace the discover-section HTML**

Replace lines 99-154 (the entire `.project-title-item.discover-section` div) with:

```html
      <!-- DISCOVER SECTION — Glassmorphism + Particles -->
      <div class="project-title-item discover-section">
        <canvas class="particle-canvas"></canvas>

        <div class="discover-content">
          <div class="discover-header">
            <h2 class="discover-title">DISCOVER</h2>
            <div class="discover-pill">Browse 1,000+ AI Tools with smart filters</div>
          </div>

          <div class="discover-showcase">
            <!-- Featured Card (span 2) -->
            <div class="glass-card glass-featured" data-glow="#10a37f">
              <span class="glass-badge">Featured</span>
              <div class="glass-card-body">
                <div class="glass-icon" style="background: #10a37f;">GPT</div>
                <div>
                  <h3>ChatGPT 4o</h3>
                  <p>The smartest AI assistant — faster, multi-modal, and more creative than ever.</p>
                </div>
              </div>
            </div>

            <!-- Tool Card -->
            <div class="glass-card glass-tool" data-glow="#FF6D1F">
              <div class="glass-icon" style="background: #FF6D1F;">MJ</div>
              <h3>Midjourney V6</h3>
              <span class="glass-tag">Image Generation</span>
            </div>

            <!-- Stats Card -->
            <div class="glass-card glass-stats" data-glow="#00d4ff">
              <h3 class="stats-counter" data-target="1200">0</h3>
              <p>AI Tools Indexed</p>
            </div>

            <!-- Categories Card (span 2) -->
            <div class="glass-card glass-categories" data-glow="#9b59b6">
              <span class="glass-label">CATEGORIES</span>
              <div class="category-chips">
                <span class="chip" style="--chip-color: #FF6D1F;">Image</span>
                <span class="chip" style="--chip-color: #3498db;">Code</span>
                <span class="chip" style="--chip-color: #e74c3c;">Video</span>
                <span class="chip" style="--chip-color: #2ecc71;">Audio</span>
                <span class="chip" style="--chip-color: #9b59b6;">Writing</span>
                <span class="chip" style="--chip-color: #f39c12;">Research</span>
              </div>
            </div>
          </div>
        </div>
      </div>
```

**Step 2: Verify** — `npm run dev`, page loads without errors (section will be unstyled until Task 3).

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: update discover section HTML with glassmorphism structure"
```

---

### Task 3: Write Glassmorphism CSS

**Files:**
- Modify: `style.css:219-501` (remove old discover/bento CSS, add new styles)

**Step 1: Remove old CSS**

Delete lines 219-501 in `style.css` (everything from `.project-title-item.discover-section` through the responsive media query for `.ai-tools-panel`). These selectors are removed:
- `.project-title-item.discover-section`
- `.discover-section .project-title-text`
- `.discover-section .project-category`
- `.discover-text-content`
- All `.bento-*` selectors
- All `.mini-*` selectors
- All `.action-*` selectors
- The `@media (max-width: 1024px)` block for discover/bento

**Step 2: Add new glassmorphism CSS**

Insert at the same location (after `.project-title-item.active` / line ~468):

```css
/* ========== DISCOVER SECTION ========== */
.project-title-item.discover-section {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 40px;
  gap: 0;
  text-align: center;
  background-color: #0b0b0b;
  opacity: 1;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.discover-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

/* Header */
.discover-title {
  font-size: clamp(4rem, 10vw, 9rem);
  font-weight: 700;
  line-height: 1;
  color: #fff;
  margin-bottom: 20px;
}

.discover-pill {
  display: inline-block;
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 400;
  letter-spacing: 0.3px;
}

/* Card Grid */
.discover-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

/* Glass Card Base */
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  color: #fff;
  text-align: left;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.glass-card::before {
  content: '';
  position: absolute;
  bottom: -40%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 60%;
  border-radius: 50%;
  background: var(--card-glow, transparent);
  opacity: 0.15;
  filter: blur(40px);
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.glass-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
}

.glass-card:hover::before {
  opacity: 0.3;
}

.glass-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.glass-card p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  line-height: 1.5;
}

/* Featured Card */
.glass-featured {
  grid-column: span 2;
  min-height: 180px;
  --card-glow: #10a37f;
}

.glass-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.glass-card-body {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.glass-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}

/* Tool Card */
.glass-tool {
  display: flex;
  flex-direction: column;
  gap: 12px;
  --card-glow: #FF6D1F;
}

.glass-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Stats Card */
.glass-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  --card-glow: #00d4ff;
}

.glass-stats h3 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #fff 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-stats p {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 6px;
}

/* Categories Card */
.glass-categories {
  grid-column: span 2;
  --card-glow: #9b59b6;
}

.glass-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  cursor: pointer;
}

.chip:hover {
  background: var(--chip-color, #9b59b6);
  border-color: var(--chip-color, #9b59b6);
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 0 20px color-mix(in srgb, var(--chip-color, #9b59b6) 40%, transparent);
}

/* Responsive */
@media (max-width: 768px) {
  .project-title-item.discover-section {
    padding: 60px 20px;
  }

  .discover-showcase {
    grid-template-columns: 1fr;
  }

  .glass-featured,
  .glass-categories {
    grid-column: span 1;
  }

  .discover-title {
    font-size: clamp(3rem, 12vw, 5rem);
  }
}
```

**Step 3: Verify** — `npm run dev`, discover section is dark with glassmorphism cards visible (no animations yet).

**Step 4: Commit**

```bash
git add style.css
git commit -m "feat: replace bento CSS with glassmorphism styles for discover section"
```

---

### Task 4: Create Discover Component (Animations + Interactions)

**Files:**
- Create: `src/components/discover.js`
- Delete: `src/components/bento.js` (after new module works)

**Step 1: Create the discover component**

```javascript
// src/components/discover.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleCanvas } from './particles.js';

gsap.registerPlugin(ScrollTrigger);

export function initDiscover() {
  const section = document.querySelector('.discover-section');
  if (!section) return;

  _initParticles(section);
  _initScrollAnimations(section);
  _initCardTilt(section);
  _initCounter(section);
  _initGlowTracking(section);
}

// --- Particle Background ---
function _initParticles(section) {
  const canvas = section.querySelector('.particle-canvas');
  if (!canvas) return;

  // Allow canvas to receive parent mouse events
  canvas.style.pointerEvents = 'none';

  new ParticleCanvas(canvas, {
    count: window.innerWidth < 768 ? 60 : 120,
    color: '255, 255, 255',
    lineMaxDist: 150,
    repelDist: 80,
  });
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.discover-title');
  const pill = section.querySelector('.discover-pill');
  const cards = section.querySelectorAll('.glass-card');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  tl.from(title, {
    y: -40,
    opacity: 0,
    duration: 0.6,
    ease: 'power4.out',
  });

  if (pill) {
    tl.from(pill, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(1.7)',
    }, '-=0.3');
  }

  if (cards.length > 0) {
    tl.from(cards, {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power4.out',
    }, '-=0.2');
  }

  // Parallax: cards move at different speeds
  cards.forEach((card, i) => {
    const speed = 30 + i * 20;
    gsap.to(card, {
      y: -speed,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

// --- 3D Card Tilt ---
function _initCardTilt(section) {
  // Disable on touch devices
  if ('ontouchstart' in window) return;

  const cards = section.querySelectorAll('.glass-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

// --- Animated Counter ---
function _initCounter(section) {
  const counter = section.querySelector('.stats-counter');
  if (!counter) return;

  const target = parseInt(counter.dataset.target, 10);

  ScrollTrigger.create({
    trigger: counter,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          counter.textContent = Math.floor(this.targets()[0].val).toLocaleString() + '+';
        },
      });
    },
  });
}

// --- Glow follows mouse on cards ---
function _initGlowTracking(section) {
  if ('ontouchstart' in window) return;

  const cards = section.querySelectorAll('.glass-card');
  cards.forEach((card) => {
    const glowColor = card.dataset.glow;
    if (glowColor) {
      card.style.setProperty('--card-glow', glowColor);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const pseudo = card.querySelector('.glass-glow') || _createGlow(card);
      pseudo.style.left = `${x}%`;
      pseudo.style.top = `${y}%`;
    });
  });
}

function _createGlow(card) {
  const glow = document.createElement('div');
  glow.className = 'glass-glow';
  glow.style.cssText = `
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: ${card.dataset.glow || '#fff'};
    opacity: 0.08;
    filter: blur(60px);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.2s ease, top 0.2s ease;
    z-index: 0;
  `;
  card.appendChild(glow);
  return glow;
}
```

**Step 2: Verify** — Will be tested after Task 5 wires it up.

**Step 3: Commit**

```bash
git add src/components/discover.js
git commit -m "feat: add discover component with particles, 3D tilt, counter, and scroll animations"
```

---

### Task 5: Update main.js & Remove bento.js

**Files:**
- Modify: `src/main.js:8,27` (swap import + call)
- Delete: `src/components/bento.js`

**Step 1: Update main.js**

Replace line 8:
```javascript
// OLD: import { initBentoGrid } from './components/bento.js'
import { initDiscover } from './components/discover.js'
```

Replace line 27:
```javascript
// OLD: initBentoGrid();
initDiscover();
```

**Step 2: Delete bento.js**

```bash
rm src/components/bento.js
```

**Step 3: Verify** — `npm run dev`, full section works:
- [ ] Particle canvas animates on dark background
- [ ] "DISCOVER" title + pill visible
- [ ] Glassmorphism cards visible with colored glow
- [ ] Scroll triggers entrance animation (stagger)
- [ ] Hover 3D tilt works on cards
- [ ] Counter animates from 0 to 1,200+
- [ ] Mouse glow follows cursor on cards
- [ ] Category chips change color on hover
- [ ] Section is responsive on narrow viewport

**Step 4: Commit**

```bash
git add src/main.js
git rm src/components/bento.js
git commit -m "feat: wire up discover component, remove old bento module"
```

---

### Task 6: Polish & Particle Mouse Interaction Fix

**Files:**
- Modify: `style.css` (minor tweaks if needed)
- Modify: `src/components/particles.js` (mouse events on section, not canvas)

**Step 1: Fix mouse events**

The canvas has `pointer-events: none` so mouse events must come from the section. Update `particles.js` constructor to bind mousemove on the section (parentElement), which is already done in the plan. Verify this works correctly — if particles don't react to mouse, change the event target.

**Step 2: Visual polish pass**
- Verify card glow visibility
- Verify pill backdrop-filter works in Safari (`-webkit-backdrop-filter`)
- Check parallax doesn't move cards off-screen
- Verify particle density looks good

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix: polish discover section visual details"
```
