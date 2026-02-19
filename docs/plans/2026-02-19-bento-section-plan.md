# Bento Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a glassmorphism bento grid showcasing 6 platform features between EVOLVE and Footer.

**Architecture:** Static HTML section with CSS Grid layout and GSAP ScrollTrigger animations. Follows the existing component pattern: one `initBento()` export, private `_init*` helpers, wired through `main.js`.

**Tech Stack:** HTML, CSS Grid, GSAP ScrollTrigger, inline SVG icons

---

### Task 1: Add Bento HTML to index.html

**Files:**
- Modify: `index.html:494-496` (between evolve section closing `</section>` and footer `<footer>`)

**Step 1: Add the bento section markup**

Insert this HTML between line 494 (`</section>`) and line 496 (`<!-- FOOTER -->`):

```html
    <!-- BENTO FEATURES SECTION -->
    <div class="project-title-item bento-section">
      <div class="bento-header">
        <h2 class="bento-title">FEATURES</h2>
        <p class="bento-subtitle">Everything you need to master AI tools.</p>
      </div>

      <div class="bento-grid">
        <!-- Card 1: AI Tool Search (large 2x2) -->
        <div class="bento-card bento-card-large">
          <div class="bento-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <h3 class="bento-card-title">AI Tool Search</h3>
          <p class="bento-card-desc">Browse through 1,000+ AI tools with advanced search and smart filters. Find exactly what you need in seconds.</p>
        </div>

        <!-- Card 2: Smart Filters (small) -->
        <div class="bento-card bento-card-small">
          <div class="bento-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </div>
          <h3 class="bento-card-title">Smart Filters</h3>
          <p class="bento-card-desc">Category, price, and rating — instantly.</p>
        </div>

        <!-- Card 3: Compare Tools (small) -->
        <div class="bento-card bento-card-small">
          <div class="bento-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/>
            </svg>
          </div>
          <h3 class="bento-card-title">Compare Tools</h3>
          <p class="bento-card-desc">Side-by-side comparison to pick the right one.</p>
        </div>

        <!-- Card 4: Community Reviews (medium) -->
        <div class="bento-card bento-card-medium">
          <div class="bento-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 class="bento-card-title">Community Reviews</h3>
          <p class="bento-card-desc">Real user ratings and honest reviews from thousands of AI practitioners.</p>
        </div>

        <!-- Card 5: API Access (medium) -->
        <div class="bento-card bento-card-medium">
          <div class="bento-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <h3 class="bento-card-title">API Access</h3>
          <p class="bento-card-desc">Programmatic access for developers. Integrate tool data into your own apps.</p>
        </div>

        <!-- Card 6: Real-time Updates (small) -->
        <div class="bento-card bento-card-small">
          <div class="bento-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h3 class="bento-card-title">Real-time Updates</h3>
          <p class="bento-card-desc">New tools and updates as they happen.</p>
        </div>
      </div>
    </div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add bento features section HTML"
```

---

### Task 2: Add Bento CSS to style.css

**Files:**
- Modify: `style.css` (add bento styles before the footer section styles)

**Step 1: Add bento section CSS**

Add before the `/* FOOTER */` comment or at the end of the project-list styles:

