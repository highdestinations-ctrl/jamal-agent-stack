-- PostgreSQL Schema for Session Memory & Long-term Storage
-- Phase 1 Implementation: Memory Layer for Personal Assistant

-- Session Memory Table: 24h conversation history with summaries
CREATE TABLE IF NOT EXISTS session_memory (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Message/turn data
  messages JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  metadata JSONB,
  
  -- Indexing for queries
  UNIQUE(session_id),
  INDEX idx_session_created (session_id, created_at),
  INDEX idx_metadata (metadata)
);

-- Working Memory Table: ephemeral task context
CREATE TABLE IF NOT EXISTS working_memory (
  id SERIAL PRIMARY KEY,
  task_id UUID NOT NULL,
  session_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Ephemeral task context
  context JSONB NOT NULL,
  status VARCHAR(50),
  parent_task_id UUID,
  
  -- TTL: auto-cleanup after 24h
  CONSTRAINT ttl_check CHECK (created_at > NOW() - INTERVAL '24 hours'),
  UNIQUE(task_id),
  INDEX idx_task_session (task_id, session_id),
  INDEX idx_parent_task (parent_task_id)
);

-- Long-term Memory Index: structured metadata for vector store
CREATE TABLE IF NOT EXISTS memory_vectors (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  vector_id VARCHAR(255) NOT NULL,
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  
  -- Vector metadata
  content_type VARCHAR(50),
  content_summary TEXT,
  tags JSONB,
  metadata JSONB,
  
  -- Semantic properties
  category VARCHAR(100),
  importance_score FLOAT DEFAULT 0.5,
  
  UNIQUE(vector_id),
  INDEX idx_session_vectors (session_id),
  INDEX idx_category (category),
  INDEX idx_expires (expires_at),
  INDEX idx_importance (importance_score DESC)
);

-- Supervisor State: tracks orchestration state
CREATE TABLE IF NOT EXISTS supervisor_state (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Current routing state
  current_node VARCHAR(100),
  routing_history JSONB,
  subagent_assignments JSONB,
  
  -- Metadata
  metadata JSONB,
  
  UNIQUE(session_id),
  INDEX idx_session_supervisor (session_id)
);

-- Grant permissions
ALTER TABLE session_memory OWNER TO postgres;
ALTER TABLE working_memory OWNER TO postgres;
ALTER TABLE memory_vectors OWNER TO postgres;
ALTER TABLE supervisor_state OWNER TO postgres;
