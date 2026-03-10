/**
 * @jamal/tradingguard-service
 * Trading guard subagent service
 */

import {
  AgentDescriptor,
  SubagentAssignment,
  SubagentReport,
  TaskStatus,
} from "@jamal/shared-types";

export class TradingGuardService {
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
      summary: summary || "Trade guard check completed",
      reportedAt: new Date().toISOString(),
    };
  }
}

export default {
  TradingGuardService,
};
