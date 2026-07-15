/* Orbiting captions — trig-placed on a ring 66% wide,
   each rotated tangentially so the type curls around the portrait. */
(function(){
  const labels=[
    'Techno · Tech House',
    'Noise · Hypnotic',
    'Florianópolis · SC',
    'Ritual · não Playlist',
    'Booking Direto',
    'CHÊDA · 2026'
  ];
  const ring=document.getElementById('orbit-ring');
  labels.forEach((txt,i)=>{
    const angle=(i/labels.length)*360 - 90;   // start at top
    const rad=angle*Math.PI/180;
    const r=50; // radius in %
    const x=50+r*Math.cos(rad);
    const y=50+r*Math.sin(rad);
    const s=document.createElement('span');
    s.className='orbit-caption';
    s.textContent=txt;
    s.style.left=x+'%';
    s.style.top=y+'%';
    s.style.transform='translate(-50%,-50%) rotate('+(angle+90)+'deg)';
    ring.appendChild(s);
  });
})();
