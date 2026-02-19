import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOOLS, CATEGORIES } from '../data/tools.js';

gsap.registerPlugin(ScrollTrigger);

let activeCategory = 'all';
let activeSort = 'rating';
let searchQuery = '';
let activeView = 'grid';
let _carouselInterval = null;
let _searchOverlayActive = false;
let _searchOverlayIndex = -1;

export function initToolsPage() {
  _setDynamicStats();
  _renderCategories();
  _renderFeaturedCarousel();
  _renderTools();
  _initSearch();
  _initSort();
  _initViewToggle();
  _initModal();
  _initFeaturedCarouselNav();
  _initFeaturedTilt();
  _initCarouselAutoplay();
  _initStickyFilter();
  _initSearchOverlay();
  _initSectionParallax();
  _initHeroSpotlight();
  _animateStats();
}

/* ========== BATCH 1: Dynamic stats ========== */
function _setDynamicStats() {
  const statNumbers = document.querySelectorAll('.tools-stat-number');
  statNumbers.forEach(el => {
    const label = el.closest('.tools-stat-item')?.querySelector('.tools-stat-label');
    if (!label) return;
    const text = label.textContent.trim().toLowerCase();
    if (text.includes('tools')) el.dataset.target = String(TOOLS.length);
    if (text.includes('categories')) el.dataset.target = String(CATEGORIES.length - 1); // minus "All"
  });
}

/* ========== BATCH 1+8: Stats countup with ScrollTrigger ========== */
function _animateStats() {
  const statsBar = document.querySelector('.tools-stats-bar');
  if (!statsBar) return;

  ScrollTrigger.create({
    trigger: statsBar,
    start: 'top 85%',
    once: true,
    onEnter() {
      const statNumbers = document.querySelectorAll('.tools-stat-number');
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(obj.val);
          },
        });
      });
    },
  });
}

/* ========== BATCH 2: Hero spotlight ========== */
function _initHeroSpotlight() {
  const spotlight = document.querySelector('.tools-hero-spotlight');
  if (!spotlight) return;

  const setX = gsap.quickSetter(spotlight, 'x', 'px');
  const setY = gsap.quickSetter(spotlight, 'y', 'px');

  const hero = document.querySelector('.tools-hero');
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    setX(e.clientX - rect.left - 200);
    setY(e.clientY - rect.top - 200);
  });
}

/* ========== BATCH 3: Featured carousel ========== */
function _renderFeaturedCarousel() {
  const container = document.getElementById('featuredCarousel');
  if (!container) return;

  const featured = TOOLS.filter(t => t.featured);

  container.innerHTML = featured.map(tool => `
    <div class="featured-tool-card" data-tool="${tool.id}" style="--card-glow: ${tool.color};">
      <span class="featured-badge" style="background: ${tool.color}20; color: ${tool.color};">Featured</span>
      <div class="featured-card-icon" style="background: linear-gradient(135deg, ${tool.color}, ${tool.color}aa);">
        ${tool.icon}
      </div>
      <h3 class="featured-card-name">${tool.name}</h3>
      <p class="featured-card-desc">${tool.description}</p>
      <div class="featured-card-stats">
        <div class="featured-card-stat">
          <span class="featured-card-stat-value">${tool.rating}</span>
          <span class="featured-card-stat-label">Rating</span>
        </div>
        <div class="featured-card-stat">
          <span class="featured-card-stat-value">${tool.users}</span>
          <span class="featured-card-stat-label">Users</span>
        </div>
        <div class="featured-card-stat">
          <span class="featured-card-stat-value">${tool.price}</span>
          <span class="featured-card-stat-label">Price</span>
        </div>
      </div>
    </div>
  `).join('');

  // Staggered entrance (Batch 3)
  gsap.from('.featured-tool-card', {
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.8,
  });

  // Click to open modal
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.featured-tool-card');
    if (!card) return;
    _openModal(card.dataset.tool);
  });
}

/* BATCH 3: Featured 3D tilt hover */
function _initFeaturedTilt() {
  const cards = document.querySelectorAll('.featured-tool-card');
  cards.forEach(card => {
    const xTo = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });

    gsap.set(card, { transformPerspective: 1200 });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(mx * 8);
      yTo(-my * 8);
    });

    card.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* BATCH 3: Carousel autoplay */
