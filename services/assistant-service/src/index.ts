/**
 * @jamal/assistant-service
 * Assistant subagent service
 */

import {
  AgentDescriptor,
  SubagentAssignment,
  SubagentReport,
  TaskStatus,
} from "@jamal/shared-types";

export class AssistantService {
  private descriptor: AgentDescriptor;

  constructor(descriptor: AgentDescriptor) {
    this.descriptor = descriptor;
  }

  getDescriptor(): AgentDescriptor {
    return this.descriptor;
  }

  executeTask(
    assignment: SubagentAssignment,
    summary?: string
  ): SubagentReport {
    return {
      subagentId: this.descriptor.id,
      taskId: assignment.taskId,
      status: TaskStatus.COMPLETED,
      summary: summary || "Task completed",
      reportedAt: new Date().toISOString(),
    };
  }
}

export default {
  AssistantService,
};
