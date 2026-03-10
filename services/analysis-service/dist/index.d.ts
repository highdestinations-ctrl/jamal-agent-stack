/**
 * Analysis Service: Weekly analysis engine
 *
 * Responsibilities:
 * - Pattern recognition across domains
 * - Anomaly/drift detection
 * - Opportunity detection
 * - Life balance analysis
 * - Proactive intervention suggestions (confidence >80% only)
 */
import { z } from "zod";
import { DomainTracker } from "@jamal/domain-tracker";
import { MemoryService } from "@jamal/memory-service";
/**
 * Analysis result for a single pattern
 */
export declare const PatternAnalysisSchema: z.ZodObject<{
    id: z.ZodString;
    domain: z.ZodString;
    pattern: z.ZodString;
    description: z.ZodString;
    frequency: z.ZodEnum<["daily", "weekly", "monthly"]>;
    strength: z.ZodNumber;
    trend: z.ZodEnum<["stable", "increasing", "decreasing"]>;
    lastObserved: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    domain: string;
    pattern: string;
    description: string;
    frequency: "daily" | "weekly" | "monthly";
    strength: number;
    trend: "stable" | "increasing" | "decreasing";
    lastObserved: Date;
}, {
    id: string;
    domain: string;
    pattern: string;
    description: string;
    frequency: "daily" | "weekly" | "monthly";
    strength: number;
    trend: "stable" | "increasing" | "decreasing";
    lastObserved: Date;
}>;
export type PatternAnalysis = z.infer<typeof PatternAnalysisSchema>;
/**
 * Anomaly detection result
 */
export declare const AnomalyDetectionSchema: z.ZodObject<{
    id: z.ZodString;
    domain: z.ZodString;
    metric: z.ZodString;
    expectedValue: z.ZodNumber;
    actualValue: z.ZodNumber;
    deviation: z.ZodNumber;
    severity: z.ZodEnum<["low", "medium", "high"]>;
    rootCauses: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    detectedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    domain: string;
    metric: string;
    expectedValue: number;
    actualValue: number;
    deviation: number;
    severity: "low" | "medium" | "high";
    rootCauses: string[];
    detectedAt: Date;
}, {
    id: string;
    domain: string;
    metric: string;
    expectedValue: number;
    actualValue: number;
    deviation: number;
    severity: "low" | "medium" | "high";
    detectedAt: Date;
    rootCauses?: string[] | undefined;
}>;
export type AnomalyDetection = z.infer<typeof AnomalyDetectionSchema>;
/**
 * Opportunity detection
 */
export declare const OpportunitySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    domains: z.ZodArray<z.ZodString, "many">;
    confidence: z.ZodNumber;
    actionItems: z.ZodArray<z.ZodString, "many">;
    expectedImpact: z.ZodEnum<["low", "medium", "high"]>;
    detectedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    description: string;
    detectedAt: Date;
    title: string;
    domains: string[];
    confidence: number;
    actionItems: string[];
    expectedImpact: "low" | "medium" | "high";
}, {
    id: string;
    description: string;
    detectedAt: Date;
    title: string;
    domains: string[];
    confidence: number;
    actionItems: string[];
    expectedImpact: "low" | "medium" | "high";
}>;
export type Opportunity = z.infer<typeof OpportunitySchema>;
/**
 * Intervention suggestion (only if confidence >80%)
 */
export declare const InterventionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["protective", "optimizing", "connecting", "opportunity"]>;
    title: z.ZodString;
    description: z.ZodString;
    confidence: z.ZodNumber;
    suggestedActions: z.ZodArray<z.ZodString, "many">;
    reasoning: z.ZodString;
    targetDomains: z.ZodArray<z.ZodString, "many">;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    description: string;
    type: "protective" | "optimizing" | "connecting" | "opportunity";
    title: string;
    confidence: number;
    suggestedActions: string[];
    reasoning: string;
    targetDomains: string[];
    createdAt: Date;
}, {
    id: string;
    description: string;
    type: "protective" | "optimizing" | "connecting" | "opportunity";
    title: string;
    confidence: number;
    suggestedActions: string[];
    reasoning: string;
    targetDomains: string[];
    createdAt: Date;
}>;
export type Intervention = z.infer<typeof InterventionSchema>;
/**
 * Weekly Analysis Report
 */
