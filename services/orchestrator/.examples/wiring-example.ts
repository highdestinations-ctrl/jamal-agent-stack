/**
 * Wiring example: supervisor + subagent services
 * Demonstrates the end-to-end contract flow between orchestrator and subagents
 */

import {
  AgentRole,
  AgentDescriptor,
  TaskStatus,
  TaskPriority,
  TaskEnvelope,
  createAgentId,
  createTaskId,
  createTaskType,
} from "@jamal/shared-types";
import { Orchestrator } from "./index";
import { AssistantService } from "@jamal/assistant-service";
import { TradingGuardService } from "@jamal/tradingguard-service";

// Create agent descriptors
const supervisorDescriptor: AgentDescriptor = {
  id: createAgentId("supervisor-001"),
  role: AgentRole.SUPERVISOR,
  displayName: "Main Orchestrator",
  isEnabled: true,
};

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

// Instantiate services
export const orchestrator = new Orchestrator(supervisorDescriptor);
export const assistantService = new AssistantService(assistantDescriptor);
export const tradingGuardService = new TradingGuardService(tradingGuardDescriptor);

// Create a sample task
const sampleTask: TaskEnvelope = {
  id: createTaskId("task-001"),
  type: createTaskType("analysis"),
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  payload: { topic: "demo", content: "Sample task" },
};

// Orchestrator delegates task to assistant
export const supervisorTaskEnvelope = orchestrator.createSupervisorTask(
  sampleTask,
  AgentRole.ASSISTANT
);

// Create assignments for both subagents
export const assistantAssignment = {
  subagentId: assistantDescriptor.id,
  taskId: sampleTask.id,
  assignedAt: new Date().toISOString(),
};

export const tradingGuardAssignment = {
  subagentId: tradingGuardDescriptor.id,
  taskId: sampleTask.id,
  assignedAt: new Date().toISOString(),
};

// Execute tasks on subagents
export const assistantReport = assistantService.executeTask(
  assistantAssignment,
  "Analysis completed successfully"
);

export const tradingGuardReport = tradingGuardService.executeTask(
  tradingGuardAssignment,
  "Trade guard validation passed"
);

// Wiring proof: all pieces fit together
export default {
  orchestrator,
  assistantService,
  tradingGuardService,
  sampleTask,
  supervisorTaskEnvelope,
  assistantAssignment,
  tradingGuardAssignment,
  assistantReport,
  tradingGuardReport,
};
