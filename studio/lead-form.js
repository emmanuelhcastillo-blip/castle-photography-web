/* CASTLE commercial lead-intake, GitHub Pages.
 * Attempts consent-based server capture before opening prepared WhatsApp.
 * If backend is down, never claim CRM capture, and still allow the visitor to contact.
 */
(()=>{"use strict";
 const form=document.querySelector("#leadForm");
 if(!form)return;
 const status=document.querySelector("#leadStatus");
 const button=form.querySelector('[type="submit"]');
 const endpoint="https://mbikhficiiqczdhobdme.supabase.co/functions/v1/cast-lead";
 const str=(v,max=650)=>String(v??"").replace(/[\r\n\t]+/g," ").trim().slice(0,max);
 const qp=new URLSearchParams(location.search);
 form.addEventListener("submit",async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const request={
   nome:str(data.get("nome"),90),
   servico:str(data.get("servico"),100),
   empresa:str(data.get("empresa"),100),
   prazo:str(data.get("prazo"),100),
   objetivo:str(data.get("objetivo"),650),
   consentimento:!!document.querySelector("#consentimento")?.checked,
   website:str(data.get("website"),150),
   client_request_id:crypto.randomUUID(),
   utm_source:str(qp.get("utm_source")||"website",120),
   utm_medium:str(qp.get("utm_medium")||"organic",120),
   utm_campaign:str(qp.get("utm_campaign")||"",120)
  };
  if(!request.consentimento)return;
  const controller=new AbortController();
  const stop=setTimeout(()=>controller.abort(),6500);
  let saved=false,leadId=null;
  if(status){status.textContent="Preparando seu atendimento...";status.setAttribute("role","status");}
  if(button){button.disabled=true;button.textContent="Preparando mensagem...";}
  try{
    const response=await fetch(endpoint,{
      method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(request),signal:controller.signal,cache:"no-store"
    });
    const result=await response.json().catch(()=>null);
    saved=response.status===201&&result?.ok===true;
    leadId=saved?result.lead_id:null;
  }catch(_){}
  finally{clearTimeout(stop);}
  if(status){
    status.textContent=saved?
      "Seu pedido foi registrado. Finalize a conversa pelo WhatsApp.":
      "O registro automático não foi confirmado. O WhatsApp vai abrir para você continuar.";
  }
  const message=[
  "Olá, Emmanuel! Encontrei a CASTLE e quero falar sobre um projeto.",
  "",
  "Nome: "+request.nome,
  "Serviço: "+request.servico,
  "Marca/perfil: "+request.empresa,
  "Prazo: "+request.prazo,
  "Objetivo: "+request.objetivo,
  ...(leadId?["","Referência CASTLE: "+leadId]:[]),
  "",
  "Origem: "+request.utm_source+(request.utm_campaign?" / "+request.utm_campaign:"")
  ].join("\n");
  const href="https://wa.me/5595991476397?text="+encodeURIComponent(message);
  if(button){button.disabled=false;button.textContent="Continuar pelo WhatsApp ↗";}
  const existing=document.querySelector("#leadFallbackLink");
  if(existing){existing.href=href;existing.hidden=false;}
  window.location.assign(href);
 });
})();