/* ============================================================
   CINEVAULT — script.js (Production Level 2.1)
   • AbortController  — cancels stale requests
   • LRU cache (50)   — instant repeat searches
   • 4-strategy fuzzy search
   • Favourites & Watchlist persistence (storage.js)
   • Curated Regional Category Filtering (categories.js)
   • Movie Detail Modal with YouTube Trailer Search
   • Category-Strict Recommendation Engine ("You Might Also Like")
   • Latest 2025-2026 Cinema Showcase
   • SaaS Backup Export & Import (JSON)
   • Dynamic Schema.org JSON-LD SEO Structured Data
   • Mobile Bottom Navigation & Desktop First Responsive UI
   ============================================================ */

// ── API CONFIGURATION ───────────────────────────────────────
const API_BASE = 'https://www.omdbapi.com';
const OMDB_KEY = '94397865';

const API = {
  search: (q, y) => `${API_BASE}/?apikey=${OMDB_KEY}&s=${encodeURIComponent(q)}&page=1${y ? `&y=${y}` : ''}`,
  detail: (id) => `${API_BASE}/?apikey=${OMDB_KEY}&i=${id}&plot=full`,
};

// ── LRU & LOCALSTORAGE CACHE (Ultra Fast 1-3s Load Times) ─────────
const _cache = new Map();
const CACHE_PREFIX = 'cv_cache_v2_';

function cacheGet(k) {
  if (_cache.has(k)) return _cache.get(k);
  try {
    const stored = localStorage.getItem(CACHE_PREFIX + k);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Cache valid for 7 days (604800000 ms)
      if (Date.now() - (parsed._ts || 0) < 604800000) {
        _cache.set(k, parsed.data);
        return parsed.data;
      }
    }
  } catch (e) {}
  return null;
}

function cacheSet(k, v) {
  if (_cache.size >= 200) _cache.delete(_cache.keys().next().value);
  _cache.set(k, v);
  try {
    localStorage.setItem(CACHE_PREFIX + k, JSON.stringify({ _ts: Date.now(), data: v }));
  } catch (e) {}
}

