/**
 * Agent role definitions and descriptors
 */

export enum AgentRole {
  SUPERVISOR = "supervisor",
  SUBAGENT = "subagent",
  ASSISTANT = "assistant",
  TRADING_GUARD = "trading_guard",
}

export type AgentId = string & { readonly __brand: "AgentId" };

export function createAgentId(id: string): AgentId {
  return id as AgentId;
}

export interface AgentDescriptor {
  id: AgentId;
  role: AgentRole;
  displayName: string;
  isEnabled: boolean;
}
