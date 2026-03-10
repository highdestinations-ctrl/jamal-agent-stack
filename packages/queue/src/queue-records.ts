import { TaskId, AgentRole } from "@jamal/shared-types";

export enum QueueRecordStatus {
  PENDING = "pending",
  CONSUMED = "consumed",
}

export interface QueuedTaskRecord {
  id: string;
  taskId: TaskId;
  targetSubagentRole: AgentRole;
  enqueuedAt: string;
  status: QueueRecordStatus;
}
