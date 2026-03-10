/**
 * Agent role definitions and descriptors
 */
export declare enum AgentRole {
    SUPERVISOR = "supervisor",
    SUBAGENT = "subagent",
    ASSISTANT = "assistant",
    TRADING_GUARD = "trading_guard"
}
export type AgentId = string & {
    readonly __brand: "AgentId";
};
export declare function createAgentId(id: string): AgentId;
export interface AgentDescriptor {
    id: AgentId;
    role: AgentRole;
    displayName: string;
    isEnabled: boolean;
}
//# sourceMappingURL=agents.d.ts.map