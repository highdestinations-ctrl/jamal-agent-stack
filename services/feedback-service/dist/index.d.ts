/**
 * Feedback Service: User feedback tracking and learning
 *
 * Responsibilities:
 * - Track explicit feedback (thumbs up/down, custom notes)
 * - Track implicit feedback (acceptance, ignoring suggestions)
 * - Confidence threshold optimization
 * - A/B testing framework for intervention styles
 * - Monthly model refinement
 */
import { z } from "zod";
import { MemoryService } from "@jamal/memory-service";
/**
 * Explicit feedback types
 */
export declare const ExplicitFeedbackSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    sessionId: z.ZodString;
    targetId: z.ZodString;
    feedbackType: z.ZodEnum<["thumbs_up", "thumbs_down", "custom_note"]>;
    content: z.ZodOptional<z.ZodString>;
    confidence: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sessionId: string;
    targetId: string;
    feedbackType: "thumbs_up" | "thumbs_down" | "custom_note";
    tags: string[];
    createdAt: Date;
    content?: string | undefined;
    confidence?: number | undefined;
}, {
    sessionId: string;
    targetId: string;
    feedbackType: "thumbs_up" | "thumbs_down" | "custom_note";
    id?: string | undefined;
    content?: string | undefined;
    confidence?: number | undefined;
    tags?: string[] | undefined;
    createdAt?: Date | undefined;
}>;
export type ExplicitFeedback = z.infer<typeof ExplicitFeedbackSchema>;
/**
 * Implicit feedback (behavioral signals)
 */
export declare const ImplicitFeedbackSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    sessionId: z.ZodString;
    targetId: z.ZodString;
    feedbackType: z.ZodEnum<["accepted", "ignored", "partially_followed", "rejected"]>;
    timeToDecision: z.ZodNumber;
    resultMetric: z.ZodOptional<z.ZodString>;
    resultValue: z.ZodOptional<z.ZodAny>;
    recordedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sessionId: string;
    targetId: string;
    feedbackType: "accepted" | "ignored" | "partially_followed" | "rejected";
    timeToDecision: number;
    recordedAt: Date;
    resultMetric?: string | undefined;
    resultValue?: any;
}, {
    sessionId: string;
    targetId: string;
    feedbackType: "accepted" | "ignored" | "partially_followed" | "rejected";
    timeToDecision: number;
    id?: string | undefined;
    resultMetric?: string | undefined;
    resultValue?: any;
    recordedAt?: Date | undefined;
}>;
export type ImplicitFeedback = z.infer<typeof ImplicitFeedbackSchema>;
/**
 * Confidence threshold record
 */
export declare const ConfidenceThresholdSchema: z.ZodObject<{
    interventionType: z.ZodEnum<["protective", "optimizing", "connecting", "opportunity"]>;
    domain: z.ZodString;
    currentThreshold: z.ZodDefault<z.ZodNumber>;
    basedOnSamples: z.ZodDefault<z.ZodNumber>;
    successRate: z.ZodDefault<z.ZodNumber>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    interventionType: "protective" | "optimizing" | "connecting" | "opportunity";
    domain: string;
    currentThreshold: number;
    basedOnSamples: number;
    successRate: number;
    updatedAt: Date;
}, {
    interventionType: "protective" | "optimizing" | "connecting" | "opportunity";
    domain: string;
    currentThreshold?: number | undefined;
    basedOnSamples?: number | undefined;
    successRate?: number | undefined;
    updatedAt?: Date | undefined;
}>;
export type ConfidenceThreshold = z.infer<typeof ConfidenceThresholdSchema>;
/**
 * A/B Test configuration
 */
