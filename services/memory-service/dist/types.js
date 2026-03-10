/**
 * Type definitions for 3-tier memory system
 */
import { z } from "zod";
// Working Memory: ephemeral task context
export const WorkingMemorySchema = z.object({
    taskId: z.string().uuid(),
    sessionId: z.string().uuid(),
    context: z.record(z.unknown()),
    status: z.enum(["active", "paused", "completed", "failed"]),
    parentTaskId: z.string().uuid().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Session Memory: 24h conversation history
export const SessionMemorySchema = z.object({
    sessionId: z.string().uuid(),
    messages: z.array(z.object({
        id: z.string(),
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
        timestamp: z.date(),
        metadata: z.record(z.unknown()).optional(),
    })),
    summary: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Long-term Memory: vector + structured
export const LongTermMemorySchema = z.object({
    vectorId: z.string(),
    sessionId: z.string().uuid(),
    content: z.string(),
    contentType: z.enum(["fact", "decision", "task_context", "user_preference", "domain_knowledge"]),
    category: z.string(),
    tags: z.array(z.string()),
    importanceScore: z.number().min(0).max(1),
    metadata: z.record(z.unknown()).optional(),
    createdAt: z.date(),
    expiresAt: z.date().optional(),
    embedding: z.array(z.number()).optional(),
});
// Supervisor state for routing & coordination
export const SupervisorStateSchema = z.object({
    sessionId: z.string().uuid(),
    currentNode: z.string(),
    routingHistory: z.array(z.object({
        timestamp: z.date(),
        fromNode: z.string(),
        toNode: z.string(),
        reason: z.string().optional(),
    })),
    subagentAssignments: z.record(z.object({
        agentId: z.string(),
        taskId: z.string().uuid(),
        status: z.enum(["pending", "running", "completed", "failed"]),
        result: z.unknown().optional(),
    })),
    metadata: z.record(z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Memory retrieval options
export const MemoryQueryOptionsSchema = z.object({
    sessionId: z.string().uuid().optional(),
    taskId: z.string().uuid().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    category: z.string().optional(),
    minImportance: z.number().min(0).max(1).default(0),
    timeRange: z.object({
        start: z.date().optional(),
        end: z.date().optional(),
    }).optional(),
});
