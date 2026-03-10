import { TaskId, TaskStatus, TaskPriority } from "@jamal/shared-types";

export interface PersistedTaskRecord {
  id: TaskId;
  type: string;
  status: TaskStatus;
  priority: TaskPriority;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
