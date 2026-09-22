import {clone,esc,wait} from './shared.js?v=20260922-showroom4';

const initial={
  drivers:[
    {id:'M01',name:'Carlos Souza',route:'Oeste 01'},
    {id:'M02',name:'Marcos Lima',route:'Zona Sul 02'}
  ],
  routes:{
    'Oeste 01':[
      {seq:1,nf:'45821',client:'Mercado Horizonte',city:'Bangu',km:6.8,status:'Pendente'},
      {seq:2,nf:'45834',client:'Drogaria Central',city:'Campo Grande',km:11.4,status:'Pendente'},
      {seq:3,nf:'45842',client:'Casa Popular',city:'Santa Cruz',km:14.2,status:'Pendente'}
    ],
    'Zona Sul 02':[
      {seq:1,nf:'45901',client:'Loja Atlântico',city:'Botafogo',km:4.1,status:'Em rota'},
      {seq:2,nf:'45911',client:'Mercado Praia',city:'Copacabana',km:5.7,status:'Pendente'}
    ]
  }
};

let state=clone(initial),rootRef=null,driver='M01',guideText='',guideToken=0,feedback='Rota pronta para execução.';

const done=()=>state.routes['Oeste 01'][0].status==='Entregue';

const routeProgress=(list)=>{
  const delivered=list.filter(x=>x.status==='Entregue').length;
  const active=list.some(x=>x.status==='Em rota');
  if(delivered>=list.length)return 100;
  if(active)return Math.min(92,18+delivered*32);
  return delivered*32;
};

const nextStop=(list)=>{
  const next=list.find(x=>x.status!=='Entregue');
  return next?next.client:'Rota concluída';
};

const remainingKm=(list)=>list.filter(x=>x.status!=='Entregue').reduce((a,x)=>a+x.km,0);

const mapSvg=(list)=>{
  const progress=routeProgress(list);
  const markers=[
    {x:250,y:102,label:'1',item:list[0]},
    {x:430,y:205,label:'2',item:list[1]},
    {x:680,y:140,label:'3',item:list[2]}
  ].filter(x=>x.item);
  return `<svg class="route-map-svg" viewBox="0 0 760 300" role="img" aria-label="Mapa demonstrativo da rota Oeste 01">
    <defs>
      <pattern id="route-grid" width="58" height="58" patternUnits="userSpaceOnUse">
        <rect width="48" height="48" x="5" y="5" rx="5" fill="#eef2f6" stroke="#dfe5ec"/>
      </pattern>
      <linearGradient id="route-progress" x1="0" x2="1">
        <stop offset="0" stop-color="#3157ff"/>
        <stop offset="1" stop-color="#c9ff4a"/>
      </linearGradient>
    </defs>
    <rect width="760" height="300" fill="#f8fafc"/>
    <rect width="760" height="300" fill="url(#route-grid)" opacity=".78"/>
    <g class="map-roads">
      <path d="M40 70 H720 M60 230 H700 M120 20 V280 M360 10 V290 M610 15 V285" />
      <path d="M20 150 H740 M245 0 V300 M505 0 V300" />
    </g>

    <path class="route-track" d="M92 245 C145 225 160 150 250 102 S360 128 430 205 S570 205 680 140"/>
    <path class="route-track-progress" pathLength="100" stroke-dasharray="${progress} 100" d="M92 245 C145 225 160 150 250 102 S360 128 430 205 S570 205 680 140"/>

    <g class="route-depot" transform="translate(92 245)">
      <circle r="16"/><path d="M-6 2h12v7H-6zM-4-3h8l3 5H-7z"/><text y="34">DEPÓSITO</text>
    </g>

    ${markers.map(({x,y,label,item})=>`<g class="route-marker ${item.status==='Entregue'?'done':item.status==='Em rota'?'active':''}" transform="translate(${x} ${y})"><circle r="17"/><text y="4">${label}</text></g>`).join('')}

    <g class="route-vehicle" style="--progress:${progress}">
      <circle r="11"/><path d="M-5-2h10v6H-5zM-3-6h6l2 4H-5z"/>
    </g>
  </svg>`;
};

