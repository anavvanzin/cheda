(function(){
  const labels=['FOGO INTERIOR','RITUAL','PRESENÇA · MOVIMENTO','FORÇA','HOUSE · TECHNO'];
  const ring=document.getElementById('orbit-ring');
  if(!ring) return;
  labels.forEach((txt,i)=>{
    const angle=(i/labels.length)*360 - 90;
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
