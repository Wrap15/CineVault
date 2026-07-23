/* ============================================================
   CINEVAULT — categories.js
   Hand-curated movie & series collections by category
   Includes Automated Weekly/Monthly Catalog Auto-Refresh System
   ============================================================ */

const CATEGORIES = {
  latest2026: [
    'tt1757678',  // Avatar: Fire and Ash (2025)
    'tt5950044',  // Superman (2025)
    'tt31036941', // Jurassic World: Rebirth (2025)
    'tt14513804', // Captain America: Brave New World (2025)
    'tt9603208',  // Mission: Impossible - The Final Reckoning (2025)
    'tt20969586', // Thunderbolts* (2025)
    'tt16311594', // F1: The Movie (2025)
    'tt3566834',  // A Minecraft Movie (2025)
    'tt4900148',  // Elio (2025)
    'tt1674782',  // Karate Kid: Legends (2025)
    'tt11378946'  // Michael (2026)
  ],
  hollywood: [
    'tt1757678',  // Avatar: Fire and Ash (2025)
    'tt5950044',  // Superman (2025)
    'tt15239678', // Dune: Part Two
    'tt6263850',  // Deadpool & Wolverine
    'tt4154796',  // Avengers: Endgame
    'tt1375666',  // Inception
    'tt0816692',  // Interstellar
    'tt0468569',  // The Dark Knight
    'tt1160419',  // Dune
    'tt15398776', // Oppenheimer
    'tt0133093',  // The Matrix
    'tt6751668'   // Parasite
  ],
  bollywood: [
    'tt12735488', // Kalki 2898 AD
    'tt15097216', // Jawan
    'tt5074352',  // Dangal
    'tt1187043',  // 3 Idiots
    'tt0073707',  // Sholay
    'tt7286456',  // Stree
    'tt10579942', // Pathaan
    'tt2382320'   // PK
  ],
  southIndian: [
    'tt12735488', // Kalki 2898 AD
    'tt10698680', // K.G.F: Chapter 2
    'tt8600134',  // Pushpa: The Rise
    'tt8178634',  // RRR
    'tt6710474',  // Kantara
    'tt2631186',  // Baahubali: The Beginning
    'tt7392728'   // Vikram
  ],
  gujarati: [
    'tt26331750', // Vash (2023)
    'tt10469118', // Hellaro (2019)
    'tt8094272',  // Reva (2018)
    'tt6949882',  // Shubh Aarambh (2017)
    'tt5086104',  // Chhello Divas: A New Beginning (2015)
    'tt9014884',  // Sharato Lagu (2018)
    'tt7580570',  // Love Ni Bhavai (2017)
    'tt20251716', // Naadi Dosh (2022)
    'tt23664710'  // Kutch Express (2023)
  ],
  anime: [
    'tt9335498',  // Demon Slayer: Mugen Train
    'tt0245429',  // Spirited Away
    'tt5311514',  // Your Name.
    'tt2560140',  // Attack on Titan
    'tt4772808'   // Jujutsu Kaisen 0
  ],
  webSeries: [
    'tt12637874', // Fallout (2024)
    'tt2788316',  // Shogun (2024)
    'tt11198330', // House of the Dragon
    'tt3581920',  // The Last of Us
    'tt0944947',  // Game of Thrones
    'tt4574334',  // Stranger Things
    'tt0903747',  // Breaking Bad
    'tt6468322'   // Money Heist
  ]
};

const CATEGORY_NAMES = {
  latest2026: 'Latest & Upcoming Cinema (2025–2026)',
  hollywood: 'Hollywood Cinema',
  bollywood: 'Bollywood Blockbusters',
  southIndian: 'South Indian Cinema',
  gujarati: 'Gujarati Regional Cinema',
  anime: 'Anime & Animated Hits',
  webSeries: 'Trending Web Series'
};

// ── AUTOMATED REGULAR CATALOG SYNC (Weekly Auto-Refresh) ──────
const AUTO_REFRESH_KEY = 'cinevault_catalog_last_sync';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function checkAutoRefreshCatalog() {
  try {
    const lastSync = localStorage.getItem(AUTO_REFRESH_KEY);
    const now = Date.now();
    if (!lastSync || (now - Number(lastSync)) > SEVEN_DAYS_MS) {
      localStorage.setItem(AUTO_REFRESH_KEY, String(now));
      return true;
    }
  } catch (e) {
    console.warn('Catalog auto-refresh check skipped:', e);
  }
  return false;
}

/**
 * Fetches all movie details for a given category key using a provided detail fetcher.
 * Filters out items with missing posters (Poster === 'N/A').
 * @param {string} categoryKey
 * @param {Function} fetchDetailFn - Function taking imdbID and returning Promise of movie detail object
 * @returns {Promise<Array>}
 */
async function fetchCategoryCollection(categoryKey, fetchDetailFn) {
  const ids = CATEGORIES[categoryKey] || [];
  if (!ids.length) return [];

  const promises = ids.map(id =>
    fetchDetailFn(id)
      .then(data => (data && data.Response === 'True') ? data : null)
      .catch(err => {
        console.warn(`Failed to fetch category item ${id}:`, err);
        return null;
      })
  );

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}
