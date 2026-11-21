(()=>{'use strict';
const modal=document.getElementById('reelDialog');
if(!modal)return;
const slot=document.getElementById('reelEmbedSlot');
const external=document.getElementById('reelExternalLink');
const title=document.getElementById('reelDialogTitle');
const closeBtn=modal.querySelector('.v7-dialog-close');
let previousFocus=null;
const allowed=/^https:\/\/www\.instagram\.com\/reel\/[\w-]+\/$/;
function stopVideo(){slot.replaceChildren();}
function hide(){modal.hidden=true;document.body.style.removeProperty('overflow');stopVideo();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});}
function show(source,label){
 if(!allowed.test(source))return;
 previousFocus=document.activeElement;
 title.textContent=label||'Reel original';
 external.href=source;
 slot.replaceChildren();
 const iframe=document.createElement('iframe');
 iframe.title=`Vídeo original: ${label||'Reel da CASTLE'}`;
 iframe.src=source+'embed/';
 iframe.loading='lazy';iframe.allow='fullscreen';
 iframe.referrerPolicy='strict-origin-when-cross-origin';
 slot.append(iframe);
 modal.hidden=false;document.body.style.overflow='hidden';
 closeBtn.focus({preventScroll:true});
}
document.querySelectorAll('[data-reel]').forEach(button=>button.addEventListener('click',()=>show(button.dataset.reel,button.dataset.title)));
modal.querySelectorAll('[data-close-reel]').forEach(button=>button.addEventListener('click',hide));
document.addEventListener('keydown',event=>{
 if(modal.hidden)return;
 if(event.key==='Escape'){event.preventDefault();hide();return;}
 if(event.key==='Tab'){
 const focusable=[...modal.querySelectorAll('button:not([disabled]),a[href]')].filter(el=>el.getClientRects().length);
 if(!focusable.length)return;
 const first=focusable[0],last=focusable.at(-1);
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});
})();