/* ============================================================
   CINEVAULT — script.js
   • AbortController  — cancels stale requests
   • LRU cache (50)   — instant repeat searches
   • 4-strategy fuzzy search
   • Passive listeners — no scroll jank
   • DocumentFragment — zero layout thrashing
   ============================================================ */

// ── API ────────────────────────────────────────────────────
const API = {
  search: (q, y) => `https://www.omdbapi.com/?s=${encodeURIComponent(q)}&page=1${y ? `&y=${y}` : ''}&apikey=94397865`,
  detail: id => `https://www.omdbapi.com/?i=${id}&apikey=91b5e14f`,
};

// ── LRU CACHE ──────────────────────────────────────────────
const _cache = new Map();
function cacheGet(k) { return _cache.get(k) ?? null; }
function cacheSet(k, v) {
  if (_cache.size >= 50) _cache.delete(_cache.keys().next().value);
  _cache.set(k, v);
}

// ── FETCH ──────────────────────────────────────────────────
async function fetchJSON(url, signal) {
  const res = await fetch(url, signal ? { signal } : {});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── ABORT CONTROLLERS ──────────────────────────────────────
let searchCtrl = null;
let detailCtrl = null;

// ── DEBOUNCE ───────────────────────────────────────────────
function debounce(fn, ms) {
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
    favListEl, favEmpty, favBadge,
    toastEl, toastMsg, navbar,
    clearBtn, submitBtn,
    navLogoBtn, detailBackBtn, navFavBtn,
    favCloseBtn, favClearAllBtn,
    navSearchToggle, navSearchInline, navSearchInput,
    quickTagsEl, themeToggleBtn, themeIcon;

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
  toastEl          = $('toast');
  toastMsg         = $('toast-msg');
  navbar           = $('navbar');
  clearBtn         = $('search-clear-btn');
  submitBtn        = $('search-submit-btn');
  navLogoBtn       = $('nav-logo-btn');
  detailBackBtn    = $('detail-back-btn');
  navFavBtn        = $('nav-fav-btn');
  favCloseBtn      = $('fav-close-btn');
  favClearAllBtn   = $('fav-clear-all-btn');
  navSearchToggle  = $('nav-search-toggle');
  navSearchInline  = $('nav-search-inline');
  navSearchInput   = $('nav-search-input');
  quickTagsEl      = $('quick-tags');
  themeToggleBtn   = $('theme-toggle-btn');
  themeIcon        = $('theme-icon');

  const fyEl = $('footer-year');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  initTheme();
  updateFavBadge();
  showHomePage();
  initParticles();
  attachListeners();
  initReveal();
  handleDeepLinking();
});

function handleDeepLinking() {
  try {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (movieId && movieId.startsWith('tt')) {
      openMovieDetail(movieId);
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
  const COUNT = isMobile ? 50 : 100;
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
    if (themeIcon) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
  } else {
    document.body.classList.remove('light-theme');
    if (themeIcon) {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
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

//  TRENDING TAGS — reliable inline-style show / hide
// ============================================================
function hideQuickTags() {
  if (!quickTagsEl) return;
  quickTagsEl.style.display = 'none';
}
function showQuickTags() {
  if (!quickTagsEl) return;
  quickTagsEl.style.display = 'flex';
}

// ============================================================
//  SEARCH LIST — show / hide
// ============================================================
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

  const debouncedLoad = debounce(val => loadMovies(val), 260);

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

  // Clear button
  clearBtn.addEventListener('click', () => {
    movieSearchBox.value = '';
    clearBtn.style.display = 'none';
    if (searchCtrl) { searchCtrl.abort(); searchCtrl = null; }
    hideSearchList();
    movieSearchBox.focus();
  });

  // Submit button
  submitBtn.addEventListener('click', () => {
    const val = movieSearchBox.value.trim();
    if (val.length > 1) { hideQuickTags(); loadMovies(val); }
  });

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
    }, 260));
  }

  // Click outside → close
  document.addEventListener('click', e => {
    if (!e.target.closest('#search-bar') && !e.target.closest('#search-list')) hideSearchList();
  }, { passive: true });

  // Escape → close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { hideSearchList(); movieSearchBox.blur(); }
  });

  // Navigation
  navLogoBtn.addEventListener('click',     goHome);
  navLogoBtn.addEventListener('keydown',   e => e.key === 'Enter' && goHome());
  detailBackBtn.addEventListener('click',  goHome);
  detailBackBtn.addEventListener('keydown',e => e.key === 'Enter' && goHome());
  navFavBtn.addEventListener('click',      showFavPage);
  favCloseBtn.addEventListener('click',    goHome);
  favClearAllBtn.addEventListener('click', () => {
    if (confirm('Clear all favourites?')) {
      localStorage.removeItem('cv_movies');
      renderFavList(); updateFavBadge();
      showToast('All favourites cleared.', 'info');
    }
  });
  navSearchToggle.addEventListener('click', () => {
    if (!navSearchInline) return;
    const hidden = navSearchInline.style.display !== 'flex';
    navSearchInline.style.display = hidden ? 'flex' : 'none';
    if (hidden && navSearchInput) navSearchInput.focus();
  });
}

