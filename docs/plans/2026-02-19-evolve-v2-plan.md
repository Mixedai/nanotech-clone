# EVOLVE V2 — Radial Orbit Skill Tree Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the existing linear 4-branch skill tree into a radial orbit layout with 19 nodes, CSS 3D perspective depth, and enhanced click-to-zoom node interaction.

**Architecture:** Replace the absolute-positioned branch layout with a radial orbit system. A center node anchors the view. 6 inner-ring nodes are positioned at 60° intervals using CSS `translate` computed from trigonometry. 12 outer-ring nodes orbit further out at ±15° offsets. SVG `<line>` elements draw connection paths. CSS `perspective` + `translateZ` create a 3D depth illusion. Click interaction zooms the node and slides in a rich detail panel from the right.

**Tech Stack:** Vanilla JS, GSAP + ScrollTrigger, CSS transforms + perspective, SVG for connection lines, Vite dev server

**Design doc:** `docs/plans/2026-02-19-evolve-v2-design.md`

**No test runner** is configured in this project. Verification is visual via `npm run dev`.

---

### Task 1: Replace Evolve Section HTML

**Files:**
- Modify: `index.html:343-493` (replace entire `.evolve-section` div)

**Step 1: Replace the evolve-section HTML**

Replace the entire `<div class="project-title-item evolve-section">...</div>` block (lines 343-493) with the new radial orbit markup below. The key structural changes:
- Remove `.tree-branch` divs and `.tree-line` divs
- Add SVG container for connection lines
- Reorganize nodes into `.inner-ring` and `.outer-ring` groups
- Each node gets a `data-angle` attribute for JS positioning
- Outer nodes get `data-parent` to link to their inner node

