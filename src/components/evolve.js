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
    const rad = (angle - 90) * (Math.PI / 180);
    const x = cx + innerR * Math.cos(rad) - node.offsetWidth / 2;
    const y = cy + innerR * Math.sin(rad) - node.offsetHeight / 2;
    node.style.left = x + 'px';
    node.style.top = y + 'px';
  });

  // Position outer ring nodes
  const outerNodes = container.querySelectorAll('.outer-ring .tree-node');
  outerNodes.forEach(node => {
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
    const containerRect = container.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
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
