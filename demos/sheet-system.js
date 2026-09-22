import {wait,esc} from './shared.js?v=20260922-showroom3';

const stages=['Planilha','Automação','Banco / Dados','Web App','Dashboard','Sistema Operacional'];
let rootRef=null,stage=0,running=false,guideText='',guideToken=0,feedback='Pronto para transformar a operação.',elapsed='—';

const rows=[
  ['Mercado Horizonte','(21) 98888-1200','PED-8841','Pendente','R$ 420,00'],
  ['Drogaria Central','(21) 98888-1201','PED-8842','Manual','R$ 535,00'],
  ['Casa Nova','(21) 98888-1202','PED-8843','Manual','R$ 650,00'],
  ['Rede Mais','(21) 98888-1203','PED-8844','Pendente','R$ 765,00'],
  ['Loja Oeste','(21) 98888-1204','PED-8845','Manual','R$ 880,00'],
  ['Farma Rio','(21) 98888-1205','PED-8846','Manual','R$ 995,00'],
  ['Mercado Sul','(21) 98888-1206','PED-8847','Pendente','R$ 1.110,00'],
  ['Casa Center','(21) 98888-1207','PED-8848','Manual','R$ 1.225,00']
];

const badge=(status)=>status==='Pendente'
  ? '<span class="sheet-status pending">Pendente</span>'
  : '<span class="sheet-status manual">Manual</span>';

const render=()=>{
  if(!rootRef)return;
  const after=stage>=5;
  const visibleRows=rows.slice(0,Math.min(rows.length,4+stage));
  rootRef.innerHTML=`<div class="miniapp"><div class="miniapp-shell">
    ${guideText?'<div class="demo-guide-banner"><strong>DEMONSTRAÇÃO GUIADA</strong><span>'+esc(guideText)+'</span></div>':''}

    <div class="miniapp-top demo-identification">
      <div class="miniapp-brand">
        <span class="miniapp-mark">V/</span>
        <div>Planilha → Sistema<small class="miniapp-muted">Evolução gradual sem romper o processo existente</small></div>
      </div>
      <span class="mini-status ${after?'ok':'blue'}">${after?'Sistema operacional':'Evolução em andamento'}</span>
    </div>

    <div class="demo-challenge ${after?'completed':''}">
      <small>DESAFIO</small>
      <strong>${after?'✓ TRANSFORMAÇÃO CONCLUÍDA':'Evolua CLIENTES.xlsx até um sistema operacional.'}</strong>
      <p>${after?'A operação agora possui automação, dados centralizados, interface e dashboard.':'Execute a transformação ou avance manualmente pelas etapas.'}</p>
    </div>

    <div class="sheet-system-layout">
      <section class="sheet-workbook" aria-label="Planilha CLIENTES.xlsx">
        <div class="sheet-titlebar">
          <span class="sheet-window-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <strong>CLIENTES.xlsx</strong>
          <small>Base operacional fictícia</small>
        </div>
        <div class="sheet-table-wrap">
          <table class="sheet-table">
            <thead><tr><th>Nome</th><th>Telefone</th><th>Pedido</th><th>Status</th><th class="num">Valor</th></tr></thead>
            <tbody>
              ${visibleRows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td><strong>${esc(r[2])}</strong></td><td>${badge(r[3])}</td><td class="num">${esc(r[4])}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="sheet-problems">
          ${stage<2
            ? '<span>Mais registros</span><span>Processos manuais</span><span>Dados dispersos</span><span>Retrabalho</span>'
            : '<span class="resolved">Dados estruturados ✓</span><span class="resolved">Regras automatizadas ✓</span>'}
        </div>
      </section>

      <section class="sheet-system-result">
        <div class="system-frame-full ${after?'ready':''}">
          <aside><strong>V/ ERP</strong><span>Dashboard</span><span>Clientes</span><span>Pedidos</span><span>Entregas</span></aside>
          <main>
            <div class="mini-kpis"><b>128<small>Clientes</small></b><b>32<small>Pedidos</small></b><b>94,3%<small>OTIF</small></b><b>5<small>Pendências</small></b></div>
            <div class="micro-chart"><i style="height:40%"></i><i style="height:66%"></i><i style="height:82%"></i><i style="height:58%"></i></div>
            <div class="system-mini-table">
              <div><span>PED-8841</span><b>Processando</b></div>
              <div><span>PED-8842</span><b class="ok">Concluído</b></div>
            </div>
          </main>
        </div>
      </section>
    </div>

    <section class="sheet-pipeline-panel" aria-label="Pipeline Planilha para Sistema">
      <div class="sheet-data-packet" style="--packet-step:${stage}"><strong>PED-8841</strong><span>8 volumes</span></div>
      <div class="sheet-pipeline-line"></div>
      <div class="sheet-system-flow">
        ${stages.map((x,i)=>`<button class="${i<stage?'done':''} ${i===stage?'active':''}" data-sheet-stage-full="${i}">
          <b>0${i+1}</b><span>${x}</span><em>${i<stage?'✓':i===stage?'recebendo…':'aguardando'}</em>
        </button>`).join('')}
      </div>
    </section>

    <div class="before-after">
      <div><small>ANTES</small><strong>Planilhas</strong><span>Processos manuais · dados dispersos · retrabalho</span></div>
      <div class="${after?'active':''}"><small>DEPOIS</small><strong>Sistema centralizado</strong><span>Automação · dashboard · controle operacional</span></div>
    </div>

    <div class="demo-result-panel ${after?'success':''}">
      <div><small>RESULTADO</small><strong>${esc(feedback)}</strong></div>
      <dl>
        <div><dt>Pedido</dt><dd>PED-8841</dd></div>
        <div><dt>Tempo</dt><dd>${elapsed}</dd></div>
        <div><dt>Etapas</dt><dd>${stage+1}/6</dd></div>
        <div><dt>Erros</dt><dd>0</dd></div>
        <div><dt>Dashboard</dt><dd>${after?'Atualizado ✓':'Aguardando'}</dd></div>
      </dl>
    </div>

    <div class="miniapp-actions" style="margin-top:12px">
      <button class="mini-btn primary" id="sheet-run" ${running?'disabled':''}>${running?'Transformando…':'Executar transformação'}</button>
    </div>
  </div></div>`;
  bind();
};

