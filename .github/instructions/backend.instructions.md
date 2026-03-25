---
description: "Orientações para edição e revisão de mudanças de código backend na API REST Express do LearnHub com persistência SQLite."
applyTo: "backend/src/**, backend/package.json"
---
# Backend – API REST Express LearnHub

Orientações para a API REST Express que fornece dados de cursos, gerencia checkout e processamento de inscrições.
Consulte [docs/architecture.md](../../docs/architecture.md) e [docs/sqlite-integration.md](../../docs/sqlite-integration.md) para contexto. Mantenha PRs focados (um endpoint ou funcionalidade por PR); inclua testes unitários para lógica de service e validação de controller.

## Estrutura do Projeto
- **index.js**: inicialização Express, middlewares globais, tratamento de erros.
- **routes/**: definição de endpoints (`products.js`, `checkout.js`, `orders.js`).
- **controllers/**: handlers de requisição; orquestram services e retornam respostas HTTP.
- **services/**: lógica de negócio; interagem com banco de dados, validações, processamento.
- **data/**: arquivos JSON para persistência local (em produção, use SQLite via `better-sqlite3`).

## Princípios Principais
- **Camadas bem definidas**: reqs → route → controller → service → data; evite lógica de negócio em controllers.
- **Tratamento de erros consistente**: use tipos de erro customizados (ex: `NotFound`, `ValidationError`, `Conflict`); middleware global mapeia para HTTP status.
- **Validação de entrada**: valide body/params em controllers antes de passar para services; retorne 400 com mensagens claras.
- **Respostas padronizadas**: sucesso `{ data, statusCode: 200 }`, erro `{ error: "msg", statusCode: 400 }`.
- **Ambiente**: use variáveis de ambiente (`.env`) para `PORT`, `DB_PATH`, `NODE_ENV`; nunca hardcode.
- **CORS**: configure apenas origins permitidos (frontend local + produção).
- **Segurança**: sanitize inputs, proteja contra SQL injection (use prepared statements SQLite), evite expor detalhes internos em erro 500.

## Checklist de Revisão
1. **Separação de camadas**: controllers delegam a services; services encapsulam regras de negócio e acesso a dados.
2. **Validação**: entrada é validada no controller; mensagens de erro úteis (não genéricas).
3. **Tratamento de erros**: exceções são capturadas, logadas, e retornam HTTP status apropriado (404, 409, 422, 500).
4. **Testes**: novos services têm testes unitários; endpoints críticos (checkout, inscrição) têm testes de integração.
5. **HTTP status**: use 200 (sucesso), 201 (criado), 400 (validação), 404 (não encontrado), 409 (conflito), 500 (erro servidor).
6. **Respostas**: incluem dados úteis; listagens retornam arrays, detalhes retornam objeto único.
7. **Documentação**: endpoints com descrição de payload, query params, status possíveis; considere Swagger/OpenAPI se API cresce.

## Endpoints Principais
### Cursos (Products)
- `GET /products` – lista todos os cursos com filtros (opcional: categoria, preço).
- `GET /products/:id` – detalhes de um curso; retorna 404 se não encontrado.

### Checkout
- `POST /checkout` – inicia processo de checkout; valida itens e retorna resumo de pagamento.
- `POST /checkout/confirm` – confirma inscrição; cria registro de ordem, retorna confirmação.

### Ordens (Enrollments)
- `GET /orders` – lista inscrições do usuário (requer autenticação em produção).
- `GET /orders/:id` – detalhes de uma inscrição específica.

## Padrões de Dados
### Curso (Product)
```json
{
  "id": "uuid",
  "title": "Título do Curso",
  "instructor": "Nome do Instrutor",
  "price": 99.99,
  "description": "Descrição do curso",
  "thumbnail": "https://...",
  "duration": "10 horas",
  "level": "iniciante|intermediário|avançado"
}
```

### Inscrição (Order)
```json
{
  "id": "uuid",
  "userId": "uuid",
  "courseId": "uuid",
  "status": "pending|confirmed|failed",
  "total": 99.99,
  "createdAt": "2026-03-25T10:00:00Z"
}
```

## Boas Práticas de Service
- **Sem I/O bloqueante**: se usar async, prefira Promise; evite `setTimeout` em lógica crítica.
- **Reutilização**: extraia funções comuns (ex: buscar curso, validar preço) em helpers reutilizáveis.
- **Mensagens claras**: exceções incluem mensagem e code específicos para debug.
- **N+1 avoidance**: ao listar ordens, carregue cursos relacionados eficientemente (evite loop de queries).

## Anti-Padrões a Evitar
- Lógica de negócio em routes; controllers já são finos.
- Retorno de objeto com status misturado (ex: `{ success: true, error: "msg" }`); use HTTP status ou types distintos.
- Erros genéricos 500; sempre distinga erros de entrada (4xx) de erro servidor (5xx).
- Sem validação de entrada; sempre valide `req.body`, `req.params`, `req.query`.
- Dados sensíveis em logs ou respostas de erro (ex: senhas, dados de pagamento).

## Testes Unitários
```javascript
// Exemplo: testes para courseService
const { getCourseById, validateEnrollment } = require('./courseService');

describe('courseService', () => {
  it('returns course by id', () => {
    const course = getCourseById('123');
    expect(course).toBeDefined();
    expect(course.id).toBe('123');
  });

  it('throws NotFound if course missing', () => {
    expect(() => getCourseById('nonexistent')).toThrow('NotFound');
  });

  it('validates enrollment and returns true if eligible', () => {
    const result = validateEnrollment('user123', 'course456');
    expect(result).toBe(true);
  });
});
```

## Exemplo de Feedback
"A lógica de cálculo de desconto em `checkoutController` deveria estar em `checkoutService` porque será reutilizada ao revisar histórico de ordens; isso reduz duplicação e facilita testes."

"O endpoint `POST /checkout/confirm` não valida se o `courseId` existe antes de criar a inscrição; adicione verificação em service e retorne 404 se curso não encontrado."

## Escalação de Issues
1. **Segurança**: sem sanitização de entrada; expõe dados sensíveis.
2. **Corretude**: lógica de negócio incorreta; estado inconsistente após transação.
3. **Performance**: N+1 queries; loops desnecessários em lógica de checkout.
4. **Manutenibilidade**: duplicação de lógica entre controllers/services.
5. **Testabilidade**: funções sem testes; mock de dados hardcoded.