// ── FAST FETCH WITH 3s TIMEOUT ─────────────────────────────
async function fetchJSON(url, signal) {
  const timeoutCtrl = new AbortController();
  const timer = setTimeout(() => timeoutCtrl.abort(), 8000);
  try {
    const fetchSignal = signal || timeoutCtrl.signal;
    const res = await fetch(url, { signal: fetchSignal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ── ABORT CONTROLLERS ──────────────────────────────────────
let searchCtrl = null;
let detailCtrl = null;

// ── DEBOUNCE ───────────────────────────────────────────────
function debounce(fn, ms = 350) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// ── HTML ESCAPE ────────────────────────────────────────────
function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── DOM REFS ───────────────────────────────────────────────
let movieSearchBox, searchList,
    resultGrid, homePage, detailPage, favPage,
    favListEl, favEmpty, favBadge, watchlistBadge,
    toastEl, toastMsg, navbar,
    clearBtn, submitBtn,
    navLogoBtn, detailBackBtn, navFavBtn, navWatchlistBtn,
    favCloseBtn, favClearAllBtn, favExportBtn, favImportBtn, importFileInput,
    tabFavBtn, tabWatchlistBtn,
    navSearchToggle, navSearchInline, navSearchInput,
    quickTagsEl, themeToggleBtn, themeIcon,
    movieModal, modalCloseBtn, modalBody,
    categoryGridEl, categoryPills,
    mbnavHome, mbnavExplore, mbnavFav, mbnavWatchlist,
    jsonldSchemaEl;

// Current Active Tab for Saved Items: STORAGE_KEYS.FAVOURITES or STORAGE_KEYS.WATCHLIST
let currentSavedTab = STORAGE_KEYS.FAVOURITES;

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  movieSearchBox   = $('movie-search-box');
  searchList       = $('search-list');
  resultGrid       = $('result-flex');
  homePage         = $('home-page');
  detailPage       = $('movie-detail-page');
  favPage          = $('favourite-result');
  favListEl        = $('fav-list');
  favEmpty         = $('fav-empty');
  favBadge         = $('fav-badge');
  watchlistBadge   = $('watchlist-badge');
  toastEl          = $('toast');
  toastMsg         = $('toast-msg');
  navbar           = $('navbar');
  clearBtn         = $('search-clear-btn');
  submitBtn        = $('search-submit-btn');
  navLogoBtn       = $('nav-logo-btn');
  detailBackBtn    = $('detail-back-btn');
  navFavBtn        = $('nav-fav-btn');
  navWatchlistBtn  = $('nav-watchlist-btn');
  favCloseBtn      = $('fav-close-btn');
  favClearAllBtn   = $('fav-clear-all-btn');
  favExportBtn     = $('fav-export-btn');
  favImportBtn     = $('fav-import-btn');
  importFileInput  = $('import-file-input');
  tabFavBtn        = $('tab-fav-btn');
  tabWatchlistBtn  = $('tab-watchlist-btn');
  navSearchToggle  = $('nav-search-toggle');
  navSearchInline  = $('nav-search-inline');
  navSearchInput   = $('nav-search-input');
  quickTagsEl      = $('quick-tags');
  themeToggleBtn   = $('theme-toggle-btn');
  themeIcon        = $('theme-icon');
  movieModal       = $('movie-modal');
  modalCloseBtn    = $('modal-close');
  modalBody        = $('modal-body');
  categoryGridEl   = $('category-results-grid');
  categoryPills    = document.querySelectorAll('.cat-pill');
  mbnavHome        = $('mbnav-home');
  mbnavExplore     = $('mbnav-explore');
  mbnavFav         = $('mbnav-fav');
  mbnavWatchlist   = $('mbnav-watchlist');
  jsonldSchemaEl   = $('jsonld-schema');

  const fyEl = $('footer-year');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  initTheme();
  updateBadges();
  showHomePage();
  initParticles();
  attachListeners();
  initReveal();
  handleDeepLinking();

  // Load default category showcase (Latest 2025-2026 Cinema)
  loadCategoryShowcase('latest2026');

  // Check for periodic weekly auto-refresh of 2025-2026 catalog
  if (typeof checkAutoRefreshCatalog === 'function' && checkAutoRefreshCatalog()) {
    showToast('✨ Catalog updated with latest 2025–2026 cinema!', 'info');
  }
});

function handleDeepLinking() {
  try {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (movieId && movieId.startsWith('tt')) {
      openMovieModal(movieId);
    }
  } catch (e) {
    console.error("Deep link parse failed:", e);
  }
}

// ============================================================
//  PARTICLES
// ============================================================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const isMobile = window.innerWidth < 600;
  const COUNT = isMobile ? 40 : 90;
  const pts = Array.from({ length: COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.3 + 0.3,
    speed: Math.random() * 0.2 + 0.04,
    alpha: Math.random() * 0.4 + 0.08,
    gold: Math.random() > 0.72,
  }));

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.y -= p.speed;
      if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? `rgba(245,197,24,${p.alpha})` : `rgba(200,200,232,${p.alpha})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(loop);
  }
  loop();
  document.addEventListener('visibilitychange', () => document.hidden ? cancelAnimationFrame(raf) : loop());
}

// ============================================================
//  SCROLL REVEAL
// ============================================================
function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.footer-col, .footer-bottom').forEach(el => { el.classList.add('reveal'); io.observe(el); });
}

// ============================================================
//  THEME TOGGLE
// ============================================================
function initTheme() {
  const savedTheme = localStorage.getItem('cv_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.body.classList.remove('light-theme');
    if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('cv_theme', isLight ? 'light' : 'dark');
  if (themeIcon) {
    if (isLight) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      showToast('Switched to Light Theme', 'info');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      showToast('Switched to Dark Theme', 'info');
    }
  }
}

// ============================================================
//  TRENDING & SEARCH SHOW / HIDE
// ============================================================
function hideQuickTags() {
  if (!quickTagsEl) return;
  quickTagsEl.style.display = 'none';
}
function showQuickTags() {
  if (!quickTagsEl) return;
  quickTagsEl.style.display = 'flex';
}

function hideSearchList() {
  searchList.classList.add('hide-search-list');
  const wrapper = document.querySelector('.hero-search-wrapper');
  if (wrapper) wrapper.classList.remove('search-active');
  showQuickTags();
}

// ============================================================
//  EVENT LISTENERS
// ============================================================
function attachListeners() {
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Phase 6: 350ms Input Debounce
  const debouncedLoad = debounce(val => loadMovies(val), 350);

  // Main search input
  movieSearchBox.addEventListener('input', () => {
    const val = movieSearchBox.value.trim();
    clearBtn.style.display = val ? 'flex' : 'none';
    if (val.length > 1) {
      hideQuickTags();
      showSkeletons();
      debouncedLoad(val);
    } else {
      hideSearchList();
    }
  });

  // Enter key
  movieSearchBox.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = movieSearchBox.value.trim();
      if (val.length > 1) { hideQuickTags(); loadMovies(val); }
    }
  });

  // Clear / Close search button
  if (clearBtn) {
    clearBtn.addEventListener('click', e => {
      e.stopPropagation();
      movieSearchBox.value = '';
      if (navSearchInput) navSearchInput.value = '';
      clearBtn.style.display = 'none';
      if (searchCtrl) { searchCtrl.abort(); searchCtrl = null; }
      hideSearchList();
      showQuickTags();
      const wrapper = document.querySelector('.hero-search-wrapper');
      if (wrapper) wrapper.classList.remove('search-active');
      showHomePage();
    });
  }

  // Submit button
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const val = movieSearchBox.value.trim();
      if (val.length > 1) { hideQuickTags(); loadMovies(val); }
    });
  }

  // Trending quick-tags
  document.querySelectorAll('.qtag').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      movieSearchBox.value = q;
      clearBtn.style.display = 'flex';
      hideQuickTags();
      showSkeletons();
      loadMovies(q);
      movieSearchBox.focus();
    });
  });

  // Nav inline search
  if (navSearchInput) {
    navSearchInput.addEventListener('input', debounce(() => {
      const val = navSearchInput.value.trim();
      if (val.length > 1) {
        movieSearchBox.value = val;
        clearBtn.style.display = 'flex';
        showHomePage();
        hideQuickTags();
        showSkeletons();
        loadMovies(val);
      }
    }, 350));
  }

  // Click outside to hide search list
  document.addEventListener('click', e => {
    if (!e.target.closest('#search-bar') && !e.target.closest('#search-list')) hideSearchList();
  }, { passive: true });

  // Escape key → close search list / modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      hideSearchList();
      closeMovieModal();
      movieSearchBox.blur();
    }
  });

  // Navigation handlers
  navLogoBtn.addEventListener('click', goHome);
  navLogoBtn.addEventListener('keydown', e => e.key === 'Enter' && goHome());
  detailBackBtn.addEventListener('click', goHome);
  detailBackBtn.addEventListener('keydown', e => e.key === 'Enter' && goHome());

  navFavBtn.addEventListener('click', () => showSavedPage(STORAGE_KEYS.FAVOURITES));
  if (navWatchlistBtn) {
    navWatchlistBtn.addEventListener('click', () => showSavedPage(STORAGE_KEYS.WATCHLIST));
  }

  favCloseBtn.addEventListener('click', goHome);

  if (tabFavBtn) tabFavBtn.addEventListener('click', () => showSavedPage(STORAGE_KEYS.FAVOURITES));
  if (tabWatchlistBtn) tabWatchlistBtn.addEventListener('click', () => showSavedPage(STORAGE_KEYS.WATCHLIST));

  favClearAllBtn.addEventListener('click', () => {
    const listName = currentSavedTab === STORAGE_KEYS.FAVOURITES ? 'favourites' : 'watchlist';
    if (confirm(`Clear all items in your ${listName}?`)) {
      clearList(currentSavedTab);
      renderSavedList();
      updateBadges();
      showToast(`All ${listName} cleared.`, 'info');
    }
  });

  navSearchToggle.addEventListener('click', () => {
    if (!navSearchInline) return;
    const hidden = navSearchInline.style.display !== 'flex';
    navSearchInline.style.display = hidden ? 'flex' : 'none';
    if (hidden && navSearchInput) navSearchInput.focus();
  });

  // Modal events
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMovieModal);
  if (movieModal) {
    movieModal.addEventListener('click', e => {
      if (e.target === movieModal) closeMovieModal();
    });
  }

  // Category showcase pill buttons
  if (categoryPills) {
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const categoryKey = pill.dataset.category;
        if (categoryKey) loadCategoryShowcase(categoryKey);
      });
    });
  }

  // Footer genre pills
  document.querySelectorAll('.fgp').forEach(pill => {
    pill.addEventListener('click', () => {
      const categoryKey = pill.dataset.category;
      if (categoryKey) {
        showHomePage();
        loadCategoryShowcase(categoryKey);
        const section = document.getElementById('categories-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile Bottom Navigation Bar Actions
  if (mbnavHome) mbnavHome.addEventListener('click', () => { setActiveMbNav(mbnavHome); goHome(); });
  if (mbnavExplore) mbnavExplore.addEventListener('click', () => {
    setActiveMbNav(mbnavExplore);
    showHomePage();
    const section = document.getElementById('categories-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
  if (mbnavFav) mbnavFav.addEventListener('click', () => { setActiveMbNav(mbnavFav); showSavedPage(STORAGE_KEYS.FAVOURITES); });
  if (mbnavWatchlist) mbnavWatchlist.addEventListener('click', () => { setActiveMbNav(mbnavWatchlist); showSavedPage(STORAGE_KEYS.WATCHLIST); });
}

function setActiveMbNav(activeBtn) {
  [mbnavHome, mbnavExplore, mbnavFav, mbnavWatchlist].forEach(btn => {
    if (btn) btn.classList.toggle('active', btn === activeBtn);
  });
}

function goHome() {
  showHomePage();
  movieSearchBox.value = '';
  clearBtn.style.display = 'none';
  hideSearchList();
  if (navSearchInput) navSearchInput.value = '';
  if (mbnavHome) setActiveMbNav(mbnavHome);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  SEARCH API — 4-strategy fuzzy fallback + AbortController
// ============================================================
async function loadMovies(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) return;

  const trimmed = searchTerm.trim();

  if (searchCtrl) searchCtrl.abort();
  searchCtrl = new AbortController();
  const signal = searchCtrl.signal;

  const cacheKey = `s:${trimmed.toLowerCase()}`;
  const cached   = cacheGet(cacheKey);
  if (cached) { displayMovieList(cached); return; }

  showSkeletons();

  let yearParam = '';
  let queryStr = trimmed;
  const yearMatch = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) {
    yearParam = yearMatch[0];
    queryStr = trimmed.replace(yearMatch[0], '').replace(/\s+/g, ' ').trim();
  }

  try {
    let data = await fetchJSON(API.search(queryStr, yearParam), signal);

    if (data.Response !== 'True' && queryStr.includes(' ')) {
      const first = queryStr.split(/\s+/)[0];
      if (first.length > 2) data = await fetchJSON(API.search(first, yearParam), signal);
    }

    if (data.Response !== 'True') {
      const clean = queryStr.replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '').trim();
      if (clean && clean !== queryStr) data = await fetchJSON(API.search(clean, yearParam), signal);
    }

    if (data.Response !== 'True' && queryStr.includes(' ')) {
      const parts = queryStr.split(/\s+/);
      const last  = parts[parts.length - 1];
      if (last.length > 3) data = await fetchJSON(API.search(last, yearParam), signal);
    }

    if (data.Response === 'True') {
      // Keep all returned items visible, using fallback title placeholders for missing posters
      const validMovies = (data.Search || []).filter(m => m && m.Title);
      cacheSet(cacheKey, validMovies);
      displayMovieList(validMovies);
    } else {
      showNoResults(trimmed);
    }
  } catch (e) {
    if (e.name !== 'AbortError') showNoResults(trimmed);
  }
}

// ── Skeleton loader (Phase 5) ─────────────────────────────
function showSkeletons() {
  searchList.classList.remove('hide-search-list');
  const wrapper = document.querySelector('.hero-search-wrapper');
  if (wrapper) wrapper.classList.add('search-active');
  searchList.innerHTML =
    '<div class="search-results-header">Searching…</div>' +
    [0,1,2,3].map(i => `
      <div class="search-skeleton" style="--i:${i}">
        <div class="sk-thumb"></div>
        <div class="sk-info">
          <div class="sk-line" style="width:66%"></div>
          <div class="sk-line sk-line-short"></div>
          <div class="sk-line" style="width:50%"></div>
        </div>
      </div>`).join('');
}

function showNoResults(term) {
  searchList.classList.remove('hide-search-list');
  const wrapper = document.querySelector('.hero-search-wrapper');
  if (wrapper) wrapper.classList.add('search-active');
  searchList.innerHTML = `
    <div class="search-no-results">
      <i class="fa-solid fa-film"></i>
      <p>No results for <strong>${escHtml(term)}</strong></p>
      <span>Try a shorter keyword or check the spelling</span>
    </div>`;
}

// ── Display search results ─────────────────────────────────
function displayMovieList(movies, filterType = 'all') {
  searchList.classList.remove('hide-search-list');
  const wrapper = document.querySelector('.hero-search-wrapper');
  if (wrapper) wrapper.classList.add('search-active');

  const filtered = filterType === 'all'
    ? movies
    : movies.filter(m => m.Type === filterType);

  const frag = document.createDocumentFragment();

  // Header with filter pills
  const hdr  = document.createElement('div');
  hdr.className   = 'search-results-header';

  const countLabel = document.createElement('span');
  countLabel.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
  hdr.appendChild(countLabel);

  const filterContainer = document.createElement('div');
  filterContainer.className = 'search-filter-pills';

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Movies', value: 'movie' },
    { label: 'Series', value: 'series' }
  ];

  filterOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `filter-pill ${filterType === opt.value ? 'active' : ''}`;
    btn.textContent = opt.label;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      displayMovieList(movies, opt.value);
    });
    filterContainer.appendChild(btn);
  });
  hdr.appendChild(filterContainer);
  frag.appendChild(hdr);

  if (filtered.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'search-no-results';
    emptyEl.innerHTML = `
      <i class="fa-solid fa-face-frown"></i>
      <p style="margin-top: 6px;">No ${filterType === 'movie' ? 'movies' : 'series'} found</p>
    `;
    frag.appendChild(emptyEl);
  } else {
    const actorFetches = filtered.map(m => {
      const ck  = `d:${m.imdbID}`;
      const hit = cacheGet(ck);
      if (hit) return Promise.resolve(hit);
      return fetchJSON(API.detail(m.imdbID))
        .then(d => { if (d?.Response === 'True') cacheSet(ck, d); return d; })
        .catch(() => null);
    });

    filtered.forEach((movie, i) => {
      const item = document.createElement('div');
      item.className = 'search-list-item';
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '0');
      item.style.setProperty('--i', i);

      const poster    = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '';
      const posterSrc = poster || 'https://placehold.co/50x70/0f0f18/F5C518?text=%3F';
      const faved     = isInList(STORAGE_KEYS.FAVOURITES, movie.imdbID);
      const bookmarked= isInList(STORAGE_KEYS.WATCHLIST, movie.imdbID);
      const typeLabel = movie.Type === 'series' ? 'Series' : movie.Type === 'episode' ? 'Episode' : 'Movie';

      item.innerHTML = `
        <div class="search-item-thumbnail">
          <img src="${escHtml(posterSrc)}" alt="${escHtml(movie.Title)}" loading="lazy"
               onload="this.classList.add('loaded')"
               onerror="this.src='https://placehold.co/50x70/0f0f18/F5C518?text=%3F';this.classList.add('loaded')">
        </div>
        <div class="search-item-info">
          <h3>${escHtml(movie.Title)}</h3>
          <p class="search-item-year">
            ${escHtml(movie.Year)}
            <span class="search-item-type-badge">${escHtml(typeLabel)}</span>
          </p>
          <p class="search-item-actors" id="act-${movie.imdbID}"></p>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="search-fav-btn watchlist-btn ${bookmarked ? 'bookmarked' : ''}"
                  title="${bookmarked ? 'Remove from watchlist' : 'Add to watchlist'}"
                  aria-label="${bookmarked ? 'Remove from watchlist' : 'Add to watchlist'}">
            <i class="fa-${bookmarked ? 'solid' : 'regular'} fa-bookmark" aria-hidden="true"></i>
          </button>
          <button class="search-fav-btn ${faved ? 'faved' : ''}"
                  title="${faved ? 'Remove from favourites' : 'Add to favourites'}"
                  aria-label="${faved ? 'Remove from favourites' : 'Add to favourites'}">
            <i class="fa-${faved ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i>
          </button>
        </div>`;

      item.addEventListener('click', e => {
        if (!e.target.closest('.search-fav-btn')) openMovieModal(movie.imdbID);
      });
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.target.closest('.search-fav-btn')) openMovieModal(movie.imdbID);
      });

      // Heart button (Favourites)
      item.querySelector('.search-fav-btn:not(.watchlist-btn)').addEventListener('click', e => {
        e.stopPropagation();
        const added = toggleInList(STORAGE_KEYS.FAVOURITES, movie);
        const btn = e.currentTarget;
        btn.classList.toggle('faved', added);
        btn.innerHTML = `<i class="fa-${added ? 'solid' : 'regular'} fa-heart"></i>`;
        updateBadges();
        showToast(added ? `"${movie.Title}" saved to favourites!` : `Removed "${movie.Title}" from favourites.`, added ? 'add' : 'remove');
      });

      // Bookmark button (Watchlist)
      item.querySelector('.watchlist-btn').addEventListener('click', e => {
        e.stopPropagation();
        const added = toggleInList(STORAGE_KEYS.WATCHLIST, movie);
        const btn = e.currentTarget;
        btn.classList.toggle('bookmarked', added);
        btn.innerHTML = `<i class="fa-${added ? 'solid' : 'regular'} fa-bookmark"></i>`;
        updateBadges();
        showToast(added ? `"${movie.Title}" added to watchlist!` : `Removed "${movie.Title}" from watchlist.`, added ? 'add' : 'remove');
      });

      frag.appendChild(item);

      actorFetches[i].then(d => {
        const el = document.getElementById(`act-${movie.imdbID}`);
        if (el && d?.Actors && d.Actors !== 'N/A') el.textContent = d.Actors;
      });
    });
  }

  searchList.innerHTML = '';
  searchList.appendChild(frag);
}

// ============================================================
//  CATEGORY SHOWCASE (Phase 3 & categories.js)
// ============================================================
async function loadCategoryShowcase(categoryKey) {
  if (!categoryGridEl) return;

  document.querySelectorAll('.cat-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.category === categoryKey);
  });

  categoryGridEl.innerHTML = Array.from({ length: 8 }, () => `<div class="skeleton-card"></div>`).join('');

  try {
    const movies = await fetchCategoryCollection(categoryKey, id => {
      const ck = `d:${id}`;
      const cached = cacheGet(ck);
      if (cached) return Promise.resolve(cached);
      return fetchJSON(API.detail(id)).then(res => {
        if (res?.Response === 'True') cacheSet(ck, res);
        return res;
      });
    });

    if (!movies.length) {
      categoryGridEl.innerHTML = `<p class="empty-state">No titles available in this category.</p>`;
      return;
    }

    const frag = document.createDocumentFragment();
    movies.forEach(m => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const posterHTML = (m.Poster && m.Poster !== 'N/A')
        ? `<img class="category-card-img" src="${escHtml(m.Poster)}" alt="${escHtml(m.Title)}" loading="lazy">`
        : createPosterPlaceholderHTML(m.Title);

      card.innerHTML = `
        <div class="category-card-poster-wrapper">
          ${posterHTML}
          <div class="category-card-overlay"></div>
        </div>
        <div class="category-card-info">
          <div class="category-card-title" title="${escHtml(m.Title)}">${escHtml(m.Title)}</div>
        </div>
      `;

      card.addEventListener('click', () => openMovieModal(m.imdbID));
      card.addEventListener('keydown', e => e.key === 'Enter' && openMovieModal(m.imdbID));
      frag.appendChild(card);
    });

    categoryGridEl.innerHTML = '';
    categoryGridEl.appendChild(frag);
  } catch (err) {
    categoryGridEl.innerHTML = `<p class="error-state">Failed to load category movies.</p>`;
  }
}

// ============================================================
//  MOVIE DETAIL MODAL (Phase 2 & Advanced Features)
// ============================================================
async function openMovieModal(imdbID) {
  if (!movieModal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display:flex;gap:20px;align-items:center;padding:20px 0;">
      <div class="skeleton-card" style="width:180px;height:270px;flex-shrink:0;"></div>
      <div style="flex:1;display:flex;flex-direction:column;gap:12px;">
        <div class="skeleton-card" style="height:32px;width:70%;"></div>
        <div class="skeleton-card" style="height:20px;width:40%;"></div>
        <div class="skeleton-card" style="height:100px;width:100%;"></div>
      </div>
    </div>`;
  movieModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const ck = `d:${imdbID}`;
  let data = cacheGet(ck);

  if (!data) {
    try {
      data = await fetchJSON(API.detail(imdbID));
      if (data?.Response === 'True') cacheSet(ck, data);
    } catch (err) {
      modalBody.innerHTML = `
        <div style="text-align:center;padding:30px;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size:2.5rem;color:var(--red);margin-bottom:12px;"></i>
          <h3>Couldn't load details</h3>
          <p style="color:var(--text-muted);margin-top:6px;">Check your connection and try again.</p>
        </div>`;
      return;
    }
  }

  if (data && data.Response === 'True') {
    renderMovieModalContent(data);
    updateJsonLdSchema(data);
  } else {
    modalBody.innerHTML = `<p class="modal-error">Movie details not found.</p>`;
  }
}

