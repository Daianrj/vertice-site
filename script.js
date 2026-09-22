// ATUALIZAÇÃO AUTOMÁTICA DO ANO NO FOOTER
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// NAVEGAÇÃO MOBILE ACESSÍVEL
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
  const toggleMenu = (open) => {
    mainNav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('open');
    toggleMenu(!isOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Fechar menu com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });
}

// SCROLLSPY (DESTACAR SEÇÃO ATIVA NA NAVEGAÇÃO)
const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

if ('IntersectionObserver' in window && sections.length > 0 && navLinks.length > 0) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.25, rootMargin: '-70px 0px -40% 0px' }
  );

  sections.forEach((section) => navObserver.observe(section));
}

// NAVEGAÇÃO MULTIPÁGINAS: DESTACAR PÁGINA ATUAL
const currentPageName = (() => {
  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (file === '' || file === 'index.html') return 'home';
  return file.replace('.html', '');
})();

document.querySelectorAll('#main-nav [data-nav-page]').forEach((link) => {
  const target = link.getAttribute('data-nav-page');
  const directActive = target === currentPageName;
  const moreChildren = ['logistica', 'processo', 'diferenciais', 'contato'];
  const groupedActive = target === 'mais' && moreChildren.includes(currentPageName);
  const isActive = directActive || groupedActive;

  link.classList.toggle('active', isActive);
  if (isActive) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});

const moreChildren = ['mais', 'logistica', 'processo', 'diferenciais', 'contato'];
const diagnosticChildren = ['diagnostico'];

if (moreChildren.includes(currentPageName)) {
  const moreGroup = document.querySelector('[data-nav-group="mais"]');
  if (moreGroup) moreGroup.classList.add('group-active');
}

if (diagnosticChildren.includes(currentPageName)) {
  const diagnosticGroup = document.querySelector('[data-nav-group="diagnostico"]');
  if (diagnosticGroup) diagnosticGroup.classList.add('group-active');
}

// Fecha o menu mobile ao redimensionar para desktop, evitando estado visual preso.
window.addEventListener('resize', () => {
  if (window.innerWidth > 820 && mainNav && menuToggle) {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
  }
});

// HERO: SIMULADOR DE FLUXO OPERACIONAL INTERATIVO
const vtabButtons = document.querySelectorAll('.vtab-btn');
const visualHeadline = document.getElementById('visual-headline');
const flowStep1 = document.getElementById('flow-step-1');
const flowStep2 = document.getElementById('flow-step-2');
const flowStep3 = document.getElementById('flow-step-3');
const cardLabelA = document.getElementById('card-label-a');
const cardTextA = document.getElementById('card-text-a');
const cardLabelB = document.getElementById('card-label-b');
const cardTextB = document.getElementById('card-text-b');
const cardLabelC = document.getElementById('card-label-c');
const cardTextC = document.getElementById('card-text-c');

const operationalData = {
  estoque: {
    headline: 'Problema → Solução → Eficiência',
    flow: ['Entrada & Recebimento', 'Conferência de Saldo', 'Armazenagem & Posição'],
    cardA: { label: 'ESTOQUE & SALDOS', text: 'Controle de entradas e saídas' },
    cardB: { label: 'VISIBILIDADE', text: 'Dados sem ruído operacional' },
    cardC: { label: 'PROCESSOS', text: 'Menos digitação e retrabalho' }
  },
  expedicao: {
    headline: 'Separação → Conferência → Despacho',
    flow: ['Ordem de Separação', 'Picking & Packing', 'Despacho Validado'],
    cardA: { label: 'CONFERÊNCIA', text: 'Validação rápida de volumes' },
    cardB: { label: 'AGILIDADE', text: 'Redução de filas na expedição' },
    cardC: { label: 'RASTREABILIDADE', text: 'Histórico claro de cada pedido' }
  },
  transporte: {
    headline: 'Roteirização → Monitoramento → Entrega',
    flow: ['Emissão de Carga', 'Rastreamento em Rota', 'Comprovante de Entrega'],
    cardA: { label: 'STATUS DE ROTA', text: 'Acompanhamento de entregas' },
    cardB: { label: 'OCORRÊNCIAS', text: 'Registro imediato de pendências' },
    cardC: { label: 'COMPROVAÇÃO', text: 'Informações centralizadas' }
  },
  automacao: {
    headline: 'Captura → Processamento → Ação',
    flow: ['Gatilho do Evento', 'Regras de Negócio', 'Sincronização Direta'],
    cardA: { label: 'INTEGRAÇÃO', text: 'Conexão direta entre ferramentas' },
    cardB: { label: 'NOTIFICAÇÕES', text: 'Alertas automáticos de rotina' },
    cardC: { label: 'PADRONIZAÇÃO', text: 'Menos falhas operacionais' }
  }
};

if (vtabButtons.length > 0 && visualHeadline) {
  vtabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      vtabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const tabKey = btn.getAttribute('data-tab');
      const data = operationalData[tabKey];

      if (data) {
        visualHeadline.textContent = data.headline;
        if (flowStep1 && flowStep2 && flowStep3 && data.flow) {
          flowStep1.textContent = data.flow[0];
          flowStep2.textContent = data.flow[1];
          flowStep3.textContent = data.flow[2];
        }
        if (cardLabelA && cardTextA) {
          cardLabelA.textContent = data.cardA.label;
          cardTextA.textContent = data.cardA.text;
        }
        if (cardLabelB && cardTextB) {
          cardLabelB.textContent = data.cardB.label;
          cardTextB.textContent = data.cardB.text;
        }
        if (cardLabelC && cardTextC) {
          cardLabelC.textContent = data.cardC.label;
          cardTextC.textContent = data.cardC.text;
        }
      }
    });
  });
}

// DIAGNÓSTICO OPERACIONAL INTERATIVO
const diagButtons = document.querySelectorAll('.diag-btn');
const diagTitle = document.getElementById('diag-title');
const diagDesc = document.getElementById('diag-description');
const diagStep1 = document.getElementById('diag-step1');
const diagStep2 = document.getElementById('diag-step2');
const diagStep3 = document.getElementById('diag-step3');
const diagCtaBtn = document.getElementById('diag-cta-btn');

