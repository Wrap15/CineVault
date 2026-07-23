/* ============================================================
   CINEVAULT — storage.js
   LocalStorage management for Favourites, Watchlist, User Ratings & Search History
   ============================================================ */

const STORAGE_KEYS = {
  FAVOURITES: 'cinevault_favourites',
  WATCHLIST: 'cinevault_watchlist',
  USER_RATINGS: 'cinevault_user_ratings'
};

// Automatic migration for legacy 'cv_movies' key if present
(function migrateOldFavs() {
  try {
    const old = localStorage.getItem('cv_movies');
    if (old) {
      const parsed = JSON.parse(old);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVOURITES)) || [];
        const combinedMap = new Map();
        existingFavs.forEach(m => {
          const id = m.imdbID || m.id;
          if (id) combinedMap.set(id, m);
        });
        parsed.forEach(m => {
          const id = m.imdbID || m.id;
          if (id && !combinedMap.has(id)) {
            combinedMap.set(id, {
              imdbID: id,
              Title: m.Title || m.title || '',
              Year: m.Year || m.year || '',
              Poster: m.Poster || m.poster || '',
              Type: m.Type || m.type || 'movie'
            });
          }
        });
        localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(Array.from(combinedMap.values())));
      }
      localStorage.removeItem('cv_movies');
    }
  } catch (e) {
    console.warn('Storage migration skipped:', e);
  }
})();

function getList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

function isInList(key, imdbID) {
  if (!imdbID) return false;
  return getList(key).some(m => (m.imdbID === imdbID || m.id === imdbID));
}

function toggleInList(key, movie) {
  const list = getList(key);
  const id = movie.imdbID || movie.id;
  if (!id) return false;

  const idx = list.findIndex(m => (m.imdbID === id || m.id === id));
  const movieObj = {
    imdbID: id,
    Title: movie.Title || movie.title || '',
    Year: movie.Year || movie.year || '',
    Poster: (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : (movie.poster || ''),
    Type: movie.Type || movie.type || 'movie'
  };

  if (idx === -1) {
    list.push(movieObj);
  } else {
    list.splice(idx, 1);
  }
  saveList(key, list);
  return idx === -1;
}

function clearList(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to clear list:', e);
  }
}



// ── USER RATINGS & REVIEWS ──────────────────────────────────
function getUserRatings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_RATINGS)) || {};
  } catch (e) {
    return {};
  }
}

function getUserRating(imdbID) {
  const ratings = getUserRatings();
  return ratings[imdbID] || null;
}

function saveUserRating(imdbID, score, note = '') {
  const ratings = getUserRatings();
  if (score > 0) {
    ratings[imdbID] = {
      score: Number(score),
      note: String(note).trim(),
      updatedAt: new Date().toISOString()
    };
  } else {
    delete ratings[imdbID];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.USER_RATINGS, JSON.stringify(ratings));
  } catch (e) {
    console.error('Failed to save rating:', e);
  }
}

// ── SAAS DATA BACKUP & RESTORE ──────────────────────────────
function exportUserData() {
  const data = {
    favourites: getList(STORAGE_KEYS.FAVOURITES),
    watchlist: getList(STORAGE_KEYS.WATCHLIST),
    userRatings: getUserRatings(),
    exportedAt: new Date().toISOString(),
    version: '2.0'
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cinevault_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importUserData(jsonData) {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (data.favourites && Array.isArray(data.favourites)) {
      saveList(STORAGE_KEYS.FAVOURITES, data.favourites);
    }
    if (data.watchlist && Array.isArray(data.watchlist)) {
      saveList(STORAGE_KEYS.WATCHLIST, data.watchlist);
    }
    if (data.userRatings && typeof data.userRatings === 'object') {
      localStorage.setItem(STORAGE_KEYS.USER_RATINGS, JSON.stringify(data.userRatings));
    }
    return true;
  } catch (e) {
    console.error('Failed to import user data:', e);
    return false;
  }
}
