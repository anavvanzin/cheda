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

  // No way to tell when the band is on screen → stay on the poster rather than
  // autoplay a clip that lives well below the fold.
  if (!('IntersectionObserver' in window)) return;

  // Play only once at least 25% of the band is on screen; pause below that.
  // Gate on intersectionRatio (isIntersecting is true at a single pixel, which
  // would start playback — and the media request — before the 25% threshold).
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio >= 0.25) { v.play().catch(function () {}); }
      else { v.pause(); }
    });
  }, { threshold: [0, 0.25] });
  io.observe(v);
})();
