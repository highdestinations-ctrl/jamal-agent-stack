import { AgentRole } from "@jamal/shared-types";
import { QueuedTaskRecord } from "./queue-records";

export interface TaskQueue {
  enqueue(record: QueuedTaskRecord): Promise<QueuedTaskRecord>;
  list(): Promise<QueuedTaskRecord[]>;
  consumeNext(targetRole: AgentRole): Promise<QueuedTaskRecord | null>;
}
