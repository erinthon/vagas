# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema de solicitação e oferta de vagas de estacionamento para condomínios. Moradores podem ofertar vagas disponíveis e solicitar vagas temporariamente.

## Structure

```
vagas/
├── backend/    # Spring Boot 3 REST API (Java 17, Maven)
└── frontend/   # Angular 20 SPA
```

## Backend

**Stack:** Spring Boot 3.3, Java 17, JPA/Hibernate, H2 (dev), PostgreSQL (prod), Lombok

```bash
cd backend

# Run (dev — H2 in-memory)
./mvnw spring-boot:run

# Build JAR
./mvnw clean package

# Tests
./mvnw test
./mvnw test -Dtest=ClassName
```

API base: `http://localhost:8080/api`  
H2 console (dev): `http://localhost:8080/h2-console`

**Package structure:** `com.condominio.vagas`
- `model/` — JPA entities: `Morador`, `Vaga`, `Oferta`, `Solicitacao`
- `repository/` — Spring Data JPA interfaces
- `service/` — business logic
- `controller/` — REST controllers, one per entity
- `config/` — CORS (allows `localhost:4200`)

**Domain flow:** A `Morador` (resident) owns `Vaga`s (parking spots). They can create `Oferta`s (offers) making a vaga available for a date range. Other moradores create `Solicitacao`s (requests) for a period. An admin can call `PATCH /api/solicitacoes/{id}/atender?ofertaId=X` to link a request to an offer, which also auto-closes the offer.

**Status enums:**
- `Oferta`: `ATIVA` | `ENCERRADA`
- `Solicitacao`: `PENDENTE` | `ATENDIDA` | `CANCELADA`

To switch to PostgreSQL, update `application.properties` datasource and change `ddl-auto` to `update`.

## Frontend

**Stack:** Angular 20, standalone components, lazy-loaded routes, SCSS

```bash
cd frontend

# Dev server (http://localhost:4200)
ng serve

# Build
ng build

# Tests
ng test
```

**Structure:** `src/app/`
- `models/` — TypeScript interfaces mirroring backend entities
- `services/` — HTTP services (`MoradorService`, `OfertaService`, `SolicitacaoService`)
- `pages/` — one standalone component per route: `home`, `ofertas`, `solicitacoes`, `moradores`

All services point to `http://localhost:8080/api/*`. Backend CORS is configured for `localhost:4200`.
