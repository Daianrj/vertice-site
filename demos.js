import { toast } from './demos/shared.js';

const modules = {
  stock:{title:'Controle de Estoque',path:'./demos/stock.js'},
  deliveries:{title:'Sistema de Entregas',path:'./demos/deliveries.js'},
  erp:{title:'ERP Operacional',path:'./demos/erp.js'},
  automation:{title:'Automação / Apps Script',path:'./demos/automation.js'},
  dashboard:{title:'Dashboard Executivo',path:'./demos/dashboard.js'},
  routing:{title:'Logística / Roteirizador',path:'./demos/routing.js'},
  driver:{title:'Aplicativo do Motorista',path:'./demos/driver.js'},
  integrations:{title:'Integrações',path:'./demos/integrations.js'}
};

const shell=document.getElementById('demo-shell');
const stage=document.getElementById('demo-shell-stage');
const title=document.getElementById('demo-shell-title');
const loading=document.getElementById('demo-shell-loading');
const reset=document.getElementById('demo-shell-reset');
const wa=document.getElementById('demo-shell-whatsapp');
let active=null, trigger=null;

document.querySelectorAll('[data-demo-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-demo-filter]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
  const f=btn.dataset.demoFilter;
  document.querySelectorAll('[data-demo-card]').forEach(card=>card.hidden=f!=='Todos' && card.dataset.category!==f);
}));

const close=()=>{
  if(!shell||shell.hidden)return;
  if(active?.destroy) active.destroy();
  shell.hidden=true; document.body.classList.remove('modal-open'); stage.innerHTML=''; active=null;
  if(trigger) trigger.focus();
};

const open=async(btn)=>{
  const key=btn.dataset.demo, meta=modules[key]; if(!meta)return;
  trigger=btn; title.textContent=meta.title; shell.hidden=false; document.body.classList.add('modal-open');
  loading.classList.add('active'); stage.innerHTML='';
  wa.href='https://wa.me/5521993836880?text='+encodeURIComponent('Olá! Testei a demonstração do '+meta.title+' da VÉRTICE e gostaria de conversar sobre uma solução semelhante para minha empresa.');
  try{
    const mod=await import(meta.path+'?v=20260922-showroom1');
    active=await mod.mount(stage,{toast});
  }catch(err){
    stage.innerHTML='<div class="miniapp"><div class="mini-panel"><strong>Não foi possível carregar esta demonstração.</strong><p class="miniapp-muted">Tente novamente em instantes.</p></div></div>';
    console.error(err);
  }finally{
    loading.classList.remove('active'); document.getElementById('demo-shell-close')?.focus();
  }
};

document.querySelectorAll('[data-demo]').forEach(btn=>btn.addEventListener('click',()=>open(btn)));
document.querySelectorAll('[data-demo-close]').forEach(btn=>btn.addEventListener('click',close));
reset?.addEventListener('click',()=>{ if(active?.reset){active.reset();toast('Dados fictícios restaurados.');}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&shell&&!shell.hidden){e.preventDefault();close();return;}
  if(e.key==='Tab'&&shell&&!shell.hidden){
    const f=[...shell.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);
    if(!f.length)return; const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
