# Kanban — Sistema de Vagas de Estacionamento

> Atualizado em: 2026-04-17 (sessão 2)

---

## ✅ Concluído

### Infraestrutura
- [x] Setup inicial Spring Boot 3 + Java 17 + Maven
- [x] Integração MySQL com credenciais via perfil local / env vars
- [x] Google OAuth2 + JWT auth (handler, filtro, redirect ao frontend)
- [x] CORS configurado para `localhost:4200`

### Backend — Core
- [x] Entidades JPA: `Morador`, `Vaga`, `Oferta`, `Solicitacao`, `Condominio`, `Cargo`
- [x] CRUD completo para todas as entidades (controllers + services + repositories)
- [x] Regras de negócio: fluxo oferta/solicitação, `PATCH /solicitacoes/{id}/atender`
- [x] Status enums: `Oferta` (`ATIVA`/`ENCERRADA`), `Solicitacao` (`PENDENTE`/`ATENDIDA`/`CANCELADA`)
- [x] Registro atômico de condomínio (síndico + morador vinculado)

### Backend — Sistema Administrativo
- [x] Entidade `AdminUser` com autenticação JWT separada
- [x] `AdminInitializer` — seed do admin padrão
- [x] `AdminAuthController` — login admin
- [x] `AdminPainelController` — visibilidade total dos dados
- [x] CRUD de `AdminUser` com guard: último admin não pode ser removido/rebaixado

### Frontend — Core
- [x] Angular 20 SPA com rotas lazy-loaded standalone
- [x] Páginas: `login`, `auth-callback`, `home`, `perfil`, `moradores`, `ofertas`, `solicitacoes`, `condominios`
- [x] Serviços HTTP por entidade

### Frontend — Painel Admin
- [x] Login admin separado
- [x] Sidebar layout com navbar ocultada em rotas admin
- [x] Tabelas de dados para todas as entidades
- [x] CRUD de usuários admin (editar, excluir, guard último admin)
- [x] CRUD de condomínios com painel de detalhes expansível
- [x] Seleção de morador existente como síndico no cadastro de condomínio

---

## 🔄 Em andamento

*(nenhum item em progresso no momento)*

---

## 📋 Backlog

### Frontend — Fluxo do Morador
- [x] Tela de cadastro/vinculação de vaga pelo morador
- [x] Tela de criação de oferta (selecionar vaga + período)
- [x] Tela de acompanhamento de ofertas do morador
- [x] Tela de criação de solicitação (selecionar período)
- [x] Tela de acompanhamento de solicitações do morador

### Regras de Negócio / Backend
- [ ] Validação de conflito de datas em ofertas e solicitações
- [ ] Notificação (e-mail ou in-app) quando solicitação for atendida
- [ ] Endpoint de cancelamento de solicitação pelo próprio morador

### Qualidade
- [x] Testes unitários nos services do backend
- [x] Testes de integração nos controllers
- [x] Testes de componente no frontend

### Deploy
- [ ] Dockerfile para backend e frontend
- [ ] `docker-compose.yml` para ambiente completo
- [ ] CI/CD (GitHub Actions)