function createPosterPlaceholderHTML(title) {
  return `
    <div class="movie-poster-placeholder">
      <i class="fa-solid fa-film"></i>
      <span>${escHtml(title || 'CineVault')}</span>
    </div>`;
}

function renderMovieModalContent(d) {
  const posterHTML = (d.Poster && d.Poster !== 'N/A')
    ? `<img class="modal-poster" src="${escHtml(d.Poster)}" alt="${escHtml(d.Title)} poster" loading="lazy">`
    : `<div style="width:180px;height:270px;flex-shrink:0;">${createPosterPlaceholderHTML(d.Title)}</div>`;
  const isFav = isInList(STORAGE_KEYS.FAVOURITES, d.imdbID);
  const isWatch = isInList(STORAGE_KEYS.WATCHLIST, d.imdbID);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(d.Title + ' official trailer')}`;

  modalBody.innerHTML = `
    <div class="modal-header">
      ${posterHTML}
      <div class="modal-header-info">
        <h2>${escHtml(d.Title)} ${d.Year && d.Year !== 'N/A' ? `(${escHtml(d.Year)})` : ''}</h2>
        <div class="modal-meta">
          ${d.Genre && d.Genre !== 'N/A' ? `<span>${escHtml(d.Genre)}</span> · ` : ''}
          ${d.Runtime && d.Runtime !== 'N/A' ? `<span>${escHtml(d.Runtime)}</span> · ` : ''}
          ${d.Rated && d.Rated !== 'N/A' ? `<span>${escHtml(d.Rated)}</span>` : ''}
        </div>
        ${d.imdbRating && d.imdbRating !== 'N/A' ? `
          <div class="modal-rating">
            <i class="fa-solid fa-star"></i>
            <span>${escHtml(d.imdbRating)}/10</span>
            <span style="font-size:0.8rem;color:var(--text-muted);font-weight:400;">(${escHtml(d.imdbVotes || 0)} votes)</span>
          </div>` : ''}
      </div>
    </div>

    ${d.Plot && d.Plot !== 'N/A' ? `<p class="modal-plot">${escHtml(d.Plot)}</p>` : ''}
    
    <div class="modal-details-list">
      ${d.Actors && d.Actors !== 'N/A' ? `<p><strong>Cast:</strong> ${escHtml(d.Actors)}</p>` : ''}
      ${d.Director && d.Director !== 'N/A' ? `<p><strong>Director:</strong> ${escHtml(d.Director)}</p>` : ''}
      ${d.Writer && d.Writer !== 'N/A' ? `<p><strong>Writer:</strong> ${escHtml(d.Writer)}</p>` : ''}
      ${d.Awards && d.Awards !== 'N/A' ? `<p><strong>Awards:</strong> ${escHtml(d.Awards)}</p>` : ''}
    </div>

    <div class="modal-actions">
      <button class="cat-pill modal-fav-btn ${isFav ? 'active' : ''}" id="modal-fav-toggle">
        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        <span>${isFav ? 'In Favourites' : 'Add to Favourites'}</span>
      </button>
      <button class="cat-pill modal-watch-btn ${isWatch ? 'active' : ''}" id="modal-watch-toggle">
        <i class="fa-${isWatch ? 'solid' : 'regular'} fa-bookmark"></i>
        <span>${isWatch ? 'In Watchlist' : 'Add to Watchlist'}</span>
      </button>
      <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="modal-trailer-btn">
        <i class="fa-brands fa-youtube"></i> Search Trailer on YouTube ↗
      </a>
    </div>

    <!-- Category-Strict Recommendation Engine Section -->
    <div class="recommendations-section">
      <div class="recommendations-title">
        <i class="fa-solid fa-sparkles"></i>
        <span>More Like This (${escHtml(getCategoryLabelForMovie(d))})</span>
      </div>
      <div class="recommendations-grid" id="modal-recommendations-grid">
        <div class="skeleton-card" style="height:160px;"></div>
        <div class="skeleton-card" style="height:160px;"></div>
        <div class="skeleton-card" style="height:160px;"></div>
      </div>
    </div>
  `;

  // Attach Fav/Watchlist toggles
  document.getElementById('modal-fav-toggle').addEventListener('click', function() {
    const added = toggleInList(STORAGE_KEYS.FAVOURITES, d);
    this.classList.toggle('active', added);
    this.querySelector('i').className = `fa-${added ? 'solid' : 'regular'} fa-heart`;
    this.querySelector('span').textContent = added ? 'In Favourites' : 'Add to Favourites';
    updateBadges();
    showToast(added ? `Added "${d.Title}" to Favourites!` : `Removed "${d.Title}" from Favourites`, added ? 'add' : 'remove');
  });

  document.getElementById('modal-watch-toggle').addEventListener('click', function() {
    const added = toggleInList(STORAGE_KEYS.WATCHLIST, d);
    this.classList.toggle('active', added);
    this.querySelector('i').className = `fa-${added ? 'solid' : 'regular'} fa-bookmark`;
    this.querySelector('span').textContent = added ? 'In Watchlist' : 'Add to Watchlist';
    updateBadges();
    showToast(added ? `Added "${d.Title}" to Watchlist!` : `Removed "${d.Title}" from Watchlist`, added ? 'add' : 'remove');
  });

  // Load Dynamic Recommendations
  renderMovieRecommendations(d);
}

// ── Category Detection for Strict Recommendations ─────────
function detectCategoryKey(movie) {
  const id = movie.imdbID;
  for (const [key, arr] of Object.entries(CATEGORIES)) {
    if (key !== 'latest2026' && arr.includes(id)) return key;
  }
  const lang = (movie.Language || '').toLowerCase();
  const type = (movie.Type || '').toLowerCase();
  const genre = (movie.Genre || '').toLowerCase();

  if (lang.includes('gujarati')) return 'gujarati';
  if (lang.includes('hindi')) return 'bollywood';
  if (lang.includes('tamil') || lang.includes('telugu') || lang.includes('kannada') || lang.includes('malayalam')) return 'southIndian';
  if (type === 'series') return 'webSeries';
  if (genre.includes('anime') || genre.includes('animation')) return 'anime';
  return 'hollywood';
}

function getCategoryLabelForMovie(movie) {
  const key = detectCategoryKey(movie);
  return CATEGORY_NAMES[key] || 'Recommended Cinema';
}

// ── Category-Strict Recommendation Engine ───────────────
async function renderMovieRecommendations(currentMovie) {
  const recGrid = document.getElementById('modal-recommendations-grid');
  if (!recGrid) return;

  const categoryKey = detectCategoryKey(currentMovie);
  const categoryIds = (CATEGORIES[categoryKey] || CATEGORIES.hollywood)
    .filter(id => id !== currentMovie.imdbID)
    .slice(0, 4);

  try {
    const recs = await Promise.all(
      categoryIds.map(id => {
        const ck = `d:${id}`;
        const cached = cacheGet(ck);
        if (cached) return Promise.resolve(cached);
        return fetchJSON(API.detail(id)).then(res => {
          if (res?.Response === 'True' && res.Poster && res.Poster !== 'N/A') cacheSet(ck, res);
          return res;
        }).catch(() => null);
      })
    );

    const validRecs = recs.filter(r => r && r.Response === 'True' && r.Poster && r.Poster !== 'N/A');
    if (!validRecs.length) {
      recGrid.innerHTML = `<p style="font-size:0.85rem;color:var(--text-muted);">No recommendations available for this title.</p>`;
      return;
    }

    const frag = document.createDocumentFragment();
    validRecs.forEach(r => {
      const card = document.createElement('div');
      card.className = 'rec-card';
      card.innerHTML = `
        <div class="rec-card-poster-wrapper">
          <img class="rec-card-img" src="${escHtml(r.Poster)}" alt="${escHtml(r.Title)}" loading="lazy">
          <div class="category-card-overlay"></div>
        </div>
        <div class="rec-card-info">
          <div class="rec-card-title" title="${escHtml(r.Title)}">${escHtml(r.Title)}</div>
        </div>
      `;
      card.addEventListener('click', () => openMovieModal(r.imdbID));
      frag.appendChild(card);
    });

    recGrid.innerHTML = '';
    recGrid.appendChild(frag);
  } catch (err) {
    recGrid.innerHTML = `<p style="font-size:0.85rem;color:var(--text-muted);">Could not load recommendations.</p>`;
  }
}

// ── SEO JSON-LD Microdata Generator ────────────────────────
function updateJsonLdSchema(movie) {
  if (!jsonldSchemaEl) return;
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.Title,
    "image": movie.Poster !== 'N/A' ? movie.Poster : undefined,
    "datePublished": movie.Released !== 'N/A' ? movie.Released : movie.Year,
    "description": movie.Plot !== 'N/A' ? movie.Plot : undefined,
    "director": movie.Director !== 'N/A' ? { "@type": "Person", "name": movie.Director } : undefined,
    "aggregateRating": movie.imdbRating !== 'N/A' ? {
      "@type": "AggregateRating",
      "ratingValue": movie.imdbRating,
      "bestRating": "10",
      "ratingCount": movie.imdbVotes ? movie.imdbVotes.replace(/,/g, '') : "100"
    } : undefined
  };
  jsonldSchemaEl.textContent = JSON.stringify(schemaData, null, 2);
}

function closeMovieModal() {
  if (!movieModal) return;
  movieModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ============================================================
//  PAGE ROUTING
// ============================================================
function showHomePage() {
  homePage.style.display = 'flex';
  detailPage.style.display = 'none';
  favPage.style.display = 'none';
}

function showSavedPage(tabKey) {
  currentSavedTab = tabKey || STORAGE_KEYS.FAVOURITES;
  homePage.style.display = 'none';
  detailPage.style.display = 'none';
  favPage.style.display = 'block';

  const isFav = currentSavedTab === STORAGE_KEYS.FAVOURITES;
  if (tabFavBtn) tabFavBtn.classList.toggle('active', isFav);
  if (tabWatchlistBtn) tabWatchlistBtn.classList.toggle('active', !isFav);

  const sub = document.getElementById('saved-sub-text');
  if (sub) sub.textContent = isFav ? 'Your curated collection of favourite films' : 'Your saved watchlist for upcoming movie nights';

  if (typeof mbnavFav !== 'undefined' && isFav) setActiveMbNav(mbnavFav);
  if (typeof mbnavWatchlist !== 'undefined' && !isFav) setActiveMbNav(mbnavWatchlist);

  renderSavedList();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  SAVED ITEMS (FAVOURITES & WATCHLIST)
// ============================================================
function updateBadges() {
  const favCount = getList(STORAGE_KEYS.FAVOURITES).length;
  const watchCount = getList(STORAGE_KEYS.WATCHLIST).length;

  if (favBadge) {
    favBadge.style.display = favCount > 0 ? 'flex' : 'none';
    favBadge.textContent = favCount > 99 ? '99+' : String(favCount);
  }
  if (watchlistBadge) {
    watchlistBadge.style.display = watchCount > 0 ? 'flex' : 'none';
    watchlistBadge.textContent = watchCount > 99 ? '99+' : String(watchCount);
  }
}

function renderSavedList() {
  const list = getList(currentSavedTab);
  favListEl.innerHTML = '';
  const isFav = currentSavedTab === STORAGE_KEYS.FAVOURITES;

  favEmpty.style.display = list.length ? 'none' : 'flex';
  const emptyIcon = document.getElementById('fav-empty-icon');
  const emptyTitle = document.getElementById('fav-empty-title');
  const emptyDesc = document.getElementById('fav-empty-desc');

  if (emptyIcon && emptyTitle && emptyDesc) {
    emptyIcon.className = `fa-regular ${isFav ? 'fa-heart' : 'fa-bookmark'} fav-empty-icon`;
    emptyTitle.textContent = isFav ? 'No favourites yet' : 'Your watchlist is empty';
    emptyDesc.textContent = isFav
      ? 'Search for a movie and click the heart icon to save it here.'
      : 'Search for a movie and click the bookmark icon to add it to your watchlist.';
  }

  if (!list.length) return;

  const frag = document.createDocumentFragment();

  list.forEach((mv, idx) => {
    const card = document.createElement('div');
    card.className = 'fav-card category-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.style.animationDelay = `${idx * 0.04}s`;
    const id = mv.imdbID || mv.id;

    const posterSrc = mv.Poster || mv.poster || '';
    const posterHTML = (posterSrc && posterSrc !== 'N/A')
      ? `<img class="category-card-img fav-card-img" src="${escHtml(posterSrc)}" alt="${escHtml(mv.Title || mv.title || '')}" loading="lazy" onload="this.classList.add('loaded')">`
      : createPosterPlaceholderHTML(mv.Title || mv.title || '');

    card.innerHTML = `
      <div class="category-card-poster-wrapper">
        ${posterHTML}
        <div class="category-card-overlay"></div>
        <button class="fav-card-remove" title="Remove" aria-label="Remove ${escHtml(mv.Title || mv.title || '')}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="category-card-info">
        <div class="category-card-title" title="${escHtml(mv.Title || mv.title || '')}">${escHtml(mv.Title || mv.title || 'Unknown')}</div>
      </div>`;

    card.addEventListener('click', e => {
      if (!e.target.closest('.fav-card-remove')) openMovieModal(id);
    });
    card.querySelector('.fav-card-remove').addEventListener('click', e => {
      e.stopPropagation();
      card.style.cssText += 'transition:all .22s ease;opacity:0;transform:scale(0.88)';
      setTimeout(() => {
        toggleInList(currentSavedTab, { imdbID: id });
        renderSavedList();
        updateBadges();
        showToast(`Removed "${mv.Title || mv.title || ''}".`, 'remove');
      }, 220);
    });
    frag.appendChild(card);
  });
  favListEl.appendChild(frag);
}

// ============================================================
//  TOAST
// ============================================================
let toastTimer;
function showToast(msg, type = 'add') {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  const icon = toastEl.querySelector('.toast-icon');
  const cfg = {
    add   : { cls:'fa-solid fa-circle-check', color:'#27ae60', border:'rgba(39,174,96,0.28)'   },
    remove: { cls:'fa-solid fa-circle-minus', color:'#e55353', border:'rgba(229,83,83,0.28)'    },
    info  : { cls:'fa-solid fa-circle-info',  color:'#6495ed', border:'rgba(100,149,237,0.28)' },
    error : { cls:'fa-solid fa-circle-xmark', color:'#e55353', border:'rgba(229,83,83,0.28)'    },
  };
  const c = cfg[type] || cfg.info;
  icon.className = `${c.cls} toast-icon`;
  icon.style.color = c.color;
  toastEl.style.borderColor = c.border;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2700);
}