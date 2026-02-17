# EVOLVE Section Design — AI Skill Tree

## Concept

The fourth and final section in the AI tools journey: DISCOVER → LEARN → USE THEM → **EVOLVE**. This section represents continuous growth and mastery of AI skills through a visual skill tree metaphor.

## Visual Approach: Interactive Skill Tree Map

A dark background with amber/gold accents. A central "AI Fundamentals" node branches out into 4 skill paths, each with an unlocked and a locked node. Scroll-driven animations progressively "unlock" nodes.

## Color Palette

- Background: Dark (#0a0a12) → warm dark (#1a0e08) gradient
- Primary accent: Amber (#f59e0b)
- Secondary accent: Gold (#fbbf24)
- Tertiary: Orange (#ea580c)
- Glow: Amber at 15% opacity, large radial blur centered
- Locked nodes: 30% opacity of base colors

## Layout

### Section Structure
```
.project-title-item.evolve-section
  .evolve-header
    h2.evolve-title  → "EVOLVE"
    p.evolve-subtitle → "Master the AI skill tree"
  .skill-tree-container
    .tree-center-node (AI Fundamentals)
    .tree-branch.branch-tl (top-left)
      .tree-line
      .tree-node.unlocked (Prompt Writing)
      .tree-line
      .tree-node.locked (Advanced Prompting)
    .tree-branch.branch-tr (top-right)
      .tree-line
      .tree-node.unlocked (Image Generation)
      .tree-line
      .tree-node.locked (Video & 3D)
    .tree-branch.branch-bl (bottom-left)
      .tree-line
      .tree-node.unlocked (Code Assist)
      .tree-line
      .tree-node.locked (Full Automation)
    .tree-branch.branch-br (bottom-right)
      .tree-line
      .tree-node.unlocked (Data Analysis)
      .tree-line
      .tree-node.locked (AI Strategy)
```

### Skill Tree Nodes

**Center Node (AI Fundamentals)**
- Large circle (80px), dark bg, amber border (2px), bright glow
- Icon: ⚡ or brain emoji
- Always "unlocked" (fully visible)

**Unlocked Nodes (4 total)**
- Circle (60px), dark bg, amber/gold border, subtle glow
- Icon + label below
- Full opacity

**Locked Nodes (4 total)**
- Circle (60px), dark bg, dim border
- Lock icon 🔒 + label below
- 30% opacity, grayscale effect

**Connection Lines**
- CSS pseudo-elements or thin div lines
- Amber gradient, 1px width
- Animated with strokeDashoffset-like effect on scroll

## Node Content

| Branch | Unlocked | Locked | Icon (unlocked) |
|--------|----------|--------|-----------------|
| Top-left | Prompt Writing | Advanced Prompting | ✍️ |
| Top-right | Image Generation | Video & 3D | 🎨 |
| Bottom-left | Code Assist | Full Automation | 💻 |
| Bottom-right | Data Analysis | AI Strategy | 📊 |

## Animations (GSAP + ScrollTrigger)

1. **Title entrance**: y:30, opacity:0 → visible (0.6s)
2. **Subtitle**: y:20, opacity:0 → visible (0.4s, overlap)
3. **Center node**: scale:0 → 1, glow pulse (back.out ease)
4. **Connection lines**: scaleX/scaleY from 0 → 1 (staggered per branch)
5. **Unlocked nodes**: scale:0.5 + opacity:0 → visible (staggered by branch)
6. **Locked nodes**: opacity:0 → 0.3 (last, subtle)
7. **Continuous**: Center node has a slow pulse-glow animation

ScrollTrigger: trigger on section, start "top 70%", toggleActions "play none none reverse"

## Responsive

### Desktop (>1024px)
- Skill tree displayed with absolute positioning around center
- Branches spread outward in 4 diagonal directions

### Tablet (768px - 1024px)
- Tree becomes 2x2 grid with center node on top
- Connection lines become vertical

### Mobile (<768px)
- Vertical stack: center node → nodes listed sequentially
- Connection lines become short vertical connectors

## Files

- **HTML**: Replace "Better Off" div in `index.html` with evolve-section markup
- **CSS**: Add `.evolve-section` styles to `style.css`
- **JS**: Create `src/components/evolve.js` with `initEvolve()` function
- **main.js**: Import and call `initEvolve()`
