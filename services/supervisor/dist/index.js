/**
 * Personal Assistant Supervisor
 *
 * LangGraph-based orchestrator that:
 * - Routes tasks to appropriate subagents
 * - Integrates with memory layer
 * - Manages feedback loops for task preparation
 */
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
/**
 * Task definition for routing
 */
export const TaskDefinitionSchema = z.object({
    id: z.string().uuid().optional(),
    type: z.enum(["assistant", "tradingguard", "ugc", "custom"]),
    title: z.string(),
    description: z.string(),
    priority: z.enum(["low", "normal", "high"]).default("normal"),
    metadata: z.record(z.unknown()).optional(),
    createdAt: z.date().optional(),
    assignedAgent: z.string().optional(),
    status: z.enum(["pending", "in_progress", "completed", "failed"]).default("pending"),
});
/**
 * Supervisor state machine
 */
export const SupervisorNodeStateSchema = z.object({
    sessionId: z.string().uuid(),
    currentTask: TaskDefinitionSchema.optional(),
    taskQueue: z.array(TaskDefinitionSchema),
    completedTasks: z.array(TaskDefinitionSchema),
    failedTasks: z.array(TaskDefinitionSchema),
    activeFeedbackLoops: z.record(z.unknown()),
    memoryContexts: z.record(z.unknown()),
});
/**
 * Personal Assistant Supervisor
 */
export class PersonalAssistantSupervisor {
    constructor(sessionId, memoryService) {
        this.subagents = new Map();
        this.sessionId = sessionId;
        this.memoryService = memoryService;
        this.state = {
            sessionId,
            taskQueue: [],
            completedTasks: [],
            failedTasks: [],
            activeFeedbackLoops: {},
            memoryContexts: {},
        };
    }
    /**
     * Register a subagent
     */
    registerSubagent(subagent) {
        this.subagents.set(subagent.id, subagent);
        console.log(`[Supervisor] Registered subagent: ${subagent.name}`);
    }
    /**
     * Submit a task for processing
     */
    async submitTask(taskDef) {
        const task = {
            ...taskDef,
            id: uuidv4(),
            createdAt: new Date(),
        };
        // Create working memory for the task
        await this.memoryService.createWorkingMemory({
            taskId: task.id,
            sessionId: this.sessionId,
            context: {
                type: task.type,
                title: task.title,
                priority: task.priority,
            },
            status: "active",
        });
        this.state.taskQueue.push(task);
        console.log(`[Supervisor] Task submitted: ${task.id} (${task.type})`);
        return task;
    }
    /**
     * Route task to appropriate subagent based on type
     */
    routeTask(task) {
        // Simple routing logic - can be enhanced with LLM-based routing
        const routingMap = {
            assistant: "assistant-agent",
            tradingguard: "tradingguard-agent",
            ugc: "ugc-agent",
            custom: "custom-agent",
        };
        return routingMap[task.type] || "default-agent";
    }
    /**
     * Execute the task through the appropriate subagent
     */
    async executeTask(task) {
        const agentId = this.routeTask(task);
        const subagent = this.subagents.get(agentId);
        if (!subagent) {
            console.error(`[Supervisor] Subagent not found: ${agentId}`);
            task.status = "failed";
            this.state.failedTasks.push(task);
            // Update working memory
            await this.memoryService.updateWorkingMemory(task.id, {
                status: "failed",
            });
            return null;
        }
        try {
            // Update task status
            task.status = "in_progress";
            task.assignedAgent = agentId;
            // Get task context from working memory
            const workingMemory = await this.memoryService.getWorkingMemory(task.id);
            const context = workingMemory?.context || {};
            // Execute task
            const result = await subagent.execute(task, context);
            // Mark as completed
            task.status = "completed";
            this.state.completedTasks.push(task);
            // Store result in long-term memory if important
            if (task.priority === "high") {
                await this.memoryService.storeLongTermMemory({
                    vectorId: `task-result-${task.id}`,
                    sessionId: this.sessionId,
                    content: JSON.stringify(result),
                    contentType: "task_context",
                    category: task.type,
                    tags: [task.type, "completed"],
                    importanceScore: 0.8,
                    metadata: {
                        taskId: task.id,
                        taskType: task.type,
                        executedBy: agentId,
                    },
                    createdAt: new Date(),
                });
            }
            // Update working memory
            await this.memoryService.updateWorkingMemory(task.id, {
                status: "completed",
            });
            console.log(`[Supervisor] Task completed: ${task.id}`);
            return result;
        }
        catch (error) {
            console.error(`[Supervisor] Task execution failed: ${task.id}`, error);
            task.status = "failed";
            this.state.failedTasks.push(task);
            await this.memoryService.updateWorkingMemory(task.id, {
                status: "failed",
            });
            return null;
        }
    }
    /**
     * Prepare feedback loop for human-in-the-loop task
     * (doesn't execute yet - just sets up the infrastructure)
     */
    async prepareFeedbackLoop(task, feedbackSchema) {
        const loopId = uuidv4();
        const loop = {
            id: loopId,
            taskId: task.id,
            status: "awaiting_feedback",
            schema: feedbackSchema,
            createdAt: new Date(),
        };
        this.state.activeFeedbackLoops[loopId] = loop;
        console.log(`[Supervisor] Feedback loop prepared: ${loopId} for task ${task.id}`);
        // Store in memory for persistence
        await this.memoryService.createWorkingMemory({
            taskId: `feedback-loop-${loopId}`,
            sessionId: this.sessionId,
            context: loop,
            status: "active",
        });
        return loopId;
    }
    /**
     * Submit feedback for a prepared loop
     */
    async submitFeedback(loopId, feedback) {
        const loop = this.state.activeFeedbackLoops[loopId];
        if (!loop) {
            throw new Error(`Feedback loop not found: ${loopId}`);
        }
        loop.feedback = feedback;
        loop.status = "feedback_received";
        loop.feedbackReceivedAt = new Date();
        console.log(`[Supervisor] Feedback received for loop: ${loopId}`);
    }
    /**
     * Process all pending tasks in the queue
     */
    async processTaskQueue() {
        while (this.state.taskQueue.length > 0) {
            const task = this.state.taskQueue.shift();
            await this.executeTask(task);
        }
    }
    /**
     * Get supervisor state for persistence
     */
    async getSupervisorState() {
        return this.state;
    }
    /**
     * Restore supervisor from state
     */
    async restoreFromState(state) {
        this.state = state;
        console.log(`[Supervisor] Restored from state: ${state.sessionId}`);
    }
    /**
     * Get current session summary from memory
     */
    async getSessionSummary() {
        const sessionMemory = await this.memoryService.getSessionMemory(this.sessionId);
        return sessionMemory?.summary || "No summary available";
    }
    /**
     * Clean up on shutdown
     */
    async shutdown() {
        // Save final state
        await this.memoryService.createOrUpdateSupervisorState({
            sessionId: this.sessionId,
            currentNode: "shutdown",
            routingHistory: [],
            subagentAssignments: {},
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log(`[Supervisor] Shutdown complete for session: ${this.sessionId}`);
    }
}
/**
 * Factory function to create supervisor
 */
export async function createSupervisor(sessionId, memoryService) {
    const supervisor = new PersonalAssistantSupervisor(sessionId, memoryService);
    console.log("[Supervisor] Created for session:", sessionId);
    return supervisor;
}
