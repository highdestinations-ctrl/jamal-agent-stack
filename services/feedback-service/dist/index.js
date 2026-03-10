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
import { v4 as uuidv4 } from "uuid";
/**
 * Explicit feedback types
 */
export const ExplicitFeedbackSchema = z.object({
    id: z.string().uuid().default(() => uuidv4()),
    sessionId: z.string().uuid(),
    targetId: z.string(), // task/intervention/suggestion id
    feedbackType: z.enum(["thumbs_up", "thumbs_down", "custom_note"]),
    content: z.string().optional(), // for custom notes
    confidence: z.number().min(0).max(1).optional(),
    tags: z.array(z.string()).default([]),
    createdAt: z.date().default(() => new Date()),
});
/**
 * Implicit feedback (behavioral signals)
 */
export const ImplicitFeedbackSchema = z.object({
    id: z.string().uuid().default(() => uuidv4()),
    sessionId: z.string().uuid(),
    targetId: z.string(), // intervention/suggestion id
    feedbackType: z.enum(["accepted", "ignored", "partially_followed", "rejected"]),
    timeToDecision: z.number().nonnegative(), // seconds
    resultMetric: z.string().optional(), // e.g., "exercise_completed", "meeting_cancelled"
    resultValue: z.any().optional(),
    recordedAt: z.date().default(() => new Date()),
});
/**
 * Confidence threshold record
 */
export const ConfidenceThresholdSchema = z.object({
    interventionType: z.enum(["protective", "optimizing", "connecting", "opportunity"]),
    domain: z.string(),
    currentThreshold: z.number().min(0).max(1).default(0.75),
    basedOnSamples: z.number().nonnegative().default(0),
    successRate: z.number().min(0).max(1).default(0.5),
    updatedAt: z.date().default(() => new Date()),
});
/**
 * A/B Test configuration
 */
export const ABTestSchema = z.object({
    id: z.string().uuid().default(() => uuidv4()),
    sessionId: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    dimension: z.string(), // e.g., "suggestion_frequency", "intervention_style"
    variantA: z.string(),
    variantB: z.string(),
    splitPercentage: z.number().min(0).max(1).default(0.5),
    startDate: z.date(),
    endDate: z.date().optional(),
    assignments: z.array(z.object({
        userId: z.string(),
        variant: z.enum(["A", "B"]),
    })).default([]),
    metrics: z.record(z.number()).default({}),
    winner: z.enum(["A", "B"]).optional(),
});
/**
 * Monthly refinement result
 */
export const MonthlyRefinementSchema = z.object({
    month: z.string(), // YYYY-MM
    sessionId: z.string().uuid(),
    totalFeedback: z.number().nonnegative(),
    successRate: z.number().min(0).max(1),
    thresholdAdjustments: z.array(z.object({
        domain: z.string(),
        oldThreshold: z.number(),
        newThreshold: z.number(),
        reason: z.string(),
    })).default([]),
    newInsights: z.array(z.string()).default([]),
    recommendedActions: z.array(z.string()).default([]),
    completedAt: z.date(),
});
/**
 * Feedback Service
 */
