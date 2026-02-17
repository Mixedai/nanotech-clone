# USE THEM Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the "Unbreak" project-title-item with a "USE THEM" section featuring a floating dashboard mockup on a dark background.

**Architecture:** Split layout (left text + right dashboard mockup) inside the existing `.project-list-section`. The dashboard is a static HTML/CSS mockup styled as an app window with 3D perspective tilt. GSAP ScrollTrigger handles entrance animations and parallax. Pattern follows existing `discover.js` component structure.

**Tech Stack:** HTML, CSS, GSAP + ScrollTrigger, vanilla JS

---

### Task 1: HTML Structure

**Files:**
- Modify: `index.html:265-268`

**Step 1: Replace Unbreak HTML with USE THEM section**

Replace the existing Unbreak `project-title-item` div (lines 265-268) with:

```html
      <!-- USE THEM SECTION — Floating Dashboard -->
      <div class="project-title-item use-them-section">
        <div class="use-them-content">
          <!-- Left: Text -->
          <div class="use-them-text">
            <h2 class="use-them-title">USE THEM</h2>
            <p class="use-them-desc">Bring all your AI tools into one workspace. Write prompts, get results, track everything.</p>
            <a href="#" class="use-them-cta">Open Workspace →</a>
          </div>

          <!-- Right: Dashboard Mockup -->
          <div class="use-them-visual">
            <div class="dashboard-mockup">
              <!-- Window Bar -->
              <div class="dash-window-bar">
                <div class="dash-traffic-lights">
                  <span class="dot dot-red"></span>
                  <span class="dot dot-yellow"></span>
                  <span class="dot dot-green"></span>
                </div>
                <span class="dash-window-title">AI Workspace</span>
                <div class="dash-window-actions">
                  <span>☰</span>
                </div>
              </div>

              <!-- Dashboard Body -->
              <div class="dash-body">
                <!-- Sidebar -->
                <div class="dash-sidebar">
                  <div class="dash-tool active" data-tool="chatgpt">
                    <div class="dash-tool-icon" style="background: #10a37f;">C</div>
                  </div>
                  <div class="dash-tool" data-tool="midjourney">
                    <div class="dash-tool-icon" style="background: #7c3aed;">M</div>
                  </div>
                  <div class="dash-tool" data-tool="gemini">
                    <div class="dash-tool-icon" style="background: #4285f4;">G</div>
                  </div>
                  <div class="dash-tool" data-tool="elevenlabs">
                    <div class="dash-tool-icon" style="background: #f59e0b;">E</div>
                  </div>
                  <div class="dash-tool" data-tool="notion">
                    <div class="dash-tool-icon" style="background: #e11d48;">N</div>
                  </div>
                </div>

                <!-- Main Area -->
                <div class="dash-main">
                  <p class="dash-greeting">Good morning! What would you like to create today?</p>
                  <div class="dash-prompt-bar">
                    <span class="dash-prompt-icon">💬</span>
                    <span class="dash-prompt-placeholder">Write a prompt...</span>
                  </div>
                  <div class="dash-stats">
                    <div class="dash-stat-card">
                      <span class="dash-stat-value">1.2K</span>
                      <span class="dash-stat-label">Tasks</span>
                    </div>
                    <div class="dash-stat-card">
                      <span class="dash-stat-value">47</span>
                      <span class="dash-stat-label">Tools</span>
                    </div>
                    <div class="dash-stat-card">
                      <span class="dash-stat-value">98%</span>
                      <span class="dash-stat-label">Score</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom Bar -->
              <div class="dash-bottom-bar">
                <span class="dash-recent-item">✓ Blog Post</span>
                <span class="dash-recent-item">✓ Image Gen</span>
                <span class="dash-recent-item dash-recent-pending">● Code Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
```

**Step 2: Verify dev server shows the new HTML**

Run: `npm run dev`
Expected: Page loads, USE THEM section appears (unstyled) where Unbreak was.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add USE THEM section HTML structure"
```

---

### Task 2: CSS Styling

**Files:**
- Modify: `style.css` (insert before the `/* Active State handled by JS */` comment around line 837)

**Step 1: Add USE THEM section CSS**

Insert the following CSS block before the `.project-title-item.active` rule (~line 837 in style.css):

```css
/* ========== USE THEM SECTION ========== */
.project-title-item.use-them-section {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  gap: 60px;
  text-align: left;
  background-color: #0a0a0f;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 1;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.use-them-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
}

/* Left: Text */
.use-them-text {
  flex: 1;
  max-width: 500px;
}

.use-them-title {
  font-size: clamp(4rem, 8vw, 8rem);
  font-weight: 700;
  line-height: 1;
  color: #fff;
  margin-bottom: 24px;
}

.use-them-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin-bottom: 40px;
}

.use-them-cta {
  display: inline-block;
  padding: 14px 36px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 40px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  cursor: none;
}

.use-them-cta:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.06);
}

/* Right: Dashboard Mockup */
.use-them-visual {
  flex: 1.2;
  max-width: 540px;
  perspective: 1200px;
}

