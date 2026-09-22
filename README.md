# VÉRTICE — Tecnologia aplicada a problemas reais

Site institucional multipáginas da VÉRTICE, desenvolvido com HTML, CSS e JavaScript puro, sem dependência de build ou framework.

## Arquitetura atual

A Home foi reduzida para uma visão geral objetiva. O conteúdo completo foi preservado e distribuído em páginas dedicadas:

- `index.html` — Home / visão geral
- `solucoes.html` — Sites, sistemas, automação e soluções para operação
- `tecnologia.html` — Google Sheets, Apps Script, Web Apps, ERP, dashboards, integrações e demonstrações
- `laboratorio.html` — Diagnóstico de maturidade, construtor de solução e jornada de evolução
- `diagnostico.html` — Gargalos operacionais e simulador de necessidade
- `mais.html` — Hub das áreas complementares
- `logistica.html` — Especialidade logística
- `processo.html` — Processo de trabalho
- `diferenciais.html` — Por que VÉRTICE
- `contato.html` — FAQ, briefing e contato
- `styles.css` — identidade visual e responsividade compartilhadas
- `script.js` — interações compartilhadas
- `robots.txt` e `sitemap.xml` — indexação

## Navegação

O header é consistente entre todas as páginas. Diagnóstico e Mais possuem acesso direto à página principal e submenus para atalhos específicos. Todas as páginas internas possuem retorno rápido para a Home.

## Responsividade

A navegação foi projetada para desktop e mobile. No celular, os submenus abrem abaixo do item principal e a navegação rápida das páginas pode ser rolada horizontalmente.

## Demonstrações

As demonstrações da página Tecnologia utilizam dados fictícios e servem apenas para mostrar possibilidades de interface e fluxo. Não representam clientes, operações ou resultados reais.

## Publicação

Compatível com GitHub Pages:

https://daianrj.github.io/vertice-site/

---

VÉRTICE — desenvolvimento, automação e tecnologia aplicada a problemas reais.


## Showroom de Demonstrações

A página `demonstracoes.html` funciona como showroom interativo da VÉRTICE. Ela não carrega todas as miniaplicações de uma vez.

Estrutura:

- `demos.js` — shell, filtros, modal, lazy loading, reset e WhatsApp contextual
- `demos.css` — estilos isolados do showroom e das miniaplicações
- `demos/shared.js` — utilitários compartilhados
- `demos/stock.js` — Controle de Estoque
- `demos/deliveries.js` — Sistema de Entregas
- `demos/erp.js` — ERP Operacional
- `demos/automation.js` — Automação / Apps Script
- `demos/dashboard.js` — Dashboard Executivo
- `demos/routing.js` — Logística / Roteirizador
- `demos/driver.js` — Aplicativo do Motorista
- `demos/integrations.js` — Integrações

Cada módulo é importado dinamicamente somente quando o visitante clica em **Testar demonstração**. Todos os dados são fictícios e locais ao navegador.
