/* CASTLE public lead capture -> Supabase Edge Function -> WhatsApp fallback. */
(()=>{'use strict';
 const form=document.querySelector('#leadForm');if(!form)return;
 const endpoint='https://mbikhficiiqczdhobdme.supabase.co/functions/v1/cast-lead';
 const status=document.getElementById('leadStatus');
 const button=form.querySelector('[type=submit]');
 const fallback=document.getElementById('leadFallbackLink');
 const clean=(v,max=650)=>String(v??'').replace(/[\r\n\t]+/g,' ').trim().slice(0,max);
 const params=new URLSearchParams(location.search);
 const dataToPayload=()=>{
  const fd=new FormData(form);
  return {
   nome:clean(fd.get('nome'),90),
   contato:clean(fd.get('contato'),160),
   servico:clean(fd.get('servico'),100),
   empresa:clean(fd.get('empresa'),100),
   prazo:clean(fd.get('prazo'),100),
   objetivo:clean(fd.get('objetivo'),650),
   consentimento:document.getElementById('consentimento')?.checked===true,
   website:clean(fd.get('website'),150),
   client_request_id:crypto.randomUUID(),
   utm_source:clean(params.get('utm_source')||'site',120),
   utm_medium:clean(params.get('utm_medium')||'organico',120),
   utm_campaign:clean(params.get('utm_campaign')||'',120)
  };
 };
 const isContact=x=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)||(/^\+?[0-9()\-\s]{10,24}$/.test(x)&&x.replace(/\D/g,'').length>=10);
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const data=dataToPayload();
  const contactInput=form.querySelector('[name=contato]');
  if(!isContact(data.contato)){contactInput?.setCustomValidity('Digite um e-mail válido ou WhatsApp com DDD.');contactInput?.reportValidity();contactInput?.addEventListener('input',()=>contactInput.setCustomValidity(''),{once:true});return;}
  if(!data.consentimento)return;
  if(status){status.textContent='Enviando sua solicitação com segurança…';status.setAttribute('role','status');}
  if(button){button.disabled=true;button.textContent='Preparando contato…';}
  const ac=new AbortController();const timeout=setTimeout(()=>ac.abort(),6500);
  let saved=false,leadId='';
  try{
    const resp=await fetch(endpoint,{method:'POST',mode:'cors',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify(data),signal:ac.signal});
    const json=await resp.json().catch(()=>({}));
    saved=resp.status===201&&json.ok===true;
    leadId=saved?String(json.lead_id||''):'';
  }catch(_){saved=false;}finally{clearTimeout(timeout);}
  const lines=[
   'Olá, Emmanuel! Encontrei a CASTLE e gostaria de conversar sobre um projeto.','',
   `Nome: ${data.nome}`,`Contato: ${data.contato}`,`Serviço: ${data.servico}`,
   `Marca/perfil: ${data.empresa||'Não informado'}`,
   `Prazo: ${data.prazo}`,`Objetivo: ${data.objetivo}`,
   ...(leadId?['',`Referência CASTLE: ${leadId}`]:[]),
   '',`Origem: ${data.utm_source} / ${data.utm_medium} / ${data.utm_campaign||'direto'}`
  ];
  const url='https://wa.me/5595991476397?text='+encodeURIComponent(lines.join('\n'));
  if(status)status.textContent=saved?'Recebemos seu briefing. Agora conclua pelo WhatsApp.':'O registro automático não foi confirmado. Continue pelo WhatsApp para não perder sua solicitação.';
  if(button){button.disabled=false;button.textContent='Continuar pelo WhatsApp ↗';}
  if(fallback){fallback.href=url;fallback.hidden=false;}
  window.location.assign(url);
 });
})();
