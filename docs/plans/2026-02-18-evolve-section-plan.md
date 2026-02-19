# EVOLVE Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the "Better Off" placeholder with an interactive AI Skill Tree section called "EVOLVE" — the final step in the DISCOVER → LEARN → USE THEM → EVOLVE journey.

**Architecture:** A dark section with amber/gold accents featuring a skill tree visualization. A central node ("AI Fundamentals") branches into 4 skill paths (Prompt Writing, Image Gen, Code Assist, Data Analysis), each with an unlocked and locked node. GSAP ScrollTrigger animates progressive "unlocking". CSS handles positioning, responsive layout, and glow effects.

**Tech Stack:** HTML, CSS (in style.css), vanilla JS with GSAP + ScrollTrigger, Vite bundler.

---

### Task 1: HTML — Replace Better Off with EVOLVE Section

**Files:**
- Modify: `index.html:334-337` (replace Better Off div)

**Context:** The "Better Off" section is currently a simple placeholder inside `.project-list-section`. It needs to become the full EVOLVE skill tree section. The section must keep the `.project-title-item` class for the existing scroll background system to work.

**Step 1: Replace the Better Off HTML**

Replace lines 334-337 in `index.html`:

```html
      <div class="project-title-item">
        <h2 class="project-title-text">Better Off</h2>
        <p class="project-category">Design</p>
      </div>
```

With this complete EVOLVE section markup:

```html
      <!-- EVOLVE SECTION — AI Skill Tree -->
      <div class="project-title-item evolve-section">
        <!-- Section Header -->
        <div class="evolve-header">
          <h2 class="evolve-title">EVOLVE</h2>
          <p class="evolve-subtitle">Master the AI skill tree</p>
        </div>

        <!-- Skill Tree -->
        <div class="skill-tree-container">
          <!-- Center Node -->
          <div class="tree-center-node">
            <div class="node-icon">⚡</div>
            <span class="node-label">AI Fundamentals</span>
          </div>

          <!-- Branch: Top-Left — Prompt Writing → Advanced Prompting -->
          <div class="tree-branch branch-tl">
            <div class="tree-line"></div>
            <div class="tree-node unlocked">
              <div class="node-icon">✍️</div>
              <span class="node-label">Prompt Writing</span>
            </div>
            <div class="tree-line"></div>
            <div class="tree-node locked">
              <div class="node-icon">🔒</div>
              <span class="node-label">Advanced Prompting</span>
            </div>
          </div>

          <!-- Branch: Top-Right — Image Generation → Video & 3D -->
          <div class="tree-branch branch-tr">
            <div class="tree-line"></div>
            <div class="tree-node unlocked">
              <div class="node-icon">🎨</div>
              <span class="node-label">Image Generation</span>
            </div>
            <div class="tree-line"></div>
            <div class="tree-node locked">
              <div class="node-icon">🔒</div>
              <span class="node-label">Video & 3D</span>
            </div>
          </div>

          <!-- Branch: Bottom-Left — Code Assist → Full Automation -->
          <div class="tree-branch branch-bl">
            <div class="tree-line"></div>
            <div class="tree-node unlocked">
              <div class="node-icon">💻</div>
              <span class="node-label">Code Assist</span>
            </div>
            <div class="tree-line"></div>
            <div class="tree-node locked">
              <div class="node-icon">🔒</div>
              <span class="node-label">Full Automation</span>
            </div>
          </div>

          <!-- Branch: Bottom-Right — Data Analysis → AI Strategy -->
          <div class="tree-branch branch-br">
            <div class="tree-line"></div>
            <div class="tree-node unlocked">
              <div class="node-icon">📊</div>
              <span class="node-label">Data Analysis</span>
            </div>
            <div class="tree-line"></div>
            <div class="tree-node locked">
              <div class="node-icon">🔒</div>
              <span class="node-label">AI Strategy</span>
            </div>
          </div>
        </div>
      </div>
```

**Step 2: Verify**

