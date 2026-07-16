/* ============================================================
   CHÊDA — intro controller (classic IIFE, is:inline)

   The intro is a single baked 18s film. This controller:
   - Gates it per browser session (sessionStorage) so it never nags on
     internal navigation; a "reopen" affordance clears the gate.
   - Plays muted + playsInline via play() and dissolves into the site
     when the video ENDS (plays once, no loop). A media-progress-aware
     watchdog covers a missing 'ended' event: it only dismisses once the
     media has actually reached its end, never while it is still
     buffering/stalled behind the wall clock.
   - If autoplay is blocked, reveals a tasteful explicit Play/Enter
     control over the poster frame.
   - Skips on the discreet Skip button, click/tap anywhere, or keyboard
     (Enter / Space / Escape). Focus is never trapped: the underlying
     page is inerted while the intro is up and restored on exit.
   - Respects prefers-reduced-motion: no playback, poster only, and
     immediate dismissal is available (Enter/click/skip).

   All dismissal listeners are wired exactly ONCE, independently of the
   session gate, so reopening behaves identically to a first visit.
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
  var END_EPS = 0.35;      // seconds: treat currentTime within this of end as "ended"
  var lastOpener = null;   // element to restore focus to on close (reopen path)
  var inerted = [];        // background siblings we marked inert while active

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

  // Make the underlying page truly non-interactive while the intro is up,
  // so aria-modal is honest. Scripts, layout and animations are untouched
  // (inert only affects focus / pointer / assistive tech).
  function inertBackground() {
    if (inerted.length) return;
    var kids = document.body.children;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (el === intro || el === reopenBtn) continue;
      if (el.tagName === 'SCRIPT') continue;
      if (!el.hasAttribute('inert')) { el.setAttribute('inert', ''); inerted.push(el); }
    }
  }
  function restoreBackground() {
    for (var i = 0; i < inerted.length; i++) {
      try { inerted[i].removeAttribute('inert'); } catch (e) {}
    }
    inerted = [];
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
      restoreBackground();
      showReopen();

      // Restore focus: to the control that opened the intro when there is
      // one (reopen path); otherwise hand it to the top of the page. Focus
      // is never trapped inside the intro.
      var target = null;
      if (lastOpener && document.body.contains(lastOpener) && !lastOpener.hidden) {
        target = lastOpener;
      } else {
        target = document.querySelector('main, .spread, body');
        if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      }
      lastOpener = null;
      if (target) {
        try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
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

  // Bring the intro on screen: used on first visit and on reopen. Never
  // attaches listeners (those are wired once at init).
  function activateIntro() {
    exited = false;
    clearWatchdog();
    intro.classList.remove('is-gone', 'is-exiting');
    intro.style.transition = '';
    intro.style.opacity = '';
    intro.removeAttribute('aria-hidden');
    intro.classList.add('is-active');
    document.body.classList.add('intro-locked');
    inertBackground();
    startPlayback();
  }

  function openIntro(ev) {
    lastOpener = (ev && ev.currentTarget) || reopenBtn || null;
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    if (reopenBtn) reopenBtn.hidden = true;
    hideFallback();
    if (video) { try { video.currentTime = 0; } catch (e) {} }
    activateIntro();
    if (skipBtn) { try { skipBtn.focus(); } catch (e) {} }
  }

  // Progress-aware end watchdog. Instead of a fixed wall-clock timeout
  // (which dismisses mid-film whenever playback buffers/stalls behind the
  // clock), we schedule for the media time REMAINING and, when it fires,
  // dismiss only if the film truly reached its end. Otherwise we re-arm for
  // the new remaining time — so buffered/stalled playback is never cut early.
  function scheduleWatchdog() {
    clearWatchdog();
    if (!video || exited) return;
    if (video.paused) return; // paused/stalled: re-armed by the 'playing' event
    var dur = (video.duration && isFinite(video.duration)) ? video.duration : null;
    var remaining = (dur !== null)
      ? Math.max(0, dur - (video.currentTime || 0))
      : 1.0; // duration unknown yet: poll again shortly
    endWatchdog = window.setTimeout(onWatchdogFire, Math.ceil(remaining * 1000) + 400);
  }

  function hasReachedMediaEnd() {
    if (!video) return false;
    var dur = (video.duration && isFinite(video.duration)) ? video.duration : null;
    return video.ended ||
      (dur !== null && video.currentTime >= dur - END_EPS);
  }

  function onWatchdogFire() {
    endWatchdog = null;
    if (exited || !video) return;
    if (hasReachedMediaEnd()) {
      removeIntro(false);
      return;
    }
    scheduleWatchdog(); // still behind (buffering/stalled) — never cut early
  }

  function onPlaybackPause() {
    clearWatchdog();
    if (!exited && hasReachedMediaEnd()) {
      removeIntro(false);
    }
  }

  // Upgrade buffering only once we know the film will actually play. The
  // markup keeps preload="metadata" so returning-session and reduced-motion
  // visitors never auto-download the clip; here (first play only) we switch
  // to eager buffering so real-network playback doesn't stall.
  function ensureEagerBuffering() {
    if (!video) return;
    if (video.preload !== 'auto') {
      video.preload = 'auto';
      if (video.readyState === 0) { try { video.load(); } catch (e) {} }
    }
  }

  function startPlayback() {
    if (!video) return;
    if (exited || intro.classList.contains('is-gone')) return; // never play a dismissed intro
    if (reduceMotion) {
      // no motion: poster only, wait for an explicit dismissal gesture
      try { video.pause(); } catch (e) {}
      return;
    }
    ensureEagerBuffering();
    var p = video.play ? video.play() : null;
    if (p && typeof p.catch === 'function') {
      p.then(function () {
        hideFallback();
        scheduleWatchdog();
      }).catch(function () {
        // autoplay blocked → offer an explicit play/enter control
        showFallback();
      });
    } else {
      scheduleWatchdog();
    }
  }

  // ── Wire dismissal controls exactly once ───────────────────
  function wireControls() {
    if (video) {
      video.addEventListener('ended', function () { removeIntro(false); });
      video.addEventListener('error', function () {
        if (!exited && !intro.classList.contains('is-gone')) showFallback();
      });
      video.addEventListener('loadeddata', startPlayback);
      // Keep the watchdog tied to real playback progress: arm/re-arm when the
      // media is actually advancing, and stand down whenever it isn't so a
      // stall or pause can never trip an early dismissal.
      video.addEventListener('playing', function () {
        if (!exited && !reduceMotion) scheduleWatchdog();
      });
      video.addEventListener('waiting', clearWatchdog);
      video.addEventListener('stalled', clearWatchdog);
      video.addEventListener('pause', onPlaybackPause);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          clearWatchdog();
        } else if (!exited && !reduceMotion && video && !video.paused) {
          scheduleWatchdog();
        }
      });
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
        ensureEagerBuffering();
        var p = video.play ? video.play() : null;
        if (p && typeof p.catch === 'function') {
          p.then(scheduleWatchdog).catch(function () { removeIntro(false); });
        } else {
          scheduleWatchdog();
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

    if (reopenBtn) reopenBtn.addEventListener('click', openIntro);
  }

  // ── Init ───────────────────────────────────────────────────
  wireControls();
  if (alreadySeen) {
    removeIntro(true);
  } else {
    activateIntro();
  }
})();
