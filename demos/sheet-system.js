import {wait,esc} from './shared.js?v=20260922-showroom3';

const stages=['Planilha','Automação','Banco / Dados','Web App','Dashboard','Sistema Operacional'];
let rootRef=null,stage=0,running=false,guideText='',guideToken=0;

const render=()=>{
  if(!rootRef)return;
  const after=stage>=5;
  const clients=['Mercado Horizonte','Drogaria Central','Casa Nova','Rede Mais','Loja Oeste','Farma Rio','Mercado Sul','Casa Center'];
  rootRef.innerHTML=`<div class="miniapp"><div class="miniapp-shell">
  ${guideText?'<div class="demo-guide-banner"><strong>DEMONSTRAÇÃO GUIADA</strong><span>'+esc(guideText)+'</span></div>':''}
  <div class="miniapp-top">
    <div class="miniapp-brand"><span class="miniapp-mark">V/</span><div>Planilha → Sistema<small class="miniapp-muted">Evolução gradual sem jogar fora o processo existente</small></div></div>
    <button class="mini-btn primary" id="sheet-run" ${running?'disabled':''}>${running?'Transformando…':'Executar transformação'}</button>
  </div>
  <div class="demo-challenge ${after?'completed':''}">
    <small>DESAFIO</small>
    <strong>${after?'✓ TRANSFORMAÇÃO CONCLUÍDA':'Evolua CLIENTES.xlsx até um sistema operacional.'}</strong>
    <p>${after?'A mesma operação agora possui automação, dados centralizados, interface e dashboard.':'Execute a transformação ou avance manualmente pelas etapas.'}</p>
  </div>
  <div class="sheet-system-full">
    <div class="sheet-system-before">
      <div class="transform-window-bar"><i></i><i></i><i></i><span>CLIENTES.xlsx</span></div>
      <div class="sheet-growth">
        <div class="sheet-head"><b>Nome</b><b>Telefone</b><b>Pedido</b><b>Status</b><b>Valor</b></div>
        ${Array.from({length:Math.min(8,4+stage)},(_,i)=>`<div class="sheet-row"><span>${clients[i]}</span><span>(21) 9••••-${1200+i}</span><span>PED-${8841+i}</span><span>${i%3===0?'Pendente':'Manual'}</span><span>R$ ${(420+i*115).toLocaleString('pt-BR')}</span></div>`).join('')}
      </div>
      <div class="sheet-problems">
        ${stage<2?'<span>Mais registros</span><span>Processos manuais</span><span>Dados dispersos</span><span>Retrabalho</span>':'<span class="resolved">Dados estruturados ✓</span><span class="resolved">Regras automatizadas ✓</span>'}
      </div>
    </div>

    <div class="sheet-system-flow">
      ${stages.map((x,i)=>`<button class="${i<=stage?'done':''} ${i===stage?'active':''}" data-sheet-stage-full="${i}"><b>0${i+1}</b><span>${x}</span></button>`).join('<i>→</i>')}
    </div>

    <div class="sheet-system-result">
      <div class="system-frame-full ${after?'ready':''}">
        <aside><strong>V/ ERP</strong><span>Dashboard</span><span>Clientes</span><span>Pedidos</span><span>Entregas</span></aside>
        <main>
          <div class="mini-kpis"><b>128<small>Clientes</small></b><b>32<small>Pedidos</small></b><b>94,3%<small>OTIF</small></b><b>5<small>Pendências</small></b></div>
          <div class="micro-chart"><i style="height:40%"></i><i style="height:66%"></i><i style="height:82%"></i><i style="height:58%"></i></div>
        </main>
      </div>
      <div class="before-after">
        <div><small>ANTES</small><strong>Planilhas</strong><span>Processos manuais · dados dispersos · retrabalho</span></div>
        <div class="${after?'active':''}"><small>DEPOIS</small><strong>Sistema centralizado</strong><span>Automação · dashboard · controle operacional</span></div>
      </div>
    </div>
  </div>
  ${after?'<div class="demo-complete"><strong>SUA OPERAÇÃO PODE COMEÇAR EM UMA PLANILHA E EVOLUIR PARA UM SISTEMA COMPLETO.</strong><p>Tudo o que você viu foi construído dentro desta demonstração.</p></div>':''}
  </div></div>`;
  bind();
};

const bind=()=>{
  document.getElementById('sheet-run')?.addEventListener('click',()=>run(false));
  rootRef.querySelectorAll('[data-sheet-stage-full]').forEach(b=>b.addEventListener('click',()=>{
    stage=Number(b.dataset.sheetStageFull);
    render();
  }));
};

const run=async(fromGuide=false)=>{
  if(running)return;
  running=true;
  stage=0;
  const token=++guideToken;
  render();
  for(let i=1;i<stages.length;i++){
    await wait(750);
    if(token!==guideToken)return;
    stage=i;
    if(fromGuide)guideText='Evoluindo para '+stages[i]+'.';
    render();
  }
  running=false;
  render();
};

const reset=()=>{
  guideToken++;
  stage=0;
  running=false;
  guideText='';
  render();
};

const guide=async()=>{
  reset();
  guideText='A operação começa em CLIENTES.xlsx, com processos manuais e dados dispersos.';
  render();
  await wait(950);
  return run(true);
};

export async function mount(root){
  rootRef=root;
  render();
  return{
    reset,
    guide,
    cancelGuide(){guideToken++;running=false},
    destroy(){guideToken++;rootRef=null}
  };
}
