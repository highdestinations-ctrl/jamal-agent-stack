# Memory Layer Architecture - Phase 1

## Overview

The Personal Assistant implements a **3-tier memory system** for optimal task context retention and knowledge management:

```
┌─────────────────────────────────────────────────────────┐
│            Application Layer (Supervisor)               │
└─────────────────────────────────────────────────────────┘
                         ▲
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Working    │ │   Session    │ │ Long-term    │
│   Memory     │ │   Memory     │ │ Memory       │
│              │ │              │ │              │
│ Ephemeral    │ │ 24h Conv.    │ │ Vector +     │
│ Task Context │ │ History      │ │ Structured   │
└──────────────┘ └──────────────┘ └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
        ┌────────────────────────────────┐
        │   Data Layer                   │
        │  PostgreSQL + Qdrant           │
        └────────────────────────────────┘
```

---

## Layer 1: Working Memory

**Purpose**: Ephemeral task context for current operations  
**Duration**: Ephemeral (~24h TTL, auto-cleanup)  
**Storage**: PostgreSQL `working_memory` table  
**Use Cases**:
- Current task state and parameters
- Intermediate computation results
- Subtask context and parent task references
- Real-time task execution data

### Schema
```sql
CREATE TABLE working_memory (
  id SERIAL PRIMARY KEY,
  task_id UUID NOT NULL UNIQUE,
  session_id UUID NOT NULL,
  context JSONB,        -- Task-specific context
  status VARCHAR(50),   -- active, paused, completed, failed
  parent_task_id UUID,  -- For subtask hierarchies
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Example Usage
```typescript
// Create working memory for a task
const workingMem = await memoryService.createWorkingMemory({
  taskId: "task-123",
  sessionId: "session-456",
  context: {
    type: "web_search",
    query: "langraph typescript",
    filters: { year: 2024 }
  },
  status: "active"
});

// Update as task progresses
await memoryService.updateWorkingMemory("task-123", {
  status: "completed",
  context: { ...existing, results_count: 42 }
});