Run: `npm run dev`
Expected: Page loads without errors. The new HTML is visible (unstyled) where Better Off used to be.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace Better Off with EVOLVE skill tree HTML"
```

---

### Task 2: CSS — EVOLVE Section Styles

**Files:**
- Modify: `style.css` (add styles before the `/* Active State */` comment at line 1209)

**Context:** The EVOLVE section needs:
1. Dark background with amber radial glow
2. Gradient text title
3. Skill tree container with absolute-positioned branches
4. Node styles (center, unlocked, locked)
5. Connection lines between nodes
6. Responsive breakpoints (1024px, 768px)

Insert this CSS **before line 1209** (before `/* Active State handled by JS */`):

**Step 1: Add all EVOLVE CSS**

```css
/* ===== EVOLVE SECTION — Skill Tree ===== */
.project-title-item.evolve-section {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 60px;
  gap: 50px;
  background: linear-gradient(180deg, #0a0a12 0%, #1a0e08 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.project-title-item.evolve-section::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* Header */
.evolve-header {
  text-align: center;
  position: relative;
  z-index: 2;
}

.evolve-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.evolve-subtitle {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(245, 158, 11, 0.6);
  margin-top: 12px;
  letter-spacing: 0.05em;
}

/* Skill Tree Container */
.skill-tree-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 500px;
  z-index: 2;
}

/* Center Node */
.tree-center-node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #12100a;
  border: 2px solid #f59e0b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.3), 0 0 60px rgba(245, 158, 11, 0.1);
  z-index: 5;
}

.tree-center-node .node-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.tree-center-node .node-label {
  font-size: 0.5rem;
  color: #fbbf24;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

/* Branches — positioned around center */
.tree-branch {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0;
  z-index: 3;
}

/* Branch directions */
.branch-tl {
  top: 8%;
  left: 2%;
  flex-direction: row;
}

.branch-tr {
  top: 8%;
  right: 2%;
  flex-direction: row-reverse;
}

.branch-bl {
  bottom: 8%;
  left: 2%;
  flex-direction: row;
}

.branch-br {
  bottom: 8%;
  right: 2%;
  flex-direction: row-reverse;
}

/* Connection Lines */
.tree-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.5));
  flex-shrink: 0;
}

.branch-tr .tree-line,
.branch-br .tree-line {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.5), rgba(245, 158, 11, 0.1));
}

/* Tree Nodes */
.tree-node {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #0f0d08;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-shrink: 0;
  position: relative;
}

.tree-node .node-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.tree-node .node-label {
  font-size: 0.45rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
}

/* Unlocked node */
.tree-node.unlocked {
  border: 2px solid rgba(245, 158, 11, 0.7);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
}

.tree-node.unlocked .node-label {
  color: rgba(251, 191, 36, 0.8);
}

/* Locked node */
.tree-node.locked {
  border: 1px solid rgba(245, 158, 11, 0.15);
  opacity: 0.35;
  filter: grayscale(0.5);
}

.tree-node.locked .node-label {
  color: rgba(255, 255, 255, 0.3);
}

/* Center node pulse animation */
@keyframes amber-pulse {
  0%, 100% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.3), 0 0 60px rgba(245, 158, 11, 0.1); }
  50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.45), 0 0 80px rgba(245, 158, 11, 0.15); }
}

.tree-center-node {
  animation: amber-pulse 3s ease-in-out infinite;
}

