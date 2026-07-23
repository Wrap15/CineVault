# 🎬 CineVault — Production Movie & Cinema Web Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-CineVault-f5c518?style=for-the-badge&logo=google-chrome&logoColor=black)](https://wrap15.github.io/CineVault/)  
👉 **[Click Here for Live Demo](https://wrap15.github.io/CineVault/)**

**CineVault** is an IMDb-level, real-world production movie discovery web application crafted with Vanilla HTML5, CSS3, JavaScript (ES6+), and the OMDb API. Built with a desktop-first & mobile-responsive UI, glassmorphic dark/light design system, category-strict recommendation engine, and local storage watchlist/favourites persistence.

---

## 🔥 Key Features

### 1. 🌟 2025–2026 Cinema & Automated Catalog Sync
- **Latest 2025–2026 Cinema Showcase**: Verified blockbusters including *Avatar: Fire and Ash* (2025), *Superman* (2025), *Jurassic World: Rebirth* (2025), *Captain America: Brave New World* (2025), *Mission: Impossible - The Final Reckoning* (2025), *Thunderbolts\** (2025), *F1: The Movie* (2025), *A Minecraft Movie* (2025), *Elio* (2025), *Karate Kid: Legends* (2025), and *Michael* (2026).
- **Automated Weekly Catalog Sync**: Automatically tracks sync timestamps in `localStorage` and auto-refreshes the movie catalog every 7 days (weekly) with toast notifications.
- **Hand-Curated Regional Collections**:
  - **Gujarati Cinema**: *Vash*, *Hellaro*, *Reva*, *Shubh Aarambh*, *Chhello Divas: A New Beginning*, *Sharato Lagu*, *Love Ni Bhavai*, *Naadi Dosh*, *Kutch Express*.
  - **Hollywood Classics & Hits**: *Avatar 3*, *Superman*, *Endgame*, *Inception*, *Interstellar*, *The Dark Knight*, *Dune*, *Oppenheimer*.
  - **Bollywood Cinema**: *Kalki 2898 AD*, *Jawan*, *Dangal*, *3 Idiots*, *Sholay*, *Stree*, *Pathaan*, *PK*.
  - **South Indian Blockbusters**: *Kalki 2898 AD*, *K.G.F Chapter 2*, *Pushpa: The Rise*, *RRR*, *Kantara*, *Baahubali*, *Vikram*.
  - **Anime & Animated Features**: *Demon Slayer: Mugen Train*, *Spirited Away*, *Your Name.*, *Attack on Titan*, *Jujutsu Kaisen 0*.
  - **Trending Web Series**: *Fallout*, *Shogun*, *House of the Dragon*, *The Last of Us*, *Game of Thrones*, *Stranger Things*, *Breaking Bad*, *Money Heist*.

### 2. 🌟 OnlyProfit-Style Top Greeting Announcement Banner
- **5-Second Auto-Disappear Announcement Bar**: Top gradient banner (`#top-greeting-banner`) displaying real-time time-aware greetings (`Good Afternoon, Welcome to CineVault. Start Searching Your Favourites Movies! ✨`).
- **Responsive Mobile Line Height & Highlight**: Golden time greeting highlight (`<span class="greet-highlight">`) with auto-fit line height for all smartphone viewports.
- **Clean Direct Navbar Architecture**: 1-tap direct buttons in header across desktop and mobile devices for Theme Toggle, Search, Favourites, and Watchlist.

### 3. 🎯 Category-Strict Recommendation Engine ("More Like This")
- Dynamic movie modal recommendations strictly matching the industry/category of the movie being viewed (Hollywood to Hollywood, Gujarati to Gujarati, Bollywood to Bollywood, etc.).
- Direct "Search Trailer on YouTube ↗" integration.

### 4. 💾 LocalStorage Persistence & Favourites / Watchlist
- Persistent **Favourites** and **Watchlist** saved in `localStorage`.
- Movie slab cards matching home screen layout with 2:3 aspect ratio, gradient overlays, and glassmorphic remove buttons.

### 5. ⚡ Ultra-Fast Load Times & 60fps Optimization
- **Persistent LocalStorage Caching**: Movie metadata is cached persistently in `localStorage` for 7 days, enabling **instant < 50ms load times** on repeat visits.
- **`TITLES_FALLBACK` Display Guarantee**: Prevents empty category screens by providing fallback titles if network API latency spikes.
- **8-Second Network Timeout & 350ms Debounce**: Reliable network requests with zero premature aborts or race conditions.
- **`content-visibility: auto` & `loading="lazy"`**: Eliminates Cumulative Layout Shift (CLS) and optimizes GPU rendering.
- **Schema.org JSON-LD Microdata**: Dynamic structured metadata for search engines.

---

## 🛠️ Project Structure

```
CineVault/
├── index.html          # Main HTML structure with SEO meta & modal container
├── css/
│   ├── style.css       # Core design system, responsive breakpoints, dark/light themes
│   └── search-styles.css # Search dropdown & skeleton loader animations
├── js/
│   ├── storage.js      # LocalStorage helper (Favourites, Watchlist, JSON Backup)
│   ├── categories.js   # Curated IMDb ID catalog per industry & category fallbacks
│   ├── greetingMessage.js # Dynamic time-based greeting announcement header
│   └── script.js       # Main app logic (search, modal, recommendations, debounce)
└── fa.png              # App icon / Favicon
```

---

## 🚀 Getting Started

1. Clone or download the repository:
   ```bash
   git clone https://github.com/dhavalpanchal/CineVault.git
   cd CineVault
   ```
2. Open `index.html` directly in any web browser or serve via a local HTTP server:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000` in your browser.

---

## 🌐 Author & Credits

- **Designed & Developed by**: DHAVAL PANCHAL
- **Portfolio**: [https://my-portfolio-nine-eta-63.vercel.app/](https://my-portfolio-nine-eta-63.vercel.app/)
- **Powered by**: Keshav & OMDb API