// Auto-cleanup after 24h (via scheduled job)
```

---

## Layer 2: Session Memory

**Purpose**: Conversation history with smart summaries  
**Duration**: 24 hours per session  
**Storage**: PostgreSQL `session_memory` table  
**Use Cases**:
- Conversation continuity within a session
- Message history with timestamps
- Session-level summaries
- Quick recall of recent interactions

### Schema
```sql
CREATE TABLE session_memory (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  messages JSONB,       -- Array of {id, role, content, timestamp}
  summary TEXT,         -- Auto-generated summary
  metadata JSONB,       -- Session-level metadata
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Message Format
```typescript
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Example
const message: Message = {
  id: "msg-42",
  role: "user",
  content: "What's the status of my trading task?",
  timestamp: new Date(),
  metadata: { intent: "status_check" }
};
```

### Example Usage
```typescript
// Append to conversation
await memoryService.appendSessionMessage(sessionId, {
  id: "msg-1",
  role: "user",
  content: "Setup my morning trading alerts",
  timestamp: new Date()
});

// Auto-summarize periodically
const summary = "User requested morning trading alerts. Set up with 30-min intervals.";
await memoryService.summarizeSession(sessionId, summary);

// Retrieve full session
const session = await memoryService.getSessionMemory(sessionId);
```

---

## Layer 3: Long-term Memory

**Purpose**: Semantic knowledge retrieval + structured facts  
**Duration**: Persistent (configurable TTL)  
**Storage**: 
- PostgreSQL `memory_vectors` (metadata indexing)
- Qdrant (vector embeddings for semantic search)  
**Use Cases**:
- User preferences ("prefers morning meetings")
- Domain knowledge ("BTC trading strategy X")
- Important decisions ("approved migration to new platform")
- Semantic recall by similarity
- Multi-session learning

### Schema (PostgreSQL)
```sql
CREATE TABLE memory_vectors (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  vector_id VARCHAR(255) NOT NULL UNIQUE,
  content_type VARCHAR(50),         -- fact, decision, task_context, etc.
  content_summary TEXT,             -- For quick reference
  tags JSONB,                       -- ["trading", "user_preference"]
  metadata JSONB,                   -- Custom metadata
  category VARCHAR(100),            -- preferences, decisions, domain_knowledge
  importance_score FLOAT,           -- 0.0-1.0
  created_at TIMESTAMP,
  expires_at TIMESTAMP,             -- Optional TTL
  updated_at TIMESTAMP
);
```

### Qdrant Collections

**1. `long_term_memory`**
- Vector size: 1536 (OpenAI embeddings)
- Distance: Cosine
- Indexed on: session_id, category, importance_score
- HNSW optimization for fast retrieval

**2. `session_embeddings`**
- Quick session-specific recall
- TTL-aware (expires after 24h)
- Contains recent conversation embeddings

**3. `task_context`**
- Task-specific embeddings
- Working memory support
- Auto-cleanup for old tasks

### Example Usage
```typescript
// Store important decision
await memoryService.storeLongTermMemory({
  vectorId: "decision-123",
  sessionId: "session-456",
  content: "User approved migration to new trading platform",
  contentType: "decision",
  category: "infrastructure",
  tags: ["migration", "trading", "approved"],
  importanceScore: 0.95,
  metadata: { decidedAt: "2024-01-15", approver: "user" },
  embedding: [0.1, 0.2, 0.3, ...], // 1536-dim
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
});

// Semantic search
const memories = await memoryService.semanticSearch(
  sessionId,
  userQueryEmbedding,
  limit: 5
);

// Retrieve by category/importance
const preferences = await memoryService.retrieveLongTermMemory({
  sessionId,
  category: "preferences",
  minImportance: 0.7
});
```

---

## Supervisor State Management

**Purpose**: Track orchestration state across tasks  
**Storage**: PostgreSQL `supervisor_state` table

```sql
CREATE TABLE supervisor_state (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  current_node VARCHAR(100),               -- Current LangGraph node
  routing_history JSONB,                   -- Node transitions
  subagent_assignments JSONB,              -- Active subagent tasks
  metadata JSONB,                          -- Custom state
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Example
```typescript
const state = {
  sessionId: "session-456",
  currentNode: "task_router",
  routingHistory: [
    {
      timestamp: new Date(),
      fromNode: "start",
      toNode: "task_router",
      reason: "Initial entry"
    }
  ],
  subagentAssignments: {
    "assistant-agent": {
      agentId: "assistant-agent",
      taskId: "task-123",
      status: "running"
    }
  }
};
```

---

## Data Flow Example: Multi-task Session

```
User Input
    │
    ├─► Working Memory (task context)
    │       └─► Live execution, intermediate results
    │
    ├─► Session Memory (conversation history)
    │       └─► Message logging, periodic summaries
    │
    ├─► Supervisor State (orchestration)
    │       └─► Routing decisions, subagent assignments
    │
    └─► Long-term Memory (async)
            └─► Semantic storage (important decisions)
            └─► Qdrant vectors (for future recall)
```

---

## Cleanup & TTL Management

### Working Memory
- **TTL**: 24 hours from creation
- **Cleanup Job**: Runs hourly
- **SQL**: `DELETE FROM working_memory WHERE created_at < NOW() - INTERVAL '24 hours'`

### Session Memory
- **TTL**: 24 hours per session
- **Auto-summarization**: Before cleanup
- **Archive**: Optional export before deletion

### Long-term Memory
- **Default TTL**: None (persistent)
- **Custom TTL**: Via `expiresAt` field
- **Cleanup**: `DELETE FROM memory_vectors WHERE expires_at < NOW()`

### Example Cleanup Job
```typescript
// Run periodically (e.g., via cron)
async function cleanupExpiredMemory() {
  console.log("[Cleanup] Running memory cleanup...");
  await memoryService.cleanupExpiredMemory();
}

// Schedule: every hour
cron.schedule('0 * * * *', cleanupExpiredMemory);
```

---

## Integration with Supervisor

The **Personal Assistant Supervisor** leverages all three memory layers:

1. **Working Memory**: Stores current task context during execution
2. **Session Memory**: Maintains conversation history for context window
3. **Long-term Memory**: Learns user preferences and domain knowledge
4. **Supervisor State**: Tracks routing decisions and subagent assignments

```typescript
const supervisor = await createSupervisor(sessionId, memoryService);

// Submit task (creates working memory)
const task = await supervisor.submitTask({
  type: "assistant",
  title: "Analyze trading data",
  description: "..."
});

// Execute task (uses all memory layers)
const result = await supervisor.executeTask(task);
// - Retrieves session context
// - Stores intermediate results in working memory
// - Saves important outcomes in long-term memory
// - Updates supervisor state
```

---

## Performance Characteristics

| Layer | Query Time | Storage | Scalability |
|-------|-----------|---------|------------|
| Working Memory | ~1-5ms | Small (task-specific) | High (TTL cleanup) |
| Session Memory | ~10-50ms | Medium (24h window) | Medium (per-session) |
| Long-term (PostgreSQL) | ~20-100ms | Large (indexed) | High (shardable) |
| Long-term (Qdrant) | ~50-200ms | Large (vectors) | High (distributed) |

---

## Configuration & Environment

### PostgreSQL
```bash
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jamal
```

### Qdrant
```bash
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=optional_api_key
```

### Initialize Database
```bash
# Run schema.sql
psql -U postgres -d jamal -f db/schemas/schema.sql

# Qdrant collections are auto-created on first use
# Or pre-create via Qdrant admin dashboard
```

---

## Future Enhancements

1. **Embedding Generation**
   - Integrate with LLM for automatic embedding generation
   - Support multiple embedding models

2. **Semantic Similarity Thresholds**
   - Configurable thresholds for memory retrieval
   - Adaptive importance scoring

3. **Cross-session Learning**
   - Aggregate long-term memory across sessions
   - User-level vs. session-level context

4. **Memory Compression**
   - Summarization of old session memories
   - Hierarchical memory organization

5. **Feedback & Refinement**
   - User feedback on memory recall quality
   - Importance score adjustment based on usage

---

## Quick Reference: API

### Memory Service
```typescript
// Working Memory
createWorkingMemory(memory)
getWorkingMemory(taskId)
updateWorkingMemory(taskId, updates)
deleteWorkingMemory(taskId)

// Session Memory
createSessionMemory(sessionId, messages)
getSessionMemory(sessionId)
appendSessionMessage(sessionId, message)
summarizeSession(sessionId, summary)

// Long-term Memory
storeLongTermMemory(memory)
retrieveLongTermMemory(options)
semanticSearch(sessionId, embedding, limit)

// Supervisor
createOrUpdateSupervisorState(state)
getSupervisorState(sessionId)

// Maintenance
cleanupExpiredMemory()
close()
```

---

**Status**: Phase 1 - Complete ✓  
**Last Updated**: 2024-03-10
