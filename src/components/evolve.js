// src/components/evolve.js

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initEvolve() {
  const section = document.querySelector('.evolve-section');
  if (!section) return;

  _initScrollAnimations(section);
  _initParallax(section);
  _initTooltips(section);
  _initNodeClicks(section);
  _initLineEnergy(section);
}

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

// --- Scroll Entrance Animations ---
function _initScrollAnimations(section) {
  const badge = section.querySelector('.evolve-level-badge');
  const title = section.querySelector('.evolve-title');
  const subtitle = section.querySelector('.evolve-subtitle');
  const xpBar = section.querySelector('.evolve-xp-bar');
  const xpFill = section.querySelector('.xp-fill');
  const centerNode = section.querySelector('.tree-center-node');
  const lines = section.querySelectorAll('.tree-line');
  const unlockedNodes = section.querySelectorAll('.tree-node.unlocked');
  const lockedNodes = section.querySelectorAll('.tree-node.locked');
  const stats = section.querySelectorAll('.evolve-stat');
  const particles = section.querySelectorAll('.e-particle');

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

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

  if (centerNode) {
    tl.from(centerNode, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)' }, '-=0.5');
  }

  if (lines.length > 0) {
    tl.from(lines, { scaleX: 0, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out', transformOrigin: 'left center' }, '-=0.3');
  }

  if (unlockedNodes.length > 0) {
    tl.from(unlockedNodes, { scale: 0, opacity: 0, rotation: -15, duration: 0.5, stagger: 0.12, ease: 'back.out(2)' }, '-=0.3');
  }

  if (lockedNodes.length > 0) {
    tl.from(lockedNodes, { opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.2');
  }

  if (stats.length > 0) {
    tl.from(stats, { y: 30, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, '-=0.2');
  }

  if (particles.length > 0) {
    tl.from(particles, { opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power1.out' }, '-=0.5');
  }
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

  let activeNode = null;

  const unlockedNodes = section.querySelectorAll('.tree-node.unlocked');
  const lockedNodes = section.querySelectorAll('.tree-node.locked');

  unlockedNodes.forEach(node => {
    node.addEventListener('click', () => {
      const icon = node.querySelector('.node-icon').textContent;
      const label = node.querySelector('.node-label').textContent;
      const desc = node.dataset.tooltip || '';
      const tools = node.dataset.tools || '';
      const progress = node.dataset.progress || '0';

      if (activeNode) activeNode.classList.remove('active-node');
      node.classList.add('active-node');
      activeNode = node;

      detailIcon.textContent = icon;
      detailTitle.textContent = label;
      detailDesc.textContent = desc;

      // Render tool tags
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

      // Reset progress bar then animate
      detailProgressFill.style.width = '0%';
      detailProgressText.textContent = progress + '% mastered';
      detailProgressWrap.style.display = '';

      panel.classList.add('visible');

      // Double rAF ensures the CSS transition picks up the width change
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailProgressFill.style.width = progress + '%';
        });
      });
    });
  });

  // Locked nodes — shake and show locked state
  lockedNodes.forEach(node => {
    node.addEventListener('click', () => {
      node.classList.add('shake');
      const required = node.dataset.required || '';

      if (activeNode) {
        activeNode.classList.remove('active-node');
        activeNode = null;
      }

      detailIcon.textContent = '🔒';
      detailTitle.textContent = 'Locked';
      detailDesc.textContent = 'Complete prerequisites to unlock this skill';
      detailToolsWrap.style.display = 'none';
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
      if (activeNode) {
        activeNode.classList.remove('active-node');
        activeNode = null;
      }
    });
  }

  // Close on outside click within section
  section.addEventListener('click', (e) => {
    if (
      !e.target.closest('.tree-node') &&
      !e.target.closest('.tree-center-node') &&
      !e.target.closest('#node-detail')
    ) {
      panel.classList.remove('visible');
      if (activeNode) {
        activeNode.classList.remove('active-node');
        activeNode = null;
      }
    }
  });
}

// --- Line Energy Pulse on Branch Hover ---
function _initLineEnergy(section) {
  const branches = section.querySelectorAll('.tree-branch');

  branches.forEach(branch => {
    const lines = branch.querySelectorAll('.tree-line');

    branch.addEventListener('mouseenter', () => {
      lines.forEach((line, i) => {
        setTimeout(() => {
          line.classList.add('energized');
        }, i * 150);
      });
    });

    branch.addEventListener('mouseleave', () => {
      lines.forEach(line => {
        line.addEventListener('animationend', () => {
          line.classList.remove('energized');
        }, { once: true });
      });
    });
  });
}
