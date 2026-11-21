/* CASTLE commercial intake: consent-based Supabase capture + reliable WhatsApp CTA. */
(()=>{'use strict';
 const form=document.getElementById('leadForm');if(!form)return;
 const endpoint='https://mbikhficiiqczdhobdme.supabase.co/functions/v1/cast-lead';
 const status=document.getElementById('leadStatus');
 const button=form.querySelector('[type=submit]');
 const fallback=document.getElementById('leadFallbackLink');
 let submitted=false;
 const clean=(v,max=650)=>String(v??'').replace(/[\r\n\t]+/g,' ').trim().slice(0,max);
 const params=new URLSearchParams(location.search);
 const contactValid=x=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)||(/^\+?[0-9()\-\s]{10,24}$/.test(x)&&x.replace(/\D/g,'').length>=10);
 const readPayload=()=>{
  const d=new FormData(form);
  return {
   nome:clean(d.get('nome'),90),contato:clean(d.get('contato'),160),servico:clean(d.get('servico'),100),
   empresa:clean(d.get('empresa'),100),prazo:clean(d.get('prazo'),100),objetivo:clean(d.get('objetivo'),650),
   consentimento:document.getElementById('consentimento')?.checked===true,
   website:clean(d.get('website'),150),client_request_id:crypto.randomUUID(),
   utm_source:clean(params.get('utm_source')||'site',120),
   utm_medium:clean(params.get('utm_medium')||'organico',120),
   utm_campaign:clean(params.get('utm_campaign')||'',120)
  };
 };
 const setMessage=(message,kind)=>{
  if(!status)return;
  status.textContent=message;status.classList.remove('lead-ok','lead-warning','lead-progress');
  if(kind)status.classList.add(kind);
 };
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(submitted||!form.reportValidity())return;
  const data=readPayload();
  const input=form.querySelector('[name=contato]');
  if(!contactValid(data.contato)){
   input?.setCustomValidity('Digite um e-mail válido ou WhatsApp com DDD.');input?.reportValidity();
   input?.addEventListener('input',()=>input.setCustomValidity(''),{once:true});return;
  }
  if(!data.consentimento)return;
  button.disabled=true;button.textContent='Enviando solicitação…';
  setMessage('Registrando sua solicitação com segurança…','lead-progress');
  const ac=new AbortController(),timeout=setTimeout(()=>ac.abort(),7000);
  let saved=false,leadId='',serverMessage='';
  try{
   const response=await fetch(endpoint,{
    method:'POST',mode:'cors',cache:'no-store',headers:{'content-type':'application/json'},
    body:JSON.stringify(data),signal:ac.signal
   });
   const payload=await response.json().catch(()=>({}));
   saved=response.status===201 && payload.ok===true;
   leadId=saved?String(payload.lead_id||''):'';
   serverMessage=String(payload.error||'');
  }catch(_){serverMessage='connection';}finally{clearTimeout(timeout);}
  const lines=[
   'Olá, Emmanuel! Encontrei a CASTLE e gostaria de conversar sobre um projeto.','',
   `Nome: ${data.nome}`,`Contato: ${data.contato}`,`Serviço: ${data.servico}`,
   `Marca/perfil: ${data.empresa||'Não informado'}`,
   `Prazo: ${data.prazo}`,`Objetivo: ${data.objetivo}`,
   ...(leadId?['',`Referência CASTLE: ${leadId}`]:[]),
   '',`Origem: ${data.utm_source} / ${data.utm_medium} / ${data.utm_campaign||'direto'}`
  ];
  const url='https://wa.me/5595991476397?text='+encodeURIComponent(lines.join('\n'));
  if(fallback){
   fallback.href=url;fallback.hidden=false;fallback.textContent='Abrir WhatsApp e falar com Emmanuel ↗';
  }
  if(saved){
   submitted=true;button.textContent='Solicitação registrada ✓';
   setMessage('✓ Seu briefing foi registrado. Agora toque no botão abaixo para abrir o WhatsApp e concluir a conversa. Nenhum pagamento foi feito.','lead-ok');
   form.querySelectorAll('input:not([type=checkbox]),select,textarea').forEach(el=>el.setAttribute('readonly',''));
  }else{
   button.disabled=false;button.textContent='Tentar registrar novamente ↻';
   const reason=serverMessage==='invalid_fields'?'Revise os dados informados.':'';
   setMessage('Ainda não foi possível confirmar o registro automático. '+reason+' Você pode usar o WhatsApp para falar diretamente com Emmanuel sem perder sua mensagem.','lead-warning');
  }
  fallback?.focus({preventScroll:true});
 });
})();