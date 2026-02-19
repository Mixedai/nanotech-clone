# Hero Section Enhancement — Split Reveal + Scroll Depth

**Date:** 2026-02-18
**Status:** Approved

## Overview

Two enhancements to the hero section:
1. Clip-path line reveal animation for the title
2. Multi-depth parallax scroll transition

## Feature 1: Title Clip-Path Reveal

Each title line wraps in `overflow: hidden` container. Inner text slides up from below with stagger.

**HTML:** Replace `<br>` with `<span class="title-line"><span class="title-line-inner">` wrappers.

**CSS:**
```css
.title-line { display: block; overflow: hidden; }
.title-line-inner { display: block; }
```

**JS:** `yPercent: 110` → `0`, duration 1.2s, stagger 0.15s. No opacity — pure mask reveal.

## Feature 2: Multi-Depth Parallax Scroll

Different scroll speeds create depth illusion:

| Element | y | opacity | end | extra |
|---------|---|---------|-----|-------|
| Title | -120 | — | bottom top | fastest |
| Subtitle | -80 | → 0 | 70% top | early fade |
| CTA | -60 | → 0 | 70% top | scale 0.95 |
| Bottom bar | -30 | → 0 | 50% top | first to go |
| Hero content | — | — | bottom top | scale 0.97 |

## Files

| File | Change |
|------|--------|
| `index.html` | Title line wrappers |
| `style.css` | `.title-line` styles |
| `src/components/hero.js` | Clip reveal timeline + enhanced parallax |