const render=()=>{
  const d=state.drivers.find(x=>x.id===driver);
  const list=state.routes[d.route];
  const km=list.reduce((a,x)=>a+x.km,0);
  const activeCount=list.filter(x=>x.status==='Em rota').length;
  const completeCount=list.filter(x=>x.status==='Entregue').length;
  rootRef.innerHTML=`<div class="miniapp"><div class="miniapp-shell">
    ${guideText?'<div class="demo-guide-banner"><strong>DEMONSTRAÇÃO GUIADA</strong><span>'+esc(guideText)+'</span></div>':''}

    <div class="miniapp-top demo-identification">
      <div class="miniapp-brand"><span class="miniapp-mark">V/</span><div>Roteirizador<small class="miniapp-muted">Planejamento operacional fictício</small></div></div>
      <select class="mini-select" id="route-driver">${state.drivers.map(x=>`<option value="${x.id}" ${x.id===driver?'selected':''}>${esc(x.name)} · ${x.route}</option>`).join('')}</select>
    </div>

    <div class="demo-challenge ${done()?'completed':''}">
      <small>DESAFIO</small>
      <strong>${done()?'✓ DESAFIO CONCLUÍDO':'Conclua a primeira parada da rota Oeste 01.'}</strong>
      <p>Altere a NF 45821 de Pendente → Em rota → Entregue e acompanhe mapa, KPIs e próxima parada.</p>
    </div>

    <div class="mini-kpis">
      <div class="mini-kpi"><small>Paradas</small><strong>${list.length}</strong></div>
      <div class="mini-kpi"><small>Distância total</small><strong>${km.toFixed(1)} km</strong></div>
      <div class="mini-kpi"><small>Em rota</small><strong>${activeCount}</strong></div>
      <div class="mini-kpi ok"><small>Concluídas</small><strong>${completeCount}</strong></div>
    </div>

    <div class="route-summary-strip">
      <div><small>Próxima parada</small><strong>${esc(nextStop(list))}</strong></div>
      <div><small>Distância restante</small><strong>${remainingKm(list).toFixed(1)} km</strong></div>
      <div><small>Motorista</small><strong>${esc(d.name)}</strong></div>
      <div><small>Rota</small><strong>${esc(d.route)}</strong></div>
    </div>

    <div class="mini-grid-2 route-layout">
      <section class="mini-panel">
        <div class="demo-section-title"><span>ÁREA OPERACIONAL</span><strong>Sequência de entregas</strong></div>
        <div class="route-list">
          ${list.map(x=>`<div class="route-line route-line-pro">
            <span class="route-num">${String(x.seq).padStart(2,'0')}</span>
            <div><strong>NF ${x.nf} · ${esc(x.client)}</strong><div class="miniapp-muted">${esc(x.city)} · ${x.km} km</div></div>
            <button class="mini-btn status-cycle ${x.status==='Entregue'?'done':x.status==='Em rota'?'active':''}" data-route-status="${x.nf}">${x.status}</button>
          </div>`).join('')}
        </div>
      </section>

      <section class="mini-panel">
        <div class="demo-section-title"><span>MAPA OPERACIONAL</span><strong>Rota demonstrativa</strong></div>
        <div class="route-map-pro">${mapSvg(list)}</div>
        <div class="route-map-legend"><span><i class="depot"></i>Depósito</span><span><i class="active"></i>Em rota</span><span><i class="done"></i>Concluída</span></div>
      </section>
    </div>

    <div class="demo-result-panel ${done()?'success':''}">
      <div><small>RESULTADO</small><strong>${esc(feedback)}</strong></div>
      <dl>
        <div><dt>Em rota</dt><dd>${activeCount}</dd></div>
        <div><dt>Concluídas</dt><dd>${completeCount}</dd></div>
        <div><dt>Próxima</dt><dd>${esc(nextStop(list))}</dd></div>
        <div><dt>Restante</dt><dd>${remainingKm(list).toFixed(1)} km</dd></div>
      </dl>
    </div>
  </div></div>`;
  bind();
};

const cycle=(x)=>{
  if(x.status==='Pendente'){
    x.status='Em rota';
    feedback='Rota iniciada. Veículo avançando para a primeira parada.';
  }else if(x.status==='Em rota'){
    x.status='Entregue';
    feedback='Entrega concluída ✓ Próxima parada recalculada.';
  }else{
    x.status='Pendente';
    feedback='Parada restaurada para teste.';
  }
  render();
};

const bind=()=>{
  document.getElementById('route-driver')?.addEventListener('change',e=>{
    driver=e.target.value;
    feedback='Motorista e rota atualizados.';
    render();
  });
  rootRef.querySelectorAll('[data-route-status]').forEach(b=>b.addEventListener('click',()=>{
    const d=state.drivers.find(x=>x.id===driver);
    const x=state.routes[d.route].find(y=>y.nf===b.dataset.routeStatus);
    cycle(x);
  }));
};

const reset=()=>{
  guideToken++;
  state=clone(initial);
  driver='M01';
  guideText='';
  feedback='Rota pronta para execução.';
  render();
};

const guide=async()=>{
  reset();
  const token=++guideToken;
  guideText='Selecionando Carlos Souza · Rota Oeste 01.';
  render();
  await wait(900);
  if(token!==guideToken)return;
  state.routes['Oeste 01'][0].status='Em rota';
  feedback='Em rota 0 → 1. Veículo deixou o depósito.';
  guideText='NF 45821 saiu para entrega.';
  render();
  await wait(1200);
  if(token!==guideToken)return;
  state.routes['Oeste 01'][0].status='Entregue';
  feedback='Concluídas 0 → 1. Próxima parada: Drogaria Central.';
  guideText='Primeira parada concluída; mapa e indicadores atualizados.';
  render();
};

export async function mount(root){
  rootRef=root;
  render();
  return{reset,guide,cancelGuide(){guideToken++},destroy(){guideToken++;rootRef=null}};
}
