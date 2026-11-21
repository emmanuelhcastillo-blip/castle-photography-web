(()=>{'use strict';
  const studio=document.getElementById('editlabLive');
  if(!studio)return;
  const button=document.getElementById('studioNext');
  const reel=document.getElementById('studioReel');
  const title=document.getElementById('studioShotTitle');
  const desc=document.getElementById('studioShotDesc');
  const topic=reel?.querySelector('.reel-topic');
  const shots=[
    {title:'O gancho',desc:'Os primeiros segundos devem ganhar atenção, não pedi-la.',topic:'O SEU VÍDEO<br><em>MERECE UM</em><br><strong>GANCHO.</strong>'},
    {title:'A narrativa',desc:'O corte, a legenda e o ritmo ajudam a ideia a chegar sem perder personalidade.',topic:'NÃO BASTA<br><em>APARECER.</em><br><strong>CONTE.</strong>'},
    {title:'A ação',desc:'Um final claro: o que a pessoa deve entender, lembrar ou fazer depois?',topic:'CONTE UMA<br><em>HISTÓRIA.</em><br><strong>MOVA.</strong>'}
  ];
  let index=0;
  button?.addEventListener('click',()=>{
    index=(index+1)%shots.length;const shot=shots[index];
    if(title)title.textContent=shot.title;
    if(desc)desc.textContent=shot.desc;
    if(topic)topic.innerHTML=shot.topic;
    studio.dataset.shot=String(index);
    button.textContent=index===2?'VOLTAR AO GANCHO ↗':'PRÓXIMO PLANO ↗';
  });
  if(window.matchMedia('(pointer:fine)').matches&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('.premium-service').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        el.style.setProperty('--cursor-x',`${e.clientX-r.left}px`);
        el.style.setProperty('--cursor-y',`${e.clientY-r.top}px`);
      },{passive:true});
    });
  }
})();