function _initCarouselAutoplay() {
  const carousel = document.getElementById('featuredCarousel');
  if (!carousel) return;

  const scrollAmount = 340;

  function autoScroll() {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= maxScroll - 10) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  _carouselInterval = setInterval(autoScroll, 4000);

  carousel.addEventListener('mouseenter', () => {
    clearInterval(_carouselInterval);
  });

  carousel.addEventListener('mouseleave', () => {
    _carouselInterval = setInterval(autoScroll, 4000);
  });

  // Pause when not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      clearInterval(_carouselInterval);
      if (entry.isIntersecting) {
        _carouselInterval = setInterval(autoScroll, 4000);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(carousel);
}

function _initFeaturedCarouselNav() {
  const carousel = document.getElementById('featuredCarousel');
  const prevBtn = document.querySelector('.tools-carousel-prev');
  const nextBtn = document.querySelector('.tools-carousel-next');
  const progressBar = document.querySelector('.tools-carousel-progress-bar');
  if (!carousel) return;

  const scrollAmount = 340;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  if (progressBar) {
    carousel.addEventListener('scroll', () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const progress = maxScroll > 0 ? carousel.scrollLeft / maxScroll : 0;
      const barWidth = 20 + progress * 80;
      progressBar.style.width = `${barWidth}%`;
    });
  }

  // Drag scroll
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => { isDragging = false; });
  carousel.addEventListener('mouseup', () => { isDragging = false; });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });
}

