# SaaS NR1 - Psicossocial & Recrutamento IA

Este é um monorepo que contém o frontend e o backend da aplicação.

## Estrutura do Projeto

* `artifacts/api-server`: Servidor de API REST (Express + Drizzle).
* `artifacts/web`: Cliente frontend (Vite + React + Wouter).
* `artifacts/mockup-sandbox`: Sandbox/Canvas de componentes mockados para desenvolvimento ágil.
* `lib/db`: Módulo compartilhado para o banco de dados (Drizzle ORM + PostgreSQL).
* `lib/auth-web`: Módulo compartilhado para controle de sessão/autenticação no frontend.

## Como Rodar Localmente

### Pré-requisitos
* Node.js v20.6.0+ (ou v24+)
* pnpm v9+
* Docker e Docker Compose (para o banco de dados)

### Passos para Inicialização

1. **Subir o banco de dados (PostgreSQL):**
   ```bash
   docker compose up -d
   ```

2. **Instalar dependências na raiz do monorepo:**
   ```bash
   pnpm install
   ```

3. **Sincronizar o schema do banco de dados (Drizzle):**
   ```bash
   pnpm --filter @workspace/db run push
   ```

4. **Iniciar o Servidor de API (Backend):**
   ```bash
   pnpm --filter @workspace/api-server run dev
   ```
   * O backend rodará em `http://localhost:8080` (configurado via [.env](file:///home/johnson/emetor/saas-nr1/artifacts/api-server/.env)).

5. **Iniciar a Aplicação Web (Frontend):**
   ```bash
   pnpm --filter @workspace/web run dev
   ```
   * A aplicação estará disponível em `http://localhost:3000` (configurado via [.env](file:///home/johnson/emetor/saas-nr1/artifacts/web/.env)).

6. **Iniciar o Sandbox de Mockups (Opcional):**
   ```bash
   pnpm --filter @workspace/mockup-sandbox run dev
   ```
   * O canvas de mockups estará disponível em `http://localhost:3001` (configurado via [.env](file:///home/johnson/emetor/saas-nr1/artifacts/mockup-sandbox/.env)).
