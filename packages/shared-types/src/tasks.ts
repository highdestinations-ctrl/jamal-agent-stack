/**
 * Task definitions and lifecycle
 */

export enum TaskStatus {
  PENDING = "pending",
  QUEUED = "queued",
  RUNNING = "running",
  BLOCKED = "blocked",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export type TaskId = string & { readonly __brand: "TaskId" };

export function createTaskId(id: string): TaskId {
  return id as TaskId;
}

export type TaskType = string & { readonly __brand: "TaskType" };

export function createTaskType(type: string): TaskType {
  return type as TaskType;
}

export interface TaskEnvelope {
  id: TaskId;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
}
