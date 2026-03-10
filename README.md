# jamal-agent-stack

Production-minded multi-service agent stack.

## Structure

**`apps/`** – User-facing applications
- `openclaw-gateway` – OpenClaw gateway frontend/control UI
- `control-api` – REST API for stack control and management
- `web` – Web dashboard/UI

**`services/`** – Backend microservices
- `orchestrator` – Task orchestration and routing
- `assistant-service` – Main agent/assistant logic
- `tradingguard-service` – Trading-specific safety/compliance
- `policy-service` – Policy enforcement and rules engine
- `skill-service` – Dynamic skill loading and execution
- `memory-service` – Persistent memory, context, embeddings

**`packages/`** – Shared libraries
- `shared-types` – TypeScript types and interfaces
- `db` – Database abstraction and migrations
- `queue` – Message queue utilities (Redis, RabbitMQ)
- `logger` – Logging library
- `llm-router` – LLM provider routing and fallback logic
- `skill-runtime` – Skill execution runtime

**`infra/`** – Infrastructure and Docker Compose
- `docker-compose.yml` – Local dev services (PostgreSQL, Redis)
- `README.md` – Infrastructure setup instructions

**`scripts/`** – Utility scripts (setup, migrations, etc.)

**`skills/`** – Custom skill definitions

**`internal/`** – Internal/private code
- `imported/` – Third-party or experimental code
- `quarantine/` – Code under review or deprecation

**`docs/`** – Documentation
- `architecture/` – System design and diagrams
- `api-contracts/` – API specs and schemas
- `runbooks/` – Operational guides

---

## Getting Started

```bash
pnpm install
pnpm dev
```

See `docs/architecture` for system design.