export declare const ABTestSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    sessionId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    dimension: z.ZodString;
    variantA: z.ZodString;
    variantB: z.ZodString;
    splitPercentage: z.ZodDefault<z.ZodNumber>;
    startDate: z.ZodDate;
    endDate: z.ZodOptional<z.ZodDate>;
    assignments: z.ZodDefault<z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        variant: z.ZodEnum<["A", "B"]>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        variant: "A" | "B";
    }, {
        userId: string;
        variant: "A" | "B";
    }>, "many">>;
    metrics: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    winner: z.ZodOptional<z.ZodEnum<["A", "B"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sessionId: string;
    name: string;
    dimension: string;
    variantA: string;
    variantB: string;
    splitPercentage: number;
    startDate: Date;
    assignments: {
        userId: string;
        variant: "A" | "B";
    }[];
    metrics: Record<string, number>;
    description?: string | undefined;
    endDate?: Date | undefined;
    winner?: "A" | "B" | undefined;
}, {
    sessionId: string;
    name: string;
    dimension: string;
    variantA: string;
    variantB: string;
    startDate: Date;
    id?: string | undefined;
    description?: string | undefined;
    splitPercentage?: number | undefined;
    endDate?: Date | undefined;
    assignments?: {
        userId: string;
        variant: "A" | "B";
    }[] | undefined;
    metrics?: Record<string, number> | undefined;
    winner?: "A" | "B" | undefined;
}>;
export type ABTest = z.infer<typeof ABTestSchema>;
/**
 * Monthly refinement result
 */
export declare const MonthlyRefinementSchema: z.ZodObject<{
    month: z.ZodString;
    sessionId: z.ZodString;
    totalFeedback: z.ZodNumber;
    successRate: z.ZodNumber;
    thresholdAdjustments: z.ZodDefault<z.ZodArray<z.ZodObject<{
        domain: z.ZodString;
        oldThreshold: z.ZodNumber;
        newThreshold: z.ZodNumber;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        domain: string;
        oldThreshold: number;
        newThreshold: number;
        reason: string;
    }, {
        domain: string;
        oldThreshold: number;
        newThreshold: number;
        reason: string;
    }>, "many">>;
    newInsights: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    recommendedActions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    completedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    successRate: number;
    month: string;
    totalFeedback: number;
    thresholdAdjustments: {
        domain: string;
        oldThreshold: number;
        newThreshold: number;
        reason: string;
    }[];
    newInsights: string[];
    recommendedActions: string[];
    completedAt: Date;
}, {
    sessionId: string;
    successRate: number;
    month: string;
    totalFeedback: number;
    completedAt: Date;
    thresholdAdjustments?: {
        domain: string;
        oldThreshold: number;
        newThreshold: number;
        reason: string;
    }[] | undefined;
    newInsights?: string[] | undefined;
    recommendedActions?: string[] | undefined;
}>;
export type MonthlyRefinement = z.infer<typeof MonthlyRefinementSchema>;
/**
 * Feedback Service
 */
export declare class FeedbackService {
    private sessionId;
    private memoryService;
    private feedbackHistory;
    private implicitHistory;
    private confidenceThresholds;
    private activeBTests;
    constructor(sessionId: string, memoryService: MemoryService);
    /**
     * Record explicit feedback (thumbs up/down, custom notes)
     */
    recordExplicitFeedback(targetId: string, feedbackType: "thumbs_up" | "thumbs_down" | "custom_note", content?: string): Promise<ExplicitFeedback>;
    /**
     * Record implicit feedback (behavioral signals)
     */
    recordImplicitFeedback(targetId: string, feedbackType: "accepted" | "ignored" | "partially_followed" | "rejected", timeToDecision: number, resultMetric?: string, resultValue?: any): Promise<ImplicitFeedback>;
    /**
     * Get confidence threshold for a domain/type
     */
    getConfidenceThreshold(domain: string, interventionType: string): number;
    /**
     * Update confidence threshold based on feedback
     */
    updateConfidenceThreshold(domain: string, interventionType: string, newThreshold: number): Promise<ConfidenceThreshold>;
    /**
     * Register A/B test
     */
    registerABTest(test: Omit<ABTest, "id">): ABTest;
    /**
     * Get variant for A/B test
     */
    getABTestVariant(testId: string, userId: string): "A" | "B" | null;
    /**
     * Record A/B test metric
     */
    recordABTestMetric(testId: string, metric: string, value: number): void;
    /**
     * Get monthly refinement recommendations
     */
    runMonthlyRefinement(): Promise<MonthlyRefinement>;
    /**
     * Generate monthly insights
     */
    private generateMonthlyInsights;
    /**
     * Generate recommended actions
     */
    private generateRecommendedActions;
    /**
     * Initialize default thresholds
     */
    private initializeDefaultThresholds;
    /**
     * Get feedback summary
     */
    getFeedbackSummary(days?: number): Promise<any>;
}
export default FeedbackService;
//# sourceMappingURL=index.d.ts.map