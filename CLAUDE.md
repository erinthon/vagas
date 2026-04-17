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

**Stack:** Spring Boot 3.3, Java 17, JPA/Hibernate, MySQL, Lombok, Spring Security + Google OAuth2 + JWT

```bash
cd backend

# Run with local credentials profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Build JAR
./mvnw clean package

# Tests
./mvnw test
./mvnw test -Dtest=ClassName
```

API base: `http://localhost:8080/api`

**Local config:** Google OAuth2 credentials and DB credentials go in `application-local.properties` (gitignored). The main `application.properties` falls back to env vars `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`.

**Package structure:** `com.condominio.vagas`
- `model/` — JPA entities: `Morador`, `Vaga`, `Oferta`, `Solicitacao`, `Condominio`, `Cargo`
- `repository/` — Spring Data JPA interfaces
- `service/` — business logic
- `controller/` — REST controllers, one per entity
- `config/` — `SecurityConfig` (JWT filter + OAuth2), `CorsConfig` (allows `localhost:4200`)
- `security/` — `JwtService`, `JwtAuthFilter`, `OAuth2LoginSuccessHandler`

**Auth flow:**
1. Frontend redirects to `/oauth2/authorization/google`
2. On success, `OAuth2LoginSuccessHandler` upserts the `Morador` by `googleId`/`email` and redirects to `{frontendUrl}/auth/callback?token=<JWT>`
3. All subsequent API calls send `Authorization: Bearer <JWT>`; `JwtAuthFilter` validates and sets the security context
4. Public endpoints: `/oauth2/**`, `/login/**`, `/api/auth/**`

**Domain flow:** A `Morador` (resident) belongs to a `Condominio` and has a `Cargo` (role). They own `Vaga`s (parking spots) and can create `Oferta`s making a vaga available for a date range. Other moradores create `Solicitacao`s (requests) for a period. An admin calls `PATCH /api/solicitacoes/{id}/atender?ofertaId=X` to link a request to an offer, which also auto-closes the offer.

**Status enums:**
- `Oferta`: `ATIVA` | `ENCERRADA`
- `Solicitacao`: `PENDENTE` | `ATENDIDA` | `CANCELADA`

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
- `services/` — HTTP services per entity
- `pages/` — one standalone component per route

All services point to `http://localhost:8080/api/*`. Backend CORS is configured for `localhost:4200`.
