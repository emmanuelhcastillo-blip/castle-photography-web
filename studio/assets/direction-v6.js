/* CASTLE / visual direction V6.
   Dependency-free scroll scenes, accessible tab demo and cinematic horizontal chapters.
   All media retained as real authored photography or explicitly labeled concepts.
*/
(()=>{'use strict';
  const doc=document.documentElement;
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(pointer:fine)');
  // Stop accidental scroll motion entirely when visitors ask for reduced motion.
  const measured=[];
  let raf=0;
  const manifesto=document.querySelector('.director-manifesto');
  const lines=manifesto?[...manifesto.querySelectorAll('.manifesto-line')]:[];
  const art=manifesto?.querySelector('.manifesto-art');
  const progressEl=document.getElementById('scrollProgress');
  const subBg=document.querySelector('.sub-cinema-image');
  function frame(){
    raf=0;
    const maxScroll=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    if(progressEl)progressEl.style.transform=`scaleX(${clamp(window.scrollY/maxScroll).toFixed(4)})`;
    if(reduce.matches)return;
    if(manifesto){
      const box=manifesto.getBoundingClientRect();
      const range=Math.max(1,box.height-window.innerHeight);
      const p=clamp(-box.top/range);
      lines.forEach((el,i)=>{
        const start=i*.19;
        const t=clamp((p-start)*3.3);
        const opacity=.25+t*.75;
        el.style.setProperty('--line-opacity',opacity.toFixed(3));
        el.style.setProperty('--line-y',((1-t)*36).toFixed(1)+'px');
        el.style.setProperty('--line-scale',(.86+t*.14).toFixed(3));
      });
      if(art){
        art.style.setProperty('--manifesto-tilt',p.toFixed(3));
        art.style.setProperty('--manifesto-art-opacity',(.2+.32*p).toFixed(3));
        art.style.setProperty('--manifesto-art-scale',(.79+.24*p).toFixed(3));
      }
      const display=manifesto.querySelector('.manifesto-progress');
      if(display)display.textContent=`0${Math.min(4,Math.max(1,Math.floor(p*4)+1))} — 04`;
    }
    if(subBg){const b=subBg.closest('.sub-cinema').getBoundingClientRect();if(b.bottom>0&&b.top<window.innerHeight){subBg.style.setProperty('--sub-drift',(clamp((window.innerHeight/2-(b.top+b.height/2))/window.innerHeight,-.5,.5)*33).toFixed(2)+'px');}}
  }
  function request(){if(raf===0)raf=requestAnimationFrame(frame);}
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request,{passive:true});
  request();
  // Headline choreography from MengTo's masked-reveal principle, implemented locally.
  // This does not alter links or form controls and preserves formatting/emphasis.
  if(!reduce.matches && 'IntersectionObserver' in window){
    const selectors=['.section-top h2','.motion-copy h2','.editlab-heading h2','.web-copy h2','.about-copy h2','.chapters-intro h2','.format-top h2','.signal-cta h2','.detail-mega','.detail-final h2','.detail-split h2'];
    const headings=[...document.querySelectorAll(selectors.join(','))];
    headings.forEach(h=>{
      let index=0;
      const visit=node=>{
        [...node.childNodes].forEach(child=>{
          if(child.nodeType===3){
            const value=child.nodeValue;
            if(!value.trim())return;
            const frag=document.createDocumentFragment();
            value.split(/(\s+)/).forEach(part=>{
              if(!part)return;
              if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
              const clip=document.createElement('span');clip.className='word-mask';
              const word=document.createElement('span');word.className='word-piece';word.textContent=part;
              word.style.setProperty('--wi',Math.min(index++,18));clip.appendChild(word);frag.appendChild(clip);
            });child.replaceWith(frag);
          }else if(child.nodeType===1&&!['SCRIPT','STYLE','BUTTON','A'].includes(child.tagName)){visit(child);}
        });
      };
      visit(h);
    });
    doc.classList.add('castle-direction');
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('text-unmasked');io.unobserve(entry.target);}
    }),{rootMargin:'0px 0px -7% 0px',threshold:.08});
    headings.forEach(h=>{if(h.getBoundingClientRect().top<window.innerHeight*.85)h.classList.add('text-unmasked');else io.observe(h)});
  }
  // Gallery arrows and native mobile swipe, with deterministic card targeting.
  const rail=document.getElementById('chapterRail');
  const buttons=[...document.querySelectorAll('[data-slide]')];
  const galleryCards=rail?[...rail.querySelectorAll('.chapter-card')]:[];
  const current=document.getElementById('chapterCurrent');
  const galleryIndex=()=>{
    if(!rail||!galleryCards.length)return 0;
    const center=rail.scrollLeft+rail.clientWidth/2;
    let closest=0,dist=Number.POSITIVE_INFINITY;
    galleryCards.forEach((card,index)=>{
      const cardCenter=card.offsetLeft-rail.offsetLeft+card.offsetWidth/2;
      const delta=Math.abs(center-cardCenter);
      if(delta<dist){closest=index;dist=delta;}
    });
    return closest;
  };
  const indicateGallery=()=>{if(current)current.textContent=`0${galleryIndex()+1} / 0${galleryCards.length}`;};
  buttons.forEach(button=>button.addEventListener('click',()=>{
    if(!rail||!galleryCards.length)return;
    const idx=galleryIndex();
    const next=clamp(idx+(button.dataset.slide==='prev'?-1:1),0,galleryCards.length-1);
    const card=galleryCards[next];
    const target=card.offsetLeft-rail.offsetLeft-(rail.clientWidth-card.offsetWidth)/2;
    rail.scrollTo({left:Math.max(0,target),behavior:reduce.matches?'auto':'smooth'});
    if(current)current.textContent=`0${next+1} / 0${galleryCards.length}`;
  }));
  let scrollerRaf=0;
  rail?.addEventListener('scroll',()=>{if(!scrollerRaf)scrollerRaf=requestAnimationFrame(()=>{scrollerRaf=0;indicateGallery();});},{passive:true});
  indicateGallery();
  // Accessible component: one format shown at a time, left/right arrows navigate the tablist.
  const tabs=[...document.querySelectorAll('.format-tab[role="tab"]')];
  const panels=[...document.querySelectorAll('.format-panel[role="tabpanel"]')];
  function chooseTab(index,focus=false){
    tabs.forEach((tab,i)=>{
      const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
      if(active&&focus)tab.focus();
    });
    panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.classList.toggle('active',i===index);});
  }
  tabs.forEach((b,i)=>{
    b.addEventListener('click',()=>chooseTab(i));
    b.addEventListener('keydown',e=>{
      if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){
        e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        chooseTab(next,true);
      }
    });
  });
  // Pointer glow is decorative, strictly for fine-pointer devices.
  if(fine.matches && !reduce.matches){
    const hero=document.querySelector('.signal-cta');
    hero?.addEventListener('pointermove',e=>{
      const rect=hero.getBoundingClientRect();hero.style.setProperty('--px',`${Math.round(e.clientX-rect.left)}px`);hero.style.setProperty('--py',`${Math.round(e.clientY-rect.top)}px`);
    },{passive:true});
  }
})();
