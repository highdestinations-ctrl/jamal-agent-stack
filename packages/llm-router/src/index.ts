/**
 * @jamal/llm-router
 * LLM model routing based on task complexity
 */

import { TaskEnvelope } from "@jamal/shared-types";

export enum ModelSize {
  SMALL = "small",   // Fast classification models
  LARGE = "large",   // Reasoning and complex analysis
}

export interface ModelRoute {
  size: ModelSize;
  provider?: string;
  modelId?: string;
  maxTokens?: number;
}

export interface TaskComplexity {
  level: "classification" | "reasoning";
  confidence: number;
}

export class LLMRouter {
  private complexityClassifiers: ((task: TaskEnvelope) => TaskComplexity)[] = [];
  private modelRoutes: Map<ModelSize, ModelRoute> = new Map();

  constructor() {
    this.registerDefaultRoutes();
    this.registerDefaultClassifiers();
  }

  private registerDefaultRoutes(): void {
    // Small model for classification tasks
    this.modelRoutes.set(ModelSize.SMALL, {
      size: ModelSize.SMALL,
      provider: "openai",
      modelId: "gpt-3.5-turbo",
      maxTokens: 500,
    });

    // Large model for reasoning tasks
    this.modelRoutes.set(ModelSize.LARGE, {
      size: ModelSize.LARGE,
      provider: "anthropic",
      modelId: "claude-3-opus",
      maxTokens: 4000,
    });
  }

  private registerDefaultClassifiers(): void {
    // Classifier 1: Identify task type
    this.complexityClassifiers.push((task: TaskEnvelope): TaskComplexity => {
      const taskTypeStr = String(task.type);

      if (
        taskTypeStr.includes("classification") ||
        taskTypeStr.includes("check") ||
        taskTypeStr.includes("validate")
      ) {
        return { level: "classification", confidence: 0.9 };
      }

      if (
        taskTypeStr.includes("analysis") ||
        taskTypeStr.includes("reasoning") ||
        taskTypeStr.includes("insight")
      ) {
        return { level: "reasoning", confidence: 0.9 };
      }

      return { level: "classification", confidence: 0.5 };
    });

    // Classifier 2: Analyze payload complexity
    this.complexityClassifiers.push((task: TaskEnvelope): TaskComplexity => {
      const payloadSize = JSON.stringify(task.payload).length;
      const fieldCount = Object.keys(task.payload || {}).length;

      if (payloadSize > 1000 || fieldCount > 5) {
        return { level: "reasoning", confidence: 0.7 };
      }

      return { level: "classification", confidence: 0.6 };
    });
  }

  classifyComplexity(task: TaskEnvelope): TaskComplexity {
    // Use the first classifier's result as primary
    const classification = this.complexityClassifiers[0]?.(task) || {
      level: "classification",
      confidence: 0.5,
    };

    // If confidence is low, check other classifiers
    if (classification.confidence < 0.7 && this.complexityClassifiers.length > 1) {
      const secondOpinion = this.complexityClassifiers[1]?.(task);
      if (secondOpinion && secondOpinion.confidence > classification.confidence) {
        return secondOpinion;
      }
    }

    return classification;
  }

  routeTask(task: TaskEnvelope): ModelRoute {
    const complexity = this.classifyComplexity(task);

    if (complexity.level === "reasoning") {
      const route = this.modelRoutes.get(ModelSize.LARGE);
      if (route) {
        console.log(`Task ${task.id} routed to LARGE model for reasoning`);
        return route;
      }
    }

    const route = this.modelRoutes.get(ModelSize.SMALL);
    if (route) {
      console.log(`Task ${task.id} routed to SMALL model for classification`);
      return route;
    }

    // Fallback
    return {
      size: ModelSize.SMALL,
      provider: "fallback",
      modelId: "default",
      maxTokens: 1000,
    };
  }

  registerRoute(size: ModelSize, route: ModelRoute): void {
    this.modelRoutes.set(size, route);
    console.log(`Route registered for ${size} model: ${route.modelId}`);
  }

  getRoute(size: ModelSize): ModelRoute | undefined {
    return this.modelRoutes.get(size);
  }

  registerComplexityClassifier(
    classifier: (task: TaskEnvelope) => TaskComplexity
  ): void {
    this.complexityClassifiers.push(classifier);
    console.log("Complexity classifier registered");
  }

  getMetrics(): {
    totalRoutes: number;
    totalClassifiers: number;
  } {
    return {
      totalRoutes: this.modelRoutes.size,
      totalClassifiers: this.complexityClassifiers.length,
    };
  }
}

export default {
  LLMRouter,
};
