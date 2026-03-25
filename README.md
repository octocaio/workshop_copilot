# LearnHub — Plataforma de Infoprodutos

Uma plataforma enxuta de venda de cursos online, inspirada em experiencias como Hotmart, criada para demonstracoes e workshops com GitHub Copilot.

## Arquitetura

- **Backend:** Node.js + Express com API REST
- **Frontend:** React + Vite + Tailwind CSS
- **Armazenamento:** catalogo em JSON local e pedidos em memoria
- **Pagamento:** servico simulado, facil de substituir por Stripe, PayPal ou similar

## Estrutura do projeto

```text
backend/
  src/
    routes/          # Definicao das rotas Express
    controllers/     # Manipuladores das requisicoes
    services/        # Regras de negocio e integracoes
    data/            # Dados JSON do catalogo

frontend/
  src/
    pages/           # Paginas da aplicacao
    components/      # Componentes reutilizaveis
    services/        # Camada cliente da API

docs/
  architecture.md    # Documentacao da arquitetura
```

## Como executar

### Pre-requisitos

- Node.js 18 ou superior

### 1. Subir o backend

```bash
cd backend
npm install
npm run dev
```

A API sera iniciada em **http://localhost:3001**.

### 2. Subir o frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicacao sera aberta em **http://localhost:5173**.

> Durante o desenvolvimento, o frontend usa o proxy do Vite para encaminhar chamadas `/api` ao backend.

## Endpoints da API

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `GET` | `/products` | Lista todos os cursos |
| `GET` | `/products/:id` | Retorna um curso especifico |
| `POST` | `/checkout` | Processa a compra de um curso |
| `GET` | `/orders/:userEmail` | Lista compras associadas a um e-mail |
| `GET` | `/health` | Verifica a saude da API |

### Exemplo de corpo para `POST /checkout`

```json
{
  "productId": "course-1",
  "userEmail": "usuario@exemplo.com"
}
```

## Funcionalidades

- **Catalogo**: exibe os cursos disponiveis com imagem, descricao resumida e preco
- **Detalhe do curso**: mostra informacoes completas e leva ao fluxo de compra
- **Finalizacao da compra**: coleta o e-mail e executa o pagamento simulado
- **Meus cursos**: busca cursos comprados pelo e-mail informado
- **Notificacoes**: mostra feedback de sucesso, erro e informacao
- **Estados de carregamento**: usa spinners durante requisicoes assincronas
- **Layout responsivo**: funciona em desktop e mobile

## Limitacoes atuais

- Os pedidos ficam apenas em memoria e sao perdidos ao reiniciar o backend
- Nao ha autenticacao nem cadastro de usuarios
- O catalogo depende de dados estaticos em arquivo JSON
- O pagamento e apenas simulado para fins de demo

## Documentacao complementar

- Veja `docs/architecture.md` para uma visao detalhada da arquitetura implementada.