/* ========== CATEGORIES ========== */
function _renderCategories() {
  const container = document.getElementById('toolsCategories');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <button class="category-btn ${cat.id === activeCategory ? 'active' : ''}" data-category="${cat.id}">
      <span class="category-icon">${cat.icon}</span>
      <span class="category-label">${cat.label}</span>
    </button>
  `).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;

    activeCategory = btn.dataset.category;
    container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _renderTools();
  });
}

/* ========== FILTERING & SORTING ========== */
function _getFilteredTools() {
  let filtered = [...TOOLS];

  if (activeCategory !== 'all') {
    filtered = filtered.filter(t => t.category === activeCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  switch (activeSort) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'users':
      filtered.sort((a, b) => _parseUsers(b.users) - _parseUsers(a.users));
      break;
    case 'price':
      filtered.sort((a, b) => {
        const aFree = a.price.toLowerCase() === 'free' ? 0 : 1;
        const bFree = b.price.toLowerCase() === 'free' ? 0 : 1;
        return aFree - bFree;
      });
      break;
  }

  return filtered;
}

function _parseUsers(str) {
  const num = parseFloat(str);
  if (str.includes('M')) return num * 1000000;
  if (str.includes('K')) return num * 1000;
  return num;
}

/* ========== BATCH 4: Star rating HTML builder ========== */
function _buildStarRating(rating) {
  const pct = (rating / 5) * 100;
  return `<div class="star-rating" aria-label="Rating: ${rating} out of 5">
    <div class="star-rating-empty">\u2605\u2605\u2605\u2605\u2605</div>
    <div class="star-rating-fill" style="width: ${pct}%">\u2605\u2605\u2605\u2605\u2605</div>
  </div>`;
}

/* ========== BATCH 1: Reset filters (no reload) ========== */
function _resetFilters() {
  activeCategory = 'all';
  activeSort = 'rating';
  searchQuery = '';

  const searchInput = document.querySelector('.tools-search-input');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('toolsSort');
  if (sortSelect) sortSelect.value = 'rating';

  const catBtns = document.querySelectorAll('.category-btn');
  catBtns.forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('.category-btn[data-category="all"]');
  if (allBtn) allBtn.classList.add('active');

  _renderTools();
}

/* ========== RENDER TOOLS GRID ========== */
function _renderTools() {
  const grid = document.getElementById('toolsGrid');
  const countEl = document.getElementById('toolsCount');
  if (!grid) return;

  // BATCH 1: Kill old ScrollTriggers to prevent accumulation
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger && st.trigger.classList && st.trigger.classList.contains('tool-card')) {
      st.kill();
    }
  });

  const filtered = _getFilteredTools();

  if (countEl) {
    countEl.textContent = `${filtered.length} tool${filtered.length !== 1 ? 's' : ''} found`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="tools-empty">
        <p>No tools found matching your criteria.</p>
        <button class="tools-reset-btn">Reset Filters</button>
      </div>
    `;
    grid.querySelector('.tools-reset-btn')?.addEventListener('click', _resetFilters);
    return;
  }

  grid.innerHTML = filtered.map(tool => `
    <article class="tool-card" data-tool="${tool.id}" style="--card-glow: ${tool.color};">
      <div class="tool-card-header">
        <div class="tool-icon" style="background: ${tool.color}15; color: ${tool.color}; border-color: ${tool.color}30;">
          ${tool.icon}
        </div>
        <div class="tool-meta">
          ${_buildStarRating(tool.rating)}
          <span class="tool-price">${tool.price}</span>
        </div>
      </div>
      <div class="tool-card-body">
        <h3 class="tool-name">${tool.name}</h3>
        <p class="tool-description">${tool.description}</p>
        <div class="tool-stats">
          <span class="tool-users">${tool.users} users</span>
        </div>
        <div class="tool-tags">
          ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="tool-card-right">
        ${_buildStarRating(tool.rating)}
        <span class="tool-price">${tool.price}</span>
      </div>
      <div class="tool-card-footer">
        <a href="/playground.html?tool=${tool.id}" class="tool-try-btn" onclick="event.stopPropagation()">Try it \u2192</a>
        <button class="tool-details-btn" onclick="event.stopPropagation()">Details</button>
      </div>
    </article>
  `).join('');

  // Apply view class
  if (activeView === 'list') {
    grid.classList.add('list-view');
  } else {
    grid.classList.remove('list-view');
  }

  // Card click → open modal
  grid.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      _openModal(card.dataset.tool);
    });
  });

  // Details button → open modal
  grid.querySelectorAll('.tool-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.tool-card');
      if (card) _openModal(card.dataset.tool);
    });
  });

  // BATCH 8: Diverse card entrance based on column
  const cards = grid.querySelectorAll('.tool-card');
  cards.forEach((card, i) => {
    const col = i % 3;
    let fromVars;
    if (col === 0) {
      fromVars = { x: -30, opacity: 0 };
    } else if (col === 2) {
      fromVars = { x: 30, opacity: 0 };
    } else {
      fromVars = { scale: 0.9, y: 40, opacity: 0 };
    }
    gsap.set(card, fromVars);
  });

  ScrollTrigger.batch('.tool-card', {
    onEnter: (batch) => {
      batch.forEach((card, i) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power3.out',
        });
      });
    },
    once: true,
  });

  // BATCH 4: 3D tilt on tool cards (grid only)
  _initToolCardTilt();
}

/* ========== BATCH 4: Tool card 3D tilt ========== */
function _initToolCardTilt() {
  if (activeView === 'list') return;

  const cards = document.querySelectorAll('.tool-card');
  cards.forEach(card => {
    const xTo = gsap.quickTo(card, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    const yTo = gsap.quickTo(card, 'rotateX', { duration: 0.35, ease: 'power2.out' });

    gsap.set(card, { transformPerspective: 1200 });

    card.addEventListener('mousemove', (e) => {
      if (activeView === 'list') return;
      const rect = card.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(mx * 6);
      yTo(-my * 6);
    });

    card.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ========== SEARCH ========== */
function _initSearch() {
  const input = document.querySelector('.tools-search-input');
  if (!input) return;

  // Focus on hero search → open overlay instead (Batch 7)
  input.addEventListener('focus', () => {
    input.blur();
    _openSearchOverlay();
  });
}

/* ========== SORT ========== */
function _initSort() {
  const select = document.getElementById('toolsSort');
  if (!select) return;

  select.addEventListener('change', (e) => {
    activeSort = e.target.value;
    _renderTools();
  });
}

/* ========== VIEW TOGGLE ========== */
function _initViewToggle() {
  const toggle = document.getElementById('viewToggle');
  if (!toggle) return;

  toggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-btn');
    if (!btn) return;

    const view = btn.dataset.view;
    if (view === activeView) return;

    activeView = view;
    toggle.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const grid = document.getElementById('toolsGrid');
    if (!grid) return;

    if (view === 'list') {
      grid.classList.add('list-view');
    } else {
      grid.classList.remove('list-view');
    }

    // Animate visible cards transition
    const visibleCards = Array.from(document.querySelectorAll('.tool-card')).filter(card => {
      const rect = card.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    gsap.fromTo(visibleCards, { opacity: 0, y: 15 }, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      stagger: 0.03,
      ease: 'power2.out',
    });
  });
}

/* ========== BATCH 5: Sticky filter bar ========== */
function _initStickyFilter() {
  const filterBar = document.querySelector('.tools-filter-bar');
  if (!filterBar) return;

  // Sentinel element before filter bar
  const sentinel = document.createElement('div');
  sentinel.className = 'tools-filter-sentinel';
  filterBar.parentNode.insertBefore(sentinel, filterBar);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        filterBar.classList.add('is-stuck');
      } else {
        filterBar.classList.remove('is-stuck');
      }
    });
  }, { threshold: 0 });

  observer.observe(sentinel);
}

