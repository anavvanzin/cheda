/* ============================================================
   CHÊDA — hypnotic intro controller (classic IIFE, is:inline)

   Responsibilities
   - Gate the intro per browser session (sessionStorage) so it never
     nags on internal navigation; a "reopen" affordance clears it.
   - Robust autoplay: try muted playsInline autoplay; if it fails or
     the video errors, fall back to the poster (already the video's
     poster attribute) — the intro still works, just static.
   - Explicit Enter / Skip controls + click/tap-anywhere + keyboard
     (Enter / Space / Escape). Navigation is never trapped: focus is
     managed and the overlay is fully removed on exit.
   - Respect prefers-reduced-motion: skip the breathing choreography
     (handled in CSS) and allow immediate entry.
   ============================================================ */
(function () {
  var SESSION_KEY = 'cheda:intro:seen';
  var intro = document.getElementById('intro');
  if (!intro) return;

  var video = intro.querySelector('.intro__media');
  var enterBtn = intro.querySelector('.intro__enter');
  var skipBtn = intro.querySelector('.intro__skip');
  var reopenBtn = document.getElementById('intro-reopen');
  var lastFocus = null;
  var exited = false;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If already seen this session, don't show the intro at all.
  var alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}

  function showReopen() {
    if (reopenBtn) reopenBtn.hidden = false;
  }

  function removeIntro(instant) {
    if (exited) return;
    exited = true;
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}

    document.body.classList.remove('intro-locked');
    intro.classList.remove('is-active');

    var finish = function () {
      intro.classList.add('is-gone');
      intro.setAttribute('aria-hidden', 'true');
      // pause + release the video so it stops decoding behind the site
      if (video) { try { video.pause(); } catch (e) {} }
      showReopen();
      // hand focus to the top of the page — never trap it in the intro
      var main = document.querySelector('main, .spread, body');
      if (main) {
        if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
        try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); }
      }
    };

    if (instant) {
      intro.style.transition = 'none';
      intro.style.opacity = '0';
      finish();
      return;
    }

    intro.classList.add('is-exiting');
    var done = false;
    var onEnd = function (ev) {
      if (ev && ev.target !== intro) return;
      if (done) return;
      done = true;
      intro.removeEventListener('transitionend', onEnd);
      finish();
    };
    intro.addEventListener('transitionend', onEnd);
    // safety net if transitionend never fires
    window.setTimeout(onEnd, 1400);
  }

  function openIntro() {
    exited = false;
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    if (reopenBtn) reopenBtn.hidden = true;
    intro.classList.remove('is-gone', 'is-exiting');
    intro.style.transition = '';
    intro.style.opacity = '';
    intro.removeAttribute('aria-hidden');
    intro.classList.add('is-active');
    document.body.classList.add('intro-locked');
    tryPlay();
    if (enterBtn) { try { enterBtn.focus(); } catch (e) {} }
  }

  function tryPlay() {
    if (!video || reduceMotion) return;
    // video is muted + playsInline; attempt autoplay, ignore rejection
    var p = video.play ? video.play() : null;
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* poster stays visible — graceful */ });
    }
  }

  // ── Wire up ────────────────────────────────────────────────
  if (alreadySeen) {
    // Never mount visibly on repeat visits this session.
    removeIntro(true);
  } else {
    intro.classList.add('is-active');
    document.body.classList.add('intro-locked');
    lastFocus = document.activeElement;

    if (video) {
      video.addEventListener('error', function () {
        /* fall back to poster automatically; nothing else needed */
      });
      if (reduceMotion) {
        // Honour reduced motion: no moving backdrop, poster only.
        try { video.pause(); } catch (e) {}
        video.removeAttribute('autoplay');
      } else {
        // Kick autoplay once metadata is ready (and immediately as well).
        video.addEventListener('loadeddata', tryPlay);
        tryPlay();
      }
    }

    if (enterBtn) enterBtn.addEventListener('click', function () { removeIntro(false); });
    if (skipBtn) skipBtn.addEventListener('click', function () { removeIntro(false); });

    // Click / tap anywhere on the backdrop also enters.
    intro.addEventListener('click', function (ev) {
      if (ev.target === enterBtn || ev.target === skipBtn) return;
      removeIntro(false);
    });

    // Keyboard: Enter / Space enter; Escape skips. Works globally
    // while the intro is active so it can never trap the user.
    document.addEventListener('keydown', function (ev) {
      if (exited || intro.classList.contains('is-gone')) return;
      if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar' ||
          ev.key === 'Escape' || ev.key === 'Esc') {
        // let the button's own click handle activation if it's focused
        if ((ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') &&
            (document.activeElement === enterBtn || document.activeElement === skipBtn)) {
          return;
        }
        ev.preventDefault();
        removeIntro(false);
      }
    });
  }

  if (reopenBtn) {
    reopenBtn.addEventListener('click', openIntro);
  }
})();
