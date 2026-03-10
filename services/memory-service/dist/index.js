/**
 * Memory Service: 3-tier memory layer for personal assistant
 *
 * Layers:
 * 1. Working Memory (ephemeral): current task context
 * 2. Session Memory (24h): conversation history with summaries
 * 3. Long-term Memory (vector + structured): semantic recall
 */
import { Pool } from "pg";
export * from "./types.js";
/**
 * MemoryService: unified interface for all memory layers
 */
export class MemoryService {
    constructor(pgConfig, qdrantConfig) {
        this.pgPool = new Pool(pgConfig);
        this.qdrantUrl = qdrantConfig.url || "http://localhost:6333";
    }
    /**
     * Initialize database connections and collections
     */
    async initialize() {
        console.log("[MemoryService] Initializing...");
        try {
            // Test PostgreSQL connection
            const pgResult = await this.pgPool.query("SELECT NOW()");
            console.log("[MemoryService] PostgreSQL connected:", pgResult.rows[0]);
            // Initialize Qdrant collections if needed
            await this.initializeQdrantCollections();
            console.log("[MemoryService] Qdrant initialized");
        }
        catch (error) {
            console.error("[MemoryService] Initialization failed:", error);
            throw error;
        }
    }
    /**
     * === WORKING MEMORY LAYER ===
     * Ephemeral task context, auto-cleanup after 24h
     */
    async createWorkingMemory(memory) {
        const query = `
      INSERT INTO working_memory (task_id, session_id, context, status, parent_task_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const result = await this.pgPool.query(query, [
            memory.taskId,
            memory.sessionId,
            JSON.stringify(memory.context),
            memory.status,
            memory.parentTaskId,
        ]);
        return this.rowToWorkingMemory(result.rows[0]);
    }
    async getWorkingMemory(taskId) {
        const query = "SELECT * FROM working_memory WHERE task_id = $1";
        const result = await this.pgPool.query(query, [taskId]);
        if (result.rows.length === 0)
            return null;
        return this.rowToWorkingMemory(result.rows[0]);
    }
    async updateWorkingMemory(taskId, updates) {
        const query = `
      UPDATE working_memory 
      SET context = $1, status = $2, updated_at = NOW()
      WHERE task_id = $3
      RETURNING *
    `;
        const result = await this.pgPool.query(query, [
            JSON.stringify(updates.context || {}),
            updates.status,
            taskId,
        ]);
        return this.rowToWorkingMemory(result.rows[0]);
    }
    async deleteWorkingMemory(taskId) {
        await this.pgPool.query("DELETE FROM working_memory WHERE task_id = $1", [taskId]);
    }
    /**
     * === SESSION MEMORY LAYER ===
     * 24h conversation history with summaries
     */
    async createSessionMemory(sessionId, messages) {
        const query = `
      INSERT INTO session_memory (session_id, messages)
      VALUES ($1, $2)
      ON CONFLICT (session_id) DO UPDATE
      SET messages = $2, updated_at = NOW()
      RETURNING *
    `;
        const result = await this.pgPool.query(query, [sessionId, JSON.stringify(messages)]);
        return this.rowToSessionMemory(result.rows[0]);
    }
    async getSessionMemory(sessionId) {
        const query = "SELECT * FROM session_memory WHERE session_id = $1";
        const result = await this.pgPool.query(query, [sessionId]);
        if (result.rows.length === 0)
            return null;
        return this.rowToSessionMemory(result.rows[0]);
    }
    async appendSessionMessage(sessionId, message) {
        const existing = await this.getSessionMemory(sessionId);
        const messages = existing?.messages || [];
        messages.push(message);
        return this.createSessionMemory(sessionId, messages);
    }
    async summarizeSession(sessionId, summary) {
        const query = `
      UPDATE session_memory 
      SET summary = $1, updated_at = NOW()
      WHERE session_id = $2
      RETURNING *
    `;
        const result = await this.pgPool.query(query, [summary, sessionId]);
        return this.rowToSessionMemory(result.rows[0]);
    }
    /**
     * === LONG-TERM MEMORY LAYER ===
     * Vector embeddings + structured metadata
     */
    async storeLongTermMemory(memory) {
        // Store in PostgreSQL for metadata indexing
        const pgQuery = `
      INSERT INTO memory_vectors (session_id, vector_id, content_type, content_summary, tags, metadata, category, importance_score, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (vector_id) DO UPDATE
      SET metadata = $9, importance_score = $8, updated_at = NOW()
    `;
        await this.pgPool.query(pgQuery, [
            memory.sessionId,
            memory.vectorId,
            memory.contentType,
            memory.content.substring(0, 500),
            JSON.stringify(memory.tags),
            JSON.stringify(memory.metadata || {}),
            memory.category,
            memory.importanceScore,
            memory.expiresAt,
        ]);
        // Store in Qdrant for semantic search (via REST API)
        if (memory.embedding) {
            try {
                const response = await fetch(`${this.qdrantUrl}/collections/long_term_memory/points/upsert`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        points: [
                            {
                                id: memory.vectorId,
                                vector: memory.embedding,
                                payload: {
                                    session_id: memory.sessionId,
                                    content: memory.content,
                                    content_type: memory.contentType,
                                    category: memory.category,
                                    created_at: memory.createdAt.toISOString(),
                                    importance_score: memory.importanceScore,
                                    tags: memory.tags,
                                    metadata: memory.metadata || {},
                                },
                            },
                        ],
                    }),
                });
                if (!response.ok) {
                    console.warn(`[MemoryService] Qdrant upsert failed: ${response.statusText}`);
                }
            }
            catch (error) {
                console.warn("[MemoryService] Qdrant connection error (non-critical):", error);
            }
        }
    }
    async retrieveLongTermMemory(options) {
        let query = "SELECT * FROM memory_vectors WHERE 1=1";
        const params = [];
        let paramIndex = 1;
        if (options.sessionId) {
            query += ` AND session_id = $${paramIndex++}`;
            params.push(options.sessionId);
        }
        if (options.category) {
            query += ` AND category = $${paramIndex++}`;
            params.push(options.category);
        }
        if (options.minImportance) {
            query += ` AND importance_score >= $${paramIndex++}`;
            params.push(options.minImportance);
        }
        query += ` ORDER BY importance_score DESC, created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(options.limit, options.offset);
        const result = await this.pgPool.query(query, params);
        return result.rows.map((row) => ({
            vectorId: row.vector_id,
            sessionId: row.session_id,
            content: row.content_summary || "",
            contentType: row.content_type,
            category: row.category,
            tags: row.tags || [],
            importanceScore: row.importance_score,
            metadata: row.metadata,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
        }));
    }
    async semanticSearch(sessionId, embedding, limit = 5) {
        try {
            const response = await fetch(`${this.qdrantUrl}/collections/long_term_memory/points/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vector: embedding,
                    limit,
                    filter: {
                        must: [
                            {
                                key: "session_id",
                                match: { value: sessionId },
                            },
                        ],
                    },
                }),
            });
            if (!response.ok) {
                console.warn(`[MemoryService] Semantic search failed: ${response.statusText}`);
                return [];
            }
            const data = await response.json();
            // Map results back to LongTermMemory type
            return (data.result || []).map((r) => ({
                vectorId: r.id.toString(),
                sessionId: r.payload.session_id,
                content: r.payload.content,
                contentType: r.payload.content_type,
                category: r.payload.category,
                tags: r.payload.tags || [],
                importanceScore: r.payload.importance_score,
                metadata: r.payload.metadata,
                createdAt: new Date(r.payload.created_at),
            }));
        }
        catch (error) {
            console.warn("[MemoryService] Semantic search error:", error);
            return [];
        }
    }
    /**
     * === SUPERVISOR STATE ===
     * Tracks orchestration state for routing
     */
    async createOrUpdateSupervisorState(state) {
        const query = `
      INSERT INTO supervisor_state (session_id, current_node, routing_history, subagent_assignments, metadata)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (session_id) DO UPDATE
      SET current_node = $2, routing_history = $3, subagent_assignments = $4, metadata = $5, updated_at = NOW()
      RETURNING *
    `;
        const result = await this.pgPool.query(query, [
            state.sessionId,
            state.currentNode,
            JSON.stringify(state.routingHistory),
            JSON.stringify(state.subagentAssignments),
            JSON.stringify(state.metadata || {}),
        ]);
        return this.rowToSupervisorState(result.rows[0]);
    }
    async getSupervisorState(sessionId) {
        const query = "SELECT * FROM supervisor_state WHERE session_id = $1";
        const result = await this.pgPool.query(query, [sessionId]);
        if (result.rows.length === 0)
            return null;
        return this.rowToSupervisorState(result.rows[0]);
    }
    /**
     * Cleanup expired memory
     */
    async cleanupExpiredMemory() {
        console.log("[MemoryService] Cleaning up expired memory...");
        // Delete expired working memory (24h)
        await this.pgPool.query("DELETE FROM working_memory WHERE created_at < NOW() - INTERVAL '24 hours'");
        // Delete expired long-term memory
        await this.pgPool.query("DELETE FROM memory_vectors WHERE expires_at IS NOT NULL AND expires_at < NOW()");
    }
    /**
     * Private helpers
     */
    async initializeQdrantCollections() {
        // Collections are typically created via Qdrant admin interface
        // This is a placeholder for collection initialization
    }
    rowToWorkingMemory(row) {
        return {
            taskId: row.task_id,
            sessionId: row.session_id,
            context: row.context,
            status: row.status,
            parentTaskId: row.parent_task_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
    rowToSessionMemory(row) {
        return {
            sessionId: row.session_id,
            messages: row.messages,
            summary: row.summary,
            metadata: row.metadata,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
    rowToSupervisorState(row) {
        return {
            sessionId: row.session_id,
            currentNode: row.current_node,
            routingHistory: row.routing_history,
            subagentAssignments: row.subagent_assignments,
            metadata: row.metadata,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
    async close() {
        await this.pgPool.end();
    }
}
// Export factory function
export async function createMemoryService(pgConfig, qdrantConfig) {
    const service = new MemoryService(pgConfig, qdrantConfig);
    await service.initialize();
    return service;
}
