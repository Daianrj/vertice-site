export const clone = (v) => JSON.parse(JSON.stringify(v));
export const money = (v) => Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export const number = (v) => Number(v||0).toLocaleString('pt-BR');
export const esc = (v='') => String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export const uid = (prefix='ID') => prefix+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
export const toast = (msg) => {
  const el=document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el);
  setTimeout(()=>el.remove(),2200);
};
export const statusClass = (s='') => /entregue|conclu|ativo|ok|expedido/i.test(s)?'ok':/pend|baixo|atras|ocorr/i.test(s)?'warn':/rota|process|separa/i.test(s)?'blue':'';
export const barChart = (items) => {
  const max=Math.max(1,...items.map(x=>Number(x.value)||0));
  return '<div class="mini-chart">'+items.map(x=>'<div class="mini-chart-bar" style="height:'+Math.max(6,(Number(x.value)||0)/max*100)+'%"><span>'+esc(x.label)+'</span></div>').join('')+'</div>';
};
