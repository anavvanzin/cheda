/* ============================================================
   CHÊDA — ambient life (classic IIFE, is:inline)

   Makes the static landing feel continuous without changing hosting:
   - CSS vars --amb-mx/my/sy drive parallax on rings, silhouette,
     portrait, and grain (declared in landing.css)
   - Soft .will-reveal entrances after the intro overlay is gone
   - Fully disabled when prefers-reduced-motion: reduce
   ============================================================ */
(function () {
  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ritualVideo = document.querySelector('.ritual-video video');
  if (reduce) {
    if (ritualVideo) ritualVideo.pause();
    document.querySelectorAll('.will-reveal').forEach(function (el) {
      el.classList.add('is-in');
    });
    return;
  }

  var root = document.documentElement;
  var mx = 0, my = 0, tx = 0, ty = 0;
  var sy = 0;
  var raf = 0;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function tick() {
    mx += (tx - mx) * 0.08;
    my += (ty - my) * 0.08;
    root.style.setProperty('--amb-mx', mx.toFixed(4));
    root.style.setProperty('--amb-my', my.toFixed(4));
    root.style.setProperty('--amb-sy', String(Math.round(sy)));
    raf = 0;
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function onScroll() {
    sy = window.scrollY || window.pageYOffset || 0;
    schedule();
  }

  if (finePointer) {
    window.addEventListener('pointermove', function (e) {
      var w = window.innerWidth || 1;
      var h = window.innerHeight || 1;
      tx = clamp((e.clientX / w) * 2 - 1, -1, 1);
      ty = clamp((e.clientY / h) * 2 - 1, -1, 1);
      schedule();
    }, { passive: true });
  }

  // Scroll-driven parallax repaints full-screen mix-blend layers (grain,
  // silhouette) every frame. On touch / coarse-pointer devices that is the
  // main source of scroll jank, so limit it to true fine-pointer devices —
  // the same gate the custom cursor uses. Mobile keeps the one-shot reveals.
  if (finePointer) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function revealAll() {
    var nodes = document.querySelectorAll('.will-reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  function activateRitualVideo() {
    if (!ritualVideo) return;
    ritualVideo.muted = true;
    if (!('IntersectionObserver' in window)) return;
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var playback = ritualVideo.play();
          if (playback && playback.catch) playback.catch(function () {});
        } else {
          ritualVideo.pause();
        }
      });
    }, { threshold: 0.35 });
    videoObserver.observe(ritualVideo);
  }

  function introDone(cb) {
    var intro = document.getElementById('intro');
    if (!intro || intro.classList.contains('is-gone')) {
      cb();
      return;
    }
    var mo = new MutationObserver(function () {
      if (intro.classList.contains('is-gone')) {
        mo.disconnect();
        cb();
      }
    });
    mo.observe(intro, { attributes: true, attributeFilter: ['class'] });
    // Safety: never wait forever if intro controller fails
    window.setTimeout(function () {
      try { mo.disconnect(); } catch (e) {}
      cb();
    }, 22000);
  }

  introDone(function () {
    revealAll();
    activateRitualVideo();
  });
})();