const diagnosticScenarios = {
  site: {
    title: 'Desenvolvimento Web Direto e Sem Atrito',
    desc: 'Criamos uma página focada no seu público, com carregamento instantâneo, mensagem clara e chamada objetiva para o WhatsApp. Sem dependências pesadas, projetada para converter no mobile.',
    step1: 'Estruturação da mensagem e proposta de valor',
    step2: 'Desenvolvimento leve, rápido e responsivo',
    step3: 'Publicação com foco em contato direto',
    waMsg: 'Olá, fiz o diagnóstico no site da VÉRTICE para Presença Digital & Conversão e gostaria de conversar sobre meu projeto.'
  },
  sistema: {
    title: 'Sistema Sob Medida para a sua Rotina',
    desc: 'Mapeamos os processos atuais para criar um painel simples e objetivo. Sem funcionalidades supérfluas que ninguém usa: apenas os fluxos, cadastros e regras de que sua equipe precisa.',
    step1: 'Mapeamento das etapas e regras de negócio',
    step2: 'Construção de interface intuitiva e rápida',
    step3: 'Substituição progressiva de planilhas dispersas',
    waMsg: 'Olá, fiz o diagnóstico no site da VÉRTICE para Sistemas & Controle Interno e gostaria de conversar sobre meu projeto.'
  },
  automacao: {
    title: 'Automação de Rotinas e Conexão de Dados',
    desc: 'Identificamos onde sua equipe perde tempo redigitando dados ou transferindo arquivos manualmente. Desenvolvemos conexões automáticas para a informação fluir sem atritos.',
    step1: 'Identificação das tarefas repetitivas críticas',
    step2: 'Integração segura entre ferramentas e sistemas',
    step3: 'Alertas e relatórios automáticos de rotina',
    waMsg: 'Olá, fiz o diagnóstico no site da VÉRTICE para Automação de Tarefas Manuais e gostaria de conversar sobre meu projeto.'
  },
  logistica: {
    title: 'Organização e Visibilidade Operacional',
    desc: 'Desenvolvimento pensado especificamente para estoques, expedição e logística. Acompanhamento claro de volumes, rotas, ocorrências e conferência para apoiar quem está na linha de frente.',
    step1: 'Diagnóstico dos pontos cegos da operação',
    step2: 'Estruturação de fluxo entre armazém e transporte',
    step3: 'Painéis de leitura rápida para tomada de decisão',
    waMsg: 'Olá, fiz o diagnóstico no site da VÉRTICE para Estoque, Expedição & Entregas e gostaria de conversar sobre meu projeto.'
  }
};

if (diagButtons.length > 0 && diagTitle) {
  diagButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      diagButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      const key = btn.getAttribute('data-diag');
      const item = diagnosticScenarios[key];

      if (item) {
        diagTitle.textContent = item.title;
        diagDesc.textContent = item.desc;
        if (diagStep1) diagStep1.textContent = item.step1;
        if (diagStep2) diagStep2.textContent = item.step2;
        if (diagStep3) diagStep3.textContent = item.step3;
        if (diagCtaBtn) {
          diagCtaBtn.href = `https://wa.me/5521993836880?text=${encodeURIComponent(item.waMsg)}`;
        }
      }
    });
  });
}

// FORMULÁRIO DE BRIEFING RÁPIDO PARA WHATSAPP
const briefingForm = document.getElementById('briefing-form');
const copyBriefingBtn = document.getElementById('copy-briefing-btn');
const copyStatus = document.getElementById('copy-status');
const briefingError = document.getElementById('briefing-error');

const validateBriefing = () => {
  const msgInput = document.getElementById('lead-message');
  const value = msgInput ? msgInput.value.trim() : '';
  if (value.length < 8) {
    if (briefingError) briefingError.textContent = 'Conte em poucas palavras o desafio que você quer resolver.';
    if (msgInput) {
      msgInput.setAttribute('aria-invalid', 'true');
      msgInput.focus();
    }
    return false;
  }
  if (briefingError) briefingError.textContent = '';
  if (msgInput) msgInput.removeAttribute('aria-invalid');
  return true;
};

const getBriefingText = () => {
  const nameInput = document.getElementById('lead-name');
  const areaInput = document.getElementById('lead-area');
  const msgInput = document.getElementById('lead-message');

  const name = nameInput ? nameInput.value.trim() : '';
  const area = areaInput ? areaInput.value : '';
  const message = msgInput ? msgInput.value.trim() : '';

  let text = 'Olá!';
  if (name) {
    text += ` Me chamo ${name}.`;
  }
  if (area) {
    text += ` Tenho interesse em: ${area}.`;
  }
  if (message) {
    text += ` Meu desafio principal é: ${message}.`;
  } else {
    text += ' Gostaria de conversar sobre um projeto com a VÉRTICE.';
  }
  return text;
};

if (briefingForm) {
  briefingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateBriefing()) return;
    const text = getBriefingText();
    const waUrl = `https://wa.me/5521993836880?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  const msgInput = document.getElementById('lead-message');
  if (msgInput) {
    msgInput.addEventListener('input', () => {
      if (msgInput.value.trim().length >= 8) {
        msgInput.removeAttribute('aria-invalid');
        if (briefingError) briefingError.textContent = '';
      }
    });
  }
}

if (copyBriefingBtn) {
  copyBriefingBtn.addEventListener('click', async () => {
    if (!validateBriefing()) return;
    const text = getBriefingText();

    const showCopySuccess = () => {
      if (copyStatus) {
        copyStatus.textContent = '✓ Mensagem copiada com sucesso!';
        setTimeout(() => { copyStatus.textContent = ''; }, 3000);
      }
    };

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const fallback = document.createElement('textarea');
        fallback.value = text;
        fallback.setAttribute('readonly', '');
        fallback.style.position = 'fixed';
        fallback.style.opacity = '0';
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand('copy');
        fallback.remove();
      }
      showCopySuccess();
    } catch {
      if (copyStatus) copyStatus.textContent = 'Não foi possível copiar automaticamente. Selecione a mensagem e tente novamente.';
    }
  });
}

// REVEAL ANIMATIONS (INTERSECTION OBSERVER)
const revealElements = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          instance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('visible'));
}

// MONITORAMENTO DE CLIQUES EM WHATSAPP
document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  link.addEventListener('click', () => {
    link.dataset.clicked = 'true';
  });
});

// CTAs CONTEXTUAIS DA SEÇÃO DE TECNOLOGIA
// Mantém o número oficial em um único ponto e gera a mensagem conforme o interesse.
const VERTICE_WHATSAPP = '5521993836880';
document.querySelectorAll('[data-wa-message]').forEach((link) => {
  const message = link.getAttribute('data-wa-message');
  if (message) {
    link.href = `https://wa.me/${VERTICE_WHATSAPP}?text=${encodeURIComponent(message)}`;
  }
});


