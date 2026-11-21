(()=>{'use strict';
 const root=document.documentElement;
 const mob=document.getElementById('mobileToggle');
 const nav=document.getElementById('navigation');
 const setMenuOpen=(open,restoreFocus=false)=>{
  if(!mob||!nav)return;
  nav.classList.toggle('open',open);mob.setAttribute('aria-expanded',String(open));
  mob.textContent=open?'Fechar ×':'Menu ☰';
  if(restoreFocus)mob.focus();
 };
 mob?.addEventListener('click',()=>setMenuOpen(mob.getAttribute('aria-expanded')!=='true'));
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuOpen(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mob?.getAttribute('aria-expanded')==='true')setMenuOpen(false,true)});
 document.addEventListener('pointerdown',e=>{if(mob?.getAttribute('aria-expanded')==='true'&&!e.target.closest('#navigation,#mobileToggle'))setMenuOpen(false)});
 window.addEventListener('resize',()=>{if(window.innerWidth>900&&mob?.getAttribute('aria-expanded')==='true')setMenuOpen(false)});
 document.querySelectorAll('#year').forEach(x=>x.textContent=String(new Date().getFullYear()));
 const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const items=[...document.querySelectorAll('.reveal')];
 if(prefersReduced || !('IntersectionObserver' in window))items.forEach(el=>el.classList.add('in'));
 else {
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}}},{threshold:.09,rootMargin:'0px 0px 7% 0px'});
  items.forEach(el=>observer.observe(el));
 }
 const growers=[...document.querySelectorAll('.grow-on-view')];
 const parallax=[...document.querySelectorAll('[data-parallax]')];
 if((growers.length||parallax.length)&&!prefersReduced){
  let scheduled=false;
  const frame=()=>{
    const vh=window.innerHeight||1;
    growers.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.bottom>=-50&&r.top<=vh+50){
        const t=Math.max(0,Math.min(1,1-Math.abs(r.top+r.height*.5-vh*.5)/vh));
        el.style.transform=`scale(${(1+.045*t).toFixed(3)})`;
      }
    });
    parallax.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.bottom>=-200&&r.top<=vh+200){
        const strength=Number(el.dataset.parallax||'.04');
        const d=Math.max(-25,Math.min(25,(r.top+r.height*.5-vh*.5)*strength));
        el.style.setProperty('--parallax-y',`${d.toFixed(1)}px`);
      }
    });
    scheduled=false;
  };
  const request=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(frame)}};
  request();window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);
 }
 const themeToggle=document.querySelector('[data-pause-phone]');
 if(themeToggle){themeToggle.addEventListener('click',()=>{const current=root.classList.toggle('pause-motion');themeToggle.setAttribute('aria-pressed',String(current));themeToggle.textContent=current?'Reproduzir animação':'Pausar animação';});}
})();