const setStage=(next)=>{
  stage=Math.max(0,Math.min(stages.length-1,Number(next)||0));
  feedback=stage===0?'Planilha recebida.':stage===1?'Automação conectada.':stage===2?'Dados centralizados.':stage===3?'Web App disponível.':stage===4?'Dashboard sincronizado.':'Sistema operacional concluído ✓';
  if(stage<5)elapsed='—';
  render();
};

const bind=()=>{
  document.getElementById('sheet-run')?.addEventListener('click',()=>run(false));
  rootRef.querySelectorAll('[data-sheet-stage-full]').forEach(b=>b.addEventListener('click',()=>setStage(b.dataset.sheetStageFull)));
};

const run=async(fromGuide=false)=>{
  if(running)return;
  running=true;
  stage=0;
  feedback='Processando transformação…';
  elapsed='—';
  const started=performance.now();
  const token=++guideToken;
  render();
  for(let i=1;i<stages.length;i++){
    await wait(760);
    if(token!==guideToken)return;
    stage=i;
    feedback='Atualizando: '+stages[i]+'…';
    if(fromGuide)guideText='Evoluindo para '+stages[i]+'.';
    render();
  }
  running=false;
  elapsed=((performance.now()-started)/1000).toFixed(1).replace('.',',')+' s';
  feedback='Operação transformada e dashboard atualizado ✓';
  render();
};

const reset=()=>{
  guideToken++;
  stage=0;
  running=false;
  guideText='';
  feedback='Pronto para transformar a operação.';
  elapsed='—';
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
  return{reset,guide,cancelGuide(){guideToken++;running=false},destroy(){guideToken++;rootRef=null}};
}
