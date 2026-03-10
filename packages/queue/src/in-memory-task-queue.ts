import { AgentRole } from "@jamal/shared-types";
import { TaskQueue } from "./task-queue";
import { QueuedTaskRecord, QueueRecordStatus } from "./queue-records";

export class InMemoryTaskQueue implements TaskQueue {
  private records: QueuedTaskRecord[] = [];

  async enqueue(record: QueuedTaskRecord): Promise<QueuedTaskRecord> {
    this.records.push(record);
    return record;
  }

  async list(): Promise<QueuedTaskRecord[]> {
    return [...this.records];
  }

  async consumeNext(targetRole: AgentRole): Promise<QueuedTaskRecord | null> {
    const index = this.records.findIndex(
      (r) => r.status === QueueRecordStatus.PENDING && r.targetSubagentRole === targetRole
    );

    if (index === -1) return null;

    const record = this.records[index];
    const consumed = { ...record, status: QueueRecordStatus.CONSUMED };
    this.records[index] = consumed;
    return consumed;
  }
}