// EXEMPLOS INTERATIVOS DOS CARDS DE TECNOLOGIA
const solutionExamples = {
  'Google Sheets': {
    desc: 'Exemplos de como uma planilha pode deixar de ser apenas um arquivo e virar uma base organizada de operação.',
    items: [
      ['Controle operacional compartilhado', 'Pedidos, estoque, clientes, entregas ou financeiro organizados em uma base única.'],
      ['Painel com filtros e validações', 'Consultas rápidas, campos padronizados e menos risco de preenchimento incorreto.'],
      ['Fechamentos e consolidações', 'Resumos automáticos por período, responsável, rota, cliente ou status.']
    ]
  },
  'Google Apps Script': {
    desc: 'Exemplos de automações que trabalham junto ao Google Workspace sem exigir que a equipe repita tarefas.',
    items: [
      ['Alertas automáticos', 'Envio de avisos quando um prazo vence, um status muda ou uma pendência aparece.'],
      ['Rotinas programadas', 'Atualizações, consolidações e verificações executadas em horários definidos.'],
      ['Regras e validações', 'Bloqueios, permissões e tratamento automático de dados antes de gravar informações.']
    ]
  },
  'Web Apps': {
    desc: 'Exemplos de interfaces web para usar os dados sem expor a complexidade da planilha para o usuário final.',
    items: [
      ['Portal operacional', 'Tela de cadastro, busca, edição e acompanhamento acessível no celular e computador.'],
      ['Área por perfil', 'Experiências diferentes para administração, operação, motorista, comercial ou cliente.'],
      ['Fluxo com fotos e comprovantes', 'Registro de ocorrências, anexos, canhotos e dados de campo em uma interface simples.']
    ]
  },
  'ERP sob medida': {
    desc: 'Exemplos de módulos que podem ser combinados em um ERP criado em torno do processo real da empresa.',
    items: [
      ['Cadastros e permissões', 'Usuários, clientes, fornecedores, produtos e perfis de acesso em um único sistema.'],
      ['Operação integrada', 'Pedidos, estoque, expedição, transporte e acompanhamento conectados entre si.'],
      ['Histórico e auditoria', 'Registro de alterações, responsáveis, datas e etapas importantes do processo.']
    ]
  },
  'Dashboards': {
    desc: 'Exemplos de painéis para transformar dados do dia a dia em leitura rápida e útil para decisão.',
    items: [
      ['Indicadores operacionais', 'Pendências, volumes, entregas, produtividade e status em uma única visão.'],
      ['Comparativos por período', 'Leitura diária, semanal ou mensal sem montar relatórios manualmente.'],
      ['Visão por responsável', 'Acompanhamento por cliente, motorista, rota, equipe ou unidade.']
    ]
  },
  'Automação de processos': {
    desc: 'Exemplos de etapas manuais que podem ser substituídas por fluxos consistentes e automáticos.',
    items: [
      ['Eliminação de redigitação', 'Dados capturados uma vez e reaproveitados nas etapas seguintes.'],
      ['Geração automática de documentos', 'Relatórios, comprovantes, resumos ou arquivos criados a partir do fluxo.'],
      ['Tratamento de pendências', 'Regras que identificam exceções e direcionam o próximo passo automaticamente.']
    ]
  },
  'Integrações': {
    desc: 'Exemplos de conexões para evitar ilhas de informação entre ferramentas usadas pela empresa.',
    items: [
      ['Formulário → base → painel', 'Informação capturada em um ponto e disponibilizada imediatamente onde será usada.'],
      ['APIs e serviços externos', 'Consulta ou envio de dados para plataformas compatíveis com integração.'],
      ['Sincronização entre bases', 'Dados compartilhados entre planilhas, sistemas e rotinas com regras definidas.']
    ]
  },
  'Estoque': {
    desc: 'Exemplos de recursos para melhorar controle, conferência e visibilidade do que entra, sai e permanece armazenado.',
    items: [
      ['Entrada e saída', 'Movimentações registradas com responsável, data, item, quantidade e observação.'],
      ['Conferência e divergências', 'Identificação de diferenças antes que elas avancem para as próximas etapas.'],
      ['Posição e saldo', 'Consulta rápida do que existe, onde está e o que precisa de atenção.']
    ]
  },
  'Transporte': {
    desc: 'Exemplos de recursos para organizar a operação desde a preparação da rota até o acompanhamento em campo.',
    items: [
      ['Roteiro operacional', 'Entregas agrupadas e organizadas para facilitar execução e acompanhamento.'],
      ['Motoristas e veículos', 'Vínculos, informações operacionais e histórico acessíveis em um único lugar.'],
      ['Ocorrências em rota', 'Registro rápido de imprevistos para que a operação consiga tratar a exceção.']
    ]
  },
  'Entregas': {
    desc: 'Exemplos de recursos para acompanhar o ciclo da entrega e centralizar as evidências da operação.',
    items: [
      ['Status da entrega', 'Pendente, em rota, entregue ou ocorrência com histórico de atualização.'],
      ['Comprovantes e canhotos', 'Fotos e documentos vinculados ao registro correto para consulta posterior.'],
      ['Pendências e tratativas', 'Visão clara do que precisa ser resolvido antes do fechamento da operação.']
    ]
  }
};

const solutionModal = document.getElementById('solution-modal');
const solutionModalTitle = document.getElementById('solution-modal-title');
const solutionModalDesc = document.getElementById('solution-modal-desc');
const solutionModalList = document.getElementById('solution-modal-list');
const solutionModalCta = document.getElementById('solution-modal-cta');
const solutionModalClose = document.getElementById('solution-modal-close');
let solutionModalTrigger = null;

const closeSolutionModal = () => {
  if (!solutionModal || solutionModal.hidden) return;
  solutionModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (solutionModalTrigger) solutionModalTrigger.focus();
};

const openSolutionModal = (card) => {
  if (!solutionModal || !card) return;
  const key = card.getAttribute('data-solution');
  const data = solutionExamples[key];
  if (!data) return;

  solutionModalTrigger = card;
  solutionModalTitle.textContent = key;
  solutionModalDesc.textContent = data.desc;
  renderPracticalDemo(key);
  solutionModalList.innerHTML = data.items.map((item, index) => `
    <div class="solution-example">
      <span class="solution-example-num">${String(index + 1).padStart(2, '0')}</span>
      <span><strong>${item[0]}</strong><span>${item[1]}</span></span>
    </div>
  `).join('');

  const message = `Olá, vim pelo site VÉRTICE e quero conversar sobre uma solução de ${key}.`;
  solutionModalCta.href = `https://wa.me/5521993836880?text=${encodeURIComponent(message)}`;

  solutionModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => solutionModalClose.focus());
};

document.querySelectorAll('.tech-card[data-solution], [data-open-solution][data-solution]').forEach((card) => {
  card.addEventListener('click', () => openSolutionModal(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openSolutionModal(card);
    }
  });
});

if (solutionModalClose) solutionModalClose.addEventListener('click', closeSolutionModal);
document.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', closeSolutionModal));

