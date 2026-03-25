---
description: "Orientações para edição e revisão de mudanças de código frontend na plataforma de aprendizado LearnHub com React + Vite + Tailwind."
applyTo: "frontend/src/**, frontend/index.html, frontend/vite.config.ts, frontend/tailwind.config.js"
---
# Frontend – Plataforma de Aprendizado LearnHub

Orientações para o catálogo de cursos, checkout e gerenciamento de inscrições do frontend LearnHub.
Consulte [docs/architecture.md](../../docs/architecture.md) para contexto do sistema. Mantenha PRs focados (uma funcionalidade ou correção por PR); inclua testes para novos hooks ou componentes complexos.

## Estrutura do Projeto
- **pages/**: Home (catálogo de cursos), ProductDetail (detalhes do curso + prévia), Checkout (inscrição + pagamento), MyCourses (painel de cursos inscritos).
- **components/**: ProductCard (card de curso), Navbar, LoadingSpinner, Toast (notificações).
- **hooks/**: useToast (fila de notificações + dismissão).
- **services/**: api.js (integração com backend Express).

## Princípios Principais
- **Integração de API**: centralize todas as chamadas de backend em `frontend/src/services/api.js`; trate erros consistentemente (passe para Toast ou error boundary).
- **Acessibilidade em primeiro lugar**: HTML semântico, labels apropriados, ARIA apenas quando semântica insuficiente; garanta que descrições de cursos e instrutores sejam acessíveis.
- **Gerenciamento de estado**: mantenha estado de UI (toast, filtros, carrinho) local; busque dados de curso/inscrição frescos do backend via api.js.
- **Performance**: carregamento tardio de páginas; use `LoadingSpinner` para tarefas assíncronas; evite re-buscar catálogo de cursos a cada mudança de rota.
- **Estilo**: prefira utilitários Tailwind; abstraia padrões de classes comuns em pequenos componentes wrapper (ex: `Button`, `Card`).
- **Tratamento de erros**: capture erros de API em componentes, dispare para `useToast()` para feedback ao usuário, registre no console para debug.

## Checklist de Revisão
1. **Chamadas de API** estão em `api.js`; componentes consomem dados via hooks/context, não fetch direto.
2. **Estados de carregamento e erro**: ProductDetail, Checkout, Home exibem `LoadingSpinner` e Toast em caso de falha.
3. **Responsivo**: verifique grid de cursos em Home, visualização de curso em ProductDetail, e formulário de Checkout em mobile (≤640px), tablet (~768px), desktop (≥1024px).
4. **Inputs de formulário** (Checkout/inscrição): acessíveis por teclado, ring de foco visível, feedback de validação via Toast ou texto inline, não apenas cor.
5. **Imagens**: miniaturas de cursos têm texto `alt`, dimensões corretas ou aspect-ratio definido para evitar layout shift; suporte a fotos de instrutores.
6. **Roteamento**: páginas em `react-router-dom`; sem suspense aninhado em cascata; use imports dinâmicos para páginas raramente visualizadas (ex: MyCourses).
7. **Segurança**: nunca interpole descrições de cursos ou bios de instrutores não confiáveis; sanitize se conteúdo gerado por usuário aparecer.

## Componentes Comuns
- **ProductCard**: exibe curso com título, instrutor, preço, miniatura, botão "Inscrever". Reutilizado em Home e seção de cursos relacionados em ProductDetail.
- **Navbar**: cabeçalho com logo, busca (opcional), ícone de carrinho/inscrição, link MyCourses. Trate navegação mobile se necessário.
- **Toast**: notificações efêmeras (sucesso, erro, info). Controlado pelo hook `useToast()`.
- **LoadingSpinner**: spinner centralizado para operações assíncronas em páginas.

## Hooks
- **useToast()**: retorna `{ addToast, toasts, dismiss }`. Chame `addToast('Inscrição no curso realizada com sucesso!', 'success')` após checkout bem-sucedido.

## Orientações de Testes
- Teste páginas complexas (Checkout, detalhes de ProductDetail) com React Testing Library; mock das chamadas `api.js`.
- Teste hook customizado `useToast()` para lógica de add, dismissão, autoexpiração.
- Testes de snapshot apenas para componentes apresentacionais estáveis como `ProductCard`.

## Flags de Performance
- Catálogo de cursos em Home: se > 50 cursos, considere paginação ou scroll infinito para evitar travamentos.
- Prévia de vídeo em ProductDetail: carregamento tardio de iframe de vídeo ou substitua por imagem poster.
- Evite re-buscar catálogo de cursos a cada rota; cache em context ou use React Query com stale-time.

## Anti-Padrões a Evitar
- Busca de dados de curso/inscrição dentro de componentes em vez de centralizar em `api.js`.
- URLs de backend hardcoded em vez de variáveis de ambiente (use `.env` e `import.meta.env.VITE_*`).
- Múltiplas cadeias `useEffect` para cargas de dados dependentes; considere orquestração de requisições em api.js ou hook customizado.
- Notificações Toast dismissidas sem ação do usuário; certifique-se de que `useToast()` respeita dismissão manual.

## Estilo de Feedback de Exemplo
"Considere extrair a lógica de busca da lista de cursos em um hook customizado (ex: `useCourseList()`) em Home, pois ela trata estados de carregamento e erro; isso reduz bugs de re-busca e melhora testabilidade."
