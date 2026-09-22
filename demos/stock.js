import {clone,esc,uid,barChart,wait} from './shared.js?v=20260922-showroom5';
const initial=[
{id:'SKU-1001',name:'Caixa reforçada 40x30',category:'Embalagens',stock:36,min:20},
{id:'SKU-1002',name:'Filme stretch 50cm',category:'Embalagens',stock:23,min:18},
{id:'SKU-1003',name:'Etiqueta térmica 100x150',category:'Suprimentos',stock:48,min:15},
{id:'SKU-1004',name:'Lacre numerado azul',category:'Segurança',stock:7,min:10}
];
let state=clone(initial),rootRef=null,query='',filter='Todos',editId=null,causeStep=0,guideText='',guideToken=0;
const challengeDone=()=>state.find(p=>p.id==='SKU-1002')?.stock<=18;
const challengeHtml=()=>`<div class="demo-challenge ${challengeDone()?'completed':''}"><small>DESAFIO</small><strong>${challengeDone()?'✓ DESAFIO CONCLUÍDO':'Faça o estoque do Filme Stretch atingir o mínimo.'}</strong><p>${challengeDone()?'Você acabou de provocar um alerta operacional e os indicadores reagiram.':'Use a saída de estoque no SKU-1002 e observe saldo, alerta, KPI e gráfico.'}</p></div>`;
const causeHtml=()=>`<div class="demo-cause-flow"><span class="${causeStep>=1?'done':''}">Registrar saída</span><i>→</i><span class="${causeStep>=2?'done':''}">Saldo diminui</span><i>→</i><span class="${causeStep>=3?'done':''}">Mínimo detectado</span><i>→</i><span class="${causeStep>=4?'done':''}">Alerta criado</span><i>→</i><span class="${causeStep>=5?'done':''}">Dashboard atualizado</span></div>`;
const render=()=>{
 const root=rootRef;if(!root)return;
 const visible=state.filter(p=>(filter==='Todos'||p.category===filter)&&(!query||[p.id,p.name].join(' ').toLowerCase().includes(query.toLowerCase())));
 const low=state.filter(p=>p.stock<=p.min).length,total=state.reduce((a,p)=>a+p.stock,0);
 root.innerHTML=`<div class="miniapp"><div class="miniapp-shell">
 ${guideText?'<div class="demo-guide-banner"><strong>DEMONSTRAÇÃO GUIADA</strong><span>'+esc(guideText)+'</span></div>':''}
 <div class="miniapp-top"><div class="miniapp-brand"><span class="miniapp-mark">V/</span><div>Controle de Estoque<small class="miniapp-muted">Operação fictícia local</small></div></div><button class="mini-btn primary" data-act="new">+ Cadastrar produto</button></div>
 ${challengeHtml()}${causeHtml()}
 <div class="mini-kpis"><div class="mini-kpi"><small>SKUs ativos</small><strong>${state.length}</strong></div><div class="mini-kpi"><small>Unidades em estoque</small><strong>${total}</strong></div><div class="mini-kpi warn"><small>Abaixo do mínimo</small><strong>${low}</strong></div><div class="mini-kpi ok"><small>Saúde do estoque</small><strong>${Math.max(0,100-low*12)}%</strong></div></div>
 <div class="mini-grid-2"><div class="mini-panel"><strong>Saldo por SKU</strong>${barChart(state.map(p=>({label:p.id.replace('SKU-',''),value:p.stock})))}</div><div class="mini-panel"><strong>Filtros</strong><div class="miniapp-toolbar" style="margin-top:12px"><input class="mini-input" id="stock-q" placeholder="Pesquisar SKU ou produto" value="${esc(query)}"><select class="mini-select" id="stock-f"><option>Todos</option>${[...new Set(state.map(p=>p.category))].map(x=>`<option ${x===filter?'selected':''}>${esc(x)}</option>`).join('')}</select></div><p class="miniapp-muted" style="margin-top:14px">Uma movimentação altera saldo, alerta, KPI e gráfico no mesmo estado local.</p></div></div>
 <div class="mini-table-wrap" style="margin-top:12px"><table class="mini-table"><thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th>Saldo</th><th>Mínimo</th><th>Status</th><th>Ações</th></tr></thead><tbody>${visible.map(p=>`<tr ${p.id==='SKU-1002'?'data-challenge-row':''}><td>${esc(p.id)}</td><td>${esc(p.name)}</td><td>${esc(p.category)}</td><td><strong>${p.stock}</strong></td><td>${p.min}</td><td><span class="mini-status ${p.stock<=p.min?'warn':'ok'}">${p.stock<=p.min?'Estoque baixo':'Normal'}</span></td><td><button class="mini-btn" data-act="in" data-id="${p.id}">+5</button> <button class="mini-btn" data-act="out" data-id="${p.id}">-5</button> <button class="mini-btn" data-act="edit" data-id="${p.id}">Editar</button> <button class="mini-btn danger" data-act="del" data-id="${p.id}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="7" class="mini-empty">Nenhum produto encontrado.</td></tr>'}</tbody></table></div>
 ${editId!==null?formHtml():''}
 </div></div>`; bind();
};
const formHtml=()=>{const p=editId==='new'?{id:'',name:'',category:'Embalagens',stock:0,min:0}:state.find(x=>x.id===editId);return `<div class="mini-panel" style="margin-top:12px"><strong>${editId==='new'?'Cadastrar produto':'Editar produto'}</strong><form class="mini-form" id="stock-form" style="margin-top:12px"><label>SKU<input class="mini-input" name="id" value="${esc(p.id)}" ${editId!=='new'?'readonly':''} required></label><label>Produto<input class="mini-input" name="name" value="${esc(p.name)}" required></label><label>Categoria<input class="mini-input" name="category" value="${esc(p.category)}" required></label><label>Estoque mínimo<input class="mini-input" type="number" min="0" name="min" value="${p.min}" required></label>${editId==='new'?'<label>Estoque inicial<input class="mini-input" type="number" min="0" name="stock" value="0" required></label>':''}<div class="full miniapp-actions"><button class="mini-btn primary">Salvar</button><button class="mini-btn" type="button" data-act="cancel">Cancelar</button></div></form></div>`;};
const move=(id,delta)=>{const p=state.find(x=>x.id===id);if(!p)return;p.stock=Math.max(0,p.stock+delta);causeStep=1;render();setTimeout(()=>{causeStep=challengeDone()?5:2;render()},180)};
const bind=()=>{
 document.getElementById('stock-q')?.addEventListener('input',e=>{query=e.target.value;render()});
 document.getElementById('stock-f')?.addEventListener('change',e=>{filter=e.target.value;render()});
 rootRef.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.act,id=b.dataset.id;
  if(a==='new'){editId='new';render()} if(a==='cancel'){editId=null;render()}
  if(a==='edit'){editId=id;render()} if(a==='del'){state=state.filter(x=>x.id!==id);render()}
  if(a==='in')move(id,5); if(a==='out')move(id,-5);
 }));
 document.getElementById('stock-form')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);if(editId==='new'){state.push({id:String(f.get('id')||uid('SKU')),name:String(f.get('name')),category:String(f.get('category')),stock:Number(f.get('stock')),min:Number(f.get('min'))})}else{const p=state.find(x=>x.id===editId);Object.assign(p,{name:String(f.get('name')),category:String(f.get('category')),min:Number(f.get('min'))})}editId=null;render()});
};
const reset=()=>{guideToken++;state=clone(initial);query='';filter='Todos';editId=null;causeStep=0;guideText='';render()};
const guide=async()=>{reset();const token=++guideToken;guideText='Localizando Filme Stretch e simulando uma saída operacional.';render();await wait(1100);if(token!==guideToken)return;causeStep=1;guideText='Registrando saída de 5 unidades.';move('SKU-1002',-5);await wait(1200);if(token!==guideToken)return;causeStep=5;guideText='O saldo atingiu o mínimo; alerta, KPI e gráfico foram atualizados.';render();await wait(1600);if(token!==guideToken)return;guideText='OPERAÇÃO CONCLUÍDA — tudo aconteceu dentro da própria demonstração.';render()};
export async function mount(root){rootRef=root;render();return{reset,guide,cancelGuide(){guideToken++},destroy(){guideToken++;rootRef=null}}}
