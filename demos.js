import { toast } from './demos/shared.js?v=20260922-showroom5';

const modules = {
  stock:{title:'Controle de Estoque',path:'./demos/stock.js',cta:'QUERO UM CONTROLE DE ESTOQUE ASSIM',message:'Olá! Vi a demonstração de Controle de Estoque no site da VÉRTICE e gostaria de entender como uma solução semelhante poderia funcionar na minha empresa.'},
  deliveries:{title:'Sistema de Entregas',path:'./demos/deliveries.js',cta:'QUERO MELHORAR MINHAS ENTREGAS',message:'Olá! Testei a demonstração do Sistema de Entregas da VÉRTICE e quero melhorar minhas entregas com uma solução semelhante.'},
  erp:{title:'ERP Operacional',path:'./demos/erp.js',cta:'QUERO UM ERP PARA MINHA EMPRESA',message:'Olá! Testei o ERP Operacional da VÉRTICE e gostaria de conversar sobre um ERP sob medida para minha empresa.'},
  automation:{title:'Automação / Apps Script',path:'./demos/automation.js',cta:'QUERO AUTOMATIZAR MEU PROCESSO',message:'Olá! Vi a demonstração de Automação / Apps Script da VÉRTICE e quero automatizar um processo da minha empresa.'},
  dashboard:{title:'Dashboard Executivo',path:'./demos/dashboard.js',cta:'QUERO UM DASHBOARD ASSIM',message:'Olá! Testei o Dashboard Executivo da VÉRTICE e gostaria de criar indicadores semelhantes para minha operação.'},
  routing:{title:'Logística / Roteirizador',path:'./demos/routing.js',cta:'QUERO OTIMIZAR MINHAS ROTAS',message:'Olá! Testei a demonstração de Logística / Roteirizador da VÉRTICE e quero otimizar minhas rotas e entregas.'},
  driver:{title:'Aplicativo do Motorista',path:'./demos/driver.js',cta:'QUERO DIGITALIZAR MINHA OPERAÇÃO',message:'Olá! Testei o Aplicativo do Motorista da VÉRTICE e quero digitalizar minha operação de entregas.'},
  integrations:{title:'Integrações',path:'./demos/integrations.js',cta:'QUERO INTEGRAR MEUS SISTEMAS',message:'Olá! Testei a demonstração de Integrações da VÉRTICE e quero integrar os sistemas e dados da minha empresa.'},
  'sheet-system':{title:'Planilha → Sistema',path:'./demos/sheet-system.js',cta:'QUERO TRANSFORMAR MINHA PLANILHA',message:'Olá! Vi a demonstração Planilha → Sistema da VÉRTICE e quero entender como transformar minha planilha em um sistema profissional.'}
};

const shell=document.getElementById('demo-shell');
const stage=document.getElementById('demo-shell-stage');
const title=document.getElementById('demo-shell-title');
const loading=document.getElementById('demo-shell-loading');
const reset=document.getElementById('demo-shell-reset');
const guide=document.getElementById('demo-shell-guide');
const wa=document.getElementById('demo-shell-whatsapp');
let active=null, trigger=null, currentKey=null;

document.querySelectorAll('[data-demo-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-demo-filter]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
  const filter=btn.dataset.demoFilter;
  document.querySelectorAll('[data-demo-card]').forEach(card=>{
    const categories=(card.dataset.category||'').split('|');
    card.hidden=filter!=='Todos'&&!categories.includes(filter);
  });
}));

const enhanceResponsiveTables=()=>{
  stage.querySelectorAll('table').forEach(table=>{
    const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    if(!headers.length)return;
    table.classList.add('responsive-demo-table');
    table.querySelectorAll('tbody tr').forEach(row=>{
      [...row.children].forEach((cell,index)=>{
        if(headers[index]) cell.setAttribute('data-label',headers[index]);
      });
    });
  });
  stage.querySelectorAll('.demo-result-panel,.demo-guide-banner').forEach(el=>el.setAttribute('aria-live','polite'));
};

const stopActive=()=>{
  if(active?.cancelGuide) active.cancelGuide();
  if(active?.destroy) active.destroy();
};

const close=()=>{
  if(!shell||shell.hidden)return;
  stopActive();
  shell.hidden=true;
  document.body.classList.remove('modal-open');
  stage.innerHTML='';
  active=null;
  currentKey=null;
  if(trigger) trigger.focus();
};

const open=async(btn)=>{
  const key=btn.dataset.demo, meta=modules[key]; if(!meta)return;
  trigger=btn;
  currentKey=key;
  title.textContent=meta.title;
  shell.hidden=false;
  document.body.classList.add('modal-open');
  loading.classList.add('active');
  stage.innerHTML='';
  guide.disabled=true;
  guide.textContent='▶ Ver demonstração guiada';
  wa.textContent=meta.cta+' ↗';
  wa.href='https://wa.me/5521993836880?text='+encodeURIComponent(meta.message);
  try{
    const mod=await import(meta.path+'?v=20260922-showroom5');
    active=await mod.mount(stage,{toast});
    enhanceResponsiveTables();
    guide.disabled=typeof active?.guide!=='function';
  }catch(err){
    stage.innerHTML='<div class="miniapp"><div class="mini-panel"><strong>Não foi possível carregar esta demonstração.</strong><p class="miniapp-muted">Tente novamente em instantes.</p></div></div>';
    console.error(err);
  }finally{
    loading.classList.remove('active');
    document.getElementById('demo-shell-close')?.focus();
  }
};

document.querySelectorAll('[data-demo]').forEach(btn=>btn.addEventListener('click',()=>open(btn)));
document.querySelectorAll('[data-demo-close]').forEach(btn=>btn.addEventListener('click',close));

reset?.addEventListener('click',()=>{
  if(active?.cancelGuide) active.cancelGuide();
  if(active?.reset){
    active.reset();
    guide.textContent='▶ Ver demonstração guiada';
    toast('Dados fictícios restaurados.');
  }
});

guide?.addEventListener('click',async()=>{
  if(!active?.guide||guide.disabled)return;
  if(active?.cancelGuide) active.cancelGuide();
  guide.disabled=true;
  guide.textContent='Executando demonstração guiada…';
  try{
    await active.guide();
    guide.textContent='↻ Ver novamente';
  }catch(err){
    console.error(err);
    guide.textContent='▶ Ver demonstração guiada';
  }finally{
    guide.disabled=false;
  }
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&shell&&!shell.hidden){e.preventDefault();close();return;}
  if(e.key==='Tab'&&shell&&!shell.hidden){
    const focusable=[...shell.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
