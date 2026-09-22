import {clone,esc,uid,barChart} from './shared.js';
const initial=[
{id:'SKU-1001',name:'Caixa reforçada 40x30',category:'Embalagens',stock:36,min:20},
{id:'SKU-1002',name:'Filme stretch 50cm',category:'Embalagens',stock:12,min:18},
{id:'SKU-1003',name:'Etiqueta térmica 100x150',category:'Suprimentos',stock:48,min:15},
{id:'SKU-1004',name:'Lacre numerado azul',category:'Segurança',stock:7,min:10}
];
let state=clone(initial),rootRef=null,query='',filter='Todos',editId=null;
const render=()=>{
 const root=rootRef;if(!root)return;
 const visible=state.filter(p=>(filter==='Todos'||p.category===filter)&&(!query||[p.id,p.name].join(' ').toLowerCase().includes(query.toLowerCase())));
 const low=state.filter(p=>p.stock<=p.min).length,total=state.reduce((a,p)=>a+p.stock,0);
 root.innerHTML=`<div class="miniapp"><div class="miniapp-shell">
 <div class="miniapp-top"><div class="miniapp-brand"><span class="miniapp-mark">V/</span><div>Controle de Estoque<small class="miniapp-muted">Operação fictícia local</small></div></div><button class="mini-btn primary" data-act="new">+ Cadastrar produto</button></div>
 <div class="mini-kpis"><div class="mini-kpi"><small>SKUs ativos</small><strong>${state.length}</strong></div><div class="mini-kpi"><small>Unidades em estoque</small><strong>${total}</strong></div><div class="mini-kpi warn"><small>Abaixo do mínimo</small><strong>${low}</strong></div><div class="mini-kpi ok"><small>Saúde do estoque</small><strong>${Math.max(0,100-low*12)}%</strong></div></div>
 <div class="mini-grid-2"><div class="mini-panel"><strong>Saldo por SKU</strong>${barChart(state.map(p=>({label:p.id.replace('SKU-',''),value:p.stock})))}</div><div class="mini-panel"><strong>Filtros</strong><div class="miniapp-toolbar" style="margin-top:12px"><input class="mini-input" id="stock-q" placeholder="Pesquisar SKU ou produto" value="${esc(query)}"><select class="mini-select" id="stock-f"><option>Todos</option>${[...new Set(state.map(p=>p.category))].map(x=>`<option ${x===filter?'selected':''}>${esc(x)}</option>`).join('')}</select></div><p class="miniapp-muted" style="margin-top:14px">Registrar uma saída reduz o saldo, recalcula KPIs e pode gerar alerta de estoque mínimo.</p></div></div>
 <div class="mini-table-wrap" style="margin-top:12px"><table class="mini-table"><thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th>Saldo</th><th>Mínimo</th><th>Status</th><th>Ações</th></tr></thead><tbody>${visible.map(p=>`<tr><td>${esc(p.id)}</td><td>${esc(p.name)}</td><td>${esc(p.category)}</td><td><strong>${p.stock}</strong></td><td>${p.min}</td><td><span class="mini-status ${p.stock<=p.min?'warn':'ok'}">${p.stock<=p.min?'Estoque baixo':'Normal'}</span></td><td><button class="mini-btn" data-act="in" data-id="${p.id}">+10</button> <button class="mini-btn" data-act="out" data-id="${p.id}">-5</button> <button class="mini-btn" data-act="edit" data-id="${p.id}">Editar</button> <button class="mini-btn danger" data-act="del" data-id="${p.id}">Excluir</button></td></tr>`).join('')||'<tr><td colspan="7" class="mini-empty">Nenhum produto encontrado.</td></tr>'}</tbody></table></div>
 ${editId!==null?formHtml():''}
 </div></div>`;
 bind();
};
const formHtml=()=>{const p=editId==='new'?{id:'',name:'',category:'Embalagens',stock:0,min:0}:state.find(x=>x.id===editId);return `<div class="mini-panel" style="margin-top:12px"><strong>${editId==='new'?'Cadastrar produto':'Editar produto'}</strong><form class="mini-form" id="stock-form" style="margin-top:12px"><label>SKU<input class="mini-input" name="id" value="${esc(p.id)}" ${editId!=='new'?'readonly':''} required></label><label>Produto<input class="mini-input" name="name" value="${esc(p.name)}" required></label><label>Categoria<input class="mini-input" name="category" value="${esc(p.category)}" required></label><label>Estoque mínimo<input class="mini-input" type="number" min="0" name="min" value="${p.min}" required></label>${editId==='new'?'<label>Estoque inicial<input class="mini-input" type="number" min="0" name="stock" value="0" required></label>':''}<div class="full miniapp-actions"><button class="mini-btn primary">Salvar</button><button class="mini-btn" type="button" data-act="cancel">Cancelar</button></div></form></div>`;};
const bind=()=>{
 document.getElementById('stock-q')?.addEventListener('input',e=>{query=e.target.value;render()});
 document.getElementById('stock-f')?.addEventListener('change',e=>{filter=e.target.value;render()});
 rootRef.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.act,id=b.dataset.id;
  if(a==='new'){editId='new';render()} if(a==='cancel'){editId=null;render()}
  if(a==='edit'){editId=id;render()} if(a==='del'){state=state.filter(x=>x.id!==id);render()}
  if(a==='in'||a==='out'){const p=state.find(x=>x.id===id);if(p){p.stock=Math.max(0,p.stock+(a==='in'?10:-5));render();}}
 }));
 document.getElementById('stock-form')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);if(editId==='new'){state.push({id:String(f.get('id')||uid('SKU')),name:String(f.get('name')),category:String(f.get('category')),stock:Number(f.get('stock')),min:Number(f.get('min'))})}else{const p=state.find(x=>x.id===editId);Object.assign(p,{name:String(f.get('name')),category:String(f.get('category')),min:Number(f.get('min'))})}editId=null;render()});
};
export async function mount(root){rootRef=root;render();return{reset(){state=clone(initial);query='';filter='Todos';editId=null;render()},destroy(){rootRef=null}}}
