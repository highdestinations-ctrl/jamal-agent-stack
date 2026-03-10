/**
 * Agent role definitions and descriptors
 */
export var AgentRole;
(function (AgentRole) {
    AgentRole["SUPERVISOR"] = "supervisor";
    AgentRole["SUBAGENT"] = "subagent";
    AgentRole["ASSISTANT"] = "assistant";
    AgentRole["TRADING_GUARD"] = "trading_guard";
})(AgentRole || (AgentRole = {}));
export function createAgentId(id) {
    return id;
}
//# sourceMappingURL=agents.js.map