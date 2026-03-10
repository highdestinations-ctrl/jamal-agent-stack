/**
 * Memory Service: 3-tier memory layer for personal assistant
 *
 * Layers:
 * 1. Working Memory (ephemeral): current task context
 * 2. Session Memory (24h): conversation history with summaries
 * 3. Long-term Memory (vector + structured): semantic recall
 */
import { WorkingMemory, SessionMemory, LongTermMemory, SupervisorState, MemoryQueryOptions } from "./types.js";
export * from "./types.js";
/**
 * MemoryService: unified interface for all memory layers
 */
export declare class MemoryService {
    private pgPool;
    private qdrantUrl;
    constructor(pgConfig: any, qdrantConfig: any);
    /**
     * Initialize database connections and collections
     */
    initialize(): Promise<void>;
    /**
     * === WORKING MEMORY LAYER ===
     * Ephemeral task context, auto-cleanup after 24h
     */
    createWorkingMemory(memory: Omit<WorkingMemory, "createdAt" | "updatedAt">): Promise<WorkingMemory>;
    getWorkingMemory(taskId: string): Promise<WorkingMemory | null>;
    updateWorkingMemory(taskId: string, updates: Partial<WorkingMemory>): Promise<WorkingMemory>;
    deleteWorkingMemory(taskId: string): Promise<void>;
    /**
     * === SESSION MEMORY LAYER ===
     * 24h conversation history with summaries
     */
    createSessionMemory(sessionId: string, messages: SessionMemory["messages"]): Promise<SessionMemory>;
    getSessionMemory(sessionId: string): Promise<SessionMemory | null>;
    appendSessionMessage(sessionId: string, message: SessionMemory["messages"][0]): Promise<SessionMemory>;
    summarizeSession(sessionId: string, summary: string): Promise<SessionMemory>;
    /**
     * === LONG-TERM MEMORY LAYER ===
     * Vector embeddings + structured metadata
     */
    storeLongTermMemory(memory: LongTermMemory): Promise<void>;
    retrieveLongTermMemory(options: MemoryQueryOptions): Promise<LongTermMemory[]>;
    semanticSearch(sessionId: string, embedding: number[], limit?: number): Promise<LongTermMemory[]>;
    /**
     * === SUPERVISOR STATE ===
     * Tracks orchestration state for routing
     */
    createOrUpdateSupervisorState(state: SupervisorState): Promise<SupervisorState>;
    getSupervisorState(sessionId: string): Promise<SupervisorState | null>;
    /**
     * Cleanup expired memory
     */
    cleanupExpiredMemory(): Promise<void>;
    /**
     * Private helpers
     */
    private initializeQdrantCollections;
    private rowToWorkingMemory;
    private rowToSessionMemory;
    private rowToSupervisorState;
    close(): Promise<void>;
}
export declare function createMemoryService(pgConfig: any, qdrantConfig: any): Promise<MemoryService>;
//# sourceMappingURL=index.d.ts.map