```css
/* BENTO FEATURES SECTION */
.bento-section {
  padding: 120px 60px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-color);
}

.bento-header {
  text-align: center;
  margin-bottom: 60px;
}

.bento-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -2px;
}

.bento-subtitle {
  font-size: 1.1rem;
  color: var(--secondary-text);
  margin-top: 12px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
  max-width: 1100px;
  width: 100%;
}

/* Large card spans 2 cols + 2 rows */
.bento-card-large {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}

/* Small cards stack in column 3 */
.bento-card:nth-child(2) { grid-column: 3; grid-row: 1; }
.bento-card:nth-child(3) { grid-column: 3; grid-row: 2; }

/* Bottom row: medium + medium + small */
.bento-card:nth-child(4) { grid-column: 1; grid-row: 3; }
.bento-card:nth-child(5) { grid-column: 2; grid-row: 3; }
.bento-card:nth-child(6) { grid-column: 3; grid-row: 3; }

/* Card base style — glassmorphism */
.bento-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: none;
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 40px rgba(0, 255, 255, 0.06);
}

/* Large card has more padding */
.bento-card-large {
  padding: 48px;
}

.bento-card-icon {
  color: rgba(0, 255, 255, 0.7);
  margin-bottom: 16px;
}

.bento-card-large .bento-card-icon {
  margin-bottom: 24px;
}

.bento-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.bento-card-large .bento-card-title {
  font-size: 1.6rem;
}

.bento-card-desc {
  font-size: 0.9rem;
  color: var(--secondary-text);
  line-height: 1.5;
}

.bento-card-large .bento-card-desc {
  font-size: 1rem;
  max-width: 400px;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  .bento-section {
    padding: 80px 30px;
  }

  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }

  .bento-card-large {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .bento-card:nth-child(2) { grid-column: 1; grid-row: auto; }
  .bento-card:nth-child(3) { grid-column: 2; grid-row: auto; }
  .bento-card:nth-child(4) { grid-column: 1; grid-row: auto; }
  .bento-card:nth-child(5) { grid-column: 2; grid-row: auto; }
  .bento-card:nth-child(6) { grid-column: 1 / -1; grid-row: auto; }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  .bento-section {
    padding: 60px 20px;
  }

  .bento-grid {
    grid-template-columns: 1fr;
  }

  .bento-card-large,
  .bento-card:nth-child(2),
  .bento-card:nth-child(3),
  .bento-card:nth-child(4),
  .bento-card:nth-child(5),
  .bento-card:nth-child(6) {
    grid-column: 1;
    grid-row: auto;
  }
}
```

**Step 2: Add will-change hint**

Append `.bento-grid` to the existing will-change rule block at end of style.css:

```css
.bento-title,
.bento-grid {
  will-change: transform;
}
```

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add bento section CSS with glassmorphism grid"
```

---

### Task 3: Add bento.js component

**Files:**
- Create: `src/components/bento.js`

**Step 1: Create the component**

```javascript
// src/components/bento.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initBento() {
  const section = document.querySelector('.bento-section');
  if (!section) return;

  _initScrollAnimations(section);
  _initParallax(section);
}

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const title = section.querySelector('.bento-title');
  const subtitle = section.querySelector('.bento-subtitle');
  const cards = section.querySelectorAll('.bento-card');

  if (title) {
    gsap.from(title, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  if (subtitle) {
    gsap.from(subtitle, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  if (cards.length) {
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section.querySelector('.bento-grid'),
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }
}

// --- Parallax (desktop only) ---
function _initParallax(section) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const title = section.querySelector('.bento-title');
    const grid = section.querySelector('.bento-grid');

    if (title) {
      gsap.to(title, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    if (grid) {
      gsap.to(grid, {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  });
}
```

**Step 2: Commit**

```bash
git add src/components/bento.js
git commit -m "feat: add bento.js component with scroll animations and parallax"
```

---

### Task 4: Wire bento.js into main.js

**Files:**
- Modify: `src/main.js`

**Step 1: Add import**

After the `initEvolve` import line, add:

```javascript
import { initBento } from './components/bento.js'
```

**Step 2: Add init call**

After the `initEvolve()` call, add:

```javascript
  // Init Bento Features Grid
  initBento();
```

**Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: wire bento section into main.js"
```

---

### Task 5: Visual verification in browser

**Step 1: Open http://localhost:5173 and scroll to the bento section**

Verify:
- [ ] Bento section appears between EVOLVE and Footer
- [ ] Asymmetric grid layout: large card (2x2), 2 small right, 3 bottom
- [ ] Glassmorphism style: semi-transparent cards with blur
- [ ] SVG icons visible with cyan tint
- [ ] Scroll entrance animation: cards stagger in
- [ ] Hover: cards lift up with border glow
- [ ] Responsive: check 768px and 1024px breakpoints

**Step 2: Fix any visual issues found**

**Step 3: Final commit if adjustments were made**

```bash
git add -A
git commit -m "fix: polish bento section visual details"
```
