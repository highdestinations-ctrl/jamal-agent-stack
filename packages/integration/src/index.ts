/**
 * Phase 1 Integration: Personal Assistant UI + Memory
 * 
 * Exports all main components for integrated usage
 */

export {
  MemoryService,
  createMemoryService,
  type WorkingMemory,
  type SessionMemory,
  type LongTermMemory,
  type SupervisorState,
  type MemoryQueryOptions,
} from "@jamal/memory-service";

export {
  PersonalAssistantSupervisor,
  createSupervisor,
  type TaskDefinition,
  type Subagent,
} from "@jamal/supervisor";

export {
  CanvasUIManager,
  TaskSubmissionForm,
  TaskStatusDisplay,
  MemoryInspectionPanel,
  BuiltInToolsPanel,
} from "@jamal/canvas-ui";
