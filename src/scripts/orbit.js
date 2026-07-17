(function(){
  // Three captions, kept in the upper hemisphere of the ring so they
  // never cross the tagline / bio / booking link stacked underneath.
  const labels=['FOGO INTERIOR','HOUSE · TECHNO','RITUAL'];
  const angles=[-90,-150,-30];
  const ring=document.getElementById('orbit-ring');
  if(!ring) return;
  labels.forEach((txt,i)=>{
    const angle=angles[i];
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
