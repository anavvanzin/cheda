(function(){
  // Three captions, kept in the upper hemisphere of the ring so they
  // never cross the tagline / bio / booking link stacked underneath.
  // Text + angle stay coupled in one list so neither can drift out of sync.
  const captions=[
    { txt:'FOGO INTERIOR',  angle:-90 },
    { txt:'HOUSE · TECHNO', angle:-150 },
    { txt:'RITUAL',         angle:-30 },
  ];
  const ring=document.getElementById('orbit-ring');
  if(!ring) return;
  captions.forEach(({txt,angle})=>{
    const rad=angle*Math.PI/180;
    const r=50;
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
