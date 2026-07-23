/* ============================================================
   CINEVAULT — categories.js
   Hand-curated movie & series collections per category
   Includes Rich Local Search Catalog & Fuzzy Search Engine
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
    'tt0461936',  // Don (2006 - Shah Rukh Khan)
    'tt1285241',  // Don 2 (2011)
    'tt0077451',  // Don (1978 - Amitabh Bachchan)
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

const TITLES_FALLBACK = {
  'tt0461936': 'Don (2006)',
  'tt1285241': 'Don 2 (2011)',
  'tt0077451': 'Don (1978)',
  'tt28630043': 'Don 3',
  'tt2229499': 'Don Jon',
  'tt1757678': 'Avatar: Fire and Ash',
  'tt0499549': 'Avatar',
  'tt1630029': 'Avatar: The Way of Water',
  'tt5950044': 'Superman',
  'tt31036941': 'Jurassic World: Rebirth',
  'tt14513804': 'Captain America: Brave New World',
  'tt9603208': 'Mission: Impossible - The Final Reckoning',
  'tt20969586': 'Thunderbolts*',
  'tt16311594': 'F1',
  'tt3566834': 'A Minecraft Movie',
  'tt4900148': 'Elio',
  'tt1674782': 'Karate Kid: Legends',
  'tt11378946': 'Michael',
  'tt15239678': 'Dune: Part Two',
  'tt6263850': 'Deadpool & Wolverine',
  'tt4154796': 'Avengers: Endgame',
  'tt0848228': 'The Avengers',
  'tt1375666': 'Inception',
  'tt0816692': 'Interstellar',
  'tt0468569': 'The Dark Knight',
  'tt1160419': 'Dune',
  'tt15398776': 'Oppenheimer',
  'tt0133093': 'The Matrix',
  'tt6751668': 'Parasite',
  'tt12735488': 'Kalki 2898 AD',
  'tt15097216': 'Jawan',
  'tt5074352': 'Dangal',
  'tt1187043': '3 Idiots',
  'tt0073707': 'Sholay',
  'tt7286456': 'Stree',
  'tt10579942': 'Pathaan',
  'tt2382320': 'PK',
  'tt10698680': 'K.G.F: Chapter 2',
  'tt8600134': 'Pushpa: The Rise',
  'tt8178634': 'RRR',
  'tt6710474': 'Kantara',
  'tt2631186': 'Baahubali: The Beginning',
  'tt7392728': 'Vikram',
  'tt26331750': 'Vash',
  'tt10469118': 'Hellaro',
  'tt8094272': 'Reva',
  'tt6949882': 'Shubh Aarambh',
  'tt5086104': 'Chhello Divas',
  'tt9014884': 'Sharato Lagu',
  'tt7580570': 'Love Ni Bhavai',
  'tt20251716': 'Naadi Dosh',
  'tt23664710': 'Kutch Express',
  'tt9335498': 'Demon Slayer: Mugen Train',
  'tt0245429': 'Spirited Away',
  'tt5311514': 'Your Name.',
  'tt2560140': 'Attack on Titan',
  'tt4772808': 'Jujutsu Kaisen 0',
  'tt12637874': 'Fallout',
  'tt2788316': 'Shogun',
  'tt11198330': 'House of the Dragon',
  'tt3581920': 'The Last of Us',
  'tt0944947': 'Game of Thrones',
  'tt4574334': 'Stranger Things',
  'tt0903747': 'Breaking Bad',
  'tt6468322': 'Money Heist'
};

// Rich local catalog database for instant search fallback
const LOCAL_FULL_CATALOG = [
  { imdbID: 'tt0461936', Title: 'Don', Year: '2006', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BYjBmOTg2NTgtZTc2Mi00ZWRhLTkzMWQtMDI0YThhZTcyMzYwXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt1285241', Title: 'Don 2', Year: '2011', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BOTc3YmI2OTgtMTBmMi00Y2FmLWJjNGUtZTJjOGI1NDVlMDY5XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt0077451', Title: 'Don', Year: '1978', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNDIyN2U3NDItZjFlYy00OWQ4LTg4Y2UtOGU2OGU5MWE5MmZhXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt2229499', Title: 'Don Jon', Year: '2013', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNDgwMTU2NDctODI0YS00ZmIxLWFiNjEtZDI2ZGE3NWFlZDY2XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt1757678', Title: 'Avatar: Fire and Ash', Year: '2025', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt5950044', Title: 'Superman', Year: '2025', Type: 'movie', Poster: 'N/A' },
  { imdbID: 'tt10579942', Title: 'Pathaan', Year: '2023', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BM2FiMTNiODctNWZlNy00YzhhLThlYjMtNmZlYWY1MTNlMGEyXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt15097216', Title: 'Jawan', Year: '2023', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMjA1NmRkZWYtNGFiZS00Mzc2LWE4NjctOTA5ZWFlMWJmMjVlXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt12735488', Title: 'Kalki 2898 AD', Year: '2024', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BYzA2N2U5MTgtNTg2OS00ZGI3LWI0NTYtMDQyOTM0OWYyNWZkXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt4154796', Title: 'Avengers: Endgame', Year: '2019', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg' },
  { imdbID: 'tt0848228', Title: 'The Avengers', Year: '2012', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMTk2NTI1NjU4N15BMl5BanBnXkFtZTcwODg0OTY0Nw@@._V1_SX300.jpg' },
  { imdbID: 'tt10872600', Title: 'Spider-Man: No Way Home', Year: '2021', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt9362722', Title: 'Spider-Man: Across the Spider-Verse', Year: '2023', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg' },
  { imdbID: 'tt0372784', Title: 'Batman Begins', Year: '2005', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BOT14NTAxZDItNzc5MS00ZTIyLTgwNWEtZGZhZDg4MmU3OTYwXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg' },
  { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt8600134', Title: 'Pushpa: The Rise', Year: '2021', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMmQ4YjBkODgtZDMzYi00ZDYzLWEyN2ItNDBjN2VlMDNlZWYyXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt8178634', Title: 'RRR', Year: '2022', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5M2VlNDZMGY2XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt10698680', Title: 'K.G.F: Chapter 2', Year: '2022', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMjA2MDU3ZWItMjA4Ny00MGNmLWFhY2MtZWI0OTc1ZmNmMmJkXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt0073707', Title: 'Sholay', Year: '1975', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNmE5Zjg3ZTEtNWU4Zi00YzBhLWEzNWEtNDdhNjg2Zjg2NjI1XkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt5074352', Title: 'Dangal', Year: '2016', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg' },
  { imdbID: 'tt1187043', Title: '3 Idiots', Year: '2009', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2GzZlNzhiXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt26331750', Title: 'Vash', Year: '2023', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BZDAyMDM0MzEtN2JmNS00Nzg2LWEyYTAtNDU2OTM5YTdhZmNhXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt5086104', Title: 'Chhello Divas', Year: '2015', Type: 'movie', Poster: 'N/A' },
  { imdbID: 'tt9335498', Title: 'Demon Slayer: Mugen Train', Year: '2020', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BODI2NjdlYWItMTE1ZC00YzI2LTlhZGQtNzE3NzA4Mzc0ZWNhXkEyXkFqcGc@._V1_SX300.jpg' },
  { imdbID: 'tt12637874', Title: 'Fallout', Year: '2024', Type: 'series', Poster: 'https://m.media-amazon.com/images/M/MV5BN2FmODJmN2QtNmMxZi00ZmE1LWIxOWQtZTU3N2FmMTNhN2ZlXkEyXkFqcGc@._V1_SX300.jpg' }
];

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
    if (!lastSync || (now - parseInt(lastSync, 10)) > SEVEN_DAYS_MS) {
      localStorage.setItem(AUTO_REFRESH_KEY, now.toString());
      return true;
    }
  } catch (e) {
    console.warn('Catalog auto-refresh check skipped:', e);
  }
  return false;
}

/**
 * Local Catalog Fuzzy Search Engine.
 * Executes token matching and edit distance check when OMDb is rate limited or spelling is imperfect.
 */
