/**
 * Task definitions and lifecycle
 */
export declare enum TaskStatus {
    PENDING = "pending",
    QUEUED = "queued",
    RUNNING = "running",
    BLOCKED = "blocked",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export type TaskId = string & {
    readonly __brand: "TaskId";
};
export declare function createTaskId(id: string): TaskId;
export type TaskType = string & {
    readonly __brand: "TaskType";
};
export declare function createTaskType(type: string): TaskType;
export interface TaskEnvelope {
    id: TaskId;
    type: TaskType;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: string;
    updatedAt: string;
    payload: Record<string, unknown>;
}
//# sourceMappingURL=tasks.d.ts.map