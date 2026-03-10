/**
 * @jamal/orchestrator
 * Main agent / supervisor service with task queueing
 */

import {
  AgentDescriptor,
  AgentRole,
  TaskEnvelope,
  SupervisorTaskEnvelope,
} from "@jamal/shared-types";
import { InMemoryTaskQueue, QueuedTaskRecord, QueueRecordStatus } from "@jamal/queue";

export class Orchestrator {
  private descriptor: AgentDescriptor;
  private taskQueue: InMemoryTaskQueue;

  constructor(descriptor: AgentDescriptor) {
    this.descriptor = descriptor;
    this.taskQueue = new InMemoryTaskQueue();
  }

  getDescriptor(): AgentDescriptor {
    return this.descriptor;
  }

  createSupervisorTask(
    task: TaskEnvelope,
    targetSubagentRole: string
  ): SupervisorTaskEnvelope {
    return {
      supervisorId: this.descriptor.id,
      task,
      targetSubagentRole,
    };
  }

  async enqueueSupervisorTask(
    task: TaskEnvelope,
    targetSubagentRole: AgentRole
  ): Promise<QueuedTaskRecord> {
    const queuedRecord: QueuedTaskRecord = {
      id: `queued-${task.id}`,
      taskId: task.id,
      targetSubagentRole,
      enqueuedAt: new Date().toISOString(),
      status: QueueRecordStatus.PENDING,
    };

    return this.taskQueue.enqueue(queuedRecord);
  }

  async consumeNextQueuedTask(targetRole: AgentRole): Promise<QueuedTaskRecord | null> {
    return this.taskQueue.consumeNext(targetRole);
  }

  async listQueuedTasks(): Promise<QueuedTaskRecord[]> {
    return this.taskQueue.list();
  }
}

export default {
  Orchestrator,
};
