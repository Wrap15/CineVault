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
  { imdbID: 'tt5950044', Title: 'Superman', Year: '2025', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BNzBhNzQ2ZDYtNTRmYi00YjVjLTgwYWUtOTg0YzAyYTBiYjkwXkEyXkFqcGc@._V1_SX300.jpg' },
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
  { imdbID: 'tt5086104', Title: 'Chhello Divas', Year: '2015', Type: 'movie', Poster: 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg' },
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

const POSTER_FALLBACK = {
  'tt1757678': 'https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt5950044': 'https://m.media-amazon.com/images/M/MV5BOGMwZGJiM2EtMzEwZC00YTYzLWIxNzYtMmJmZWNlZjgxZTMwXkEyXkFqcGc@._V1_QL75_UY562_CR35,0,380,562_.jpg',
  'tt31036941': 'https://m.media-amazon.com/images/M/MV5BNjg2NTcwYWQtYzk4NS00MTJhLWEzZjItMzIxNjk3YzlkYzU0XkEyXkFqcGc@._V1_QL75_UY562_CR0,0,380,562_.jpg',
  'tt14513804': 'https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
  'tt9603208': 'https://m.media-amazon.com/images/M/MV5BZGQ5NGEyYTItMjNiMi00Y2EwLTkzOWItMjc5YjJiMjMyNTI0XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt20969586': 'https://m.media-amazon.com/images/M/MV5BNDIzNGUwZmYtODM0Yy00NjA3LTgxOGUtOTY0ZGM5MjBkM2I3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt16311594': 'https://m.media-amazon.com/images/M/MV5BNGI0MDI4NjEtOWU3ZS00ODQyLWFhYTgtNGYxM2ZkM2Q2YjE3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt3566834': 'https://m.media-amazon.com/images/M/MV5BYzFjMzNjOTktNDBlNy00YWZhLWExYTctZDcxNDA4OWVhOTJjXkEyXkFqcGc@._V1_SX300.jpg',
  'tt4900148': 'https://m.media-amazon.com/images/M/MV5BOWE5ZDMyMWEtOTZjMi00YzFhLWE4OTEtNDc3MDMzZjFmMmIzXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt1674782': 'https://m.media-amazon.com/images/M/MV5BM2MwYTlkY2MtNmUzNy00MTljLThjNDAtZGUzNzMxMzcxNzM5XkEyXkFqcGc@._V1_SX300.jpg',
  'tt11378946': 'https://m.media-amazon.com/images/M/MV5BNzllNmRlN2EtMDQyOC00ODJjLTg4OWQtZDNmNGU3YzlkNjc1XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt12584954': 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg',
  'tt10676048': 'https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_SX300.jpg',
  'tt15239678': 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt6263850': 'https://m.media-amazon.com/images/M/MV5BZTk5ODY0MmQtMzA3Ni00NGY1LThiYzItZThiNjFiNDM4MTM3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt4154796': 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt1375666': 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt0816692': 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt0468569': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt1160419': 'https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_QL75_UY562_CR1,0,380,562_.jpg',
  'tt15398776': 'https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt0133093': 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
  'tt6751668': 'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX300.jpg',
  'tt0461936': 'https://m.media-amazon.com/images/M/MV5BYjBmOTg2NTgtZTc2Mi00ZWRhLTkzMWQtMDI0YThhZTcyMzYwXkEyXkFqcGc@._V1_SX300.jpg',
  'tt1285241': 'https://m.media-amazon.com/images/M/MV5BOTc3YmI2OTgtMTBmMi00Y2FmLWJjNGUtZTJjOGI1NDVlMDY5XkEyXkFqcGc@._V1_SX300.jpg',
  'tt0077451': 'https://m.media-amazon.com/images/M/MV5BNDIyN2U3NDItZjFlYy00OWQ4LTg4Y2UtOGU2OGU5MWE5MmZhXkEyXkFqcGc@._V1_SX300.jpg',
  'tt12735488': 'https://m.media-amazon.com/images/M/MV5BMTM3ZGUwYTEtZTI5NS00ZmMyLTk2YmQtMWU4YjlhZTI3NjRjXkEyXkFqcGc@._V1_SX300.jpg',
  'tt15097216': 'https://m.media-amazon.com/images/M/MV5BZjEyNDIzNmEtMjdkYS00ZDAwLTljOWYtNDRhYTVhYTlmOTk1XkEyXkFqcGc@._V1_SX300.jpg',
  'tt5074352': 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg',
  'tt1187043': 'https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_SX300.jpg',
  'tt0073707': 'https://m.media-amazon.com/images/M/MV5BNmI1NTRmMWQtNDJlZC00MGIzLWEwYzctYTQwNTI2NWNjM2MwXkEyXkFqcGc@._V1_SX300.jpg',
  'tt7286456': 'https://m.media-amazon.com/images/M/MV5BNzY3OWQ5NDktNWQ2OC00ZjdlLThkMmItMDhhNDk3NTFiZGU4XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt10579942': 'https://m.media-amazon.com/images/M/MV5BMmJlYzg2NTEtZmRiNS00YzhkLThiNDYtYzQyZTRkNzA3NTI1XkEyXkFqcGdeQXVyMjE4MzQ2OTQ@._V1_SX300.jpg',
  'tt2382320': 'https://m.media-amazon.com/images/M/MV5BZGZiOGZhZDQtZmRkNy00ZmUzLTliMGEtZGU0NjExOGMxZDVkXkEyXkFqcGc@._V1_SX300.jpg',
  'tt10698680': 'https://m.media-amazon.com/images/M/MV5BZmQzZjVkZTUtYjI4ZC00ZDJmLWI0ZDUtZTFmMGM1Mzc5ZjIyXkEyXkFqcGc@._V1_SX300.jpg',
  'tt8600134': 'https://m.media-amazon.com/images/M/MV5BMmQ4YjBkODgtZDMzYi00ZDYzLWEyN2ItNDBjN2VlMDNlZWYyXkEyXkFqcGc@._V1_SX300.jpg',
  'tt8178634': 'https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_SX300.jpg',
  'tt6710474': 'https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
  'tt2631186': 'https://m.media-amazon.com/images/M/MV5BM2YxZThhZmEtYzM0Yi00OWYxLWI4NGYtM2Y2ZDNmOGE0ZWQzXkEyXkFqcGc@._V1_SX300.jpg',
  'tt7392728': 'https://m.media-amazon.com/images/M/MV5BMmJhYjBkZGYtNWQwYi00NWVhLWE4NWQtOTc5ZGU5NmEwOGQ5XkEyXkFqcGc@._V1_SX300.jpg',
  'tt26331750': 'https://m.media-amazon.com/images/M/MV5BZDM3YmMxYWYtMWVmYy00ZGRmLWJhZTAtYTI0OWRjOTY1ZmQ5XkEyXkFqcGc@._V1_SX300.jpg',
  'tt10469118': 'https://m.media-amazon.com/images/M/MV5BNTRkYzEwMDctODM5YS00NzRhLWE3YjgtMzc0MGYwODQ2NjgwXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg',
  'tt8094272': 'https://m.media-amazon.com/images/M/MV5BOTkzMDFlNWUtMmM2Ni00ZjIwLTkzZmUtYTY5YTA0NDBkOTZjXkEyXkFqcGdeQXVyNTk4MzQ3MjY@._V1_SX300.jpg',
  'tt6949882': 'https://m.media-amazon.com/images/M/MV5BNWY4NjNiNmEtNTljYi00YzU3LTk3ODAtNGI1Y2NmOThiMmNmXkEyXkFqcGdeQXVyMjc1Mzc5Mzg@._V1_SX300.jpg',
  'tt5086104': 'https://m.media-amazon.com/images/M/MV5BYmZkNWNjZGEtMTQ0MC00MTJjLTgyMWQtMGZkNDhiOTRmNGQxXkEyXkFqcGc@._V1_SX300.jpg',
  'tt9014884': 'https://m.media-amazon.com/images/M/MV5BMjY5MTQ4MDgtZDc4ZC00ODA3LWJlYjAtMTc3MzJhNDIxMDBlXkEyXkFqcGdeQXVyNDAyMjYyMzQ@._V1_SX300.jpg',
  'tt7580570': 'https://m.media-amazon.com/images/M/MV5BNmEzYjg3ODEtOGFjMi00MDlkLTk4NzMtNzg0OGZlZmNiYjY5XkEyXkFqcGdeQXVyNDAyMjYyMzQ@._V1_SX300.jpg',
  'tt20251716': 'https://m.media-amazon.com/images/M/MV5BOTIwNTZhYjMtM2EyNS00YmFkLTllYWUtNzRhYzhjOWI3ODQ2XkEyXkFqcGdeQXVyMTUyOTU3MjUy._V1_SX300.jpg',
  'tt23664710': 'https://m.media-amazon.com/images/M/MV5BZTg5Y2FhMzctZGY3NS00ZjZmLWEzOTktOWJlNTM3NTU1ZjliXkEyXkFqcGc@._V1_SX300.jpg',
  'tt9335498': 'https://m.media-amazon.com/images/M/MV5BMWU1OGEwNmQtNGM3MS00YTYyLThmYmMtN2FjYzQzNzNmNTE0XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
  'tt0245429': 'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzjRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt5311514': 'https://m.media-amazon.com/images/M/MV5BMjI1ODZkYTgtYTY3Yy00ZTJkLWFkOTgtZDUyYWM4MzQwNjk0XkEyXkFqcGc@._V1_SX300.jpg',
  'tt2560140': 'https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_QL75_UY562_CR9,0,380,562_.jpg',
  'tt4772808': 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg',
  'tt12637874': 'https://m.media-amazon.com/images/M/MV5BYzE1MTZmY2ItMTgxNi00OGU5LTk4NTItMmY2ODFhYzhjZjRkXkEyXkFqcGc@._V1_QL75_UX380_CR0,57,380,562_.jpg',
  'tt2788316': 'https://m.media-amazon.com/images/M/MV5BZmJkMDRjYzEtMWI3Ny00OWE3LWJlNTItMGQ1MTQzMzc3NDY5XkEyXkFqcGc@._V1_SX300.jpg',
  'tt11198330': 'https://m.media-amazon.com/images/M/MV5BZGM4MTczODQtNGIxOC00Y2U2LTk1YmItNzA2N2VhYmE0Y2YwXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt3581920': 'https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  'tt0944947': 'https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_QL75_UX380_CR0,3,380,562_.jpg',
  'tt4574334': 'https://m.media-amazon.com/images/M/MV5BNjRiMTA4NWUtNmE0ZC00NGM0LWJhMDUtZWIzMDM5ZDIzNTg3XkEyXkFqcGc@._V1_QL75_UY562_CR35,0,380,562_.jpg',
  'tt0903747': 'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
  'tt6468322': 'https://m.media-amazon.com/images/M/MV5BZjkxZWJiNTUtYjQwYS00MTBlLTgwODQtM2FkNWMyMjMwOGZiXkEyXkFqcGc@._V1_QL75_UX380_CR0,5,380,562_.jpg'
};

/**
 * Daily Movie Rotator Engine:
 * Shifts array order based on current calendar day so every single day
 * users receive freshly updated movies at the top of each genre!
 */
function getDailyRotatedCollection(categoryKey) {
  const ids = CATEGORIES[categoryKey] || CATEGORIES.latest2026;
  if (!ids.length) return [];
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const shift = dayOfYear % ids.length;
  return [...ids.slice(shift), ...ids.slice(0, shift)];
}

/**
 * Fetches all movie details for a given category key using a provided detail fetcher.
 * Guarantees zero empty screens by applying title and poster fallbacks and daily rotation.
 * @param {string} categoryKey
 * @param {Function} fetchDetailFn - Function taking imdbID and returning Promise of movie detail object
 * @returns {Promise<Array>}
 */
async function fetchCategoryCollection(categoryKey, fetchDetailFn) {
  const ids = getDailyRotatedCollection(categoryKey);
  if (!ids.length) return [];

  const promises = ids.map(id =>
    fetchDetailFn(id)
      .then(data => {
        if (data && data.Response === 'True' && data.Poster && data.Poster !== 'N/A') return data;
        const fallbackPoster = POSTER_FALLBACK[id] || 'https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_SX600.jpg';
        return {
          imdbID: id,
          Title: (data && data.Title && data.Title !== 'N/A') ? data.Title : (TITLES_FALLBACK[id] || 'CineVault Cinema'),
          Year: (data && data.Year && data.Year !== 'N/A') ? data.Year : '2025',
          Poster: (data && data.Poster && data.Poster !== 'N/A') ? data.Poster : fallbackPoster,
          imdbRating: (data && data.imdbRating && data.imdbRating !== 'N/A') ? data.imdbRating : '8.5',
          Response: 'True'
        };
      })
      .catch(() => {
        return {
          imdbID: id,
          Title: TITLES_FALLBACK[id] || 'CineVault Cinema',
          Year: '2025',
          Poster: POSTER_FALLBACK[id] || 'https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_SX600.jpg',
          imdbRating: '8.5',
          Response: 'True'
        };
      })
  );

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}
