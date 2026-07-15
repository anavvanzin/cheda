/* ============================================================
   CHÊDA — intro controller (classic IIFE, is:inline)

   The intro is a single baked 7s film. This controller:
   - Gates it per browser session (sessionStorage) so it never nags on
     internal navigation; a "reopen" affordance clears the gate.
   - Autoplays muted + playsInline and dissolves into the site when the
     video ENDS (plays once, no loop). A watchdog covers a missing
     'ended' event.
   - If autoplay is blocked, reveals a tasteful explicit Play/Enter
     control over the poster frame.
   - Skips on the discreet Skip button, click/tap anywhere, or keyboard
     (Enter / Space / Escape). Focus is never trapped: it is handed to
     the page and the overlay is removed on exit.
   - Respects prefers-reduced-motion: no playback, poster only, and
     immediate entry is available (Enter/click/skip).
   ============================================================ */
(function () {
  var SESSION_KEY = 'cheda:intro:seen';
  var intro = document.getElementById('intro');
  if (!intro) return;

  var video = intro.querySelector('.intro__media');
  var skipBtn = intro.querySelector('.intro__skip');
  var fallback = intro.querySelector('.intro__fallback');
  var enterBtn = intro.querySelector('.intro__enter');
  var reopenBtn = document.getElementById('intro-reopen');
  var exited = false;
  var endWatchdog = null;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}

  function showReopen() { if (reopenBtn) reopenBtn.hidden = false; }
  function showFallback() { if (fallback) fallback.hidden = false; }
  function hideFallback() { if (fallback) fallback.hidden = true; }

  function clearWatchdog() {
    if (endWatchdog) { window.clearTimeout(endWatchdog); endWatchdog = null; }
  }

  function removeIntro(instant) {
    if (exited) return;
    exited = true;
    clearWatchdog();
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}

    document.body.classList.remove('intro-locked');
    intro.classList.remove('is-active');

    var finish = function () {
      intro.classList.add('is-gone');
      intro.setAttribute('aria-hidden', 'true');
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
    window.setTimeout(onEnd, 1400); // safety net
  }

  function openIntro() {
    exited = false;
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    if (reopenBtn) reopenBtn.hidden = true;
    hideFallback();
    intro.classList.remove('is-gone', 'is-exiting');
    intro.style.transition = '';
    intro.style.opacity = '';
    intro.removeAttribute('aria-hidden');
    intro.classList.add('is-active');
    document.body.classList.add('intro-locked');
    if (video) { try { video.currentTime = 0; } catch (e) {} }
    startPlayback();
    if (skipBtn) { try { skipBtn.focus(); } catch (e) {} }
  }

  function armEndWatchdog() {
    clearWatchdog();
    if (!video) return;
    // Dissolve shortly after the clip's natural length even if 'ended'
    // is missed. Fall back to a fixed 7.4s if duration isn't known yet.
    var dur = (video.duration && isFinite(video.duration)) ? video.duration : 7.0;
    endWatchdog = window.setTimeout(function () {
      if (!exited) removeIntro(false);
    }, Math.ceil(dur * 1000) + 500);
  }

  function startPlayback() {
    if (!video) return;
    if (reduceMotion) {
      // no motion: poster only, wait for an explicit entry gesture
      try { video.pause(); } catch (e) {}
      return;
    }
    var p = video.play ? video.play() : null;
    if (p && typeof p.catch === 'function') {
      p.then(function () {
        hideFallback();
        armEndWatchdog();
      }).catch(function () {
        // autoplay blocked → offer an explicit play/enter control
        showFallback();
      });
    } else {
      armEndWatchdog();
    }
  }

  // ── Wire up ────────────────────────────────────────────────
  if (alreadySeen) {
    removeIntro(true);
  } else {
    intro.classList.add('is-active');
    document.body.classList.add('intro-locked');

    if (video) {
      video.addEventListener('ended', function () { removeIntro(false); });
      video.addEventListener('error', showFallback);
      video.addEventListener('loadedmetadata', function () {
        if (!reduceMotion && !video.paused) armEndWatchdog();
      });
      if (reduceMotion) {
        try { video.pause(); } catch (e) {}
        video.removeAttribute('autoplay');
      } else {
        video.addEventListener('loadeddata', startPlayback);
        startPlayback();
      }
    }

    if (skipBtn) skipBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      removeIntro(false);
    });

    // Fallback Enter: user gesture — start playback so they still see
    // the film; the video's own 'ended' will then dissolve the intro.
    if (enterBtn) enterBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      hideFallback();
      if (video && !reduceMotion) {
        var p = video.play ? video.play() : null;
        if (p && typeof p.catch === 'function') {
          p.then(armEndWatchdog).catch(function () { removeIntro(false); });
        } else {
          armEndWatchdog();
        }
      } else {
        removeIntro(false);
      }
    });

    // Click / tap anywhere on the backdrop enters immediately.
    intro.addEventListener('click', function (ev) {
      if (ev.target === skipBtn || ev.target === enterBtn ||
          (enterBtn && enterBtn.contains(ev.target))) return;
      removeIntro(false);
    });

    // Keyboard: Enter / Space / Escape enter. Global so it never traps.
    document.addEventListener('keydown', function (ev) {
      if (exited || intro.classList.contains('is-gone')) return;
      if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar' ||
          ev.key === 'Escape' || ev.key === 'Esc') {
        if ((ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') &&
            (document.activeElement === skipBtn || document.activeElement === enterBtn)) {
          return; // let the focused button handle its own activation
        }
        ev.preventDefault();
        removeIntro(false);
      }
    });
  }

  if (reopenBtn) reopenBtn.addEventListener('click', openIntro);
})();
