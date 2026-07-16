// ============================================================
//  CINEVAULT — GREETING MESSAGE
// ============================================================
(function () {
  const hrs = new Date().getHours();
  let greet, emoji;
  if      (hrs < 5)  { greet = 'Good Night';     emoji = '🌙'; }
  else if (hrs < 12) { greet = 'Good Morning';   emoji = '⛅'; }
  else if (hrs < 17) { greet = 'Good Afternoon'; emoji = '🌇'; }
  else if (hrs < 21) { greet = 'Good Evening';   emoji = '🎬'; }
  else               { greet = 'Good Night';     emoji = '🌙'; }

  const el = document.getElementById('greeting-msg');
  if (el) {
    el.innerHTML = `${emoji}&nbsp;<b>${greet}</b>`;
    if (!localStorage.getItem('cv_visited')) {
      el.classList.add('first-time-highlight');
      localStorage.setItem('cv_visited', 'true');
    }
  }
})();