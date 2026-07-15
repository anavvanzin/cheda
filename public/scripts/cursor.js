/* ─────────────────────────────────────────────
   Custom cursor — 3 concentric layers, ring lerps behind
   ───────────────────────────────────────────── */
(function(){
  // Skip entirely on touch/coarse pointer environments
  const supports = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(!supports) return;

  const ring = document.getElementById('cursor-ring');
  const disc = document.getElementById('cursor-disc');
  const dot  = document.getElementById('cursor-dot');
  const body = document.body;
  if(!ring || !disc || !dot) return;

  // Target position (real mouse), and lerped ring position
  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let rx = tx, ry = ty;
  let rafId = null;

  const LERP = 0.18;   // catch-up factor per frame; higher = tighter

  function tick(){
    rx += (tx - rx) * LERP;
    ry += (ty - ry) * LERP;
    ring.style.transform = 'translate3d(' + (rx - ring.offsetWidth/2) + 'px,' + (ry - ring.offsetHeight/2) + 'px, 0)';
    disc.style.transform = 'translate3d(' + (tx - disc.offsetWidth/2) + 'px,' + (ty - disc.offsetHeight/2) + 'px, 0)';
    dot.style.transform  = 'translate3d(' + (tx - dot.offsetWidth/2)  + 'px,' + (ty - dot.offsetHeight/2)  + 'px, 0)';
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    body.removeAttribute('data-cursor-hidden');
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    body.setAttribute('data-cursor-hidden','true');
  });

  // Hover state via delegated pointerover/pointerout
  const HOVER_SEL = 'a, button, .route, .mix, .set-card, .brand-logo, [data-cursor-target]';
  document.addEventListener('pointerover', (e) => {
    if(e.target.closest && e.target.closest(HOVER_SEL)){
      body.setAttribute('data-cursor-hover','true');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if(e.target.closest && e.target.closest(HOVER_SEL)){
      body.removeAttribute('data-cursor-hover');
    }
  });

  // Hide over iframes — browser forces native cursor inside cross-origin frames anyway,
  // but hiding our layers avoids the visual double cursor at the border.
  document.querySelectorAll('iframe').forEach(f => {
    f.addEventListener('pointerenter', () => body.setAttribute('data-cursor-hidden','true'));
    f.addEventListener('pointerleave', () => body.removeAttribute('data-cursor-hidden'));
  });

  // Boot the animation loop
  tick();
})();