document.addEventListener('keydown', (event) => {
  if (!solutionModal || solutionModal.hidden) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeSolutionModal();
    return;
  }

  if (event.key === 'Tab') {
    const focusable = [...solutionModal.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.hidden && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});


// MINI DEMONSTRAÇÕES PRÁTICAS — DADOS ILUSTRATIVOS
const solutionDemoStage = document.getElementById('solution-demo-stage');

const solutionDemoTemplates = {
  'Google Sheets': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Controle_Operacional.xlsx — DEMO</span></div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="sheet-add">+ Nova linha</button><span class="demo-status ok">Compartilhado</span></div>
      <table class="demo-grid-table">
        <thead><tr><th>Pedido</th><th>Cliente</th><th>Status</th><th>Volumes</th></tr></thead>
        <tbody id="demo-sheet-body">
          <tr><td contenteditable="true">PED-1041</td><td contenteditable="true">Cliente Alfa</td><td><span class="demo-status">Separação</span></td><td contenteditable="true">12</td></tr>
          <tr><td contenteditable="true">PED-1042</td><td contenteditable="true">Cliente Beta</td><td><span class="demo-status ok">Expedido</span></td><td contenteditable="true">7</td></tr>
          <tr><td contenteditable="true">PED-1043</td><td contenteditable="true">Cliente Gama</td><td><span class="demo-status warn">Pendente</span></td><td contenteditable="true">4</td></tr>
        </tbody>
      </table>
    </div>`,

  'Google Apps Script': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Automação de fechamento — DEMO</span></div>
      <div class="demo-flow">
        <div class="demo-flow-node active" id="demo-auto-1">1. Ler dados<br><small>Planilha operacional</small></div>
        <div class="demo-flow-node" id="demo-auto-2">2. Validar<br><small>Regras e pendências</small></div>
        <div class="demo-flow-node" id="demo-auto-3">3. Entregar<br><small>Resumo + alerta</small></div>
      </div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="automation-run">Executar automação</button></div>
      <div class="demo-log" id="demo-log">Pronto para executar…</div>
    </div>`,

  'Web Apps': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Portal Operacional — DEMO</span></div>
      <div class="demo-form">
        <input id="demo-web-client" value="Cliente Exemplo" aria-label="Cliente">
        <select id="demo-web-status" aria-label="Status"><option>Pendente</option><option>Em rota</option><option>Entregue</option></select>
      </div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="webapp-save">Registrar</button><span class="demo-status" id="demo-web-result">Aguardando</span></div>
      <div class="demo-route-list" id="demo-web-list">
        <div class="demo-route"><span class="demo-route-num">01</span><div><strong>NF 45821</strong><small>Cliente Exemplo</small></div><span class="demo-status">Pendente</span></div>
      </div>
    </div>`,

  'ERP sob medida': () => `
    <div class="demo-window demo-erp">
      <aside class="demo-erp-nav"><strong>VÉRTICE ERP</strong>
        <button class="active" data-demo-action="erp-tab" data-tab="Operação">Operação</button>
        <button data-demo-action="erp-tab" data-tab="Estoque">Estoque</button>
        <button data-demo-action="erp-tab" data-tab="Entregas">Entregas</button>
      </aside>
      <div class="demo-erp-body">
        <div class="demo-kpis">
          <div class="demo-kpi"><small id="demo-erp-k1">Pedidos abertos</small><strong id="demo-erp-v1">18</strong></div>
          <div class="demo-kpi"><small id="demo-erp-k2">Em separação</small><strong id="demo-erp-v2">7</strong></div>
          <div class="demo-kpi"><small id="demo-erp-k3">Pendências</small><strong id="demo-erp-v3">3</strong></div>
        </div>
        <table class="demo-grid-table"><thead><tr><th>Documento</th><th>Etapa</th><th>Responsável</th></tr></thead><tbody id="demo-erp-table"><tr><td>OP-2301</td><td>Conferência</td><td>Equipe A</td></tr><tr><td>OP-2302</td><td>Separação</td><td>Equipe B</td></tr></tbody></table>
      </div>
    </div>`,

  'Dashboards': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Dashboard Operacional — DEMO</span></div>
      <div class="demo-kpis">
        <div class="demo-kpi"><small>Entregas hoje</small><strong>42</strong></div>
        <div class="demo-kpi"><small>Em rota</small><strong>11</strong></div>
        <div class="demo-kpi"><small>Pendências</small><strong>4</strong></div>
      </div>
      <div class="demo-chart" aria-label="Gráfico demonstrativo">
        <div class="demo-bar" style="height:42%"><span>Seg</span></div>
        <div class="demo-bar" style="height:64%"><span>Ter</span></div>
        <div class="demo-bar" style="height:51%"><span>Qua</span></div>
        <div class="demo-bar" style="height:78%"><span>Qui</span></div>
        <div class="demo-bar" style="height:88%"><span>Sex</span></div>
      </div>
    </div>`,

  'Automação de processos': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Fluxo automático — DEMO</span></div>
      <div class="demo-flow">
        <div class="demo-flow-node active" id="demo-proc-1">Pedido recebido</div>
        <div class="demo-flow-node" id="demo-proc-2">Validação automática</div>
        <div class="demo-flow-node" id="demo-proc-3">Equipe notificada</div>
      </div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="process-next">Simular fluxo</button><span class="demo-status" id="demo-process-status">Etapa 1/3</span></div>
    </div>`,

  'Integrações': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Integração de dados — DEMO</span></div>
      <div class="demo-flow">
        <div class="demo-flow-node active">Google Forms<br><small>Entrada</small></div>
        <div class="demo-flow-node" id="demo-int-mid">Apps Script / API<br><small>Processamento</small></div>
        <div class="demo-flow-node" id="demo-int-end">ERP / Dashboard<br><small>Destino</small></div>
      </div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="integration-sync">Sincronizar agora</button><span class="demo-status" id="demo-int-status">Pronto</span></div>
    </div>`,

  'Estoque': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Controle de Estoque — DEMO</span></div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="stock-in">+ Entrada 10</button><button class="demo-btn" data-demo-action="stock-out">- Saída 5</button></div>
      <table class="demo-grid-table"><thead><tr><th>SKU</th><th>Produto</th><th>Posição</th><th>Saldo</th></tr></thead><tbody><tr><td>SKU-001</td><td>Caixa padrão</td><td>A-01-03</td><td id="demo-stock-balance">35</td></tr><tr><td>SKU-002</td><td>Embalagem</td><td>B-04-02</td><td>82</td></tr></tbody></table>
      <div class="demo-log" id="demo-stock-log">Última movimentação: nenhuma nesta demonstração.</div>
    </div>`,

  'Transporte': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Roteiro de Transporte — DEMO</span></div>
      <div class="demo-route-list">
        <div class="demo-route"><span class="demo-route-num">01</span><div><strong>Barra → Recreio</strong><small>Motorista A · 8 entregas</small></div><span class="demo-status ok">Em rota</span></div>
        <div class="demo-route"><span class="demo-route-num">02</span><div><strong>Campo Grande → Santa Cruz</strong><small>Motorista B · 6 entregas</small></div><span class="demo-status" id="demo-route-status">Programada</span></div>
      </div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="route-start">Iniciar rota 02</button></div>
    </div>`,

  'Entregas': () => `
    <div class="demo-window">
      <div class="demo-window-bar"><i class="demo-dot"></i><i class="demo-dot"></i><i class="demo-dot"></i><span class="demo-title">Comprovante de Entrega — DEMO</span></div>
      <div class="demo-form">
        <input value="NF 45821" readonly aria-label="Nota fiscal">
        <select id="demo-delivery-status" aria-label="Status"><option>Em rota</option><option>Entregue</option><option>Ocorrência</option></select>
      </div>
      <div style="padding:0 14px 14px"><div class="demo-proof" id="demo-proof">📷 Área demonstrativa de canhoto / comprovante</div></div>
      <div class="demo-toolbar"><button class="demo-btn demo-btn-primary" data-demo-action="delivery-finish">Finalizar entrega</button><span class="demo-status" id="demo-delivery-result">Em rota</span></div>
    </div>`
};

const renderPracticalDemo = (key) => {
  if (!solutionDemoStage) return;
  const template = solutionDemoTemplates[key];
  solutionDemoStage.innerHTML = template ? template() : '<div class="demo-proof">Demonstração em preparação.</div>';
};

let demoProcessStep = 1;

const handleDemoAction = (button) => {
  const action = button.getAttribute('data-demo-action');

  if (action === 'sheet-add') {
    const body = document.getElementById('demo-sheet-body');
    if (body) {
      const next = body.children.length + 1041;
      body.insertAdjacentHTML('beforeend', `<tr><td contenteditable="true">PED-${next}</td><td contenteditable="true">Novo cliente</td><td><span class="demo-status">Novo</span></td><td contenteditable="true">1</td></tr>`);
    }
  }

  if (action === 'automation-run') {
    const log = document.getElementById('demo-log');
    ['demo-auto-1','demo-auto-2','demo-auto-3'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.classList.add('active'), i * 350);
    });
    if (log) {
      log.textContent = 'Lendo dados…';
      setTimeout(() => { log.textContent = 'Validando regras e pendências…'; }, 450);
      setTimeout(() => { log.textContent = '✓ Processo concluído. Resumo demonstrativo gerado e alerta enviado.'; }, 900);
    }
  }

  if (action === 'webapp-save') {
    const client = document.getElementById('demo-web-client');
    const status = document.getElementById('demo-web-status');
    const result = document.getElementById('demo-web-result');
    const list = document.getElementById('demo-web-list');
    if (list && client && status) {
      const count = list.children.length + 1;
      list.insertAdjacentHTML('beforeend', `<div class="demo-route"><span class="demo-route-num">${String(count).padStart(2,'0')}</span><div><strong>NF DEMO-${45000+count}</strong><small>${client.value || 'Cliente Exemplo'}</small></div><span class="demo-status">${status.value}</span></div>`);
      if (result) { result.textContent = 'Registrado'; result.classList.add('ok'); }
    }
  }

  if (action === 'erp-tab') {
    document.querySelectorAll('.demo-erp-nav button').forEach(btn => btn.classList.toggle('active', btn === button));
    const tab = button.getAttribute('data-tab');
    const data = {
      'Operação':['Pedidos abertos','18','Em separação','7','Pendências','3'],
      'Estoque':['SKUs ativos','126','Itens baixos','9','Movimentos hoje','31'],
      'Entregas':['Programadas','24','Em rota','11','Ocorrências','2']
    }[tab];
    if (data) {
      ['demo-erp-k1','demo-erp-v1','demo-erp-k2','demo-erp-v2','demo-erp-k3','demo-erp-v3'].forEach((id,i) => {
        const el = document.getElementById(id); if (el) el.textContent = data[i];
      });
    }
  }

  if (action === 'process-next') {
    demoProcessStep = demoProcessStep >= 3 ? 1 : demoProcessStep + 1;
    ['demo-proc-1','demo-proc-2','demo-proc-3'].forEach((id,i) => {
      const el = document.getElementById(id); if (el) el.classList.toggle('active', i < demoProcessStep);
    });
    const s = document.getElementById('demo-process-status'); if (s) s.textContent = `Etapa ${demoProcessStep}/3`;
  }

  if (action === 'integration-sync') {
    const mid = document.getElementById('demo-int-mid');
    const end = document.getElementById('demo-int-end');
    const st = document.getElementById('demo-int-status');
    if (st) st.textContent = 'Sincronizando…';
    if (mid) mid.classList.add('active');
    setTimeout(() => { if (end) end.classList.add('active'); if (st) { st.textContent='Sincronizado'; st.classList.add('ok'); } }, 550);
  }

  if (action === 'stock-in' || action === 'stock-out') {
    const bal = document.getElementById('demo-stock-balance');
    const log = document.getElementById('demo-stock-log');
    if (bal) {
      let value = Number(bal.textContent || 0);
      value += action === 'stock-in' ? 10 : -5;
      bal.textContent = String(Math.max(0, value));
      if (log) log.textContent = action === 'stock-in' ? 'Última movimentação: entrada demonstrativa de +10 unidades.' : 'Última movimentação: saída demonstrativa de -5 unidades.';
    }
  }

  if (action === 'route-start') {
    const st = document.getElementById('demo-route-status');
    if (st) { st.textContent = 'Em rota'; st.classList.add('ok'); }
    button.textContent = 'Rota iniciada ✓';
  }

  if (action === 'delivery-finish') {
    const select = document.getElementById('demo-delivery-status');
    const result = document.getElementById('demo-delivery-result');
    const proof = document.getElementById('demo-proof');
    if (select) select.value = 'Entregue';
    if (result) { result.textContent = 'Entregue'; result.classList.add('ok'); }
    if (proof) proof.innerHTML = '✓ Comprovante demonstrativo vinculado<br><small>Registro concluído com sucesso</small>';
    button.textContent = 'Entrega finalizada ✓';
  }
};

