/* CHÊDA — shaded reel controller (classic IIFE, is:inline)
   Plays the muted background loop only while it is on screen, and never at all
   when the visitor prefers reduced motion (it stays on the poster still). This
   keeps the clip from burning battery offscreen and honours motion settings. */
(function () {
  var v = document.querySelector('.reel-video');
  if (!v) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;                       // stay on the poster; no motion

  if (!('IntersectionObserver' in window)) { v.play().catch(function () {}); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { v.play().catch(function () {}); }
      else { v.pause(); }
    });
  }, { threshold: 0.25 });
  io.observe(v);
})();