```html
<!-- EVOLVE SECTION — Radial Orbit Skill Tree -->
<div class="project-title-item evolve-section">
  <!-- Section Header -->
  <div class="evolve-header">
    <span class="evolve-level-badge">LVL 12</span>
    <h2 class="evolve-title">EVOLVE</h2>
    <p class="evolve-subtitle">Master the AI skill tree</p>
    <div class="evolve-xp-bar">
      <div class="xp-fill"></div>
      <span class="xp-text">2,450 / 3,000 XP</span>
    </div>
  </div>

  <!-- Floating Particles -->
  <div class="evolve-particles">
    <div class="e-particle"></div>
    <div class="e-particle"></div>
    <div class="e-particle"></div>
    <div class="e-particle"></div>
    <div class="e-particle"></div>
    <div class="e-particle"></div>
  </div>

  <!-- Orbit Skill Tree -->
  <div class="skill-tree-container">
    <!-- SVG Connection Lines (drawn by JS) -->
    <svg class="tree-connections" aria-hidden="true"></svg>

    <!-- Decorative orbit rings -->
    <div class="orbit-ring orbit-ring-inner"></div>
    <div class="orbit-ring orbit-ring-outer"></div>

    <!-- Center Node -->
    <div class="tree-center-node" data-tooltip="Your AI journey starts here">
      <div class="node-icon">⚡</div>
      <span class="node-label">AI Core</span>
    </div>

    <!-- Inner Ring: 6 Core Skills (unlocked) -->
    <div class="inner-ring">
      <div class="tree-node unlocked" data-angle="0"
        data-tooltip="Master prompt engineering techniques"
        data-tools="ChatGPT, Claude, Gemini"
        data-progress="85">
        <div class="node-icon">✍️</div>
        <span class="node-label">Prompt Writing</span>
      </div>

      <div class="tree-node unlocked" data-angle="60"
        data-tooltip="Generate stunning images with AI"
        data-tools="Midjourney, DALL-E, Stable Diffusion"
        data-progress="72">
        <div class="node-icon">🎨</div>
        <span class="node-label">Image Gen</span>
      </div>

      <div class="tree-node unlocked" data-angle="120"
        data-tooltip="Supercharge your development workflow"
        data-tools="GitHub Copilot, Cursor, Claude Code"
        data-progress="90">
        <div class="node-icon">💻</div>
        <span class="node-label">Code Assist</span>
      </div>

      <div class="tree-node unlocked" data-angle="180"
        data-tooltip="Transform data into insights"
        data-tools="ChatGPT, Julius AI, Pandas AI"
        data-progress="65">
        <div class="node-icon">📊</div>
        <span class="node-label">Data Analysis</span>
      </div>

      <div class="tree-node unlocked" data-angle="240"
        data-tooltip="Create compelling content with AI"
        data-tools="Jasper, Copy.ai, Claude"
        data-progress="78">
        <div class="node-icon">✏️</div>
        <span class="node-label">AI Writing</span>
      </div>

      <div class="tree-node unlocked" data-angle="300"
        data-tooltip="Generate music and audio with AI"
        data-tools="Suno, ElevenLabs, Murf"
        data-progress="55">
        <div class="node-icon">🎵</div>
        <span class="node-label">AI Audio</span>
      </div>
    </div>

    <!-- Outer Ring: 12 Specializations (locked) -->
    <div class="outer-ring">
      <!-- Prompt Writing children -->
      <div class="tree-node locked" data-angle="-15" data-parent="0"
        data-tooltip="Complete Prompt Writing to unlock"
        data-required="750 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Adv. Prompting</span>
      </div>
      <div class="tree-node locked" data-angle="15" data-parent="0"
        data-tooltip="Complete Prompt Writing to unlock"
        data-required="900 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Chain-of-Thought</span>
      </div>

      <!-- Image Gen children -->
      <div class="tree-node locked" data-angle="45" data-parent="60"
        data-tooltip="Complete Image Gen to unlock"
        data-required="800 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Video & 3D</span>
      </div>
      <div class="tree-node locked" data-angle="75" data-parent="60"
        data-tooltip="Complete Image Gen to unlock"
        data-required="850 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Style Transfer</span>
      </div>

      <!-- Code Assist children -->
      <div class="tree-node locked" data-angle="105" data-parent="120"
        data-tooltip="Complete Code Assist to unlock"
        data-required="1000 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Full Automation</span>
      </div>
      <div class="tree-node locked" data-angle="135" data-parent="120"
        data-tooltip="Complete Code Assist to unlock"
        data-required="1200 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">AI Agents</span>
      </div>

      <!-- Data Analysis children -->
      <div class="tree-node locked" data-angle="165" data-parent="180"
        data-tooltip="Complete Data Analysis to unlock"
        data-required="900 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">AI Strategy</span>
      </div>
      <div class="tree-node locked" data-angle="195" data-parent="180"
        data-tooltip="Complete Data Analysis to unlock"
        data-required="1100 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Predictive Models</span>
      </div>

      <!-- AI Writing children -->
      <div class="tree-node locked" data-angle="225" data-parent="240"
        data-tooltip="Complete AI Writing to unlock"
        data-required="800 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Content Marketing</span>
      </div>
      <div class="tree-node locked" data-angle="255" data-parent="240"
        data-tooltip="Complete AI Writing to unlock"
        data-required="950 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Creative Fiction</span>
      </div>

      <!-- AI Audio children -->
      <div class="tree-node locked" data-angle="285" data-parent="300"
        data-tooltip="Complete AI Audio to unlock"
        data-required="850 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Music Production</span>
      </div>
      <div class="tree-node locked" data-angle="315" data-parent="300"
        data-tooltip="Complete AI Audio to unlock"
        data-required="1000 XP">
        <div class="node-icon">🔒</div>
        <span class="node-label">Voice Synthesis</span>
      </div>
    </div>
  </div>

  <!-- Stats Row -->
  <div class="evolve-stats">
    <div class="evolve-stat">
      <span class="stat-number">6</span>
      <span class="stat-label">Skills Unlocked</span>
    </div>
    <div class="evolve-stat">
      <span class="stat-number">82%</span>
      <span class="stat-label">Completion</span>
    </div>
    <div class="evolve-stat">
      <span class="stat-number">18</span>
      <span class="stat-label">Tools Mastered</span>
    </div>
  </div>

  <!-- Tooltip -->
  <div class="node-tooltip" id="evolve-tooltip">
    <span class="tooltip-text"></span>
  </div>

  <!-- Node Detail Panel (Side Slide-In) -->
  <div class="node-detail-panel" id="node-detail">
    <button class="detail-close">&times;</button>
    <div class="detail-icon"></div>
    <h3 class="detail-title"></h3>
    <p class="detail-desc"></p>
    <div class="detail-tools">
      <span class="detail-tools-label">Tools:</span>
      <div class="detail-tools-list"></div>
    </div>
    <div class="detail-progress-wrap">
      <div class="detail-progress-bar">
        <div class="detail-progress-fill"></div>
      </div>
      <span class="detail-progress-text"></span>
    </div>
    <div class="detail-specs">
      <span class="detail-specs-label">Specializations:</span>
      <div class="detail-specs-list"></div>
    </div>
  </div>
</div>
```

**Step 2: Verify in browser**

Run: `npm run dev` — evolve section should appear (unstyled/broken is OK at this stage, just confirm no console errors and the HTML renders)

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace evolve HTML with radial orbit skill tree markup"
```

---

### Task 2: CSS — Base Section + 3D Perspective + Orbit Rings

**Files:**
- Modify: `style.css:1307-1351` (replace base evolve-section styles)

**Step 1: Replace the base section styles**

Replace lines starting from `/* ===== EVOLVE SECTION — Skill Tree ===== */` through the `@keyframes glow-breathe` block (approximately lines 1307-1351) with:

```css
/* ===== EVOLVE SECTION — Radial Orbit Skill Tree ===== */

.project-title-item.evolve-section {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 60px;
  gap: 50px;
  background: linear-gradient(180deg, #0a0a12 0%, #150d04 50%, #0a0a12 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

/* Ambient glow layers */
.project-title-item.evolve-section::before {
  content: '';
  position: absolute;
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.04) 40%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: glow-breathe 6s ease-in-out infinite;
}

.project-title-item.evolve-section::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, transparent 70%);
  top: 30%;
  left: 20%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