if (solutionDemoStage) {
  solutionDemoStage.addEventListener('click', (event) => {
    const button = event.target.closest('[data-demo-action]');
    if (button) handleDemoAction(button);
  });
}


// LABORATÓRIO VÉRTICE: DIAGNÓSTICO, CONSTRUTOR E JORNADA
const maturityRun = document.getElementById('maturity-run');
const maturityResult = document.getElementById('maturity-result');
const maturityTitle = document.getElementById('maturity-title');
const maturityDesc = document.getElementById('maturity-desc');
const maturityRoute = document.getElementById('maturity-route');
const maturityWa = document.getElementById('maturity-wa');

if (maturityRun) {
  maturityRun.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('#maturity-questions input:checked')].map(i => i.value);
    const score = checked.length;
    let title = 'Operação organizada, pronta para evoluir';
    let desc = 'Sua base parece relativamente estruturada. O próximo ganho tende a vir de automação, interface e integração.';
    let route = ['Automação', 'Dashboard', 'Integrações'];

    if (score >= 4) {
      title = 'Operação muito manual e fragmentada';
      desc = 'Há sinais de retrabalho e baixa visibilidade. O melhor caminho é organizar a base primeiro e evoluir em etapas.';
      route = ['Google Sheets', 'Apps Script', 'Web App', 'ERP'];
    } else if (score >= 2) {
      title = 'Operação organizada, mas pouco integrada';
      desc = 'Você já tem controles, mas ainda existe esforço manual. Vale conectar dados e criar uma camada de automação.';
      route = ['Apps Script', 'Web App', 'Dashboard'];
    } else if (score === 0) {
      title = 'Operação com boa base de controle';
      desc = 'Poucos sinais de atrito foram marcados. A oportunidade está em ganho de escala, integração e experiência do usuário.';
      route = ['Web App', 'ERP', 'Integrações'];
    }

    maturityTitle.textContent = title;
    maturityDesc.textContent = desc;
    maturityRoute.innerHTML = route.map(item => '<span>'+item+'</span>').join('');
    maturityResult.hidden = false;
    const msg = 'Olá, fiz o diagnóstico de maturidade no site VÉRTICE. Resultado: '+title+'. Quero conversar sobre o próximo passo.';
    maturityWa.href = 'https://wa.me/5521993836880?text='+encodeURIComponent(msg);
  });
}