export class FeedbackService {
    constructor(sessionId, memoryService) {
        this.feedbackHistory = [];
        this.implicitHistory = [];
        this.confidenceThresholds = new Map();
        this.activeBTests = new Map();
        this.sessionId = sessionId;
        this.memoryService = memoryService;
        this.initializeDefaultThresholds();
    }
    /**
     * Record explicit feedback (thumbs up/down, custom notes)
     */
    async recordExplicitFeedback(targetId, feedbackType, content) {
        const feedback = {
            id: uuidv4(),
            sessionId: this.sessionId,
            targetId,
            feedbackType,
            content,
            tags: [feedbackType, "user_feedback"],
            createdAt: new Date(),
        };
        this.feedbackHistory.push(feedback);
        // Store in memory
        await this.memoryService.storeLongTermMemory({
            vectorId: `feedback-explicit-${feedback.id}`,
            sessionId: this.sessionId,
            content: JSON.stringify(feedback),
            contentType: "decision",
            category: "explicit_feedback",
            tags: [feedbackType, "user_feedback"],
            importanceScore: 0.7,
            metadata: {
                targetId,
                feedbackType,
            },
            createdAt: feedback.createdAt,
        });
        console.log(`[FeedbackService] Recorded explicit feedback: ${feedbackType} on ${targetId}`);
        return feedback;
    }
    /**
     * Record implicit feedback (behavioral signals)
     */
    async recordImplicitFeedback(targetId, feedbackType, timeToDecision, resultMetric, resultValue) {
        const feedback = {
            id: uuidv4(),
            sessionId: this.sessionId,
            targetId,
            feedbackType,
            timeToDecision,
            resultMetric,
            resultValue,
            recordedAt: new Date(),
        };
        this.implicitHistory.push(feedback);
        // Store in memory
        await this.memoryService.storeLongTermMemory({
            vectorId: `feedback-implicit-${feedback.id}`,
            sessionId: this.sessionId,
            content: JSON.stringify(feedback),
            contentType: "decision",
            category: "implicit_feedback",
            tags: [feedbackType, "behavioral", "learning"],
            importanceScore: 0.8,
            metadata: {
                targetId,
                feedbackType,
                resultMetric,
            },
            createdAt: feedback.recordedAt,
        });
        console.log(`[FeedbackService] Recorded implicit feedback: ${feedbackType} on ${targetId}`);
        return feedback;
    }
    /**
     * Get confidence threshold for a domain/type
     */
    getConfidenceThreshold(domain, interventionType) {
        const key = `${interventionType}:${domain}`;
        const threshold = this.confidenceThresholds.get(key);
        return threshold?.currentThreshold || 0.75;
    }
    /**
     * Update confidence threshold based on feedback
     */
    async updateConfidenceThreshold(domain, interventionType, newThreshold) {
        const key = `${interventionType}:${domain}`;
        const old = this.confidenceThresholds.get(key);
        const updated = {
            interventionType: interventionType,
            domain,
            currentThreshold: newThreshold,
            basedOnSamples: (old?.basedOnSamples || 0) + 1,
            successRate: old?.successRate || 0.5,
            updatedAt: new Date(),
        };
        this.confidenceThresholds.set(key, updated);
        // Store update
        await this.memoryService.storeLongTermMemory({
            vectorId: `threshold-update-${key}-${Date.now()}`,
            sessionId: this.sessionId,
            content: JSON.stringify(updated),
            contentType: "user_preference",
            category: "confidence_threshold",
            tags: [domain, interventionType, "model_refinement"],
            importanceScore: 0.85,
            metadata: { domain, interventionType, newThreshold },
            createdAt: new Date(),
        });
        console.log(`[FeedbackService] Updated threshold for ${key}: ${newThreshold}`);
        return updated;
    }
    /**
     * Register A/B test
     */
    registerABTest(test) {
        const abTest = {
            ...test,
            id: uuidv4(),
        };
        this.activeBTests.set(abTest.id, abTest);
        console.log(`[FeedbackService] Registered A/B test: ${abTest.name}`);
        return abTest;
    }
    /**
     * Get variant for A/B test
     */
    getABTestVariant(testId, userId) {
        const test = this.activeBTests.get(testId);
        if (!test)
            return null;
        // Check if already assigned
        const existing = test.assignments.find(a => a.userId === userId);
        if (existing)
            return existing.variant;
        // Assign new user
        const variant = Math.random() < test.splitPercentage ? "A" : "B";
        test.assignments.push({ userId, variant });
        return variant;
    }
    /**
     * Record A/B test metric
     */
    recordABTestMetric(testId, metric, value) {
        const test = this.activeBTests.get(testId);
        if (!test)
            return;
        test.metrics[metric] = (test.metrics[metric] || 0) + value;
    }
    /**
     * Get monthly refinement recommendations
     */
    async runMonthlyRefinement() {
        console.log("[FeedbackService] Running monthly refinement...");
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        // Calculate success metrics
        const totalFeedback = this.feedbackHistory.length + this.implicitHistory.length;
        const acceptedCount = this.implicitHistory.filter(f => f.feedbackType === "accepted").length;
        const successRate = totalFeedback > 0 ? acceptedCount / totalFeedback : 0;
        // Analyze thresholds
        const adjustments = [];
        for (const [key, threshold] of this.confidenceThresholds.entries()) {
            // If success rate is high, lower threshold to be more proactive
            if (successRate > 0.8 && threshold.currentThreshold > 0.7) {
                const newThreshold = Math.max(0.65, threshold.currentThreshold - 0.05);
                adjustments.push({
                    domain: threshold.domain,
                    oldThreshold: threshold.currentThreshold,
                    newThreshold,
                    reason: `High success rate (${(successRate * 100).toFixed(0)}%) - can be more proactive`,
                });
                await this.updateConfidenceThreshold(threshold.domain, key.split(":")[0], newThreshold);
            }
            // If success rate is low, raise threshold to be more conservative
            if (successRate < 0.5 && threshold.currentThreshold < 0.85) {
                const newThreshold = Math.min(0.9, threshold.currentThreshold + 0.05);
                adjustments.push({
                    domain: threshold.domain,
                    oldThreshold: threshold.currentThreshold,
                    newThreshold,
                    reason: `Low success rate (${(successRate * 100).toFixed(0)}%) - need to be more conservative`,
                });
                await this.updateConfidenceThreshold(threshold.domain, key.split(":")[0], newThreshold);
            }
        }
        // Generate insights
        const insights = this.generateMonthlyInsights();
        const refinement = {
            month,
            sessionId: this.sessionId,
            totalFeedback,
            successRate,
            thresholdAdjustments: adjustments,
            newInsights: insights,
            recommendedActions: this.generateRecommendedActions(successRate, insights),
            completedAt: new Date(),
        };
        // Store refinement
        await this.memoryService.storeLongTermMemory({
            vectorId: `refinement-${month}`,
            sessionId: this.sessionId,
            content: JSON.stringify(refinement),
            contentType: "decision",
            category: "monthly_refinement",
            tags: ["refinement", "model_update", month],
            importanceScore: 0.9,
            metadata: {
                month,
                successRate,
                adjustmentCount: adjustments.length,
            },
            createdAt: new Date(),
        });
        console.log("[FeedbackService] Monthly refinement complete");
        return refinement;
    }
    /**
     * Generate monthly insights
     */
    generateMonthlyInsights() {
        const insights = [];
        // Most common feedback type
        const feedbackTypes = this.feedbackHistory.reduce((acc, f) => {
            acc[f.feedbackType] = (acc[f.feedbackType] || 0) + 1;
            return acc;
        }, {});
        const mostCommon = Object.entries(feedbackTypes).sort((a, b) => b[1] - a[1])[0];
        if (mostCommon) {
            insights.push(`Most common feedback: ${mostCommon[0]} (${mostCommon[1]} times)`);
        }
        // Implicit acceptance rate
        const acceptedCount = this.implicitHistory.filter(f => f.feedbackType === "accepted").length;
        const acceptanceRate = this.implicitHistory.length > 0 ? acceptedCount / this.implicitHistory.length : 0;
        insights.push(`Implicit acceptance rate: ${(acceptanceRate * 100).toFixed(0)}%`);
        // Time to decision trend
        if (this.implicitHistory.length > 0) {
            const avgTime = this.implicitHistory.reduce((sum, f) => sum + f.timeToDecision, 0) / this.implicitHistory.length;
            insights.push(`Average decision time: ${avgTime.toFixed(0)}s`);
        }
        return insights;
    }
    /**
     * Generate recommended actions
     */
    generateRecommendedActions(successRate, insights) {
        const actions = [];
        if (successRate > 0.8) {
            actions.push("Continue current intervention strategy");
            actions.push("Consider increasing proactivity (lower confidence thresholds)");
        }
        else if (successRate < 0.5) {
            actions.push("Review intervention wording/timing");
            actions.push("Increase confidence thresholds to reduce false positives");
        }
        else {
            actions.push("Monitor trends over next 30 days");
            actions.push("A/B test different suggestion styles");
        }
        if (insights.some(i => i.includes("acceptance rate"))) {
            actions.push("Survey user on suggestion relevance");
        }
        return actions;
    }
    /**
     * Initialize default thresholds
     */
    initializeDefaultThresholds() {
        const defaults = [
            { type: "protective", domain: "work", threshold: 0.8 },
            { type: "protective", domain: "personal", threshold: 0.75 },
            { type: "optimizing", domain: "work", threshold: 0.75 },
            { type: "optimizing", domain: "personal", threshold: 0.7 },
            { type: "opportunity", domain: "learning", threshold: 0.7 },
            { type: "connecting", domain: "personal", threshold: 0.8 },
        ];
        defaults.forEach(({ type, domain, threshold }) => {
            const key = `${type}:${domain}`;
            this.confidenceThresholds.set(key, {
                interventionType: type,
                domain,
                currentThreshold: threshold,
                basedOnSamples: 0,
                successRate: 0.5,
                updatedAt: new Date(),
            });
        });
    }
    /**
     * Get feedback summary
     */
    async getFeedbackSummary(days = 7) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const recentExplicit = this.feedbackHistory.filter(f => f.createdAt > cutoff);
        const recentImplicit = this.implicitHistory.filter(f => f.recordedAt > cutoff);
        return {
            period: `Last ${days} days`,
            explicitFeedbackCount: recentExplicit.length,
            implicitFeedbackCount: recentImplicit.length,
            thumbsUpCount: recentExplicit.filter(f => f.feedbackType === "thumbs_up").length,
            thumbsDownCount: recentExplicit.filter(f => f.feedbackType === "thumbs_down").length,
            acceptanceRate: recentImplicit.length > 0
                ? recentImplicit.filter(f => f.feedbackType === "accepted").length / recentImplicit.length
                : 0,
        };
    }
}
export default FeedbackService;
//# sourceMappingURL=index.js.map