@keyframes glow-breathe {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

/* Skill Tree Container — 3D Perspective */
.skill-tree-container {
  position: relative;
  width: 100%;
  max-width: 700px;
  height: 700px;
  z-index: 2;
  perspective: 1200px;
}

/* SVG Connections Layer */
.tree-connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Decorative Orbit Rings */
.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(245, 158, 11, 0.06);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.orbit-ring-inner {
  width: 380px;
  height: 380px;
}

.orbit-ring-outer {
  width: 620px;
  height: 620px;
  border-style: dashed;
  border-color: rgba(245, 158, 11, 0.04);
}
```

**Step 2: Verify in browser**

Run: `npm run dev` — section should show dark background with subtle glow, orbit rings visible as faint circles.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add evolve v2 base section with 3D perspective and orbit rings"
```

---

### Task 3: CSS — Header, XP Bar, Particles (Keep existing)

**Files:**
- Verify: `style.css:1354-1479` — These styles are already correct and carry over. No changes needed.

The existing `.evolve-header`, `.evolve-level-badge`, `.evolve-title`, `.evolve-subtitle`, `.evolve-xp-bar`, `.xp-fill`, `.xp-text`, `.evolve-particles`, `.e-particle` styles all remain unchanged.

**Step 1: Verify header renders correctly**

Run: `npm run dev` — confirm EVOLVE title, level badge, XP bar, and particles display as before.

**Step 2: Commit (skip if no changes)**

No commit needed — existing styles preserved.

---

### Task 4: CSS — Center Node + Inner Ring Nodes

**Files:**
- Modify: `style.css` — Replace lines 1481-1646 (old `.skill-tree-container` through `.tree-node.unlocked .node-label`)

**Step 1: Replace center node + inner ring styles**

Replace the old skill-tree-container, center-node, branches, tree-line, and tree-node styles with:

```css
/* Center Node */
.tree-center-node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(40px);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #1a1508, #0f0d08);
  border: 2px solid #f59e0b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow:
    0 0 40px rgba(245, 158, 11, 0.4),
    0 0 80px rgba(245, 158, 11, 0.15),
    inset 0 0 25px rgba(245, 158, 11, 0.06);
  z-index: 5;
  animation: amber-pulse 3s ease-in-out infinite;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tree-center-node:hover {
  transform: translate(-50%, -50%) translateZ(40px) scale(1.08);
}

.tree-center-node .node-icon {
  font-size: 2rem;
  line-height: 1;
}

.tree-center-node .node-label {
  font-size: 0.55rem;
  color: #fbbf24;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

@keyframes amber-pulse {
  0%, 100% {
    box-shadow: 0 0 40px rgba(245, 158, 11, 0.4), 0 0 80px rgba(245, 158, 11, 0.15), inset 0 0 25px rgba(245, 158, 11, 0.06);
  }
  50% {
    box-shadow: 0 0 55px rgba(245, 158, 11, 0.55), 0 0 100px rgba(245, 158, 11, 0.2), inset 0 0 30px rgba(245, 158, 11, 0.1);
  }
}

/* Inner & Outer Ring Groups */
.inner-ring,
.outer-ring {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Tree Nodes (shared) */
.tree-node {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #141008, #0a0804);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}

.tree-node .node-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.tree-node .node-label {
  font-size: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
}

/* Inner Ring Nodes — 76px, in front */
.inner-ring .tree-node {
  width: 76px;
  height: 76px;
  transform: translateZ(25px);
}

.inner-ring .tree-node.unlocked {
  border: 2px solid rgba(245, 158, 11, 0.7);
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.25), 0 0 50px rgba(245, 158, 11, 0.08);
}

.inner-ring .tree-node.unlocked:hover {
  transform: translateZ(25px) scale(1.12);
  box-shadow: 0 0 35px rgba(245, 158, 11, 0.4), 0 0 70px rgba(245, 158, 11, 0.12);
}

.inner-ring .tree-node.unlocked .node-label {
  color: rgba(251, 191, 36, 0.85);
}

/* Unlocked node ring on hover */
.tree-node.unlocked::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(245, 158, 11, 0);
  transition: border-color 0.3s ease, inset 0.3s ease;
}

.tree-node.unlocked:hover::before {
  border-color: rgba(245, 158, 11, 0.25);
  inset: -10px;
}
```

**Step 2: Verify in browser**

Run: `npm run dev` — center node should be visible in the middle. Inner ring nodes will NOT be positioned yet (JS does that), but they should render with correct sizing and styling.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add evolve v2 center node and inner ring CSS styles"
```

---

### Task 5: CSS — Outer Ring Nodes + Locked State

**Files:**
- Modify: `style.css` — Add after the inner ring styles (replace old locked node + stats styles)

**Step 1: Add outer ring node styles**

Add these styles right after the inner ring styles from Task 4, replacing the old `.tree-node.locked` styles:

```css
/* Outer Ring Nodes — 56px, recessed */
.outer-ring .tree-node {
  width: 56px;
  height: 56px;
  transform: translateZ(-15px);
}

.outer-ring .tree-node .node-icon {
  font-size: 1rem;
}

.outer-ring .tree-node .node-label {
  font-size: 0.42rem;
  bottom: -16px;
}

/* Locked node */
.tree-node.locked {
  border: 1px solid rgba(245, 158, 11, 0.1);
  opacity: 0.35;
  filter: grayscale(0.5) blur(0.3px);
}

.tree-node.locked:hover {
  opacity: 0.5;
  filter: grayscale(0.2) blur(0px);
}

.tree-node.locked .node-label {
  color: rgba(255, 255, 255, 0.2);
}

/* Active node highlight */
.tree-node.active-node {
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.55), 0 0 80px rgba(245, 158, 11, 0.2) !important;
  z-index: 10;
}