const builderButtons = document.querySelectorAll('#solution-builder [data-module]');
const builderSummary = document.getElementById('builder-summary');
const builderWa = document.getElementById('builder-wa');
const builderSelection = new Set();

builderButtons.forEach(button => {
  button.addEventListener('click', () => {
    const module = button.getAttribute('data-module');
    if (builderSelection.has(module)) builderSelection.delete(module);
    else builderSelection.add(module);
    button.classList.toggle('active', builderSelection.has(module));

    const items = [...builderSelection];
    if (!items.length) {
      builderSummary.textContent = 'Selecione os módulos acima.';
      builderWa.classList.add('disabled-link');
      builderWa.setAttribute('aria-disabled','true');
      builderWa.removeAttribute('href');
      return;
    }

    builderSummary.textContent = items.join(' + ');
    const msg = 'Olá, montei uma solução no site VÉRTICE com: '+items.join(', ')+'. Quero conversar sobre este sistema.';
    builderWa.href = 'https://wa.me/5521993836880?text='+encodeURIComponent(msg);
    builderWa.classList.remove('disabled-link');
    builderWa.setAttribute('aria-disabled','false');
  });
});

const evolutionData = {
  sheet:{tag:'ETAPA 01',title:'Planilha organizada',text:'Estruturamos dados, campos, validações e visão operacional para eliminar bagunça e criar uma base confiável.',gains:['Base única','Validações','Filtros e consultas']},
  automation:{tag:'ETAPA 02',title:'Automação inteligente',text:'Apps Script assume tarefas repetitivas, dispara alertas, consolida informações e executa regras automaticamente.',gains:['Menos digitação','Alertas','Rotinas programadas']},
  webapp:{tag:'ETAPA 03',title:'Web App para a equipe',text:'A operação passa a usar uma interface simples no celular e computador, sem depender de navegar diretamente pela planilha.',gains:['Interface mobile','Perfis de acesso','Fluxo guiado']},
  erp:{tag:'ETAPA 04',title:'ERP sob medida',text:'Módulos, cadastros, permissões e processos ficam conectados em uma experiência única desenhada para a empresa.',gains:['Módulos integrados','Auditoria','Gestão centralizada']},
  integration:{tag:'ETAPA 05',title:'Integrações e escala',text:'Conectamos APIs, sistemas e fontes externas para eliminar ilhas de informação e permitir que a operação cresça sem retrabalho.',gains:['APIs','Sincronização','Escalabilidade']}
};

const evolutionButtons = document.querySelectorAll('.evolution-step');
const evolutionTag = document.getElementById('evolution-tag');
const evolutionTitle = document.getElementById('evolution-title');
const evolutionText = document.getElementById('evolution-text');
const evolutionGains = document.getElementById('evolution-gains');

const renderEvolution = (key) => {
  const data = evolutionData[key];
  if (!data) return;
  evolutionTag.textContent=data.tag;
  evolutionTitle.textContent=data.title;
  evolutionText.textContent=data.text;
  evolutionGains.innerHTML=data.gains.map(g => '<span>'+g+'</span>').join('');
};

renderEvolution('sheet');

evolutionButtons.forEach(button => {
  button.addEventListener('click', () => {
    evolutionButtons.forEach(b => {b.classList.remove('active');b.setAttribute('aria-selected','false');});
    button.classList.add('active');
    button.setAttribute('aria-selected','true');
    renderEvolution(button.getAttribute('data-stage'));
  });
});


// DROPDOWNS DO MENU COMPACTO — CONTROLE ROBUSTO
const navDropdowns = document.querySelectorAll('.nav-dropdown');

const setDropdownState = (dropdown, open) => {
  if (!dropdown) return;
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');
  const menu = dropdown.querySelector('.nav-dropdown-menu');
  if (!toggle || !menu) return;

  dropdown.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
};

const closeAllNavDropdowns = (except = null) => {
  navDropdowns.forEach((dropdown) => {
    if (dropdown === except) return;
    setDropdownState(dropdown, false);
  });
};

navDropdowns.forEach((dropdown, index) => {
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');
  const menu = dropdown.querySelector('.nav-dropdown-menu');
  if (!toggle || !menu) return;

  const menuId = menu.id || ('nav-submenu-' + index);
  menu.id = menuId;
  toggle.setAttribute('aria-controls', menuId);

  // Estado inicial sempre fechado, independentemente de CSS antigo/cacheado.
  setDropdownState(dropdown, false);

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeAllNavDropdowns(dropdown);
    setDropdownState(dropdown, willOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setDropdownState(dropdown, false));
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-dropdown')) closeAllNavDropdowns();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const openDropdown = document.querySelector('.nav-dropdown.open');
    if (openDropdown) {
      const toggle = openDropdown.querySelector('.nav-dropdown-toggle');
      closeAllNavDropdowns();
      if (toggle) toggle.focus();
    }
  }
});

