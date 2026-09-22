const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const demos={};

const html={
stock:(s=0)=>`<div class="microapp micro-stock">
<div class="micro-kpis"><b>24<small>Produtos</small></b><b>386<small>Unidades</small></b><b class="${s?'warn':''}">${s?4:3}<small>Estoque baixo</small></b><b>18<small>Saídas hoje</small></b></div>
<div class="micro-table"><span>SKU</span><span>Produto</span><span>Saldo</span><span>Status</span>
<b>1001</b><b>Caixa reforçada</b><b>36</b><em>Normal</em>
<b>1002</b><b>Filme stretch</b><b class="${s?'drop':''}">${s?8:13}</b><em class="${s?'alert':''}">${s?'Baixo':'Normal'}</em>
<b>1003</b><b>Etiqueta logística</b><b>48</b><em>Normal</em></div>
<div class="micro-bars"><i style="--w:72%"></i><i class="${s?'low':''}" style="--w:${s?'22%':'38%'}"></i><i style="--w:86%"></i></div>
<div class="micro-alert ${s?'show':''}">⚠ Estoque mínimo atingido</div></div>`,
deliveries:(s=0)=>`<div class="microapp micro-deliveries">
<div class="micro-kpis"><b>24<small>Entregas</small></b><b class="warn">${s>=1?4:5}<small>Pendentes</small></b><b>${s===1?9:8}<small>Em rota</small></b><b class="ok">${s>=2?12:11}<small>Entregues</small></b></div>
<div class="micro-row"><strong>NF 45821</strong><span>Mercado Horizonte · Campo Grande</span><em class="${s===0?'warn':s===1?'blue':'ok'}">${s===0?'Pendente':s===1?'Em rota':'Entregue ✓'}</em></div>
<div class="micro-row"><strong>NF 45834</strong><span>Drogaria Central · Bangu</span><em class="blue">Em rota</em></div>
<div class="micro-row"><strong>NF 45851</strong><span>Casa Nova · Recreio</span><em class="ok">Entregue</em></div>
<div class="micro-proof">${s>=1?'GPS capturado ✓':''} ${s>=2?'· Comprovante anexado ✓ · Entrega finalizada ✓':''}</div></div>`,
erp:(s=0)=>`<div class="microapp micro-erp micro-erp-pro">
<aside><strong>V/ ERP</strong><span class="${s===0?'active':''}">Dashboard</span><span>Clientes</span><span>Produtos</span><span class="${s===2?'active':''}">Estoque</span><span class="${s===1?'active':''}">Pedidos</span><span>Entregas</span></aside>
<main>
  <div class="micro-erp-title"><strong>Dashboard</strong><span>Operação em tempo real</span></div>
  <div class="micro-kpis"><b>128<small>Clientes</small></b><b>${s?33:32}<small>Pedidos</small></b><b>R$ 18,4k<small>Faturamento</small></b><b class="${s===2?'ok':''}">${s===2?5:6}<small>Pendências</small></b></div>
  <div class="micro-erp-grid">
    <div class="micro-erp-table"><div><b>PED-8841</b><span>Mercado Horizonte</span><em class="${s===1?'blue':s===2?'ok':'warn'}">${s===0?'Aberto':s===1?'Processando':'Concluído'}</em></div><div><b>PED-8842</b><span>Drogaria Central</span><em class="ok">Concluído</em></div></div>
    <div class="micro-chart"><i style="height:42%"></i><i style="height:64%"></i><i style="height:${s===2?'88%':'72%'}"></i><i style="height:58%"></i></div>
  </div>
  <div class="micro-erp-event"><strong>${s===0?'Visão geral':s===1?'PED-8841 processando': 'Estoque reservado ✓'}</strong><span>${s===0?'Módulos integrados':s===1?'8 volumes · Mercado Horizonte':'Dashboard atualizado'}</span></div>
</main></div>`,
automation:(s=0)=>`<div class="microapp micro-auto"><div class="micro-sheet"><span>PED-8841</span><span>Mercado Horizonte</span><span>8 volumes</span><span class="${s>=4?'ok':''}">${s>=4?'Processado':'Pendente'}</span></div>
<div class="micro-flow">${['Nova linha','Validando','Apps Script','Processado','Relatório','Notificação'].map((x,i)=>`<b class="${i<s?'done':i===s?'active':''}">${x}</b>`).join('<i>→</i>')}</div>
<div class="micro-console">${[
'18:31:02 Entrada detectada','18:31:02 Validando registro','18:31:03 Processamento iniciado','18:31:03 Dashboard atualizado','18:31:04 Processo concluído'
].slice(0,Math.max(1,s)).map(x=>'<span>'+x+'</span>').join('')}</div></div>`,
dashboard:(s=0)=>`<div class="microapp micro-dashboard"><div class="micro-kpis"><b class="${s?'pulse':''}">${s?128:127}<small>Pedidos</small></b><b>${s?'94,3':'94,1'}%<small>OTIF</small></b><b class="warn">${s?7:8}<small>Pendências</small></b><b class="ok">119<small>Entregas</small></b></div><div class="micro-chart"><i style="height:34%"></i><i style="height:52%"></i><i style="height:${s?'82%':'70%'}"></i><i style="height:61%"></i><i style="height:74%"></i></div><div class="micro-live">● Atualizado ${s?'agora':'há poucos segundos'}</div></div>`,
routing:(s=0)=>`<div class="microapp micro-route"><div class="micro-route-head"><strong>Carlos Souza · Oeste 01</strong><span>3 paradas · 32,4 km</span></div><div class="micro-route-map"><svg viewBox="0 0 320 92" aria-hidden="true"><path class="road" d="M18 70 C70 64 72 25 118 27 S180 75 220 55 S265 22 302 34"/><path class="progress s${s}" d="M18 70 C70 64 72 25 118 27 S180 75 220 55 S265 22 302 34"/><circle class="depot" cx="18" cy="70" r="6"/><circle class="${s>0?'done':'active'}" cx="118" cy="27" r="7"/><circle class="${s>1?'done':s===1?'active':''}" cx="220" cy="55" r="7"/><circle cx="302" cy="34" r="7"/></svg></div>${['Bangu · NF 45821','Campo Grande · NF 45834','Santa Cruz · NF 45842'].map((x,i)=>`<div class="micro-route-stop ${i===s?'active':''}"><b>0${i+1}</b><span>${x}</span><em>${i<s?'Concluída':i===s?'Próxima':'Pendente'}</em></div>`).join('')}</div>`,
driver:(s=0)=>`<div class="microapp micro-phone"><div class="micro-phone-top">Olá, Carlos <span>8 entregas hoje</span></div><div class="micro-next"><small>PRÓXIMA ENTREGA</small><strong>NF 45821</strong><span>Mercado Horizonte</span><em>Campo Grande — RJ</em></div><button>${['INICIAR ROTA','GPS CAPTURADO ✓','EM ROTA','CHEGADA AO CLIENTE','COMPROVANTE ANEXADO ✓','ENTREGA CONCLUÍDA ✓'][Math.min(s,5)]}</button><div class="micro-phone-foot">${s>=5?'7 entregas restantes':'Rota Oeste 01'}</div></div>`,
integrations:(s=0)=>`<div class="microapp micro-integration"><div class="micro-payload">PED-8841 <span>8 volumes</span></div><div class="micro-int-flow">${['Sheets','Automação','Web App','ERP','Dashboard','Notificação'].map((x,i)=>`<div class="${i<s?'done':i===s?'active':''}"><b>${x}</b><span>${i<s?'✓':i===s?'recebendo…':'—'}</span></div>`).join('<i>→</i>')}</div><div class="micro-process">${s>=5?'PROCESSO CONCLUÍDO · 1,8 s':'Dado viajando entre sistemas'}</div></div>`,
'sheet-system':(s=0)=>`<div class="microapp micro-sheet-system" data-stage="${s}">
<div class="micro-sheet-window"><div class="micro-sheet-title"><i></i><i></i><i></i><strong>CLIENTES.xlsx</strong></div><div class="micro-sheet-grid-pro"><b>Nome</b><b>Pedido</b><b>Status</b><span>Mercado Horizonte</span><span>PED-8841</span><em>Pendente</em><span>Drogaria Central</span><span>PED-8842</span><em>Manual</em></div></div>
<div class="sheet-pipeline sheet-pipeline-pro">${['Planilha','Automação','Dados','Web App','Dashboard','Sistema'].map((x,i)=>`<b class="${i<=s?'on':''}">${x}</b>`).join('<span>→</span>')}</div>
<div class="sheet-after"><strong>${s<3?'Processos manuais':'Sistema operacional'}</strong><span>${s<3?'dados dispersos · retrabalho':'automação · dashboard · controle'}</span></div></div>`
};

