# Phase 1: Personal Assistant UI + Memory Integration

**Status**: MVP Implementation Complete ✓  
**Timeline**: Target 4-6 weeks, MVP achieved in Phase 1  
**Last Updated**: 2024-03-10

## What's New in Phase 1

This phase introduces:

1. **3-Tier Memory System**
   - Working Memory (ephemeral task context)
   - Session Memory (24h conversation history)
   - Long-term Memory (vector + structured semantic storage)

2. **Personal Assistant Supervisor**
   - LangGraph-based orchestrator
   - Task routing to subagents (assistant, tradingguard, ugc)
   - Feedback loop infrastructure (prepare, don't execute)

3. **OpenClaw Canvas UI**
   - Task submission form
   - Status display & monitoring
   - Memory inspection (debugging)
   - Built-in tools (web search, calendar, notes)

4. **Infrastructure**
   - pnpm monorepo workspace
   - TypeScript packages (memory-service, supervisor, canvas-ui)
   - PostgreSQL + Qdrant integration
   - Database schemas & migration scripts

## Project Structure

```
jamal-agent-stack/
├── services/
│   ├── memory-service/          # 3-tier memory layer
│   │   ├── src/
│   │   │   ├── types.ts         # Type definitions
│   │   │   └── index.ts         # Main service
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── supervisor/              # LangGraph orchestrator
│       ├── src/
│       │   └── index.ts         # Supervisor implementation
│       ├── package.json
│       └── tsconfig.json
│
├── ui/
│   └── canvas-ui/               # OpenClaw Canvas components
│       ├── src/
│       │   └── index.ts         # UI components & manager
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── integration/             # Integration tests
│       ├── src/
│       │   ├── index.ts
│       │   ├── test-memory.ts
│       │   └── test-supervisor.ts
│       ├── package.json
│       └── tsconfig.json
│
├── db/
│   └── schemas/
│       ├── schema.sql           # PostgreSQL tables
│       └── qdrant-schema.json   # Qdrant collections
│
├── MEMORY_ARCHITECTURE.md       # Detailed memory design
├── PHASE1_SETUP.md             # This file
├── pnpm-workspace.yaml
├── tsconfig.json
└── package.json
```

## Quick Start

### Prerequisites

- Node.js ≥ 20.0.0
- pnpm ≥ 8.0.0
- PostgreSQL 13+ (for session/working memory)
- Qdrant 1.7+ (for vector search)

### 1. Install Dependencies

```bash
cd jamal-agent-stack

# Install all packages (uses pnpm workspaces)
pnpm install
```

### 2. Setup Databases

#### PostgreSQL

```bash
# Create database
createdb jamal

# Run schema
psql -U postgres -d jamal -f db/schemas/schema.sql

# Verify
psql -U postgres -d jamal -c "\dt"
# Should show: session_memory, working_memory, memory_vectors, supervisor_state
```

#### Qdrant

```bash
# Start Qdrant (Docker)
docker run -p 6333:6333 qdrant/qdrant

# Verify health
curl http://localhost:6333/health
# Should return: {"status":"ok"}
```

### 3. Build

```bash
# Build all packages
pnpm build

# Or build specific package
pnpm --filter @jamal/memory-service build
```

### 4. Run Tests

```bash
# Integration tests (requires PostgreSQL + Qdrant running)
pnpm --filter @jamal/integration test:memory
pnpm --filter @jamal/integration test:supervisor
```

## Usage Examples

### Creating Memory Service

```typescript
import { createMemoryService } from "@jamal/memory-service";

const memoryService = await createMemoryService(
  {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "jamal",
  },
  { url: "http://localhost:6333" }
);

// Working memory
const working = await memoryService.createWorkingMemory({
  taskId: "task-1",
  sessionId: "session-1",
  context: { query: "search for langraph" },
  status: "active",
});

// Session memory
await memoryService.appendSessionMessage("session-1", {
  id: "msg-1",
  role: "user",
  content: "Hi!",
  timestamp: new Date(),
});

// Long-term memory
await memoryService.storeLongTermMemory({
  vectorId: "memory-1",
  sessionId: "session-1",
  content: "User prefers morning meetings",
  contentType: "user_preference",
  category: "preferences",
  tags: ["user", "schedule"],
  importanceScore: 0.9,
  createdAt: new Date(),
});
```

### Creating Supervisor

```typescript
import { createSupervisor } from "@jamal/supervisor";

const supervisor = await createSupervisor("session-1", memoryService);

// Register subagents
supervisor.registerSubagent({
  id: "assistant-agent",
  name: "Assistant",
  capabilities: ["help", "query"],
  async execute(task, context) {
    return { result: "Task completed" };
  },
});

// Submit task
const task = await supervisor.submitTask({
  type: "assistant",
  title: "Explain TypeScript",
  description: "Basic overview",
  priority: "normal",
});

// Execute
const result = await supervisor.executeTask(task);
```

### Using Canvas UI

```typescript
import { CanvasUIManager } from "@jamal/canvas-ui";

const uiManager = new CanvasUIManager("session-1", supervisor, memoryService);

// Render dashboard
const html = uiManager.renderDashboard();

// Or render specific component
const taskForm = uiManager.render("task-form");
const statusPanel = uiManager.render("task-status");
```

## Architecture Highlights

### 3-Tier Memory

**Layer 1: Working Memory**
- Ephemeral, task-specific context
- Auto-cleanup after 24h
- Fast access for active tasks

**Layer 2: Session Memory**
- 24h conversation history
- Auto-summaries for context efficiency
- Per-session isolation

**Layer 3: Long-term Memory**
- Persistent semantic storage
- Vector embeddings for similarity search
- Importance scoring & TTL support

### Supervisor Routing

```
Task Input
  │
  ├─► Router (task type detection)
  │       ├─► Assistant Agent
  │       ├─► Trading Guard Agent
  │       └─► UGC Agent
  │
  ├─► Memory Integration (context + storage)
  │       ├─► Load from session memory
  │       ├─► Execute with working memory
  │       └─► Save to long-term memory
  │
  └─► Feedback Loops (optional)
        └─► Prepare loop, submit feedback
```

## Environment Variables

```bash
# PostgreSQL
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jamal

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=optional
```

## API Reference

### Memory Service

#### Working Memory
- `createWorkingMemory(memory)` - Create task context
- `getWorkingMemory(taskId)` - Retrieve context
- `updateWorkingMemory(taskId, updates)` - Update status
- `deleteWorkingMemory(taskId)` - Remove (for cleanup)

#### Session Memory
- `createSessionMemory(sessionId, messages)` - Initialize
- `getSessionMemory(sessionId)` - Retrieve
- `appendSessionMessage(sessionId, message)` - Add message
- `summarizeSession(sessionId, summary)` - Save summary

#### Long-term Memory
- `storeLongTermMemory(memory)` - Save fact
- `retrieveLongTermMemory(options)` - Query by category/importance
- `semanticSearch(sessionId, embedding)` - Vector search

### Supervisor

- `submitTask(taskDef)` - Queue task
- `executeTask(task)` - Run task
- `prepareFeedbackLoop(task, schema)` - Setup feedback
- `submitFeedback(loopId, feedback)` - Provide feedback
- `processTaskQueue()` - Drain queue
- `getSupervisorState()` - Get state
- `getSessionSummary()` - Get summary

### Canvas UI

- `CanvasUIManager(sessionId, supervisor, memory)` - Initialize
- `render(componentId)` - Render single component
- `renderDashboard()` - Full UI

## Testing

### Unit Tests (To implement)
```bash
pnpm test
```

### Integration Tests
```bash
# Memory service tests
pnpm --filter @jamal/integration test:memory

# Supervisor tests
pnpm --filter @jamal/integration test:supervisor
```

### Manual Testing

1. **Start services**
   ```bash
   # PostgreSQL
   docker run -d -e POSTGRES_PASSWORD=postgres postgres:15

   # Qdrant
   docker run -d -p 6333:6333 qdrant/qdrant
   ```

2. **Run tests**
   ```bash
   pnpm build
   pnpm --filter @jamal/integration test:memory
   ```

3. **Check logs**
   - Memory service initialization
   - Database connectivity
   - Vector collection creation

## Deployment Checklist

- [ ] PostgreSQL database initialized with schema
- [ ] Qdrant service running and accessible
- [ ] All packages built successfully
- [ ] Integration tests passing
- [ ] Environment variables configured
- [ ] Memory cleanup job scheduled
- [ ] Logging configured
- [ ] Error handling in place

## Known Limitations & TODOs

### Completed ✓
- [x] 3-tier memory architecture
- [x] PostgreSQL + Qdrant integration
- [x] Memory service implementation
- [x] Supervisor with routing
- [x] Canvas UI components (scaffolded)
- [x] Database schemas
- [x] Integration tests (scaffolded)

### Phase 2 (Next)
- [ ] LLM-based embedding generation
- [ ] Semantic search refinement
- [ ] Cross-session memory aggregation
- [ ] Advanced feedback loops
- [ ] Production logging & monitoring
- [ ] Performance optimization
- [ ] Full test suite

### Future Enhancements
- [ ] Memory compression & archival
- [ ] User-level memory aggregation
- [ ] Importance score learning
- [ ] Multi-session context fusion
- [ ] Memory federation (distributed)

## Troubleshooting

### PostgreSQL Connection Failed
```
Error: Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Start PostgreSQL and verify connection:
```bash
psql -U postgres -h localhost -c "SELECT NOW()"
```

### Qdrant Not Found
```
Error: ECONNREFUSED http://localhost:6333
```
**Solution**: Start Qdrant:
```bash
docker run -p 6333:6333 qdrant/qdrant
```

### Build Errors
```
Error: Cannot find module '@jamal/memory-service'
```
**Solution**: Ensure pnpm workspaces are linked:
```bash
pnpm install
pnpm build
```

## Support & Contributing

- **Documentation**: See `MEMORY_ARCHITECTURE.md`
- **Issues**: Report in GitHub issues
- **PR**: Follow conventional commits
- **Testing**: Add tests for new features

## Next Steps

1. **Phase 2**: Production hardening
   - Error handling & recovery
   - Logging & monitoring
   - Performance tuning
   - Full test coverage

2. **Phase 3**: Advanced features
   - LLM embedding generation
   - Semantic memory fusion
   - Cross-session learning
   - Advanced orchestration

3. **Phase 4**: Scaling
   - Distributed memory
   - Multi-agent coordination
   - High-availability setup

---

**Status**: Phase 1 MVP Complete ✓  
**Architecture**: 3-tier memory + LangGraph supervisor  
**Technology**: TypeScript, PostgreSQL, Qdrant, LangChain