function goHome() {
  showHomePage();
  movieSearchBox.value = '';
  clearBtn.style.display = 'none';
  hideSearchList();
  if (navSearchInput) navSearchInput.value = '';
}

// ============================================================
//  SEARCH API — 4-strategy fuzzy fallback
// ============================================================
async function loadMovies(term) {
  const trimmed = term.trim();
  if (!trimmed) return;

  if (searchCtrl) searchCtrl.abort();
  searchCtrl = new AbortController();
  const { signal } = searchCtrl;

  const cacheKey = `s:${trimmed.toLowerCase()}`;
  const cached   = cacheGet(cacheKey);
  if (cached) { displayMovieList(cached); return; }

  showSkeletons();

  // Extract year if present (e.g. "Avengers 2012" -> year: "2012", query: "Avengers")
  let yearParam = '';
  let queryStr = trimmed;
  const yearMatch = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) {
    yearParam = yearMatch[0];
    queryStr = trimmed.replace(yearMatch[0], '').replace(/\s+/g, ' ').trim();
  }

  try {
    // Strategy 1: exact term
    let data = await fetchJSON(API.search(queryStr, yearParam), signal);

    // Strategy 2: first word only  (e.g. "Pushpa" from "Pushpa The Rise")
    if (data.Response !== 'True' && queryStr.includes(' ')) {
      const first = queryStr.split(/\s+/)[0];
      if (first.length > 2) data = await fetchJSON(API.search(first, yearParam), signal);
    }

    // Strategy 3: strip special characters  (e.g. "KGF" from "K.G.F")
    if (data.Response !== 'True') {
      const clean = queryStr.replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '').trim();
      if (clean && clean !== queryStr) data = await fetchJSON(API.search(clean, yearParam), signal);
    }

    // Strategy 4: last significant word
    if (data.Response !== 'True' && queryStr.includes(' ')) {
      const parts = queryStr.split(/\s+/);
      const last  = parts[parts.length - 1];
      if (last.length > 3) data = await fetchJSON(API.search(last, yearParam), signal);
    }

    if (data.Response === 'True') {
      cacheSet(cacheKey, data.Search);
      displayMovieList(data.Search);
    } else {
      showNoResults(trimmed);
    }
  } catch (e) {
    if (e.name !== 'AbortError') showNoResults(trimmed);
  }
}

// ── Skeleton loader ────────────────────────────────────────
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

