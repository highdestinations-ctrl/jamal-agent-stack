/**
 * Message definitions for agent communication
 */
export declare enum MessageRole {
    SYSTEM = "system",
    USER = "user",
    ASSISTANT = "assistant",
    TOOL = "tool"
}
export interface MessageEnvelope {
    role: MessageRole;
    content: string;
    createdAt: string;
}
//# sourceMappingURL=messages.d.ts.map