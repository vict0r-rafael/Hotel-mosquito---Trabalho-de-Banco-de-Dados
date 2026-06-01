# Hotel do Mosquito — Trabalho de Banco de Dados

Sistema de gerenciamento hoteleiro desenvolvido como trabalho prático da disciplina de Banco de Dados Relacional.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Banco de dados | MySQL 8 |
| Backend | NestJS + TypeORM |
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Autenticação | JWT (RS256) |

## Estrutura do repositório

```
Hotel-mosquito/
├── database/        # Scripts SQL (tabelas, views, stored procedures, triggers)
├── backend/         # API REST em NestJS
└── frontend/        # SPA em React
```

## Regras de negócio

- Toda comunicação com o banco é feita exclusivamente via **Stored Procedures** e **Views** — nenhum SQL cru é executado pela aplicação.
- **Recepcionista:** pode criar e gerenciar reservas, realizar check-in e check-out, e consultar disponibilidade de quartos.
- **Gerente:** acesso total, incluindo relatórios de faturamento e ocupação.
- Senhas armazenadas como hash bcrypt gerado pela aplicação antes de chegar ao banco.

## Como executar

### Banco de dados

1. Crie um banco `hotel_mosquito` no MySQL.
2. Execute os scripts na ordem:
   ```
   database/01_tabelas.sql
   database/02_views.sql
   database/03_stored_procedures.sql
   database/04_triggers.sql
   database/05_dados_exemplo.sql
   ```

### Backend

```bash
cd backend
cp .env.example .env   # preencha as variáveis de ambiente
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Modelo de dados

As principais entidades do sistema são:

- **categoria_quarto** — tipos de acomodação (Standard, Luxo, Suíte…)
- **quarto** — unidades do hotel com preço, capacidade e status
- **historico_preco** — auditoria automática de alterações de preço (trigger)
- **cliente** — hóspedes cadastrados
- **funcionario** — colaboradores com perfil Recepcionista ou Gerente
- **reserva** — vínculo cliente ↔ quarto com datas previstas
- **hospedagem** — check-in efetivado, com totais calculados no checkout
- **produto_servico** — itens consumíveis (frigobar, lavanderia…)
- **consumo** — itens lançados durante a hospedagem

## Autores

Trabalho desenvolvido para a disciplina de Banco de Dados Relacional.
