/**
 * @jamal/shared-types
 * Core contract definitions for the agent stack
 */

// Agents
export { AgentRole, type AgentId, createAgentId, type AgentDescriptor } from "./agents";

// Tasks
export {
  TaskStatus,
  TaskPriority,
  type TaskId,
  createTaskId,
  type TaskType,
  createTaskType,
  type TaskEnvelope,
} from "./tasks";

// Messages
export { MessageRole, type MessageEnvelope } from "./messages";

// Supervision
export {
  type SupervisorTaskEnvelope,
  type SubagentAssignment,
  type SubagentReport,
} from "./supervision";
