# Frontend LearnHub

Frontend da plataforma LearnHub, construido com React, Vite e Tailwind CSS.

## Objetivo

Esta interface permite:

- navegar pelo catalogo de cursos
- visualizar detalhes de cada curso
- finalizar uma compra com pagamento simulado
- consultar cursos adquiridos a partir do e-mail informado

## Stack

- React 19
- React Router 7
- Vite 8
- Tailwind CSS 4

## Executando localmente

```bash
npm install
npm run dev
```

Por padrao, a aplicacao roda em `http://localhost:5173`.

## Integracao com o backend

As chamadas HTTP usam o prefixo `/api`.

No ambiente de desenvolvimento, o arquivo `vite.config.js` redireciona essas requisicoes para `http://localhost:3001`.

## Estrutura principal

```text
src/
	components/   Componentes compartilhados
	pages/        Paginas da aplicacao
	services/     Funcoes de acesso a API
	App.jsx       Mapa de rotas da SPA
	main.jsx      Bootstrap do React
```
