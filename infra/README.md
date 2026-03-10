# Infrastructure

Local development infrastructure: PostgreSQL 16 + Redis 7.

## Setup

1. Copy `.env.example` to `.env` at the repo root:
   ```bash
   cp .env.example .env
   ```

2. Start services:
   ```bash
   docker-compose -f infra/docker-compose.yml up -d
   ```

3. Verify health:
   ```bash
   docker-compose -f infra/docker-compose.yml ps
   ```

4. Stop services:
   ```bash
   docker-compose -f infra/docker-compose.yml down
   ```

## Credentials

See `.env` for connection details. Both services bind to `127.0.0.1` only (localhost).

- **Postgres:** `127.0.0.1:5432`
- **Redis:** `127.0.0.1:6379`

## Cleanup

To remove volumes and start fresh:
```bash
docker-compose -f infra/docker-compose.yml down -v
```
