# LearnHub – Instruções Gerais para Copilot

Estas são diretrizes em nível de repositório. Arquivos específicos de caminho em `.github/instructions/*.instructions.md` fornecem orientações focadas para áreas específicas (frontend, backend).

## Arquitetura de Alto Nível
Monorepo Node.js com:
- `backend/` API REST Express (persistência JSON com SQLite em roadmap, padrão de camadas: controller → service → data)
- `frontend/` React + Vite + Tailwind (SPA com roteamento)
- Documentação arquitetural e design em `docs/`

Consulte `docs/architecture.md` e `docs/sqlite-integration.md` para detalhes. Evite reafirmar em revisões; faça links em vez disso.

## Orientações Gerais de Revisão
Ao gerar sugestões, considere:
1. Prefira diffs incrementais e mínimos; preserve estilo e nomeação existentes.
2. Destaque problemas de segurança, corretude e integridade de dados antes de micro-otimizações.
3. Estimule validação de entrada e segregação de camadas (controller → service → data); sugira refatoração quando lógica se mistura.
4. Sinalize lógica duplicada que pertence a um utilitário compartilhado ou método de service reutilizável.
5. Garanta tratamento de erros com tipos customizados apropriados (ex: NotFound, ValidationError, Conflict) e HTTP status codes consistentes via middleware.
6. Estimule testes: testes unitários para nova lógica de service; testes de componente (React Testing Library) para fluxos críticos de UI.
7. Para preocupações de performance, destaque padrões N+1 em queries, carregamento desnecessário de dados ou re-buscas evitáveis.
8. Prefira configuração dirigida por variáveis de ambiente; evite caminhos/secrets hardcoded.

## Fluxo de Trabalho Monorepo
- Desenvolvimento iterativo: `npm run dev` na raiz (ou por workspace).
- Mantenha PRs focados: código + testes + docs (arquitetura ou notas de build) quando comportamento muda.
- Atualize arquivos de instrução relacionados se novas pastas ou slices arquiteturais forem introduzidas.

## Não Repita
Não insira rotas API ou arquivos de componentes inteiros em feedback de revisão a menos que absolutamente necessário: cite apenas as linhas que requerem mudança. Resuma observações de baixo impacto.

## Ordem de Escalação para Sugestões
1. Segurança / integridade de dados
2. Corretude lógica / funcional
3. Performance / escalabilidade
4. Manutenibilidade / duplicação
5. Legibilidade / consistência
6. Estilo / formatação menor

## Tom & Estilo de Feedback
Seja conciso, acionável e apresente uma razão ("porque" clause) para recomendações não-triviais. Ofereça uma solução preferida; opcionalmente uma alternativa leve.

## Referência de Arquivos de Instruções
- **[frontend.instructions.md](.github/instructions/frontend.instructions.md)**: UI, React, Vite, Tailwind, integração API.
- **[backend.instructions.md](.github/instructions/backend.instructions.md)**: Express, controllers, services, validação, testes.

---
Se novos subsistemas forem adicionados (ex: `worker/`, `mobile/`), crie um novo `*.instructions.md` com padrões `applyTo` em vez de inchar este arquivo.