.inner-ring .tree-node.active-node {
  transform: translateZ(25px) scale(1.25) !important;
}

.tree-center-node.active-node {
  transform: translate(-50%, -50%) translateZ(40px) scale(1.12) !important;
}

/* Neighbor highlight when parent clicked */
.tree-node.neighbor-highlight {
  opacity: 0.8 !important;
  filter: grayscale(0) blur(0px) !important;
  border-color: rgba(245, 158, 11, 0.4) !important;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
}

/* Locked shake */
@keyframes locked-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

.tree-node.locked.shake {
  animation: locked-shake 0.4s ease;
}
```

**Step 2: Verify in browser**

Run: `npm run dev` — outer ring nodes should render (unstyled position, but correct locked appearance).

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add evolve v2 outer ring and locked node CSS styles"
```

---

### Task 6: CSS — Detail Panel (Side Slide-In) + Tooltip

**Files:**
- Modify: `style.css` — Replace old detail panel styles with side-sliding panel

**Step 1: Replace detail panel and tooltip styles**

Replace the old `.node-tooltip` and `.node-detail-panel` styles with:

```css
/* ===== EVOLVE Tooltip ===== */
.node-tooltip {
  position: absolute;
  padding: 8px 14px;
  background: rgba(20, 16, 8, 0.95);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  color: rgba(251, 191, 36, 0.9);
  font-size: 0.7rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: 20;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(245, 158, 11, 0.1);
  transition: opacity 0.2s ease;
  transform: translateX(-50%);
}

.node-tooltip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(245, 158, 11, 0.3);
}

/* ===== EVOLVE Detail Panel — Side Slide-In ===== */
.node-detail-panel {
  position: absolute;
  top: 50%;
  right: -340px;
  transform: translateY(-50%);
  width: 300px;
  max-height: 80vh;
  padding: 30px 24px;
  background: rgba(15, 12, 6, 0.97);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
  z-index: 30;
  backdrop-filter: blur(20px);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.06);
  transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  overflow-y: auto;
}

.node-detail-panel.visible {
  right: 20px;
}

.detail-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.4rem;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1;
}

.detail-close:hover {
  color: #f59e0b;
}

.detail-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.detail-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fbbf24;
  margin: 0;
}

.detail-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.5;
}

.detail-tools {
  width: 100%;
}

.detail-tools-label,
.detail-specs-label {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.detail-tools-list,
.detail-specs-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  justify-content: center;
}

.detail-tool-tag {
  padding: 4px 10px;
  font-size: 0.65rem;
  color: rgba(245, 158, 11, 0.8);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.06);
}

.detail-specs {
  width: 100%;
}

.detail-spec-tag {
  padding: 4px 10px;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.detail-progress-wrap {
  width: 100%;
}

.detail-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.detail-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 6px;
  width: 0%;
  transition: width 0.8s ease-out;
}

.detail-progress-text {
  font-size: 0.6rem;
  color: rgba(245, 158, 11, 0.5);
  margin-top: 4px;
  display: block;
}
```

**Step 2: Verify in browser**

Run: `npm run dev` — detail panel should be hidden off-screen to the right by default.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add evolve v2 side-sliding detail panel and tooltip CSS"
```

---

### Task 7: CSS — Stats Row + SVG Connection Styles + Responsive

**Files:**
- Modify: `style.css` — Add stats, SVG, and responsive styles

**Step 1: Add remaining CSS blocks**

```css
/* Stats Row */
.evolve-stats {
  display: flex;
  gap: 50px;
  position: relative;
  z-index: 2;
}

