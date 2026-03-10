/**
 * Personal Assistant Supervisor
 *
 * LangGraph-based orchestrator that:
 * - Routes tasks to appropriate subagents
 * - Integrates with memory layer
 * - Manages feedback loops for task preparation
 */
import { z } from "zod";
import { MemoryService } from "@jamal/memory-service";
/**
 * Task definition for routing
 */
export declare const TaskDefinitionSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["assistant", "tradingguard", "ugc", "custom"]>;
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    assignedAgent: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "failed"]>>;
}, "strip", z.ZodTypeAny, {
    type: "custom" | "assistant" | "tradingguard" | "ugc";
    status: "pending" | "in_progress" | "completed" | "failed";
    title: string;
    description: string;
    priority: "low" | "normal" | "high";
    id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: Date | undefined;
    assignedAgent?: string | undefined;
}, {
    type: "custom" | "assistant" | "tradingguard" | "ugc";
    title: string;
    description: string;
    id?: string | undefined;
    status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
    priority?: "low" | "normal" | "high" | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: Date | undefined;
    assignedAgent?: string | undefined;
}>;
export type TaskDefinition = z.infer<typeof TaskDefinitionSchema>;
/**
 * Supervisor state machine
 */
export declare const SupervisorNodeStateSchema: z.ZodObject<{
    sessionId: z.ZodString;
    currentTask: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["assistant", "tradingguard", "ugc", "custom"]>;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodDate>;
        assignedAgent: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "failed"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }>>;
    taskQueue: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["assistant", "tradingguard", "ugc", "custom"]>;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodDate>;
        assignedAgent: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "failed"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }>, "many">;
    completedTasks: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["assistant", "tradingguard", "ugc", "custom"]>;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodDate>;
        assignedAgent: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "failed"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }>, "many">;
    failedTasks: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["assistant", "tradingguard", "ugc", "custom"]>;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodDate>;
        assignedAgent: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "failed"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }, {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }>, "many">;
    activeFeedbackLoops: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    memoryContexts: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    taskQueue: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }[];
    completedTasks: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }[];
    failedTasks: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }[];
    activeFeedbackLoops: Record<string, unknown>;
    memoryContexts: Record<string, unknown>;
    currentTask?: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        status: "pending" | "in_progress" | "completed" | "failed";
        title: string;
        description: string;
        priority: "low" | "normal" | "high";
        id?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    } | undefined;
}, {
    sessionId: string;
    taskQueue: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }[];
    completedTasks: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }[];
    failedTasks: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    }[];
    activeFeedbackLoops: Record<string, unknown>;
    memoryContexts: Record<string, unknown>;
    currentTask?: {
        type: "custom" | "assistant" | "tradingguard" | "ugc";
        title: string;
        description: string;
        id?: string | undefined;
        status?: "pending" | "in_progress" | "completed" | "failed" | undefined;
        priority?: "low" | "normal" | "high" | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: Date | undefined;
        assignedAgent?: string | undefined;
    } | undefined;
}>;
export type SupervisorNodeState = z.infer<typeof SupervisorNodeStateSchema>;
/**
 * Subagent interface
 */
interface Subagent {
    id: string;
    name: string;
    capabilities: string[];
    execute(task: TaskDefinition, context: any): Promise<any>;
}
/**
 * Personal Assistant Supervisor
 */
export declare class PersonalAssistantSupervisor {
    private sessionId;
    private memoryService;
    private subagents;
    private state;
    constructor(sessionId: string, memoryService: MemoryService);
    /**
     * Register a subagent
     */
    registerSubagent(subagent: Subagent): void;
    /**
     * Submit a task for processing
     */
    submitTask(taskDef: Omit<TaskDefinition, "id" | "createdAt">): Promise<TaskDefinition>;
    /**
     * Route task to appropriate subagent based on type
     */
    private routeTask;
    /**
     * Execute the task through the appropriate subagent
     */
    executeTask(task: TaskDefinition): Promise<any>;
    /**
     * Prepare feedback loop for human-in-the-loop task
     * (doesn't execute yet - just sets up the infrastructure)
     */
    prepareFeedbackLoop(task: TaskDefinition, feedbackSchema: any): Promise<string>;
    /**
     * Submit feedback for a prepared loop
     */
    submitFeedback(loopId: string, feedback: any): Promise<void>;
    /**
     * Process all pending tasks in the queue
     */
    processTaskQueue(): Promise<void>;
    /**
     * Get supervisor state for persistence
     */
    getSupervisorState(): Promise<SupervisorNodeState>;
    /**
     * Restore supervisor from state
     */
    restoreFromState(state: SupervisorNodeState): Promise<void>;
    /**
     * Get current session summary from memory
     */
    getSessionSummary(): Promise<string>;
    /**
     * Clean up on shutdown
     */
    shutdown(): Promise<void>;
}
/**
 * Factory function to create supervisor
 */
export declare function createSupervisor(sessionId: string, memoryService: MemoryService): Promise<PersonalAssistantSupervisor>;
export type { Subagent };
//# sourceMappingURL=index.d.ts.map