/* ========== BATCH 6: Detail Modal with GSAP ========== */
function _initModal() {
  const overlay = document.getElementById('toolModal');
  const closeBtn = document.getElementById('toolModalClose');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) _closeModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', _closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      _closeModal();
    }
  });
}

function _openModal(toolId) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return;

  const overlay = document.getElementById('toolModal');
  const modal = overlay.querySelector('.tool-modal');

  // Populate content
  const iconEl = document.getElementById('modalIcon');
  iconEl.style.background = `linear-gradient(135deg, ${tool.color}, ${tool.color}aa)`;
  iconEl.textContent = tool.icon;

  document.getElementById('modalName').textContent = tool.name;
  // Star rating in modal (Batch 6)
  document.getElementById('modalRating').innerHTML = _buildStarRating(tool.rating) + ` <span style="margin-left:6px;color:#f59e0b;">${tool.rating}</span>`;
  document.getElementById('modalPrice').textContent = tool.price;
  document.getElementById('modalUsers').textContent = `${tool.users} users`;
  document.getElementById('modalDescription').textContent = tool.description;

  const featuresList = document.getElementById('modalFeaturesList');
  featuresList.innerHTML = tool.features.map(f => `<li>${f}</li>`).join('');

  document.getElementById('modalPricingText').textContent = tool.pricePlan;

  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = tool.tags.map(tag => `<span class="tool-modal-tag">${tag}</span>`).join('');

  document.getElementById('modalVisitBtn').href = tool.url;
  document.getElementById('modalTryBtn').href = `/playground.html?tool=${tool.id}`;

  // Related tools
  const related = TOOLS
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  const relatedGrid = document.getElementById('modalRelated');
  relatedGrid.innerHTML = related.map(r => `
    <div class="related-tool-card" data-tool="${r.id}">
      <div class="related-tool-icon" style="background: linear-gradient(135deg, ${r.color}, ${r.color}aa);">
        ${r.icon}
      </div>
      <div class="related-tool-name">${r.name}</div>
      <div class="related-tool-rating">\u2605 ${r.rating}</div>
    </div>
  `).join('');

  relatedGrid.querySelectorAll('.related-tool-card').forEach(card => {
    card.addEventListener('click', () => {
      _openModal(card.dataset.tool);
    });
  });

  // GSAP open animation (Batch 6)
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  gsap.set(modal, { scale: 0.9, opacity: 0 });
  const tl = gsap.timeline();
  tl.to(modal, {
    scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: 'back.out(1.4)',
  });

  // Stagger content elements
  const contentEls = modal.querySelectorAll('.tool-modal-header, .tool-modal-description, .tool-modal-features, .tool-modal-pricing, .tool-modal-tags, .tool-modal-actions, .tool-modal-related');
  gsap.set(contentEls, { y: 20, opacity: 0 });
  tl.to(contentEls, {
    y: 0,
    opacity: 1,
    duration: 0.35,
    stagger: 0.06,
    ease: 'power3.out',
  }, '-=0.15');
}

function _closeModal() {
  const overlay = document.getElementById('toolModal');
  if (!overlay) return;

  const modal = overlay.querySelector('.tool-modal');

  // GSAP close animation (Batch 6)
  gsap.to(modal, {
    scale: 0.92,
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in',
    onComplete() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      gsap.set(modal, { scale: 1, opacity: 1 });
    },
  });
}