export declare const WeeklyAnalysisReportSchema: z.ZodObject<{
    sessionId: z.ZodString;
    weekStart: z.ZodDate;
    weekEnd: z.ZodDate;
    lifeBalance: z.ZodAny;
    patterns: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        domain: z.ZodString;
        pattern: z.ZodString;
        description: z.ZodString;
        frequency: z.ZodEnum<["daily", "weekly", "monthly"]>;
        strength: z.ZodNumber;
        trend: z.ZodEnum<["stable", "increasing", "decreasing"]>;
        lastObserved: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        domain: string;
        pattern: string;
        description: string;
        frequency: "daily" | "weekly" | "monthly";
        strength: number;
        trend: "stable" | "increasing" | "decreasing";
        lastObserved: Date;
    }, {
        id: string;
        domain: string;
        pattern: string;
        description: string;
        frequency: "daily" | "weekly" | "monthly";
        strength: number;
        trend: "stable" | "increasing" | "decreasing";
        lastObserved: Date;
    }>, "many">>;
    anomalies: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        domain: z.ZodString;
        metric: z.ZodString;
        expectedValue: z.ZodNumber;
        actualValue: z.ZodNumber;
        deviation: z.ZodNumber;
        severity: z.ZodEnum<["low", "medium", "high"]>;
        rootCauses: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        detectedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        domain: string;
        metric: string;
        expectedValue: number;
        actualValue: number;
        deviation: number;
        severity: "low" | "medium" | "high";
        rootCauses: string[];
        detectedAt: Date;
    }, {
        id: string;
        domain: string;
        metric: string;
        expectedValue: number;
        actualValue: number;
        deviation: number;
        severity: "low" | "medium" | "high";
        detectedAt: Date;
        rootCauses?: string[] | undefined;
    }>, "many">>;
    opportunities: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        domains: z.ZodArray<z.ZodString, "many">;
        confidence: z.ZodNumber;
        actionItems: z.ZodArray<z.ZodString, "many">;
        expectedImpact: z.ZodEnum<["low", "medium", "high"]>;
        detectedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        description: string;
        detectedAt: Date;
        title: string;
        domains: string[];
        confidence: number;
        actionItems: string[];
        expectedImpact: "low" | "medium" | "high";
    }, {
        id: string;
        description: string;
        detectedAt: Date;
        title: string;
        domains: string[];
        confidence: number;
        actionItems: string[];
        expectedImpact: "low" | "medium" | "high";
    }>, "many">>;
    interventions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["protective", "optimizing", "connecting", "opportunity"]>;
        title: z.ZodString;
        description: z.ZodString;
        confidence: z.ZodNumber;
        suggestedActions: z.ZodArray<z.ZodString, "many">;
        reasoning: z.ZodString;
        targetDomains: z.ZodArray<z.ZodString, "many">;
        createdAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        description: string;
        type: "protective" | "optimizing" | "connecting" | "opportunity";
        title: string;
        confidence: number;
        suggestedActions: string[];
        reasoning: string;
        targetDomains: string[];
        createdAt: Date;
    }, {
        id: string;
        description: string;
        type: "protective" | "optimizing" | "connecting" | "opportunity";
        title: string;
        confidence: number;
        suggestedActions: string[];
        reasoning: string;
        targetDomains: string[];
        createdAt: Date;
    }>, "many">>;
    summary: z.ZodString;
    keyInsights: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    generatedAt: z.ZodDate;
    modelVersion: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    weekStart: Date;
    weekEnd: Date;
    patterns: {
        id: string;
        domain: string;
        pattern: string;
        description: string;
        frequency: "daily" | "weekly" | "monthly";
        strength: number;
        trend: "stable" | "increasing" | "decreasing";
        lastObserved: Date;
    }[];
    anomalies: {
        id: string;
        domain: string;
        metric: string;
        expectedValue: number;
        actualValue: number;
        deviation: number;
        severity: "low" | "medium" | "high";
        rootCauses: string[];
        detectedAt: Date;
    }[];
    opportunities: {
        id: string;
        description: string;
        detectedAt: Date;
        title: string;
        domains: string[];
        confidence: number;
        actionItems: string[];
        expectedImpact: "low" | "medium" | "high";
    }[];
    interventions: {
        id: string;
        description: string;
        type: "protective" | "optimizing" | "connecting" | "opportunity";
        title: string;
        confidence: number;
        suggestedActions: string[];
        reasoning: string;
        targetDomains: string[];
        createdAt: Date;
    }[];
    summary: string;
    keyInsights: string[];
    generatedAt: Date;
    modelVersion: string;
    lifeBalance?: any;
}, {
    sessionId: string;
    weekStart: Date;
    weekEnd: Date;
    summary: string;
    generatedAt: Date;
    lifeBalance?: any;
    patterns?: {
        id: string;
        domain: string;
        pattern: string;
        description: string;
        frequency: "daily" | "weekly" | "monthly";
        strength: number;
        trend: "stable" | "increasing" | "decreasing";
        lastObserved: Date;
    }[] | undefined;
    anomalies?: {
        id: string;
        domain: string;
        metric: string;
        expectedValue: number;
        actualValue: number;
        deviation: number;
        severity: "low" | "medium" | "high";
        detectedAt: Date;
        rootCauses?: string[] | undefined;
    }[] | undefined;
    opportunities?: {
        id: string;
        description: string;
        detectedAt: Date;
        title: string;
        domains: string[];
        confidence: number;
        actionItems: string[];
        expectedImpact: "low" | "medium" | "high";
    }[] | undefined;
    interventions?: {
        id: string;
        description: string;
        type: "protective" | "optimizing" | "connecting" | "opportunity";
        title: string;
        confidence: number;
        suggestedActions: string[];
        reasoning: string;
        targetDomains: string[];
        createdAt: Date;
    }[] | undefined;
    keyInsights?: string[] | undefined;
    modelVersion?: string | undefined;
}>;
export type WeeklyAnalysisReport = z.infer<typeof WeeklyAnalysisReportSchema>;
/**
 * Analysis Service
 */
export declare class AnalysisService {
    private domainTracker;
    private memoryService;
    private sessionId;
    private historicalData;
    constructor(sessionId: string, domainTracker: DomainTracker, memoryService: MemoryService);
    /**
     * Run weekly analysis (Sunday 10am)
     */
    runWeeklyAnalysis(): Promise<WeeklyAnalysisReport>;
    /**
     * Detect patterns across domains
     */
    private detectPatterns;
    /**
     * Detect anomalies
     */
    private detectAnomalies;
    /**
     * Detect opportunities
     */
    private detectOpportunities;
    /**
     * Generate interventions (confidence >80% only)
     */
    private generateInterventions;
    /**
     * Generate summary
     */
    private generateSummary;
    /**
     * Extract key insights
     */
    private extractKeyInsights;
    /**
     * Calculate average mood
     */
    private calculateAverageMood;
}
export default AnalysisService;
//# sourceMappingURL=index.d.ts.map