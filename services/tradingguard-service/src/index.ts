/**
 * @jamal/tradingguard-service
 * Trading guard subagent service with worker runtime
 */

import {
  AgentDescriptor,
  AgentRole,
  SubagentAssignment,
  SubagentReport,
  TaskStatus,
  TaskEnvelope,
} from "@jamal/shared-types";
import { TaskQueue, QueuedTaskRecord } from "@jamal/queue";
import { PolicyService } from "@jamal/policy-service";
import { SkillService } from "@jamal/skill-service";

export interface WorkerConfig {
  pollIntervalMs?: number;
  maxConcurrent?: number;
}

export class TradingGuardWorker {
  private descriptor: AgentDescriptor;
  private queue: TaskQueue;
  private policyService: PolicyService;
  private skillService: SkillService;
  private isRunning: boolean = false;
  private pollInterval: number;
  private pollTimer?: NodeJS.Timeout;

  constructor(
    descriptor: AgentDescriptor,
    queue: TaskQueue,
    policyService: PolicyService,
    skillService: SkillService,
    config?: WorkerConfig
  ) {
    this.descriptor = descriptor;
    this.queue = queue;
    this.policyService = policyService;
    this.skillService = skillService;
    this.pollInterval = config?.pollIntervalMs || 1000; // Default 1 second
  }

  getDescriptor(): AgentDescriptor {
    return this.descriptor;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error("Worker is already running");
    }

    this.isRunning = true;
    console.log(`TradingGuardWorker started (poll interval: ${this.pollInterval}ms)`);

    this.poll();
  }

  private poll = (): void => {
    if (!this.isRunning) {
      return;
    }

    this.consumeNextTask().catch((error) => {
      console.error("Error consuming task:", error);
    });

    this.pollTimer = setTimeout(this.poll, this.pollInterval);
  };

  private async consumeNextTask(): Promise<void> {
    try {
      const queuedTask = await this.queue.consumeNext(AgentRole.TRADING_GUARD);

      if (queuedTask) {
        await this.processTask(queuedTask);
      }
    } catch (error) {
      console.error("Error in consumeNextTask:", error);
    }
  }

  private async processTask(queuedTask: QueuedTaskRecord): Promise<void> {
    try {
      console.log(`Processing task ${queuedTask.taskId}`);

      // Check policy before execution
      const mockTask: TaskEnvelope = {
        id: queuedTask.taskId,
        type: "trade" as any,
        status: TaskStatus.PENDING,
        priority: "MEDIUM" as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        payload: { taskId: queuedTask.taskId },
      };

      const policyResult = await this.policyService.checkPolicy(
        mockTask,
        queuedTask.targetSubagentRole
      );

      if (!policyResult.allowed) {
        console.log(
          `Task ${queuedTask.taskId} blocked by policy: ${policyResult.reason}`
        );
        return;
      }

      // Execute task using skill service
      const skillResult = await this.skillService.executeAuto(mockTask);

      // Create assignment and report
      const assignment: SubagentAssignment = {
        subagentId: this.descriptor.id,
        taskId: queuedTask.taskId,
        assignedAt: new Date().toISOString(),
      };

      const reportSummary = skillResult.success
        ? `Task ${queuedTask.taskId} completed successfully`
        : `Task ${queuedTask.taskId} failed: ${skillResult.error}`;

      const report = this.executeTask(assignment, reportSummary);
      console.log(`Task ${queuedTask.taskId} completed with status: ${report.status}`);
    } catch (error) {
      console.error(`Error processing task ${queuedTask.taskId}:`, error);
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
    }

    console.log("TradingGuardWorker stopped");
  }

  executeTask(assignment: SubagentAssignment, summary?: string): SubagentReport {
    return {
      subagentId: this.descriptor.id,
      taskId: assignment.taskId,
      status: TaskStatus.COMPLETED,
      summary: summary || "Trade guard check completed",
      reportedAt: new Date().toISOString(),
    };
  }
}

export class TradingGuardService {
  private descriptor: AgentDescriptor;
  private worker?: TradingGuardWorker;

  constructor(descriptor: AgentDescriptor) {
    this.descriptor = descriptor;
  }

  getDescriptor(): AgentDescriptor {
    return this.descriptor;
  }

  createWorker(queue: TaskQueue, policyService: PolicyService, skillService: SkillService, config?: WorkerConfig): TradingGuardWorker {
    this.worker = new TradingGuardWorker(this.descriptor, queue, policyService, skillService, config);
    return this.worker;
  }

  getWorker(): TradingGuardWorker | undefined {
    return this.worker;
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
