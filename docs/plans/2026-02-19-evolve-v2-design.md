# EVOLVE Section V2 Design — Radial Orbit Skill Tree

## Overview

Major upgrade to the existing EVOLVE section. Transforms the 4-branch linear skill tree into a radial orbit layout with 3D depth, expanded content (19 nodes), and enhanced click interaction.

## Concept

**Radial Orbit Tree:** Center node with two concentric rings. Inner ring = 6 core skills (unlocked). Outer ring = 12 specializations (locked, 2 per core skill). CSS `perspective` creates depth illusion where inner ring floats forward and outer ring recedes.

## Color Palette (Unchanged)

- Background: Dark (#0a0a12) to warm dark (#150d04) gradient
- Primary: Amber (#f59e0b)
- Secondary: Gold (#fbbf24)
- Tertiary: Orange (#ea580c)
- Locked: 50% opacity, grayscale

## Node Map

### Center (1 node)
- **AI Fundamentals** — 120px, strongest glow, translateZ(40px)

### Inner Ring — 6 Core Skills (unlocked, 76px, translateZ(25px))

| Position | Name | Icon | Tools | Progress |
|----------|------|------|-------|----------|
| 0° (top) | Prompt Writing | ✍️ | ChatGPT, Claude, Gemini | 85% |
| 60° | Image Generation | 🎨 | Midjourney, DALL-E, SD | 72% |
| 120° | Code Assist | 💻 | Copilot, Cursor, Claude Code | 90% |
| 180° (bottom) | Data Analysis | 📊 | ChatGPT, Julius AI, Pandas AI | 65% |
| 240° | AI Writing | ✏️ | Jasper, Copy.ai, Claude | 78% |
| 300° | AI Audio | 🎵 | Suno, ElevenLabs, Murf | 55% |

### Outer Ring — 12 Specializations (locked, 56px, translateZ(-15px))

| Parent | Spec 1 | Spec 2 |
|--------|--------|--------|
| Prompt Writing | Advanced Prompting | Chain-of-Thought |
| Image Generation | Video & 3D | Style Transfer |
| Code Assist | Full Automation | AI Agents |
| Data Analysis | AI Strategy | Predictive Models |
| AI Writing | Content Marketing | Creative Fiction |
| AI Audio | Music Production | Voice Synthesis |

## Layout Architecture

### Radial Positioning

```
Inner ring radius: ~180px from center
Outer ring radius: ~300px from center
Inner nodes: 60° apart (0°, 60°, 120°, 180°, 240°, 300°)
Outer nodes: ±15° offset from parent's angle
```

Node positions calculated with trigonometry:
```
x = centerX + radius * sin(angle)
y = centerY - radius * cos(angle)
```

### 3D Depth (CSS perspective)

```css
.skill-tree-container {
  perspective: 1200px;
  transform-style: preserve-3d;
}
.tree-center-node { transform: translateZ(40px); }
.inner-ring .tree-node { transform: translateZ(25px); }
.outer-ring .tree-node { transform: translateZ(-15px); opacity: 0.5; filter: blur(0.5px); }
```

### Connection Lines

SVG `<line>` elements:
- Center → each inner node (amber gradient stroke, 2px)
- Each inner node → its 2 outer nodes (thinner, 1px, dimmer)
- Continuous dash-offset animation for energy flow

### Orbit Rings (Decorative)

Thin CSS rings (conic-gradient or border) marking inner and outer orbit paths. Very subtle (5-8% opacity).

## Node Click Experience

### Unlocked Node Click:
1. Clicked node scales to 1.3x with enhanced glow
2. Connected outer nodes brighten (opacity 0.5 → 0.8)
3. Connection lines to those nodes pulse brighter
4. Detail panel slides in from right side (320px wide)
5. Panel content:
   - Large icon + title
   - Description text
   - Tool list with mini icons
   - Mastery progress bar (animated fill)
   - "Specializations" section showing connected outer nodes
6. Click outside or close button dismisses

### Locked Node Click:
1. Node shakes (CSS animation)
2. Detail panel shows locked state
3. Shows prerequisite: "Complete [parent skill] to unlock"
4. Progress bar shows 0% with lock icon

### Active State:
- `.active-node` class on clicked node
- Only one active at a time
- Active node has stronger border glow

## Scroll Animations (GSAP + ScrollTrigger)

### Entrance Sequence:
1. Level badge drops in (y:-20, 0.4s)
2. "EVOLVE" title scales in (scale:0.9, 0.7s)
3. Subtitle fades in (0.4s)
4. XP bar appears + fill animates (1s)
5. Center node pops in (scale:0, back.out(2.5), 0.6s)
6. Inner ring nodes appear sequentially around orbit (stagger 0.15s, scale:0, back.out)
7. Connection lines draw in (stroke-dashoffset, stagger)
8. Outer ring nodes fade in subtly (opacity:0 → 0.5, stagger 0.08s)
9. Stats row slides up (y:30, stagger 0.15s)
10. Particles fade in (0.8s)

### Parallax (Desktop only):
- Header: y offset -50px over scroll
- Tree container: y offset -25px
- Stats: y offset -10px

### Continuous:
- Center node amber pulse (3s loop)
- SVG line dash-offset loop (energy flow)
- Floating particles (existing)
- XP bar shine effect (existing)

## Responsive

### Desktop (>1024px)
- Full radial orbit layout with perspective
- Side panel for details
- All 19 nodes visible

### Tablet (768px - 1024px)
- Smaller radii (inner: 140px, outer: 230px)
- Smaller nodes (inner: 65px, outer: 50px)
- Detail panel becomes modal overlay

### Mobile (<768px)
- Vertical stack layout (no radial)
- Center node on top
- Inner nodes in 2-column grid
- Outer nodes collapsed (shown on parent click)
- Detail panel full-width bottom sheet

## Header (Unchanged)

- Level badge: "LVL 12"
- Title: "EVOLVE" with shimmer gradient
- Subtitle: "Master the AI skill tree"
- XP bar: 2,450 / 3,000 XP (82% fill)

## Stats Row (Unchanged structure, updated numbers)

- 6 Skills Unlocked (was 4)
- 82% Completion
- 18 Tools Mastered (was 12)

## Files Changed

- `index.html` — Replace evolve-section HTML (radial orbit markup + SVG lines)
- `style.css` — Rewrite evolve CSS (radial positioning, 3D, new detail panel)
- `src/components/evolve.js` — Rewrite (radial positioning, SVG connections, enhanced click, scroll animations)

## Performance Notes

- CSS transforms for 3D (GPU accelerated)
- SVG for connection lines (lightweight, animatable)
- GSAP ScrollTrigger with `toggleActions: 'play none none reverse'` to clean up off-screen
- `will-change: transform` on animated elements only when needed
