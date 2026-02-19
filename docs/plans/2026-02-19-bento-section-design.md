# Bento Section Design

**Date:** 2026-02-19
**Status:** Approved
**Placement:** After EVOLVE, before Footer

## Layout

Asymmetric bento grid — 6 cards with visual hierarchy:

```
┌───────────────────────┬───────────┐
│                       │ Smart     │
│   AI Tool Search      │ Filters   │
│   (2x2 — hero card)   ├───────────┤
│                       │ Compare   │
├───────────┬───────────┼───────────┤
│ Community │ API       │ Real-time │
│ Reviews   │ Access    │ Updates   │
└───────────┴───────────┴───────────┘
```

## Cards

| # | Title | Size | Icon | Description |
|---|-------|------|------|-------------|
| 1 | AI Tool Search | Large (2x2) | Search/magnifier | Browse 1000+ AI tools with advanced search |
| 2 | Smart Filters | Small | Filter/sliders | Filter by category, price, and rating instantly |
| 3 | Compare Tools | Small | Columns/compare | Side-by-side comparison to pick the right tool |
| 4 | Community Reviews | Medium | Users/star | Real user ratings and honest reviews |
| 5 | API Access | Medium | Code/terminal | Programmatic access for developers |
| 6 | Real-time Updates | Small | Refresh/bolt | New tools and updates as they happen |

## Visual Style

- **Glassmorphism cards**: `backdrop-filter: blur(20px)`, semi-transparent bg, thin border
- **Hover**: subtle scale-up (1.02) + border glow
- **Icons**: Inline SVG, accent color (cyan #00ffff or white)
- **Background**: Dark (#0b0b0b), consistent with rest of page
- **Section title**: "FEATURES" in large bold text, same pattern as other sections

## Animations

- **Scroll entrance**: Staggered — cards appear one by one (GSAP ScrollTrigger)
- **Parallax**: Grid shifts up slightly on scroll (desktop only, min-width 768px)
- **Hover**: Scale + glow transition via CSS

## Responsive

- **Desktop (1024px+)**: Full asymmetric grid (3 columns)
- **Tablet (768px-1023px)**: 2-column grid, big card spans full width
- **Mobile (<768px)**: Single column stack

## Technical

- HTML: Static markup in `index.html` inside `.project-list-section`
- CSS: Added to `style.css` (bento-specific section)
- JS: `src/components/bento.js` exports `initBento()`
- Wired in `src/main.js`
