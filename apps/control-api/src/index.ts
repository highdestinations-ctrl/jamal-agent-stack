/**
 * @jamal/control-api
 * Thin entrypoint into the supervisor/subagent stack with persistence and queueing
 */

import express, { Express, Request, Response } from "express";
import {
  AgentDescriptor,
  AgentRole,
  TaskStatus,
  TaskPriority,
  TaskEnvelope,
  SupervisorTaskEnvelope,
  SubagentAssignment,
  SubagentReport,
  createTaskId,
  createTaskType,
  createAgentId,
} from "@jamal/shared-types";
import { Orchestrator } from "@jamal/orchestrator";
import { AssistantService } from "@jamal/assistant-service";
import { TradingGuardService } from "@jamal/tradingguard-service";
import { InMemoryTaskRepository, PersistedTaskRecord } from "@jamal/db";
import { QueuedTaskRecord } from "@jamal/queue";

export interface DemoFlowResult {
  task: TaskEnvelope;
  persistedTask: PersistedTaskRecord;
  queuedTask: QueuedTaskRecord;
  assignment: SubagentAssignment;
  report: SubagentReport;
}

export interface CreateTaskRequest {
  type?: string;
  priority?: TaskPriority;
  payload: Record<string, any>;
  targetRole?: AgentRole;
}

export interface CreateTaskResponse {
  id: string;
  type: string;
  status: TaskStatus;
  queuedRecord?: QueuedTaskRecord;
  error?: string;
}

export class ControlApi {
  private supervisorDescriptor: AgentDescriptor;
  private orchestrator: Orchestrator;
  private assistantService: AssistantService;
  private tradingGuardService: TradingGuardService;
  private taskRepository: InMemoryTaskRepository;
  private app: Express;
  private port: number = 3000;

  constructor(supervisorDescriptor: AgentDescriptor) {
    this.supervisorDescriptor = supervisorDescriptor;
    this.orchestrator = new Orchestrator(supervisorDescriptor);
    this.taskRepository = new InMemoryTaskRepository();
    this.app = express();

    const assistantDescriptor: AgentDescriptor = {
      id: createAgentId("assistant-001"),
      role: AgentRole.ASSISTANT,
      displayName: "Assistant Subagent",
      isEnabled: true,
    };

    const tradingGuardDescriptor: AgentDescriptor = {
      id: createAgentId("tradingguard-001"),
      role: AgentRole.TRADING_GUARD,
      displayName: "Trading Guard Subagent",
      isEnabled: true,
    };

    this.assistantService = new AssistantService(assistantDescriptor);
    this.tradingGuardService = new TradingGuardService(tradingGuardDescriptor);

    this.setupRoutes();
  }

  getDescriptor(): AgentDescriptor {
    return this.supervisorDescriptor;
  }

  private setupRoutes(): void {
    this.app.use(express.json());

    // Health check endpoint
    this.app.get("/health", (req: Request, res: Response) => {
      res.json({ status: "ok", uptime: process.uptime() });
    });

    // Create task and enqueue it
    this.app.post("/tasks", async (req: Request, res: Response) => {
      try {
        const { type, priority, payload, targetRole } = req.body as CreateTaskRequest;

        // Validate payload
        if (!payload || typeof payload !== "object") {
          res.status(400).json({
            error: "payload is required and must be an object",
          });
          return;
        }

        // Create task
        const taskType = type ? createTaskType(type) : createTaskType("api-request");
        const task: TaskEnvelope = {
          id: createTaskId(`task-${Date.now()}`),
          type: taskType,
          status: TaskStatus.PENDING,
          priority: priority || TaskPriority.MEDIUM,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          payload,
        };

        // Persist task
        const persistedTask = await this.persistTask(task);

        // Determine target role (default to ASSISTANT)
        const target = (targetRole as AgentRole) || AgentRole.ASSISTANT;

        // Enqueue task
        const queuedTask = await this.orchestrator.enqueueSupervisorTask(task, target);

        const response: CreateTaskResponse = {
          id: task.id,
          type: task.type,
          status: task.status,
          queuedRecord: queuedTask,
        };

        res.status(201).json(response);
      } catch (error) {
        const err = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: err });
      }
    });
  }

  start(port?: number): Promise<void> {
    this.port = port || this.port;
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`Control API listening on port ${this.port}`);
        resolve();
      });
    });
  }

  stop(): void {
    // No-op for now - would close the server in a real implementation
  }

  createDemoTask(): TaskEnvelope {
    return {
      id: createTaskId("task-control-api-demo"),
      type: createTaskType("demo"),
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payload: { topic: "control-api-demo", request: "demo request" },
    };
  }

  createDemoSupervisorEnvelope(): SupervisorTaskEnvelope {
    const demoTask = this.createDemoTask();
    return this.orchestrator.createSupervisorTask(demoTask, AgentRole.ASSISTANT);
  }

  private async persistTask(task: TaskEnvelope): Promise<PersistedTaskRecord> {
    return this.taskRepository.create({
      id: task.id,
      type: task.type,
      status: task.status,
      priority: task.priority,
      payload: task.payload,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  }

  async runDemoAssistantFlow(): Promise<DemoFlowResult> {
    const task = this.createDemoTask();
    const persistedTask = await this.persistTask(task);

    const queuedTask = await this.orchestrator.enqueueSupervisorTask(
      task,
      AgentRole.ASSISTANT
    );

    const consumedQueuedTask = await this.orchestrator.consumeNextQueuedTask(
      AgentRole.ASSISTANT
    );

    const assignment: SubagentAssignment = {
      subagentId: this.assistantService.getDescriptor().id,
      taskId: task.id,
      assignedAt: new Date().toISOString(),
    };

    const report = this.assistantService.executeTask(
      assignment,
      "Control API assistant flow completed"
    );

    return {
      task,
      persistedTask,
      queuedTask: consumedQueuedTask || queuedTask,
      assignment,
      report,
    };
  }

  async runDemoTradingGuardFlow(): Promise<DemoFlowResult> {
    const task = this.createDemoTask();
    const persistedTask = await this.persistTask(task);

    const queuedTask = await this.orchestrator.enqueueSupervisorTask(
      task,
      AgentRole.TRADING_GUARD
    );

    const consumedQueuedTask = await this.orchestrator.consumeNextQueuedTask(
      AgentRole.TRADING_GUARD
    );

    const assignment: SubagentAssignment = {
      subagentId: this.tradingGuardService.getDescriptor().id,
      taskId: task.id,
      assignedAt: new Date().toISOString(),
    };

    const report = this.tradingGuardService.executeTask(
      assignment,
      "Control API trading guard flow completed"
    );

    return {
      task,
      persistedTask,
      queuedTask: consumedQueuedTask || queuedTask,
      assignment,
      report,
    };
  }

  async listPersistedTasks(): Promise<PersistedTaskRecord[]> {
    return this.taskRepository.list();
  }

  async listQueuedTasks(): Promise<QueuedTaskRecord[]> {
    return this.orchestrator.listQueuedTasks();
  }
}

export default {
  ControlApi,
};
