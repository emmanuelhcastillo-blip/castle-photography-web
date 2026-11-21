/* CASTLE V8 | Accessible navigation, portfolio interaction, consent-based leads. */
(()=>{'use strict';
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  $$('[data-year]').forEach(el=>{el.textContent=String(new Date().getFullYear());});
  const toggle=$('#menuToggle'), nav=$('#navLinks');
  function setMenu(open){if(!toggle||!nav)return;toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);toggle.innerHTML=open?'FECHAR <span aria-hidden="true">✕</span>':'MENU <span aria-hidden="true">☰</span>';}
  toggle?.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
  $$('a',nav||document.createElement('div')).forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){setMenu(false);toggle.focus();}});
  document.addEventListener('pointerdown',event=>{if(toggle?.getAttribute('aria-expanded')==='true'&&!event.target.closest('.site-nav,.menu-toggle'))setMenu(false);});
  matchMedia('(min-width:951px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(!reduced.matches && 'IntersectionObserver' in window){
    document.documentElement.classList.add('js-motion');
    const obs=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target);}}},{threshold:.075,rootMargin:'0px 0px 7% 0px'});
    $$('.reveal').forEach(el=>obs.observe(el));
  }
  const kinetic=$('[data-kinetic]');
  if(kinetic&&!reduced.matches){let ticking=false;const update=()=>{const r=kinetic.getBoundingClientRect(),height=innerHeight||800;const factor=Math.max(0,Math.min(1,(height-r.top)/(height+r.height*.5)));const scale=.94+.065*factor;kinetic.style.transform=`scale(${scale.toFixed(3)})`;ticking=false;};const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}};onScroll();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);}

  const comparison=$('#beforeAfter'),widget=$('#compareWidget'),percent=$('#comparePct');
  comparison?.addEventListener('input',()=>{const val=comparison.value;widget?.style.setProperty('--split',`${val}%`);if(percent)percent.textContent=`${val}%`;});

  /* Fallback phone stays interactive when CDN/WebGL is unavailable. */
  const phoneStage=$('#immersive-phone');
  if(phoneStage){
    let fallbackScene=0;
    const fallbackText=['UM REEL\nCOM\nINTENÇÃO.','VOCÊ FALA.\nA HISTÓRIA\nPRENDE.','DA IDEIA\nAO ANÚNCIO.'];
    const fallbackDisplay=$('.light-phone-screen strong',phoneStage);
    $('#nextPhoneScene')?.addEventListener('click',()=>{
      if(phoneStage.classList.contains('is-webgl'))return;
      fallbackScene=(fallbackScene+1)%fallbackText.length;
      if(fallbackDisplay)fallbackDisplay.textContent=fallbackText[fallbackScene];
      phoneStage.dataset.fallbackScene=String(fallbackScene);
    });
    const rotate=$('#rotatePhone');
    rotate?.addEventListener('click',()=>{
      if(phoneStage.classList.contains('is-webgl'))return;
      const paused=phoneStage.classList.toggle('fallback-paused');
      rotate.setAttribute('aria-pressed',String(paused));
      const label=$('#rotateLabel'),icon=$('#rotateIcon');
      if(label)label.textContent=paused?'Retomar giro':'Pausar giro';
      if(icon)icon.textContent=paused?'▶':'Ⅱ';
    });
  }

  /* Instagram embeds are never created before a deliberate user click. */
  const dialog=$('#reelDialog'),slot=$('#reelEmbedSlot'),external=$('#reelExternalLink'),title=$('#reelDialogTitle');
  const allowedReel=/^https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/$/;
  let focusBefore=null;
  const closeReel=()=>{if(!dialog||dialog.hidden)return;dialog.hidden=true;document.body.style.removeProperty('overflow');slot?.replaceChildren();if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});};
  function openReel(url,name){if(!dialog||!slot||!allowedReel.test(url))return;focusBefore=document.activeElement;title.textContent=name||'Reel original';external.href=url;slot.replaceChildren();const frame=document.createElement('iframe');frame.title='Instagram Reel: '+(name||'CASTLE');frame.loading='lazy';frame.src=url+'embed/';frame.allow='fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';slot.append(frame);dialog.hidden=false;document.body.style.overflow='hidden';$('.dialog-close',dialog)?.focus({preventScroll:true});}
  $$('[data-reel]').forEach(button=>button.addEventListener('click',()=>openReel(button.dataset.reel,button.dataset.reelTitle)));
  $$('[data-close-reel]').forEach(button=>button.addEventListener('click',closeReel));
  document.addEventListener('keydown',event=>{
    if(dialog?.hidden!==false)return;
    if(event.key==='Escape'){event.preventDefault();closeReel();return;}
    if(event.key==='Tab'){const active=$$('button:not([disabled]),a[href]',dialog).filter(el=>el.getClientRects().length);const first=active[0],last=active.at(-1);if(!first)return;if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });

  /* Form: same backend contract as the live Supabase Edge Function. */
  const form=$('#leadForm');if(!form)return;
  const endpoint='https://mbikhficiiqczdhobdme.supabase.co/functions/v1/cast-lead';
  const status=$('#leadStatus'),send=$('#leadSubmit'),wa=$('#leadFallbackLink'),reset=$('#leadReset');
  const params=new URLSearchParams(location.search);
  const service=params.get('servico');
  if(service){const sel=$('#servico');if(sel&&[...sel.options].some(o=>o.value===service))sel.value=service;}
  const validContact=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||(/^\+?[0-9()\-\s]{10,24}$/.test(v)&&v.replace(/\D/g,'').length>=10);
  const clean=(val,max=650)=>String(val??'').replace(/[\r\n\t]+/g,' ').trim().slice(0,max);
  const uuid=()=>{
    if(globalThis.crypto?.randomUUID)return crypto.randomUUID();
    if(globalThis.crypto?.getRandomValues){const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=[...b].map(x=>x.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}
    return '00000000-0000-4000-8000-'+String(Date.now()).padStart(12,'0').slice(-12);
  };
  let requestId=uuid(),inflight=false,complete=false;
  const tell=(message,kind='info')=>{status.textContent=message;status.dataset.kind=kind;};
  function payload(){const f=new FormData(form);return{nome:clean(f.get('nome'),90),contato:clean(f.get('contato'),150),servico:clean(f.get('servico'),100),empresa:clean(f.get('empresa'),100),prazo:clean(f.get('prazo'),100),objetivo:clean(f.get('objetivo'),650),website:clean(f.get('website'),150),consentimento:$('#consentimento')?.checked===true,client_request_id:requestId,utm_source:clean(params.get('utm_source')||'site',120),utm_campaign:clean(params.get('utm_campaign')||'',120),utm_medium:clean(params.get('utm_medium')||'orgânico',120)};}
  function prepareWhatsApp(data,leadId=''){
    const lines=['Olá, Emmanuel! Quero conversar sobre um projeto com a CASTLE.','','Nome: '+data.nome,'Contato: '+data.contato,'Serviço: '+data.servico,'Marca/perfil: '+(data.empresa||'Não informado'),'Prazo: '+data.prazo,'Ideia: '+data.objetivo, ...(leadId?['','Referência: '+leadId]:[]),'','Origem: '+data.utm_source+(data.utm_campaign?' / '+data.utm_campaign:'')];
    wa.href='https://wa.me/5595991476397?text='+encodeURIComponent(lines.join('\n'));wa.hidden=false;
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(inflight||complete||!form.reportValidity())return;
    const data=payload();const input=$('#contatoInput');
    if(!validContact(data.contato)){input.setCustomValidity('Informe um e-mail válido ou WhatsApp com DDD.');input.reportValidity();const clear=()=>{input.setCustomValidity('');input.removeEventListener('input',clear);};input.addEventListener('input',clear);return;}
    if(!data.consentimento)return;
    inflight=true;send.disabled=true;send.textContent='Registrando pedido…';tell('Enviando sua solicitação ao estúdio…','info');
    const ac=new AbortController(),timeout=setTimeout(()=>ac.abort(),8000);
    let success=false,serverError='',leadId='';
    try{const res=await fetch(endpoint,{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:ac.signal});const obj=await res.json().catch(()=>({}));success=res.status===201&&obj.ok===true;leadId=success?String(obj.lead_id||''):'';serverError=String(obj.error||'');}catch(e){serverError='network';}finally{clearTimeout(timeout);inflight=false;}
    prepareWhatsApp(data,leadId);
    if(success){complete=true;send.textContent='Pedido recebido ✓';tell('✓ Pedido registrado no estúdio. Você pode continuar pelo WhatsApp, mas não precisa enviar a mensagem duas vezes. Nenhum pagamento foi realizado.','success');reset.hidden=false;wa?.focus({preventScroll:true});}
    else{send.disabled=false;send.textContent='Tentar novamente ↻';tell(serverError==='too_many_requests'?'Muitas solicitações recentes. Use o WhatsApp ou tente mais tarde.':'Ainda não conseguimos confirmar o registro. Sua mensagem está pronta para continuar pelo WhatsApp. Você também pode tentar novamente.','error');}
  });
  reset?.addEventListener('click',()=>{requestId=uuid();complete=false;inflight=false;form.reset();send.disabled=false;send.innerHTML='Registrar pedido de orçamento <span aria-hidden="true">↗</span>';wa.hidden=true;reset.hidden=true;tell('Sem pagamento automático. Seu pedido só será registrado após o envio.');$('#nome')?.focus();});
})();