// =========================================================
// HERO ARCHITECTURE — LIVE OPERATIONAL CYCLE
// CSS 3D + SVG + JS. No decorative WebGL.
// =========================================================
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const architectureShell = document.getElementById('hero-architecture-shell');
  const architectureScene = document.getElementById('hero-iso-scene');
  const architectureCaption = document.getElementById('architecture-caption');
  const captionTitle = document.getElementById('architecture-caption-title');
  const captionText = document.getElementById('architecture-caption-text');
  const packetLayer = document.getElementById('architecture-packet-layer');
  const ordersKpi = document.getElementById('architecture-orders-kpi');

  const architectureCopy = {
    sheets: ['Sheets recebe o dado.', 'Um novo pedido entra na base e inicia o fluxo digital.'],
    automation: ['Apps Script processa.', 'Validação, regras e automação transformam dado bruto em ação confiável.'],
    webapp: ['Web App leva a ação para a operação.', 'A equipe recebe uma interface simples para executar e atualizar o processo.'],
    erp: ['ERP centraliza o processo.', 'Pedido, estoque, entrega e histórico passam a compartilhar o mesmo contexto.'],
    dashboard: ['Dashboard fecha o ciclo de gestão.', 'O resultado operacional volta como indicador para apoiar a próxima decisão.'],
    estoque: ['Estoque recebe a demanda.', 'O pedido gera necessidade real de separação e movimentação de saldo.'],
    expedicao: ['Expedição prepara a saída.', 'Separação e conferência transformam demanda em carga pronta.'],
    transporte: ['Transporte executa a rota.', 'A carga deixa a expedição e passa a ser acompanhada em campo.'],
    entrega: ['Entrega comprova o resultado.', 'A finalização retorna ao sistema como dado confiável e rastreável.']
  };

  const nodeMap = {
    sheets: document.querySelector('[data-architecture-node="sheets"]'),
    automation: document.querySelector('[data-architecture-node="automation"]'),
    webapp: document.querySelector('[data-architecture-node="webapp"]'),
    erp: document.querySelector('[data-architecture-node="erp"]'),
    dashboard: document.querySelector('[data-architecture-node="dashboard"]'),
    estoque: document.querySelector('[data-architecture-node="estoque"]'),
    expedicao: document.querySelector('[data-architecture-node="expedicao"]'),
    transporte: document.querySelector('[data-architecture-node="transporte"]'),
    entrega: document.querySelector('[data-architecture-node="entrega"]')
  };

  const stateEls = {};
  document.querySelectorAll('[data-node-state]').forEach((el) => {
    stateEls[el.getAttribute('data-node-state')] = el;
  });

  const pathMap = {
    sheets: ['path-sheets-script'],
    automation: ['path-sheets-script', 'path-script-webapp'],
    webapp: ['path-script-webapp', 'path-webapp-erp', 'path-delivery-webapp'],
    erp: ['path-webapp-erp', 'path-erp-dashboard', 'path-erp-stock'],
    dashboard: ['path-erp-dashboard'],
    estoque: ['path-erp-stock', 'path-stock-expedition'],
    expedicao: ['path-stock-expedition', 'path-expedition-transport'],
    transporte: ['path-expedition-transport', 'path-transport-delivery'],
    entrega: ['path-transport-delivery', 'path-delivery-webapp']
  };

  const setCaption = (title, text) => {
    if (captionTitle) captionTitle.textContent = title;
    if (captionText) captionText.textContent = text;
  };

  const setNodeState = (key, text) => {
    if (stateEls[key]) stateEls[key].textContent = text;
  };

  const clearNodeClasses = () => {
    Object.values(nodeMap).forEach((node) => {
      if (!node) return;
      node.classList.remove('is-active', 'is-processing', 'is-success');
    });
    document.querySelectorAll('.architecture-path').forEach((path) => {
      path.classList.remove('is-active-path', 'is-hover-path');
    });
  };

  const activateNode = (key, mode = 'active') => {
    Object.values(nodeMap).forEach((node) => node?.classList.remove('is-active', 'is-processing', 'is-success'));
    const node = nodeMap[key];
    if (!node) return;
    node.classList.add(mode === 'processing' ? 'is-processing' : mode === 'success' ? 'is-success' : 'is-active');
  };

  const setArchitectureNode = (key, sourceButton = null) => {
    const copy = architectureCopy[key];
    if (!copy || !architectureCaption) return;
    setCaption(copy[0], copy[1]);

    document.querySelectorAll('[data-architecture-node]').forEach((node) => {
      node.classList.toggle('is-hovered', node === sourceButton);
    });
    document.querySelectorAll('.architecture-path').forEach((path) => path.classList.remove('is-hover-path'));
    (pathMap[key] || []).forEach((id) => document.getElementById(id)?.classList.add('is-hover-path'));

    const tabMap = { estoque: 'estoque', expedicao: 'expedicao', transporte: 'transporte', automation: 'automacao' };
    const tabKey = tabMap[key];
    if (tabKey) {
      const tab = document.querySelector('.vtab-btn[data-tab="' + tabKey + '"]');
      if (tab) tab.click();
    }
  };

  Object.entries(nodeMap).forEach(([key, button]) => {
    if (!button) return;
    button.addEventListener('mouseenter', () => setArchitectureNode(key, button));
    button.addEventListener('focus', () => setArchitectureNode(key, button));
    button.addEventListener('click', () => setArchitectureNode(key, button));
    button.addEventListener('mouseleave', () => {
      button.classList.remove('is-hovered');
      document.querySelectorAll('.architecture-path').forEach((path) => path.classList.remove('is-hover-path'));
    });
  });

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (architectureShell && architectureScene && finePointer && !reducedMotion) {
    architectureShell.addEventListener('pointermove', (event) => {
      const rect = architectureShell.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      architectureShell.style.setProperty('--tilt-x', (-y * 1.7).toFixed(2) + 'deg');
      architectureShell.style.setProperty('--tilt-y', (x * 2.2).toFixed(2) + 'deg');
    }, { passive: true });

    architectureShell.addEventListener('pointerleave', () => {
      architectureShell.style.setProperty('--tilt-x', '0deg');
      architectureShell.style.setProperty('--tilt-y', '0deg');
    });
  }

  let architectureVisible = false;
  let cycleToken = 0;
  let orders = Number(ordersKpi?.textContent || 127);

  const sleep = (ms, token) => new Promise((resolve) => {
    const started = performance.now();
    const tick = () => {
      if (token !== cycleToken || !architectureVisible) return resolve(false);
      if (performance.now() - started >= ms) return resolve(true);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  const animatePacket = (pathId, duration, token, options = {}) => new Promise((resolve) => {
    if (!packetLayer || token !== cycleToken || !architectureVisible) return resolve(false);
    const path = document.getElementById(pathId);
    if (!path || typeof path.getTotalLength !== 'function') return resolve(false);

    const length = path.getTotalLength();
    const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    packet.setAttribute('r', options.size || '5.5');
    packet.setAttribute('class', 'architecture-packet ' + (options.kind || 'data'));
    packetLayer.appendChild(packet);

    path.classList.add('is-active-path');
    let last = null;
    let elapsed = 0;

    const frame = (time) => {
      if (token !== cycleToken || !architectureVisible) {
        packet.remove();
        path.classList.remove('is-active-path');
        return resolve(false);
      }
      if (last !== null) elapsed += Math.min(34, time - last);
      last = time;
      const progress = Math.min(1, elapsed / duration);
      const distance = options.reverse ? length * (1 - progress) : length * progress;
      const point = path.getPointAtLength(distance);
      packet.setAttribute('cx', point.x);
      packet.setAttribute('cy', point.y);

      if (progress >= 1) {
        packet.remove();
        path.classList.remove('is-active-path');
        return resolve(true);
      }
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  });

  const runOperationalCycle = async (token) => {
    clearNodeClasses();
    setNodeState('sheets', 'Novo pedido');
    setNodeState('automation', 'Aguardando');
    setNodeState('webapp', 'Operação');
    setNodeState('erp', 'Sincronizado');
    setNodeState('estoque', 'Pedido recebido');
    setNodeState('expedicao', 'Aguardando');
    setNodeState('transporte', 'Aguardando');
    setNodeState('entrega', 'Pendente');

    activateNode('sheets');
    setCaption('Novo pedido recebido.', 'O dado nasce no Sheets e inicia o ciclo.');
    if (!(await sleep(700, token))) return;

    if (!(await animatePacket('path-sheets-script', 950, token, { kind: 'data' }))) return;
    activateNode('automation', 'processing');
    setNodeState('automation', 'Validando…');
    setCaption('Apps Script validando.', 'Regras verificam o pedido antes de liberar a próxima etapa.');
    if (!(await sleep(850, token))) return;
    setNodeState('automation', 'Validado ✓');
    nodeMap.automation?.classList.remove('is-processing');
    nodeMap.automation?.classList.add('is-success');

    if (!(await animatePacket('path-script-webapp', 900, token, { kind: 'data' }))) return;
    activateNode('webapp');
    setNodeState('webapp', 'Pedido disponível');
    setCaption('Web App recebeu a operação.', 'A equipe agora enxerga e executa o pedido em uma interface operacional.');
    if (!(await sleep(650, token))) return;

    if (!(await animatePacket('path-webapp-erp', 900, token, { kind: 'data' }))) return;
    activateNode('erp', 'processing');
    setNodeState('erp', 'Registrando…');
    setCaption('ERP centralizando.', 'O pedido entra no contexto de gestão e gera demanda para a operação física.');
    if (!(await sleep(700, token))) return;
    setNodeState('erp', 'Pedido registrado ✓');

    if (!(await animatePacket('path-erp-stock', 1250, token, { kind: 'operation', size: '6' }))) return;
    activateNode('estoque');
    setNodeState('estoque', 'Pedido recebido');
    setCaption('Estoque recebeu a demanda.', 'O dado digital agora movimenta uma etapa física da operação.');
    if (!(await sleep(700, token))) return;

    if (!(await animatePacket('path-stock-expedition', 1000, token, { kind: 'operation', size: '6' }))) return;
    activateNode('expedicao', 'processing');
    setNodeState('expedicao', 'Separando…');
    setCaption('Expedição em processamento.', 'Separação e conferência preparam o pedido para saída.');
    if (!(await sleep(850, token))) return;
    setNodeState('expedicao', 'Expedido ✓');

    if (!(await animatePacket('path-expedition-transport', 1000, token, { kind: 'operation', size: '6' }))) return;
    activateNode('transporte');
    setNodeState('transporte', 'Em rota');
    setCaption('Transporte iniciado.', 'A entrega passa a ser acompanhada em campo.');
    if (!(await sleep(700, token))) return;

    if (!(await animatePacket('path-transport-delivery', 1000, token, { kind: 'operation', size: '6' }))) return;
    activateNode('entrega', 'success');
    setNodeState('entrega', 'Entregue ✓');
    setCaption('Entrega concluída.', 'A comprovação agora precisa voltar ao sistema como informação de gestão.');
    if (!(await sleep(850, token))) return;

    if (!(await animatePacket('path-delivery-webapp', 1350, token, { kind: 'feedback', size: '5.5' }))) return;
    activateNode('webapp', 'success');
    setNodeState('webapp', 'Comprovante recebido');
    setCaption('Resultado voltou ao Web App.', 'A operação de campo devolve evidência e status ao fluxo digital.');
    if (!(await sleep(550, token))) return;

    if (!(await animatePacket('path-webapp-erp', 850, token, { kind: 'feedback' }))) return;
    activateNode('erp', 'success');
    setNodeState('erp', 'Atualizado ✓');
    setCaption('ERP atualizado.', 'A entrega finalizada passa a fazer parte do histórico central.');
    if (!(await sleep(550, token))) return;

    if (!(await animatePacket('path-erp-dashboard', 950, token, { kind: 'feedback' }))) return;
    activateNode('dashboard', 'success');
    orders += 1;
    if (ordersKpi) {
      ordersKpi.textContent = String(orders);
      ordersKpi.closest('.node-kpi')?.classList.add('kpi-updated');
      setTimeout(() => ordersKpi.closest('.node-kpi')?.classList.remove('kpi-updated'), 850);
    }
    setCaption('Dashboard atualizado.', 'O resultado operacional virou informação para decisão: pedidos ' + (orders - 1) + ' → ' + orders + '.');
    if (!(await sleep(1700, token))) return;

    clearNodeClasses();
    setCaption('Ciclo concluído.', 'OPERAÇÃO → DADOS → AUTOMAÇÃO → SISTEMA → DECISÃO → OPERAÇÃO');
    await sleep(1900, token);
  };

  const startCycle = async () => {
    if (!architectureShell || reducedMotion || !architectureVisible) return;
    const token = ++cycleToken;
    while (architectureVisible && token === cycleToken) {
      await runOperationalCycle(token);
      if (token !== cycleToken || !architectureVisible) break;
    }
  };

  const stopCycle = () => {
    cycleToken += 1;
    packetLayer?.querySelectorAll('.architecture-packet').forEach((packet) => packet.remove());
    clearNodeClasses();
  };

  if (architectureShell) {
    if (reducedMotion) {
      architectureShell.classList.add('architecture-static');
      setCaption('Arquitetura integrada.', 'Dados, automação, sistema e operação conectados em um único ciclo.');
    } else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible && !architectureVisible) {
          architectureVisible = true;
          startCycle();
        } else if (!visible && architectureVisible) {
          architectureVisible = false;
          stopCycle();
        }
      }, { threshold: 0.12 });
      observer.observe(architectureShell);
    } else {
      architectureVisible = true;
      startCycle();
    }
  }

  // SHEET → SYSTEM: scroll-driven DOM/CSS evolution (no WebGL needed here).
  const evolution = document.getElementById('sheet-system-evolution');
  if (!evolution) return;

  const stageButtons = [...evolution.querySelectorAll('[data-sheet-stage]')];
  const stageTitle = document.getElementById('sheet-stage-title');
  const stageDesc = document.getElementById('sheet-stage-desc');

  const stageContent = [
    ['Planilha organizada', 'A base atual é estruturada sem romper a rotina da equipe.'],
    ['Automação aplicada', 'Regras repetitivas passam a rodar automaticamente e os dados começam a fluir.'],
    ['Web App operacional', 'A equipe ganha uma interface simples, rápida e adequada ao celular e computador.'],
    ['ERP e gestão integrada', 'Módulos, indicadores e permissões passam a funcionar em uma experiência profissional única.']
  ];

  let currentStage = -1;
  const applyStage = (stage) => {
    const next = Math.max(0, Math.min(3, Number(stage) || 0));
    if (next === currentStage) return;
    currentStage = next;
    evolution.setAttribute('data-evolution-stage', String(next));

    stageButtons.forEach((button) => {
      const active = Number(button.getAttribute('data-sheet-stage')) === next;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (stageTitle) stageTitle.textContent = stageContent[next][0];
    if (stageDesc) stageDesc.textContent = stageContent[next][1];
  };

  stageButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', () => applyStage(button.getAttribute('data-sheet-stage')));
  });

  applyStage(0);

  if (!reducedMotion && window.matchMedia('(min-width: 821px)').matches) {
    let ticking = false;

    const updateByScroll = () => {
      ticking = false;
      const rect = evolution.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const progress = Math.max(0, Math.min(0.999, (vh * 0.82 - rect.top) / (rect.height + vh * 0.22)));
      applyStage(Math.floor(progress * 4));
    };

    const requestScrollUpdate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateByScroll);
      }
    };

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate, { passive: true });
    updateByScroll();
  }
})();
