// ============================================================
//  CINEVAULT — GREETING ANNOUNCEMENT BANNER (OnlyProfit Style)
//  Visible for 5s on website open, then automatically disappears
// ============================================================
(function () {
  function initGreetingBanner() {
    const hrs = new Date().getHours();
    let greet, emoji;
    if      (hrs < 5)  { greet = 'Good Night';     emoji = '🌙'; }
    else if (hrs < 12) { greet = 'Good Morning';   emoji = '☀️'; }
    else if (hrs < 17) { greet = 'Good Afternoon'; emoji = '☀️'; }
    else if (hrs < 21) { greet = 'Good Evening';   emoji = '🎬'; }
    else               { greet = 'Good Night';     emoji = '🌙'; }

    // Top Announcement Banner
    const banner = document.getElementById('top-greeting-banner');
    const iconEl = document.getElementById('top-greeting-icon');
    const textEl = document.getElementById('top-greeting-text');
    const closeBtn = document.getElementById('top-greeting-close');

    if (iconEl) iconEl.textContent = emoji;
    if (textEl) {
      textEl.innerHTML = `<span class="greet-highlight">${greet}</span>, Welcome to CineVault. Start Searching Your Favourites Movies!`;
    }

    function dismissBanner() {
      if (banner) {
        banner.classList.add('banner-hidden');
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', dismissBanner);
    }

    // Auto-disappear after 5 seconds
    setTimeout(dismissBanner, 5000);

    // Hero Greeting Badge
    const heroEl = document.getElementById('hero-time-greeting');
    if (heroEl) {
      heroEl.innerHTML = `${emoji} ${greet}`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGreetingBanner);
  } else {
    initGreetingBanner();
  }
})();