.dashboard-mockup {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.3),
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 120px rgba(100, 100, 255, 0.05);
  transform: rotateY(-8deg) rotateX(3deg);
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.6s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.dashboard-mockup:hover {
  transform: rotateY(0deg) rotateX(0deg);
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.2),
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 0 160px rgba(100, 100, 255, 0.08);
}

/* Window Bar */
.dash-window-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
}

.dash-traffic-lights {
  display: flex;
  gap: 6px;
  margin-right: 12px;
}

.dash-traffic-lights .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #28c840; }

.dash-window-title {
  flex: 1;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
}

.dash-window-actions {
  font-size: 0.9rem;
  color: #999;
}

/* Dashboard Body */
.dash-body {
  display: flex;
  min-height: 260px;
}

/* Sidebar */
.dash-sidebar {
  width: 56px;
  background: #fafafa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 8px;
}

.dash-tool-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
  opacity: 0.5;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dash-tool.active .dash-tool-icon {
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Main Area */
.dash-main {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dash-greeting {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.dash-prompt-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 12px;
}

.dash-prompt-icon {
  font-size: 1rem;
}

.dash-prompt-placeholder {
  font-size: 0.85rem;
  color: #aaa;
}

/* Stats */
.dash-stats {
  display: flex;
  gap: 12px;
}

.dash-stat-card {
  flex: 1;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dash-stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.dash-stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Bottom Bar */
.dash-bottom-bar {
  display: flex;
  gap: 16px;
  padding: 10px 16px;
  background: #fafafa;
  border-top: 1px solid #eee;
}

.dash-recent-item {
  font-size: 0.72rem;
  color: #10a37f;
  font-weight: 500;
}

.dash-recent-pending {
  color: #f59e0b;
}

/* USE THEM Responsive */
@media (max-width: 1024px) {
  .project-title-item.use-them-section {
    flex-direction: column;
    padding: 80px 40px;
    gap: 40px;
    text-align: center;
  }

  .use-them-content {
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }

  .use-them-text {
    max-width: 600px;
    text-align: center;
  }

  .use-them-visual {
    max-width: 460px;
  }
}

@media (max-width: 768px) {
  .project-title-item.use-them-section {
    padding: 60px 20px;
  }

  .use-them-title {
    font-size: clamp(3rem, 12vw, 5rem);
  }

  .dashboard-mockup {
    transform: none;
  }

  .dashboard-mockup:hover {
    transform: none;
  }

  .dash-body {
    min-height: 200px;
  }

  .dash-sidebar {
    width: 44px;
  }

  .dash-tool-icon {
    width: 28px;
    height: 28px;
    font-size: 0.6rem;
  }

  .dash-main {
    padding: 16px;
    gap: 14px;
  }

  .dash-greeting {
    font-size: 0.85rem;
  }

  .dash-stat-card {
    padding: 10px;
  }

  .dash-stat-value {
    font-size: 1rem;
  }
}
```

**Step 2: Verify styling in dev server**

Run: `npm run dev`
Expected: USE THEM section appears with dark bg, dot-grid, split layout, white dashboard mockup with 3D tilt. Hover flattens the dashboard.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add USE THEM section CSS with dashboard mockup styling"
```

---

### Task 3: JavaScript Component

**Files:**
- Create: `src/components/use-them.js`

**Step 1: Create the use-them.js component**

Create `src/components/use-them.js` with scroll entrance animations and parallax:

```javascript
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
```

**Step 2: Verify file created**

Check the file exists and has no syntax errors.

**Step 3: Commit**

```bash
git add src/components/use-them.js
git commit -m "feat: add use-them.js component with scroll animations and parallax"
```

---

### Task 4: Wire Up in main.js

**Files:**
- Modify: `src/main.js:9-10` (add import) and `src/main.js:31` (add init call)

**Step 1: Add import and init call**

Add the import after the learn import (line 9):
```javascript
import { initUseThem } from './components/use-them.js'
```

Add the init call after `initLearn()` (line 31):
```javascript
  // Init Use Them Section (Floating Dashboard)
  initUseThem();
```

**Step 2: Verify in dev server**

Run: `npm run dev`
Expected: Full USE THEM section works — scroll entrance animations trigger, dashboard parallax works, hover tilt transitions smoothly.

**Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: wire up USE THEM section in main.js"
```

---

### Task 5: Polish & Verification

**Files:**
- All modified files (review pass)

**Step 1: Cross-browser / responsive check**

- Desktop: verify 3D tilt, hover flatten, scroll animations, dot-grid visible
- Resize to tablet (1024px): verify stacking works
- Resize to mobile (768px): verify no 3D tilt, clean stacking
- Verify dashboard mockup is readable at all sizes

**Step 2: Verify page flow**

Scroll through full page and verify section order:
HERO → SEPARATOR → DISCOVER → LEARN → USE THEM → Better Off → FOOTER

Verify no layout breaks or z-index conflicts.

**Step 3: Final commit if any polish needed**

```bash
git add -A
git commit -m "fix: polish USE THEM section responsive and layout"
```