/* ========== BATCH 7: Cmd+K Search Overlay ========== */
function _initSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;

  const input = document.getElementById('searchOverlayInput');
  const results = document.getElementById('searchOverlayResults');
  const backdrop = overlay.querySelector('.search-overlay-backdrop');

  // Cmd+K / Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (_searchOverlayActive) {
        _closeSearchOverlay();
      } else {
        _openSearchOverlay();
      }
    }
  });

  // Backdrop click to close
  backdrop.addEventListener('click', _closeSearchOverlay);

  // Input handler
  input.addEventListener('input', () => {
    _renderSearchResults(input.value.trim());
  });

  // Keyboard nav
  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _searchOverlayIndex = Math.min(_searchOverlayIndex + 1, items.length - 1);
      _highlightSearchResult(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      _searchOverlayIndex = Math.max(_searchOverlayIndex - 1, 0);
      _highlightSearchResult(items);
    } else if (e.key === 'Enter' && _searchOverlayIndex >= 0 && items[_searchOverlayIndex]) {
      e.preventDefault();
      const toolId = items[_searchOverlayIndex].dataset.tool;
      _closeSearchOverlay();
      _openModal(toolId);
    } else if (e.key === 'Escape') {
      _closeSearchOverlay();
    }
  });
}

function _openSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchOverlayInput');
  if (!overlay) return;

  _searchOverlayActive = true;
  _searchOverlayIndex = -1;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Animate open
  const panel = overlay.querySelector('.search-overlay-panel');
  gsap.fromTo(panel, { scale: 0.95, opacity: 0 }, {
    scale: 1,
    opacity: 1,
    duration: 0.25,
    ease: 'back.out(1.2)',
  });

  setTimeout(() => input.focus(), 50);
  _renderSearchResults('');
}

function _closeSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchOverlayInput');
  if (!overlay) return;

  _searchOverlayActive = false;

  const panel = overlay.querySelector('.search-overlay-panel');
  gsap.to(panel, {
    scale: 0.95,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      input.value = '';
      _searchOverlayIndex = -1;
    },
  });
}

function _renderSearchResults(query) {
  const results = document.getElementById('searchOverlayResults');
  if (!results) return;

  let filtered = [...TOOLS];
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  const displayed = filtered.slice(0, 8);
  _searchOverlayIndex = displayed.length > 0 ? 0 : -1;

  results.innerHTML = displayed.map((tool, i) => `
    <div class="search-result-item ${i === 0 ? 'active' : ''}" data-tool="${tool.id}">
      <div class="search-result-icon" style="background: linear-gradient(135deg, ${tool.color}, ${tool.color}aa);">
        ${tool.icon}
      </div>
      <div class="search-result-info">
        <div class="search-result-name">${tool.name}</div>
        <div class="search-result-desc">${tool.description}</div>
      </div>
      <div class="search-result-meta">
        <span class="search-result-rating">\u2605 ${tool.rating}</span>
      </div>
    </div>
  `).join('');

  // Click handler
  results.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const toolId = item.dataset.tool;
      _closeSearchOverlay();
      _openModal(toolId);
    });
  });
}

function _highlightSearchResult(items) {
  items.forEach((item, i) => {
    item.classList.toggle('active', i === _searchOverlayIndex);
  });
  if (items[_searchOverlayIndex]) {
    items[_searchOverlayIndex].scrollIntoView({ block: 'nearest' });
  }
}

/* ========== BATCH 8: Section parallax ========== */
function _initSectionParallax() {
  if (window.innerWidth < 768) return;

  const featuredTitle = document.querySelector('.tools-featured-title');
  if (featuredTitle) {
    gsap.to(featuredTitle, {
      y: -30,
      scrollTrigger: {
        trigger: featuredTitle,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    });
  }

  const gridCount = document.getElementById('toolsCount');
  if (gridCount) {
    gsap.to(gridCount, {
      y: -15,
      scrollTrigger: {
        trigger: gridCount,
        start: 'top 90%',
        end: 'bottom 30%',
        scrub: 1,
      },
    });
  }
}
