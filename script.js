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
const navLinks = document.querySelectorAll('#main-nav a');
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
    const text = getBriefingText();
    const waUrl = `https://wa.me/5521993836880?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
}

if (copyBriefingBtn) {
  copyBriefingBtn.addEventListener('click', () => {
    const text = getBriefingText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (copyStatus) {
          copyStatus.textContent = '✓ Mensagem copiada com sucesso!';
          setTimeout(() => {
            copyStatus.textContent = '';
          }, 3000);
        }
      }).catch(() => {
        if (copyStatus) copyStatus.textContent = 'Não foi possível copiar automaticamente.';
      });
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