const configs={
stock:{max:1,delay:1500},deliveries:{max:2,delay:1250},erp:{max:2,delay:1450},automation:{max:5,delay:900},dashboard:{max:1,delay:1400},routing:{max:2,delay:1350},driver:{max:5,delay:950},integrations:{max:5,delay:900},'sheet-system':{max:5,delay:950}
};

document.querySelectorAll('[data-microdemo]').forEach(el=>{
  const id=el.dataset.microdemo,cfg=configs[id]; if(!cfg||!html[id])return;
  let step=0,timer=null,active=false;
  const render=()=>{el.innerHTML=html[id](step)};
  const tick=()=>{if(!active||reduced)return;step=step>=cfg.max?0:step+1;render();timer=setTimeout(tick,cfg.delay)};
  const start=()=>{if(reduced||active)return;active=true;clearTimeout(timer);timer=setTimeout(tick,320)};
  const stop=()=>{active=false;clearTimeout(timer)};
  render();
  const card=el.closest('.showroom-card');
  card?.addEventListener('mouseenter',start);
  card?.addEventListener('focusin',start);
  card?.addEventListener('mouseleave',stop);
  card?.addEventListener('focusout',e=>{if(!card.contains(e.relatedTarget))stop()});
  demos[id]={start,stop,reset:()=>{step=0;render()}};
});

if('IntersectionObserver'in window&&!reduced){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const id=entry.target.dataset.microdemo;
    if(entry.isIntersecting&&window.innerWidth<=820)demos[id]?.start();
    else if(window.innerWidth<=820)demos[id]?.stop();
  }),{threshold:.6});
  document.querySelectorAll('[data-microdemo]').forEach(el=>observer.observe(el));
}
