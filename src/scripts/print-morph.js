(function(){
  // Orbit captions — placed trigonometrically like on /print/ritual.html
  const labels=[
    'Techno · Tech House','Noise · Hypnotic',
    'Florianópolis · SC',
    'Booking Direto','CHÊDA · 2026'
  ];
  const ring=document.getElementById('orbit-ring');
  labels.forEach((txt,i)=>{
    const angle=(i/labels.length)*360 - 90;
    const rad=angle*Math.PI/180;
    const r=50;
    const x=50+r*Math.cos(rad);
    const y=50+r*Math.sin(rad);
    const s=document.createElement('span');
    s.className='orbit-caption';
    s.textContent=txt;
    s.style.left=x+'%'; s.style.top=y+'%';
    s.style.transform='translate(-50%,-50%) rotate('+(angle+90)+'deg)';
    ring.appendChild(s);
  });

  // Toggle: sets .is-poster on the A4 to drive --t between 0 and 1
  const a4 = document.getElementById('a4');
  const btnR = document.getElementById('btn-ritual');
  const btnP = document.getElementById('btn-poster');
  const goto = state => {
    if(state === 'poster'){
      a4.classList.add('is-poster');
      btnR.classList.remove('on'); btnP.classList.add('on');
    }else{
      a4.classList.remove('is-poster');
      btnP.classList.remove('on'); btnR.classList.add('on');
    }
  };
  btnR.addEventListener('click', () => goto('ritual'));
  btnP.addEventListener('click', () => goto('poster'));

  // Query param ?state=poster or ?loop=true (for capture)
  const q = new URLSearchParams(location.search);
  if(q.get('state') === 'poster') goto('poster');
  if(q.get('loop') === 'true'){
    a4.setAttribute('data-loop','true');
    document.querySelector('.morph-toggle').style.display='none';
  }
})();
