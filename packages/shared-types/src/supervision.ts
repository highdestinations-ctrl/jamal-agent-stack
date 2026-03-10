/**
 * Supervision and delegation contracts for main-agent / subagent architecture
 */

import { AgentId } from "./agents";
import { TaskEnvelope, TaskId } from "./tasks";

export interface SupervisorTaskEnvelope {
  supervisorId: AgentId;
  task: TaskEnvelope;
  targetSubagentRole: string;
}

export interface SubagentAssignment {
  subagentId: AgentId;
  taskId: TaskId;
  assignedAt: string;
}

export interface SubagentReport {
  subagentId: AgentId;
  taskId: TaskId;
  status: string;
  summary: string;
  reportedAt: string;
}
