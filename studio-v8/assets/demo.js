(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const status=$('#demoStatus');
const say=t=>{if(status)status.textContent=t;};
$$('[data-add]').forEach(button=>button.addEventListener('click',()=>{const item=button.dataset.add;say(`Simulação: você escolheu “${item}”. Nenhum pedido foi enviado e nenhum pagamento será realizado.`);}));
$$('[data-class]').forEach(button=>button.addEventListener('click',()=>{$$('[data-class]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));say('Aula selecionada para demonstração: '+button.dataset.class+'. Nenhuma reserva foi criada.');}));
$$('[data-palette]').forEach(button=>button.addEventListener('click',()=>{const body=document.body;body.classList.remove('v-sky','v-sand','v-mint');body.classList.add(button.dataset.palette);$$('[data-palette]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));say('Paleta alterada: '+button.textContent.trim()+'. Este é um protótipo interativo.');}));
})();