/* ===== EVOLVE Responsive ===== */
@media (max-width: 1024px) {
  .project-title-item.evolve-section {
    padding: 60px 30px;
    gap: 40px;
  }

  .skill-tree-container {
    height: 450px;
    max-width: 600px;
  }

  .tree-line {
    width: 40px;
  }

  .tree-node {
    width: 60px;
    height: 60px;
  }

  .tree-center-node {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 768px) {
  .project-title-item.evolve-section {
    padding: 50px 16px;
    gap: 30px;
  }

  .evolve-title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .skill-tree-container {
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .tree-center-node {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
  }

  .tree-branch {
    position: relative;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    flex-direction: row !important;
    justify-content: center;
  }

  .tree-line {
    width: 20px;
  }

  .tree-node {
    width: 55px;
    height: 55px;
  }

  .tree-node .node-label {
    font-size: 0.4rem;
  }
}
```

**Step 2: Verify**

Run: `npm run dev`
Expected: EVOLVE section renders with dark/amber background, centered skill tree with nodes positioned around center, connection lines visible, responsive layout works at all breakpoints.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add EVOLVE section CSS with skill tree layout"
```

---

### Task 3: JavaScript — Scroll Animations

**Files:**
- Create: `src/components/evolve.js`

**Context:** Follow the same pattern as `src/components/use-them.js` — export a single `initEvolve()` function that queries DOM elements and creates a GSAP ScrollTrigger timeline. The animation sequence: title → subtitle → center node (scale bounce) → branches animate outward (lines + unlocked nodes staggered) → locked nodes fade in last.

**Step 1: Create evolve.js**

Create `src/components/evolve.js` with this content:

```javascript
// src/components/evolve.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initEvolve() {
  const section = document.querySelector('.evolve-section');
  if (!section) return;

  _initScrollAnimations(section);
}

function _initScrollAnimations(section) {
  const title = section.querySelector('.evolve-title');
  const subtitle = section.querySelector('.evolve-subtitle');
  const centerNode = section.querySelector('.tree-center-node');
  const branches = section.querySelectorAll('.tree-branch');
  const lines = section.querySelectorAll('.tree-line');
  const unlockedNodes = section.querySelectorAll('.tree-node.unlocked');
  const lockedNodes = section.querySelectorAll('.tree-node.locked');

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

  // Center node — scale bounce
  if (centerNode) {
    tl.from(centerNode, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)',
    }, '-=0.1');
  }

  // Connection lines — grow outward
  if (lines.length > 0) {
    tl.from(lines, {
      scaleX: 0,
      opacity: 0,
      duration: 0.3,
      stagger: 0.06,
      ease: 'power2.out',
      transformOrigin: 'left center',
    }, '-=0.2');
  }

  // Unlocked nodes — pop in
  if (unlockedNodes.length > 0) {
    tl.from(unlockedNodes, {
      scale: 0.5,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.5)',
    }, '-=0.2');
  }

  // Locked nodes — subtle fade
  if (lockedNodes.length > 0) {
    tl.from(lockedNodes, {
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out',
    }, '-=0.1');
  }
}
```

**Step 2: Verify**

Run: `npm run dev`
Expected: File exists, no import errors yet (not wired to main.js).

**Step 3: Commit**

```bash
git add src/components/evolve.js
git commit -m "feat: add EVOLVE section scroll animations"
```

---

### Task 4: Wire Up — Import in main.js

**Files:**
- Modify: `src/main.js:10-11` (add import) and `src/main.js:34-35` (add init call)

**Step 1: Add import**

After line 10 (`import { initUseThem }...`), add:

```javascript
import { initEvolve } from './components/evolve.js'
```

**Step 2: Add init call**

After line 35 (`initUseThem();`), add:

```javascript
  // Init Evolve Section (AI Skill Tree)
  initEvolve();
```

**Step 3: Verify**

Run: `npm run dev`
Expected: Page loads without errors. Scrolling to the EVOLVE section triggers the entrance animations — title fades in, center node scales up, branches animate outward, nodes pop in.

**Step 4: Commit**

```bash
git add src/main.js
git commit -m "feat: wire EVOLVE section to main.js"
```

---

### Task 5: Build Verification

**Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors. Check dist/ output includes the new code.

**Step 2: Preview**

Run: `npm run preview`
Expected: Production build renders correctly with all animations working.

**Step 3: Final commit (if any fixes needed)**

If any fixes were needed, commit them. Otherwise skip.