function searchLocalCatalog(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const results = [];
  const addedIds = new Set();

  LOCAL_FULL_CATALOG.forEach(m => {
    const title = (m.Title || '').toLowerCase();
    const id = m.imdbID || m.id;

    if (addedIds.has(id)) return;

    if (title.includes(q) || q.includes(title) || isFuzzyMatch(q, title)) {
      addedIds.add(id);
      results.push(m);
    }
  });

  return results;
}

function isFuzzyMatch(str1, str2) {
  if (!str1 || !str2) return false;
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s2.includes(s1) || s1.includes(s2)) return true;

  if (s1.length >= 3 && s2.length >= 3) {
    if (s1.slice(0, 3) === s2.slice(0, 3)) return true;
    if (levenshteinDistance(s1, s2) <= 2) return true;
  }
  return false;
}

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Fetches all movie details for a given category key using a provided detail fetcher.
 * Guarantees zero empty screens by applying title fallbacks.
 * @param {string} categoryKey
 * @param {Function} fetchDetailFn - Function taking imdbID and returning Promise of movie detail object
 * @returns {Promise<Array>}
 */
async function fetchCategoryCollection(categoryKey, fetchDetailFn) {
  const ids = CATEGORIES[categoryKey] || [];
  if (!ids.length) return [];

  const promises = ids.map(id =>
    fetchDetailFn(id)
      .then(data => (data && data.Response === 'True') ? data : { imdbID: id, Title: TITLES_FALLBACK[id] || 'CineVault Cinema', Year: '', Poster: 'N/A', Response: 'True' })
      .catch(() => {
        return { imdbID: id, Title: TITLES_FALLBACK[id] || 'CineVault Cinema', Year: '', Poster: 'N/A', Response: 'True' };
      })
  );

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}
