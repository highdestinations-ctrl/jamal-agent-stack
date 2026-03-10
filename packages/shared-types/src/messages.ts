/**
 * Message definitions for agent communication
 */

export enum MessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  TOOL = "tool",
}

export interface MessageEnvelope {
  role: MessageRole;
  content: string;
  createdAt: string;
}
