/**
 * @jamal/policy-service
 * Policy engine for task validation and approval
 */

import { AgentDescriptor, TaskEnvelope, AgentRole } from "@jamal/shared-types";

export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  description?: string;
  check: (task: TaskEnvelope, targetRole: AgentRole) => Promise<PolicyCheckResult>;
}

export class PolicyService {
  private descriptor: AgentDescriptor;
  private rules: Map<string, PolicyRule> = new Map();

  constructor(descriptor: AgentDescriptor) {
    this.descriptor = descriptor;
    this.registerDefaultPolicies();
  }

  getDescriptor(): AgentDescriptor {
    return this.descriptor;
  }

  private registerDefaultPolicies(): void {
    // Policy 1: Reject empty payloads
    this.registerRule({
      id: "policy-no-empty-payload",
      name: "No Empty Payload",
      description: "Reject tasks with empty or missing payload",
      check: async (task: TaskEnvelope): Promise<PolicyCheckResult> => {
        if (!task.payload || Object.keys(task.payload).length === 0) {
          return { allowed: false, reason: "Task payload is empty" };
        }
        return { allowed: true };
      },
    });

    // Policy 2: Reject unknown task types
    this.registerRule({
      id: "policy-known-task-types",
      name: "Known Task Types",
      description: "Only allow known task types",
      check: async (task: TaskEnvelope): Promise<PolicyCheckResult> => {
        const knownTypes = ["demo", "api-request", "trade", "check"];
        const taskTypeStr = String(task.type);
        if (!knownTypes.some((t) => taskTypeStr.includes(t))) {
          return { allowed: false, reason: `Unknown task type: ${task.type}` };
        }
        return { allowed: true };
      },
    });

    // Policy 3: Validate target role
    this.registerRule({
      id: "policy-valid-target-role",
      name: "Valid Target Role",
      description: "Ensure target role is valid",
      check: async (task: TaskEnvelope, targetRole: AgentRole): Promise<PolicyCheckResult> => {
        const validRoles = [AgentRole.ASSISTANT, AgentRole.TRADING_GUARD, AgentRole.SUPERVISOR];
        if (!validRoles.includes(targetRole)) {
          return { allowed: false, reason: `Invalid target role: ${targetRole}` };
        }
        return { allowed: true };
      },
    });
  }

  registerRule(rule: PolicyRule): void {
    this.rules.set(rule.id, rule);
    console.log(`Policy rule registered: ${rule.name}`);
  }

  async checkPolicy(
    task: TaskEnvelope,
    targetRole: AgentRole
  ): Promise<PolicyCheckResult> {
    console.log(`Running policy check for task ${task.id}`);

    for (const rule of this.rules.values()) {
      try {
        const result = await rule.check(task, targetRole);
        if (!result.allowed) {
          console.log(
            `Policy check failed (${rule.name}): ${result.reason}`
          );
          return result;
        }
      } catch (error) {
        const err = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error in policy rule ${rule.id}:`, err);
        return { allowed: false, reason: `Policy check error: ${err}` };
      }
    }

    console.log(`All policy checks passed for task ${task.id}`);
    return { allowed: true };
  }

  async checkPolicies(
    task: TaskEnvelope,
    targetRole: AgentRole
  ): Promise<PolicyCheckResult[]> {
    const results: PolicyCheckResult[] = [];

    for (const rule of this.rules.values()) {
      try {
        const result = await rule.check(task, targetRole);
        results.push(result);
      } catch (error) {
        const err = error instanceof Error ? error.message : "Unknown error";
        results.push({ allowed: false, reason: `Policy check error: ${err}` });
      }
    }

    return results;
  }

  listRules(): PolicyRule[] {
    return Array.from(this.rules.values());
  }
}

export default {
  PolicyService,
};