.evolve-stat {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.evolve-stat .stat-number {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.evolve-stat .stat-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* SVG Connection Lines */
.tree-connections line {
  stroke: url(#amber-gradient);
  stroke-width: 1.5;
  stroke-linecap: round;
  opacity: 0.4;
}

.tree-connections line.inner-line {
  stroke-width: 2;
  opacity: 0.5;
}

.tree-connections line.outer-line {
  stroke-width: 1;
  opacity: 0.25;
  stroke-dasharray: 4 4;
}

.tree-connections line.line-active {
  opacity: 0.8;
  stroke-width: 2.5;
  filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.4));
}

/* ===== EVOLVE V2 Responsive ===== */
@media (max-width: 1024px) {
  .project-title-item.evolve-section {
    padding: 60px 30px;
    gap: 40px;
  }

  .skill-tree-container {
    max-width: 550px;
    height: 550px;
  }

  .orbit-ring-inner { width: 300px; height: 300px; }
  .orbit-ring-outer { width: 500px; height: 500px; }

  .inner-ring .tree-node { width: 65px; height: 65px; }
  .outer-ring .tree-node { width: 48px; height: 48px; }
  .tree-center-node { width: 100px; height: 100px; }

  .evolve-stats { gap: 35px; }

  .node-detail-panel {
    width: 260px;
    padding: 24px 18px;
  }
}

@media (max-width: 768px) {
  .project-title-item.evolve-section {
    padding: 50px 16px;
    gap: 30px;
  }

  .evolve-title { font-size: clamp(2.5rem, 10vw, 4rem); }
  .evolve-xp-bar { width: 220px; }

  /* Switch to vertical stack on mobile */
  .skill-tree-container {
    height: auto;
    max-width: 100%;
    perspective: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 20px 0;
  }

  .tree-connections,
  .orbit-ring { display: none; }

  .tree-center-node {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    width: 90px;
    height: 90px;
  }

  .tree-center-node:hover { transform: scale(1.08); }

  .inner-ring,
  .outer-ring {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px 20px;
    justify-items: center;
    pointer-events: auto;
  }

  .inner-ring .tree-node,
  .outer-ring .tree-node {
    position: relative;
    transform: none;
    width: 60px;
    height: 60px;
  }

  .inner-ring .tree-node.unlocked:hover { transform: scale(1.1); }
  .inner-ring .tree-node.active-node { transform: scale(1.2) !important; }

  .outer-ring .tree-node { width: 50px; height: 50px; }
  .outer-ring .tree-node .node-label { font-size: 0.38rem; }

  .evolve-stats { gap: 25px; }
  .evolve-stat .stat-number { font-size: 1.5rem; }

  /* Detail panel becomes bottom sheet on mobile */
  .node-detail-panel {
    position: fixed;
    top: auto;
    right: 0;
    bottom: -100%;
    left: 0;
    width: 100%;
    max-height: 60vh;
    transform: none;
    border-radius: 20px 20px 0 0;
    transition: bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .node-detail-panel.visible {
    right: 0;
    bottom: 0;
  }
}
```

**Step 2: Verify in browser**

Run: `npm run dev` — resize browser to check tablet/mobile layouts. Stats should render correctly.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add evolve v2 stats, SVG line styles, and responsive CSS"
```

---

### Task 8: CSS — Clean Up Old Evolve Styles

**Files:**
- Modify: `style.css` — Remove all old evolve styles that were replaced

**Step 1: Remove deprecated styles**

Delete the following old style blocks that are no longer needed:
- Old `.skill-tree-container` (replaced by new one in Task 2)
- Old `.tree-branch`, `.branch-tl/tr/bl/br` (no longer used — radial replaces branches)
- Old `.tree-line`, `.tree-line::after` (SVG replaces CSS lines)
- Old `.tree-line.energized`, `@keyframes line-energy` (replaced by SVG animation)
- Old `.tree-node .node-desc` (removed from HTML)
- Old responsive media queries for evolve that reference `.tree-branch`, `.tree-line`

Ensure all NEW styles from Tasks 2-7 are properly placed where the old ones were removed.

**Step 2: Verify no visual regressions**

Run: `npm run dev` — full page scroll through. All sections should render correctly. Evolve section should show the new layout structure.

**Step 3: Commit**

```bash
git add style.css
git commit -m "refactor: remove deprecated evolve v1 CSS styles"
```

---

### Task 9: JS — Radial Positioning + SVG Connection Lines

**Files:**
- Rewrite: `src/components/evolve.js` (complete rewrite)

**Step 1: Write the new evolve.js with positioning and SVG logic**

Replace the entire contents of `src/components/evolve.js` with:

```js
// src/components/evolve.js — Radial Orbit Skill Tree

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INNER_RADIUS = 180;
const OUTER_RADIUS = 295;
const TABLET_INNER = 140;
const TABLET_OUTER = 230;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function initEvolve() {
  const section = document.querySelector('.evolve-section');
  if (!section) return;

  const container = section.querySelector('.skill-tree-container');
  if (!container) return;

  _positionNodes(container);
  _drawConnections(container);
  _initScrollAnimations(section);
  _initParallax(section);
  _initTooltips(section);
  _initNodeClicks(section);

  // Reposition on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      _positionNodes(container);
      _drawConnections(container);
    }, 200);
  });
}

// --- Radial Positioning ---
function _positionNodes(container) {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  if (isMobile) return; // CSS grid handles mobile layout

  const isTablet = window.innerWidth <= TABLET_BREAKPOINT;
  const innerR = isTablet ? TABLET_INNER : INNER_RADIUS;
  const outerR = isTablet ? TABLET_OUTER : OUTER_RADIUS;

  const rect = container.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  // Position inner ring nodes
  const innerNodes = container.querySelectorAll('.inner-ring .tree-node');
  innerNodes.forEach(node => {
    const angle = parseFloat(node.dataset.angle);
    const rad = (angle - 90) * (Math.PI / 180); // -90 so 0° = top
    const x = cx + innerR * Math.cos(rad) - node.offsetWidth / 2;
    const y = cy + innerR * Math.sin(rad) - node.offsetHeight / 2;
    node.style.left = x + 'px';
    node.style.top = y + 'px';
  });

  // Position outer ring nodes
  const outerNodes = container.querySelectorAll('.outer-ring .tree-node');
  outerNodes.forEach(node => {
    const parentAngle = parseFloat(node.dataset.parent);
    const offsetAngle = parseFloat(node.dataset.angle);
    const rad = (offsetAngle - 90) * (Math.PI / 180);
    const x = cx + outerR * Math.cos(rad) - node.offsetWidth / 2;
    const y = cy + outerR * Math.sin(rad) - node.offsetHeight / 2;
    node.style.left = x + 'px';
    node.style.top = y + 'px';
  });
}

// --- SVG Connection Lines ---
function _drawConnections(container) {
  const svg = container.querySelector('.tree-connections');
  if (!svg) return;

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  if (isMobile) {
    svg.innerHTML = '';
    return;
  }

  const rect = container.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  // Clear existing
  svg.innerHTML = '';

  // Add gradient definition
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.id = 'amber-gradient';
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'rgba(245, 158, 11, 0.15)');
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', 'rgba(245, 158, 11, 0.6)');
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Draw center → inner node lines
  const innerNodes = container.querySelectorAll('.inner-ring .tree-node');
  innerNodes.forEach(node => {
    const nodeRect = node.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const nx = nodeRect.left - containerRect.left + nodeRect.width / 2;
    const ny = nodeRect.top - containerRect.top + nodeRect.height / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', nx);
    line.setAttribute('y2', ny);
    line.classList.add('inner-line');
    line.dataset.parentAngle = node.dataset.angle;
    svg.appendChild(line);
  });

  // Draw inner → outer node lines
  const outerNodes = container.querySelectorAll('.outer-ring .tree-node');
  outerNodes.forEach(node => {
    const parentAngle = node.dataset.parent;
    const parentNode = container.querySelector(
      `.inner-ring .tree-node[data-angle="${parentAngle}"]`
    );
    if (!parentNode) return;

    const containerRect = container.getBoundingClientRect();
    const pRect = parentNode.getBoundingClientRect();
    const nRect = node.getBoundingClientRect();

    const px = pRect.left - containerRect.left + pRect.width / 2;
    const py = pRect.top - containerRect.top + pRect.height / 2;
    const nx = nRect.left - containerRect.left + nRect.width / 2;
    const ny = nRect.top - containerRect.top + nRect.height / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', px);
    line.setAttribute('y1', py);
    line.setAttribute('x2', nx);
    line.setAttribute('y2', ny);
    line.classList.add('outer-line');
    line.dataset.parentAngle = parentAngle;
    svg.appendChild(line);
  });
}
```

Note: This is only the first half of evolve.js. The remaining functions are added in the next tasks.

**Step 2: Verify in browser**

Run: `npm run dev` — nodes should be positioned in a radial orbit on desktop. SVG lines should connect center→inner and inner→outer. Mobile should show a grid fallback.

**Step 3: Commit**

```bash
git add src/components/evolve.js
git commit -m "feat: add evolve v2 radial positioning and SVG connection drawing"
```

---

### Task 10: JS — Enhanced Click Interaction + Tooltips

**Files:**
- Modify: `src/components/evolve.js` — Add the interaction functions

**Step 1: Add tooltip, click, and detail panel functions**

Append these functions to `src/components/evolve.js` (before the closing of the file, after `_drawConnections`):

```js
// --- Tooltip on Hover ---
function _initTooltips(section) {
  const tooltip = section.querySelector('#evolve-tooltip');
  const tooltipText = tooltip ? tooltip.querySelector('.tooltip-text') : null;
  if (!tooltip || !tooltipText) return;

  const allNodes = section.querySelectorAll('.tree-node, .tree-center-node');

  allNodes.forEach(node => {
    const text = node.dataset.tooltip;
    if (!text) return;

    node.addEventListener('mouseenter', () => {
      tooltipText.textContent = text;
      tooltip.style.opacity = '1';
      _positionTooltip(tooltip, node, section);
    });

    node.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
}

function _positionTooltip(tooltip, node, section) {
  const nodeRect = node.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();

  const x = nodeRect.left + nodeRect.width / 2 - sectionRect.left;
  const y = nodeRect.top - sectionRect.top - 12;

  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

// --- Click to Open Detail Panel ---
function _initNodeClicks(section) {
  const panel = section.querySelector('#node-detail');
  if (!panel) return;

  const closeBtn = panel.querySelector('.detail-close');
  const detailIcon = panel.querySelector('.detail-icon');
  const detailTitle = panel.querySelector('.detail-title');
  const detailDesc = panel.querySelector('.detail-desc');
  const detailToolsList = panel.querySelector('.detail-tools-list');
  const detailProgressFill = panel.querySelector('.detail-progress-fill');
  const detailProgressText = panel.querySelector('.detail-progress-text');
  const detailToolsWrap = panel.querySelector('.detail-tools');
  const detailProgressWrap = panel.querySelector('.detail-progress-wrap');
  const detailSpecsWrap = panel.querySelector('.detail-specs');
  const detailSpecsList = panel.querySelector('.detail-specs-list');

  let activeNode = null;

  const container = section.querySelector('.skill-tree-container');
  const svg = container ? container.querySelector('.tree-connections') : null;

  // --- Unlocked node click ---
  const unlockedNodes = section.querySelectorAll('.tree-node.unlocked');
  unlockedNodes.forEach(node => {
    node.addEventListener('click', () => {
      const icon = node.querySelector('.node-icon').textContent;
      const label = node.querySelector('.node-label').textContent;
      const desc = node.dataset.tooltip || '';
      const tools = node.dataset.tools || '';
      const progress = node.dataset.progress || '0';
      const parentAngle = node.dataset.angle;

      // Clear previous active state
      _clearActiveState(section, svg);
      node.classList.add('active-node');
      activeNode = node;

      // Highlight connected outer nodes
      if (parentAngle !== undefined) {
        const childNodes = section.querySelectorAll(
          `.outer-ring .tree-node[data-parent="${parentAngle}"]`
        );
        childNodes.forEach(child => child.classList.add('neighbor-highlight'));

        // Highlight SVG lines
        if (svg) {
          svg.querySelectorAll(`line[data-parent-angle="${parentAngle}"]`)
            .forEach(line => line.classList.add('line-active'));
        }
      }

      // Populate detail panel
      detailIcon.textContent = icon;
      detailTitle.textContent = label;
      detailDesc.textContent = desc;

      // Tools
      detailToolsList.innerHTML = '';
      if (tools) {
        detailToolsWrap.style.display = '';
        tools.split(', ').forEach(tool => {
          const tag = document.createElement('span');
          tag.className = 'detail-tool-tag';
          tag.textContent = tool;
          detailToolsList.appendChild(tag);
        });
      } else {
        detailToolsWrap.style.display = 'none';
      }

      // Specializations (connected outer nodes)
      detailSpecsList.innerHTML = '';
      if (parentAngle !== undefined) {
        const specs = section.querySelectorAll(
          `.outer-ring .tree-node[data-parent="${parentAngle}"]`
        );
        if (specs.length > 0) {
          detailSpecsWrap.style.display = '';
          specs.forEach(spec => {
            const tag = document.createElement('span');
            tag.className = 'detail-spec-tag';
            tag.textContent = spec.querySelector('.node-label').textContent;
            detailSpecsList.appendChild(tag);
          });
        } else {
          detailSpecsWrap.style.display = 'none';
        }
      } else {
        detailSpecsWrap.style.display = 'none';
      }

      // Progress bar
      detailProgressFill.style.width = '0%';
      detailProgressText.textContent = progress + '% mastered';
      detailProgressWrap.style.display = '';

      panel.classList.add('visible');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailProgressFill.style.width = progress + '%';
        });
      });
    });
  });

  // --- Locked node click ---
  const lockedNodes = section.querySelectorAll('.tree-node.locked');
  lockedNodes.forEach(node => {
    node.addEventListener('click', () => {
      node.classList.add('shake');
      const required = node.dataset.required || '';
      const parentAngle = node.dataset.parent || '';

      _clearActiveState(section, svg);

      // Find parent name
      const parentNode = parentAngle
        ? section.querySelector(`.inner-ring .tree-node[data-angle="${parentAngle}"]`)
        : null;
      const parentName = parentNode
        ? parentNode.querySelector('.node-label').textContent
        : 'prerequisites';

      detailIcon.textContent = '🔒';
      detailTitle.textContent = 'Locked';
      detailDesc.textContent = `Complete ${parentName} to unlock this skill`;
      detailToolsWrap.style.display = 'none';
      detailSpecsWrap.style.display = 'none';
      detailProgressWrap.style.display = 'none';

      if (required) {
        detailProgressWrap.style.display = '';
        detailProgressFill.style.width = '0%';
        detailProgressText.textContent = 'Requires ' + required;
      }

      panel.classList.add('visible');

      node.addEventListener('animationend', () => {
        node.classList.remove('shake');
      }, { once: true });
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('visible');
      _clearActiveState(section, svg);
      activeNode = null;
    });
  }

  // Close on outside click
  section.addEventListener('click', (e) => {
    if (
      !e.target.closest('.tree-node') &&
      !e.target.closest('.tree-center-node') &&
      !e.target.closest('#node-detail')
    ) {
      panel.classList.remove('visible');
      _clearActiveState(section, svg);
      activeNode = null;
    }
  });
}

function _clearActiveState(section, svg) {
  section.querySelectorAll('.active-node').forEach(n => n.classList.remove('active-node'));
  section.querySelectorAll('.neighbor-highlight').forEach(n => n.classList.remove('neighbor-highlight'));
  if (svg) {
    svg.querySelectorAll('.line-active').forEach(l => l.classList.remove('line-active'));
  }
}
```

**Step 2: Verify in browser**

Run: `npm run dev`:
- Hover over nodes: tooltip should appear
- Click an unlocked inner node: it zooms, connected outer nodes brighten, detail panel slides in from right
- Click a locked node: shake animation + locked detail panel
- Click outside: everything dismisses

**Step 3: Commit**

```bash
git add src/components/evolve.js
git commit -m "feat: add evolve v2 enhanced click interaction and tooltips"
```

---

### Task 11: JS — Scroll Entrance Animations + Parallax

**Files:**
- Modify: `src/components/evolve.js` — Add scroll animation and parallax functions

**Step 1: Add scroll and parallax functions**

Add these functions to `src/components/evolve.js`:

```js
// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const badge = section.querySelector('.evolve-level-badge');
  const title = section.querySelector('.evolve-title');
  const subtitle = section.querySelector('.evolve-subtitle');
  const xpBar = section.querySelector('.evolve-xp-bar');
  const xpFill = section.querySelector('.xp-fill');
  const centerNode = section.querySelector('.tree-center-node');
  const innerNodes = section.querySelectorAll('.inner-ring .tree-node');
  const outerNodes = section.querySelectorAll('.outer-ring .tree-node');
  const stats = section.querySelectorAll('.evolve-stat');
  const particles = section.querySelectorAll('.e-particle');
  const orbitRings = section.querySelectorAll('.orbit-ring');
  const svg = section.querySelector('.tree-connections');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Header entrance
  if (badge) {
    tl.from(badge, { y: -20, opacity: 0, duration: 0.4, ease: 'power3.out' });
  }

  tl.from(title, { y: 30, opacity: 0, scale: 0.9, duration: 0.7, ease: 'power4.out' }, '-=0.2');

  if (subtitle) {
    tl.from(subtitle, { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.4');
  }

  if (xpBar) {
    tl.from(xpBar, { opacity: 0, scaleX: 0, transformOrigin: 'left center', duration: 0.4, ease: 'power3.out' }, '-=0.2');
  }

  if (xpFill) {
    tl.from(xpFill, { width: '0%', duration: 1, ease: 'power2.out' }, '-=0.2');
  }

  // Orbit rings fade in
  if (orbitRings.length > 0) {
    tl.from(orbitRings, { opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, '-=0.5');
  }

  // Center node pops in
  if (centerNode) {
    tl.from(centerNode, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)' }, '-=0.3');
  }

  // Inner ring nodes appear in sequence around the orbit
  if (innerNodes.length > 0) {
    tl.from(innerNodes, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.12,
      ease: 'back.out(2)',
    }, '-=0.2');
  }

  // SVG connection lines draw in
  if (svg) {
    const lines = svg.querySelectorAll('line');
    if (lines.length > 0) {
      tl.from(lines, {
        attr: { x2: (i, el) => el.getAttribute('x1'), y2: (i, el) => el.getAttribute('y1') },
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      }, '-=0.3');
    }
  }

  // Outer ring nodes fade in
  if (outerNodes.length > 0) {
    tl.from(outerNodes, {
      opacity: 0,
      scale: 0.6,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power2.out',
    }, '-=0.2');
  }

  // Stats slide up
  if (stats.length > 0) {
    tl.from(stats, { y: 30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, '-=0.2');
  }

  // Particles fade
  if (particles.length > 0) {
    tl.from(particles, { opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power1.out' }, '-=0.5');
  }
}

// --- Parallax on Scroll (Desktop only) ---
function _initParallax(section) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const header = section.querySelector('.evolve-header');
    const treeContainer = section.querySelector('.skill-tree-container');
    const stats = section.querySelector('.evolve-stats');

    if (header) {
      gsap.to(header, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    if (treeContainer) {
      gsap.to(treeContainer, {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    if (stats) {
      gsap.to(stats, {
        y: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }
  });
}
```

**Step 2: Verify in browser**

Run: `npm run dev`:
- Scroll down to evolve section: nodes should animate in sequentially
- SVG lines should "draw in" from center outward
- Scroll past: slight parallax on header vs tree vs stats

**Step 3: Commit**

```bash
git add src/components/evolve.js
git commit -m "feat: add evolve v2 scroll entrance animations and parallax"
```

---

### Task 12: Final Integration + Visual Polish

**Files:**
- Verify: `src/main.js` (should already import and call `initEvolve()` — no changes needed)
- Modify: `style.css` — Minor visual tweaks if needed after browser testing

**Step 1: Full visual verification**

Run: `npm run dev` and check:

1. **Desktop (1200px+):**
   - 19 nodes in radial orbit layout
   - Center node with amber pulse glow
   - 6 inner nodes at 60° intervals
   - 12 outer nodes (dimmed/locked) at outer orbit
   - SVG lines connecting all nodes
   - Orbit ring decorations faintly visible
   - Click inner node → zoom + neighbor highlight + side panel
   - Click locked node → shake + locked panel
   - Smooth scroll entrance animations
   - Parallax on scroll

2. **Tablet (768-1024px):**
   - Smaller orbit, smaller nodes
   - Same interactions

3. **Mobile (<768px):**
   - Vertical stack: center node on top
   - 3-column grid for inner and outer nodes
   - No SVG lines, no orbit rings
   - Detail panel appears as bottom sheet

**Step 2: Fix any visual issues found**

Common fixes might include:
- Adjusting orbit radius if nodes overlap
- Tweaking z-index if nodes render behind SVG
- Adjusting mobile grid spacing

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete evolve v2 radial orbit skill tree"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Replace HTML markup | `index.html` |
| 2 | Base section + 3D perspective CSS | `style.css` |
| 3 | Verify header/XP/particles (no changes) | `style.css` |
| 4 | Center node + inner ring CSS | `style.css` |
| 5 | Outer ring + locked node CSS | `style.css` |
| 6 | Detail panel + tooltip CSS | `style.css` |
| 7 | Stats + SVG + responsive CSS | `style.css` |
| 8 | Remove old evolve CSS | `style.css` |
| 9 | JS: Radial positioning + SVG drawing | `evolve.js` |
| 10 | JS: Click interaction + tooltips | `evolve.js` |
| 11 | JS: Scroll animations + parallax | `evolve.js` |
| 12 | Integration + visual polish | All files |
