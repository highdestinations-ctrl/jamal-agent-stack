/**
 * Type definitions for 3-tier memory system
 */
import { z } from "zod";
export declare const WorkingMemorySchema: z.ZodObject<{
    taskId: z.ZodString;
    sessionId: z.ZodString;
    context: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    status: z.ZodEnum<["active", "paused", "completed", "failed"]>;
    parentTaskId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    taskId: string;
    sessionId: string;
    context: Record<string, unknown>;
    status: "active" | "paused" | "completed" | "failed";
    createdAt: Date;
    updatedAt: Date;
    parentTaskId?: string | undefined;
}, {
    taskId: string;
    sessionId: string;
    context: Record<string, unknown>;
    status: "active" | "paused" | "completed" | "failed";
    createdAt: Date;
    updatedAt: Date;
    parentTaskId?: string | undefined;
}>;
export type WorkingMemory = z.infer<typeof WorkingMemorySchema>;
export declare const SessionMemorySchema: z.ZodObject<{
    sessionId: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        role: z.ZodEnum<["user", "assistant", "system"]>;
        content: z.ZodString;
        timestamp: z.ZodDate;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, unknown> | undefined;
    }, {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    summary: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
    messages: {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, unknown> | undefined;
    }[];
    metadata?: Record<string, unknown> | undefined;
    summary?: string | undefined;
}, {
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
    messages: {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
        metadata?: Record<string, unknown> | undefined;
    }[];
    metadata?: Record<string, unknown> | undefined;
    summary?: string | undefined;
}>;
export type SessionMemory = z.infer<typeof SessionMemorySchema>;
export declare const LongTermMemorySchema: z.ZodObject<{
    vectorId: z.ZodString;
    sessionId: z.ZodString;
    content: z.ZodString;
    contentType: z.ZodEnum<["fact", "decision", "task_context", "user_preference", "domain_knowledge"]>;
    category: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    importanceScore: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    expiresAt: z.ZodOptional<z.ZodDate>;
    embedding: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    createdAt: Date;
    content: string;
    vectorId: string;
    contentType: "fact" | "decision" | "task_context" | "user_preference" | "domain_knowledge";
    category: string;
    tags: string[];
    importanceScore: number;
    metadata?: Record<string, unknown> | undefined;
    expiresAt?: Date | undefined;
    embedding?: number[] | undefined;
}, {
    sessionId: string;
    createdAt: Date;
    content: string;
    vectorId: string;
    contentType: "fact" | "decision" | "task_context" | "user_preference" | "domain_knowledge";
    category: string;
    tags: string[];
    importanceScore: number;
    metadata?: Record<string, unknown> | undefined;
    expiresAt?: Date | undefined;
    embedding?: number[] | undefined;
}>;
export type LongTermMemory = z.infer<typeof LongTermMemorySchema>;
export declare const SupervisorStateSchema: z.ZodObject<{
    sessionId: z.ZodString;
    currentNode: z.ZodString;
    routingHistory: z.ZodArray<z.ZodObject<{
        timestamp: z.ZodDate;
        fromNode: z.ZodString;
        toNode: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        fromNode: string;
        toNode: string;
        reason?: string | undefined;
    }, {
        timestamp: Date;
        fromNode: string;
        toNode: string;
        reason?: string | undefined;
    }>, "many">;
    subagentAssignments: z.ZodRecord<z.ZodString, z.ZodObject<{
        agentId: z.ZodString;
        taskId: z.ZodString;
        status: z.ZodEnum<["pending", "running", "completed", "failed"]>;
        result: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        taskId: string;
        status: "completed" | "failed" | "pending" | "running";
        agentId: string;
        result?: unknown;
    }, {
        taskId: string;
        status: "completed" | "failed" | "pending" | "running";
        agentId: string;
        result?: unknown;
    }>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
    currentNode: string;
    routingHistory: {
        timestamp: Date;
        fromNode: string;
        toNode: string;
        reason?: string | undefined;
    }[];
    subagentAssignments: Record<string, {
        taskId: string;
        status: "completed" | "failed" | "pending" | "running";
        agentId: string;
        result?: unknown;
    }>;
    metadata?: Record<string, unknown> | undefined;
}, {
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
    currentNode: string;
    routingHistory: {
        timestamp: Date;
        fromNode: string;
        toNode: string;
        reason?: string | undefined;
    }[];
    subagentAssignments: Record<string, {
        taskId: string;
        status: "completed" | "failed" | "pending" | "running";
        agentId: string;
        result?: unknown;
    }>;
    metadata?: Record<string, unknown> | undefined;
}>;
export type SupervisorState = z.infer<typeof SupervisorStateSchema>;
export declare const MemoryQueryOptionsSchema: z.ZodObject<{
    sessionId: z.ZodOptional<z.ZodString>;
    taskId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    minImportance: z.ZodDefault<z.ZodNumber>;
    timeRange: z.ZodOptional<z.ZodObject<{
        start: z.ZodOptional<z.ZodDate>;
        end: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        start?: Date | undefined;
        end?: Date | undefined;
    }, {
        start?: Date | undefined;
        end?: Date | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    minImportance: number;
    taskId?: string | undefined;
    sessionId?: string | undefined;
    category?: string | undefined;
    timeRange?: {
        start?: Date | undefined;
        end?: Date | undefined;
    } | undefined;
}, {
    taskId?: string | undefined;
    sessionId?: string | undefined;
    category?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    minImportance?: number | undefined;
    timeRange?: {
        start?: Date | undefined;
        end?: Date | undefined;
    } | undefined;
}>;
export type MemoryQueryOptions = z.infer<typeof MemoryQueryOptionsSchema>;
//# sourceMappingURL=types.d.ts.map