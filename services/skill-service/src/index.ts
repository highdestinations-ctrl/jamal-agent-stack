/**
 * @jamal/skill-service
 * Skill system for task execution with LLM routing
 */

import { AgentDescriptor, TaskEnvelope, SubagentReport, TaskStatus } from "@jamal/shared-types";
import { LLMRouter } from "@jamal/llm-router";

export interface SkillResult {
  success: boolean;
  output?: any;
  error?: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  version?: string;
  execute: (task: TaskEnvelope) => Promise<SkillResult>;
}

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  register(skill: Skill): void {
    if (this.skills.has(skill.id)) {
      throw new Error(`Skill ${skill.id} is already registered`);
    }
    this.skills.set(skill.id, skill);
    console.log(`Skill registered: ${skill.name} (${skill.id})`);
  }

  unregister(skillId: string): void {
    if (!this.skills.has(skillId)) {
      throw new Error(`Skill ${skillId} not found`);
    }
    this.skills.delete(skillId);
    console.log(`Skill unregistered: ${skillId}`);
  }

  get(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  list(): Skill[] {
    return Array.from(this.skills.values());
  }

  exists(skillId: string): boolean {
    return this.skills.has(skillId);
  }
}

export class SkillRuntime {
  private registry: SkillRegistry;

  constructor(registry: SkillRegistry) {
    this.registry = registry;
  }

  async execute(skillId: string, task: TaskEnvelope): Promise<SkillResult> {
    const skill = this.registry.get(skillId);

    if (!skill) {
      return {
        success: false,
        error: `Skill ${skillId} not found in registry`,
      };
    }

    try {
      console.log(`Executing skill: ${skill.name} (${skillId})`);
      const result = await skill.execute(task);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error.message : "Unknown error";
      console.error(`Error executing skill ${skillId}:`, err);
      return {
        success: false,
        error: err,
      };
    }
  }

  async executeAuto(task: TaskEnvelope): Promise<SkillResult> {
    // Try to find a skill that matches the task type
    const taskTypeStr = String(task.type);

    for (const skill of this.registry.list()) {
      if (skill.id.includes(taskTypeStr) || skill.name.includes(taskTypeStr)) {
        console.log(`Auto-selected skill: ${skill.name} for task type: ${taskTypeStr}`);
        return this.execute(skill.id, task);
      }
    }

    // If no matching skill found, return error
    return {
      success: false,
      error: `No skill found for task type: ${task.type}`,
    };
  }
}

export class SkillService {
  private descriptor: AgentDescriptor;
  private registry: SkillRegistry;
  private runtime: SkillRuntime;
  private llmRouter: LLMRouter;

  constructor(descriptor: AgentDescriptor) {
    this.descriptor = descriptor;
    this.registry = new SkillRegistry();
    this.runtime = new SkillRuntime(this.registry);
    this.llmRouter = new LLMRouter();
    this.registerDefaultSkills();
  }

  private registerDefaultSkills(): void {
    // Default echo skill
    this.registry.register({
      id: "skill-echo",
      name: "Echo Skill",
      description: "Returns the input payload unchanged",
      version: "1.0.0",
      execute: async (task: TaskEnvelope): Promise<SkillResult> => {
        return {
          success: true,
          output: task.payload,
        };
      },
    });

    // Default info skill
    this.registry.register({
      id: "skill-info",
      name: "Info Skill",
      description: "Returns information about the task",
      version: "1.0.0",
      execute: async (task: TaskEnvelope): Promise<SkillResult> => {
        return {
          success: true,
          output: {
            taskId: task.id,
            taskType: task.type,
            taskStatus: task.status,
            createdAt: task.createdAt,
          },
        };
      },
    });
  }

  getDescriptor(): AgentDescriptor {
    return this.descriptor;
  }

  getRegistry(): SkillRegistry {
    return this.registry;
  }

  getRuntime(): SkillRuntime {
    return this.runtime;
  }

  getLLMRouter(): LLMRouter {
    return this.llmRouter;
  }

  async executeSkill(skillId: string, task: TaskEnvelope): Promise<SkillResult> {
    // Route the task to select the appropriate model
    const route = this.llmRouter.routeTask(task);
    console.log(
      `Skill ${skillId} will use model: ${route.modelId} (${route.size})`
    );
    return this.runtime.execute(skillId, task);
  }

  async executeAuto(task: TaskEnvelope): Promise<SkillResult> {
    // Route the task to select the appropriate model
    const route = this.llmRouter.routeTask(task);
    console.log(
      `Auto-selected model: ${route.modelId} (${route.size}) for task complexity`
    );
    return this.runtime.executeAuto(task);
  }
}

export default {
  SkillService,
};
