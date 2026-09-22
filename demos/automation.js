import {esc,wait} from './shared.js?v=20260922-showroom4';

const steps=[
  'Nova linha detectada',
  'Validando dados',
  'Dados válidos ✓',
  'Apps Script executando',
  'Pedido processado',
  'Relatório atualizado',
  'Notificação enviada ✓'
];

const logLines=[
  '18:31:02 Entrada detectada',
  '18:31:02 Validando registro...',
  '18:31:03 Dados válidos',
  '18:31:03 Apps Script executando',
  '18:31:04 Pedido PED-8841 processado',
  '18:31:04 Dashboard atualizado',
  '18:31:05 Notificação enviada',
  '18:31:05 Processo concluído ✓'
];

let rootRef=null,running=false,active=-1,guideText='',guideToken=0,elapsed='—';

const done=()=>active>=steps.length-1;

const logs=()=>{
  const count=active<0?1:Math.min(logLines.length,active+2);
  return logLines.slice(0,count).map((x,i)=>i===count-1?'<b>'+esc(x)+'</b>':esc(x)).join('<br>');
};

const render=()=>{
  if(!rootRef)return;
  rootRef.innerHTML=`<div class="miniapp"><div class="miniapp-shell">
    ${guideText?'<div class="demo-guide-banner"><strong>DEMONSTRAÇÃO GUIADA</strong><span>'+esc(guideText)+'</span></div>':''}

    <div class="miniapp-top demo-identification">
      <div class="miniapp-brand"><span class="miniapp-mark">V/</span><div>Automação / Apps Script<small class="miniapp-muted">Planilha iniciando uma operação completa</small></div></div>
      <span class="mini-status ${done()?'ok':running?'blue':'warn'}">${done()?'Concluído ✓':running?'Processando...':'Aguardando execução'}</span>
    </div>

    <div class="demo-challenge ${done()?'completed':''}">
      <small>DESAFIO</small>
      <strong>${done()?'✓ DESAFIO CONCLUÍDO':'Execute o processamento do pedido.'}</strong>
      <p>${done()?'Você transformou uma linha de planilha em processamento, dashboard e notificação.':'Clique em Executar automação e acompanhe cada etapa.'}</p>
    </div>

    <div class="automation-workspace">
      <section class="mini-panel">
        <div class="demo-section-title"><span>DADOS DE ENTRADA</span><strong>Planilha operacional</strong></div>
        <div class="auto-sheet-table">
          <div class="auto-sheet-head"><span>Pedido</span><span>Cliente</span><span>Volumes</span><span>Status</span></div>
          <div class="auto-sheet-row"><strong>PED-8841</strong><span>Mercado Horizonte</span><span>8</span><span><em class="${done()?'ok':'warn'}">${done()?'Processado':'Pendente'}</em></span></div>
        </div>

        <div class="automation-pipeline" aria-label="Etapas da automação">
          <div class="automation-data-packet" style="--auto-step:${Math.max(0,Math.min(active,6))}"><strong>PED-8841</strong><span>8 volumes</span></div>
          <div class="automation-rail"></div>
          <div class="automation-nodes">
            ${steps.map((s,i)=>`<div class="automation-node ${i<active?'done':i===active?'active':''}"><b>0${i+1}</b><span>${s}</span><em>${i<active?'✓':i===active?'processando…':'aguardando'}</em></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="mini-panel">
        <div class="demo-section-title"><span>PROCESSAMENTO</span><strong>Console de execução</strong></div>
        <div class="mini-log automation-console">${logs()}</div>
        <p class="miniapp-muted">PLANILHA NÃO PRECISA SER APENAS PLANILHA. Ela pode iniciar uma operação completa.</p>
      </section>
    </div>

    <div class="demo-result-panel ${done()?'success':''}">
      <div><small>RESULTADO</small><strong>${done()?'Pedido processado e notificação enviada ✓':running?'Processando pedido...':'Pronto para executar'}</strong></div>
      <dl>
        <div><dt>Pedido</dt><dd>PED-8841</dd></div>
        <div><dt>Tempo</dt><dd>${elapsed}</dd></div>
        <div><dt>Etapas</dt><dd>${Math.max(0,active+1)}/7</dd></div>
        <div><dt>Erros</dt><dd>0</dd></div>
        <div><dt>Dashboard</dt><dd>${active>=5?'Atualizado ✓':'Aguardando'}</dd></div>
      </dl>
    </div>

    <div class="miniapp-actions" style="margin-top:12px">
      <button class="mini-btn primary" id="auto-run" ${running?'disabled':''}>${running?'Executando automação…':'Executar automação'}</button>
    </div>
  </div></div>`;

  document.getElementById('auto-run')?.addEventListener('click',()=>run(false));
};

const run=async(fromGuide=false)=>{
  if(running)return;
  running=true;
  active=-1;
  elapsed='—';
  const started=performance.now();
  const token=++guideToken;
  render();

  for(let i=0;i<steps.length;i++){
    if(token!==guideToken)return;
    active=i;
    if(fromGuide)guideText=steps[i];
    render();
    await wait(650);
  }

  if(token!==guideToken)return;
  running=false;
  elapsed=((performance.now()-started)/1000).toFixed(1).replace('.',',')+' s';
  render();
};

const reset=()=>{
  guideToken++;
  running=false;
  active=-1;
  guideText='';
  elapsed='—';
  render();
};

const guide=async()=>{
  reset();
  guideText='Uma nova linha acabou de entrar na planilha.';
  render();
  await wait(800);
  return run(true);
};

export async function mount(root){
  rootRef=root;
  render();
  return{reset,guide,cancelGuide(){guideToken++;running=false},destroy(){guideToken++;rootRef=null}};
}