// ── Display results ────────────────────────────────────────
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
    // Fire all actor fetches in parallel
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
      const faved     = isInFavourites(movie.imdbID);
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
        <button class="search-fav-btn ${faved ? 'faved' : ''}"
                aria-label="${faved ? 'Remove from favourites' : 'Add to favourites'}">
          <i class="fa-${faved ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i>
        </button>`;

      item.addEventListener('click', e => {
        if (!e.target.closest('.search-fav-btn')) openMovieDetail(movie.imdbID);
      });
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.target.closest('.search-fav-btn')) openMovieDetail(movie.imdbID);
      });
      item.querySelector('.search-fav-btn').addEventListener('click', e => {
        e.stopPropagation();
        toggleFavFromSearch(movie.imdbID, poster, movie.Title, movie.Year, e.currentTarget);
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
//  MOVIE DETAIL
// ============================================================
async function openMovieDetail(imdbID) {
  hideSearchList();
  movieSearchBox.value = '';
  clearBtn.style.display = 'none';
  if (navSearchInput) navSearchInput.value = '';

  if (detailCtrl) detailCtrl.abort();
  detailCtrl = new AbortController();

  const ck   = `d:${imdbID}`;
  let   data = cacheGet(ck);

  if (!data) {
    try {
      data = await fetchJSON(API.detail(imdbID), detailCtrl.signal);
      if (data?.Response === 'True') cacheSet(ck, data);
    } catch (e) {
      if (e.name !== 'AbortError') showToast('Could not load details. Try again.', 'error');
      return;
    }
  }

  if (data?.Response === 'True') { renderMovieDetail(data); showDetailPage(); }
}

function renderMovieDetail(d) {
  const poster = d.Poster && d.Poster !== 'N/A' ? d.Poster
    : 'https://placehold.co/300x450/0f0f18/F5C518?text=No+Poster';
  const faved  = isInFavourites(d.imdbID);

  let stars = '';
  let ratingClass = 'rating-low';
  const r   = parseFloat(d.imdbRating);
  if (!isNaN(r)) {
    const full = Math.floor(r / 2), half = (r/2 - full) >= 0.5 ? 1 : 0, empty = 5 - full - half;
    stars = '<span class="imdb-stars">'
      + '<i class="fa-solid fa-star"></i>'.repeat(full)
      + (half ? '<i class="fa-solid fa-star-half-stroke"></i>' : '')
      + '<i class="fa-regular fa-star"></i>'.repeat(empty)
      + '</span>';

    if (r >= 8.0) ratingClass = 'rating-high';
    else if (r >= 6.0) ratingClass = 'rating-mid';
  }

  const genres = d.Genre && d.Genre !== 'N/A'
    ? d.Genre.split(',').map(g => `<span class="genre-tag">${escHtml(g.trim())}</span>`).join('') : '';

  const row = (label, val) => val && val !== 'N/A'
    ? `<div class="info-row"><span class="info-label">${label}</span><span class="info-value">${escHtml(val)}</span></div>` : '';

  resultGrid.innerHTML = `
    <div id="movie-image">
      <img src="${escHtml(poster)}" alt="${escHtml(d.Title)}" class="lazy-img"
           onload="this.classList.add('loaded')"
           onerror="this.src='https://placehold.co/300x450/0f0f18/F5C518?text=No+Poster';this.classList.add('loaded')">
      <div class="poster-overlay" aria-hidden="true"></div>
    </div>
    <div id="movie-info">
      <h1>${escHtml(d.Title)}</h1>
      <div class="movie-meta-row">
        ${d.Rated   && d.Rated   !== 'N/A' ? `<span class="meta-pill rating-pill"><i class="fa-solid fa-ticket"></i>${escHtml(d.Rated)}</span>` : ''}
        ${d.Year    && d.Year    !== 'N/A' ? `<span class="meta-pill year-pill"><i class="fa-solid fa-calendar"></i>${escHtml(d.Year)}</span>` : ''}
        ${d.Runtime && d.Runtime !== 'N/A' ? `<span class="meta-pill runtime-pill"><i class="fa-solid fa-clock"></i>${escHtml(d.Runtime)}</span>` : ''}
      </div>
      ${d.imdbRating && d.imdbRating !== 'N/A' ? `
        <div class="imdb-score-box">
          <div><div class="imdb-score-label">IMDb Rating</div><div>${stars}</div></div>
          <span class="imdb-score-num ${ratingClass}">${escHtml(d.imdbRating)}</span>
          <span class="imdb-score-max">/10</span>
        </div>` : ''}
      ${genres ? `<div class="genre-tags">${genres}</div>` : ''}
      <div class="detail-divider"></div>
      ${d.Plot && d.Plot !== 'N/A' ? `<p class="plot-text">${escHtml(d.Plot)}</p>` : ''}
      ${row('Director', d.Director)}
      ${row('Writers',  d.Writer)}
      ${row('Cast',     d.Actors)}
      ${row('Language', d.Language)}
      ${row('Country',  d.Country)}
      ${row('Released', d.Released)}
      ${d.Awards && d.Awards !== 'N/A' ? `<div class="awards-row"><i class="fa-solid fa-award"></i><span>${escHtml(d.Awards)}</span></div>` : ''}
      <div class="detail-actions-row">
        <button class="detail-fav-btn ${faved ? 'active' : ''}" id="detail-fav-btn">
          <i class="fa-${faved ? 'solid' : 'regular'} fa-heart"></i>
          <span>${faved ? 'Saved to Favourites' : 'Add to Favourites'}</span>
        </button>
        <a href="https://www.imdb.com/title/${d.imdbID}/" target="_blank" rel="noopener noreferrer" class="detail-imdb-link-btn">
          <i class="fa-brands fa-imdb"></i>
          <span>IMDb Page</span>
        </a>
        <button id="detail-share-btn" class="detail-share-btn">
          <i class="fa-solid fa-share-nodes"></i>
          <span>Share Link</span>
        </button>
      </div>
    </div>`;

  document.getElementById('detail-fav-btn').addEventListener('click', function() {
    toggleFavFromDetail(d, this);
  });

  document.getElementById('detail-share-btn').addEventListener('click', function() {
    const shareUrl = window.location.origin + window.location.pathname + '?id=' + d.imdbID;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Share link copied to clipboard!', 'info');
    }).catch(() => {
      showToast('Could not copy link.', 'error');
    });
  });
}

// ============================================================
//  PAGE ROUTING
// ============================================================
function showHomePage()   { homePage.style.display='flex'; detailPage.style.display='none'; favPage.style.display='none'; }
function showDetailPage() { homePage.style.display='none'; detailPage.style.display='block'; favPage.style.display='none'; window.scrollTo({top:0,behavior:'smooth'}); }
function showFavPage()    { homePage.style.display='none'; detailPage.style.display='none'; favPage.style.display='block'; window.scrollTo({top:0,behavior:'smooth'}); renderFavList(); }

// ============================================================
//  FAVOURITES
// ============================================================
function getFavs()   { try { return JSON.parse(localStorage.getItem('cv_movies')) || []; } catch { return []; } }
function saveFavs(a) { localStorage.setItem('cv_movies', JSON.stringify(a)); updateFavBadge(); }
function isInFavourites(id) { return getFavs().some(m => m.id === id); }

function toggleFavFromSearch(id, poster, title, year, btn) {
  if (isInFavourites(id)) {
    saveFavs(getFavs().filter(m => m.id !== id));
    btn.classList.remove('faved');
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    showToast(`Removed "${title}".`, 'remove');
  } else {
    const f = getFavs(); f.push({id,poster,title,year}); saveFavs(f);
    btn.classList.add('faved');
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    showToast(`"${title}" saved!`, 'add');
  }
}

function toggleFavFromDetail(d, btn) {
  if (isInFavourites(d.imdbID)) {
    saveFavs(getFavs().filter(m => m.id !== d.imdbID));
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Favourites';
    showToast('Removed from favourites.', 'remove');
  } else {
    const f = getFavs();
    f.push({id:d.imdbID, poster:d.Poster!=='N/A'?d.Poster:'', title:d.Title, year:d.Year});
    saveFavs(f);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fa-solid fa-heart"></i> Saved to Favourites';
    showToast(`"${d.Title}" saved!`, 'add');
  }
}

function updateFavBadge() {
  const n = getFavs().length;
  favBadge.style.display = n > 0 ? 'flex' : 'none';
  favBadge.textContent   = n > 99 ? '99+' : String(n);
}

function renderFavList() {
  const favs = getFavs();
  favListEl.innerHTML = '';
  favEmpty.style.display = favs.length ? 'none' : 'flex';
  if (!favs.length) return;

  const ph   = 'https://placehold.co/220x330/0f0f18/F5C518?text=No+Poster';
  const frag = document.createDocumentFragment();

  favs.forEach((mv, idx) => {
    const card = document.createElement('div');
    card.className = 'fav-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.style.animationDelay = `${idx * 0.05}s`;
    card.innerHTML = `
      <img class="fav-card-img" src="${escHtml(mv.poster || ph)}" alt="${escHtml(mv.title||'')}" loading="lazy"
           onload="this.classList.add('loaded')"
           onerror="this.src='${ph}';this.classList.add('loaded')">
      <div class="fav-card-body">
        <div class="fav-card-title">${escHtml(mv.title || 'Unknown')}</div>
        <div class="fav-card-year">${escHtml(mv.year || '')}</div>
      </div>
      <button class="fav-card-remove" aria-label="Remove ${escHtml(mv.title||'')}">
        <i class="fa-solid fa-xmark"></i>
      </button>`;

    card.addEventListener('click', e => { if (!e.target.closest('.fav-card-remove')) openMovieDetail(mv.id); });
    card.querySelector('.fav-card-remove').addEventListener('click', e => {
      e.stopPropagation();
      card.style.cssText += 'transition:all .22s ease;opacity:0;transform:scale(0.88)';
      setTimeout(() => { saveFavs(getFavs().filter(m => m.id !== mv.id)); renderFavList(); showToast(`"${mv.title}" removed.`, 'remove'); }, 220);
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