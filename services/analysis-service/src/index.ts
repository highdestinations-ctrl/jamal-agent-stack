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
import { DomainTracker, DomainState, LifeBalanceScorecard } from "@jamal/domain-tracker";
import { MemoryService } from "@jamal/memory-service";

/**
 * Analysis result for a single pattern
 */
export const PatternAnalysisSchema = z.object({
  id: z.string(),
  domain: z.string(),
  pattern: z.string(),
  description: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  strength: z.number().min(0).max(1), // 0-1
  trend: z.enum(["stable", "increasing", "decreasing"]),
  lastObserved: z.date(),
});

export type PatternAnalysis = z.infer<typeof PatternAnalysisSchema>;

/**
 * Anomaly detection result
 */
export const AnomalyDetectionSchema = z.object({
  id: z.string(),
  domain: z.string(),
  metric: z.string(),
  expectedValue: z.number(),
  actualValue: z.number(),
  deviation: z.number(), // percentage
  severity: z.enum(["low", "medium", "high"]),
  rootCauses: z.array(z.string()).default([]),
  detectedAt: z.date(),
});

export type AnomalyDetection = z.infer<typeof AnomalyDetectionSchema>;

/**
 * Opportunity detection
 */
export const OpportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  domains: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  actionItems: z.array(z.string()),
  expectedImpact: z.enum(["low", "medium", "high"]),
  detectedAt: z.date(),
});

export type Opportunity = z.infer<typeof OpportunitySchema>;

/**
 * Intervention suggestion (only if confidence >80%)
 */
export const InterventionSchema = z.object({
  id: z.string(),
  type: z.enum(["protective", "optimizing", "connecting", "opportunity"]),
  title: z.string(),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  suggestedActions: z.array(z.string()),
  reasoning: z.string(),
  targetDomains: z.array(z.string()),
  createdAt: z.date(),
});

export type Intervention = z.infer<typeof InterventionSchema>;

/**
 * Weekly Analysis Report
 */
export const WeeklyAnalysisReportSchema = z.object({
  sessionId: z.string().uuid(),
  weekStart: z.date(),
  weekEnd: z.date(),

  // Life balance
  lifeBalance: z.any(), // LifeBalanceScorecardSchema

  // Patterns
  patterns: z.array(PatternAnalysisSchema).default([]),

  // Anomalies
  anomalies: z.array(AnomalyDetectionSchema).default([]),

  // Opportunities
  opportunities: z.array(OpportunitySchema).default([]),

  // Interventions (confidence >80% only)
  interventions: z.array(InterventionSchema).default([]),

  // Summary
  summary: z.string(),
  keyInsights: z.array(z.string()).default([]),

  // Metadata
  generatedAt: z.date(),
  modelVersion: z.string().default("1.0.0"),
});

export type WeeklyAnalysisReport = z.infer<typeof WeeklyAnalysisReportSchema>;

/**
 * Analysis Service
 */
export class AnalysisService {
  private domainTracker: DomainTracker;
  private memoryService: MemoryService;
  private sessionId: string;
  private historicalData: Map<string, any> = new Map();

  constructor(sessionId: string, domainTracker: DomainTracker, memoryService: MemoryService) {
    this.sessionId = sessionId;
    this.domainTracker = domainTracker;
    this.memoryService = memoryService;
  }

  /**
   * Run weekly analysis (Sunday 10am)
   */
  async runWeeklyAnalysis(): Promise<WeeklyAnalysisReport> {
    console.log("[AnalysisService] Starting weekly analysis...");

    const domainState = this.domainTracker.getState();
    const weekStart = domainState.periodStart;
    const weekEnd = domainState.periodEnd;

    // 1. Calculate life balance
    const lifeBalance = this.domainTracker.calculateLifeBalance();

    // 2. Pattern recognition
    const patterns = await this.detectPatterns(domainState);

    // 3. Anomaly detection
    const anomalies = await this.detectAnomalies(domainState, patterns);

    // 4. Opportunity detection
    const opportunities = await this.detectOpportunities(domainState, patterns);

    // 5. Generate interventions (confidence >80% only)
    const interventions = await this.generateInterventions(patterns, anomalies, opportunities);

    // 6. Generate summary
    const summary = this.generateSummary(lifeBalance, patterns, anomalies, opportunities);
    const keyInsights = this.extractKeyInsights(patterns, anomalies, opportunities, lifeBalance);

    const report: WeeklyAnalysisReport = {
      sessionId: this.sessionId,
      weekStart,
      weekEnd,
      lifeBalance,
      patterns,
      anomalies,
      opportunities,
      interventions,
      summary,
      keyInsights,
      generatedAt: new Date(),
      modelVersion: "1.0.0",
    };

    // Store in long-term memory
    await this.memoryService.storeLongTermMemory({
      vectorId: `weekly-analysis-${weekStart.toISOString()}`,
      sessionId: this.sessionId,
      content: JSON.stringify(report),
      contentType: "decision",
      category: "weekly_analysis",
      tags: ["analysis", "weekly", "patterns", "opportunities"],
      importanceScore: 0.9,
      metadata: {
        weekStart,
        weekEnd,
        lifeBalanceScore: lifeBalance.overallBalance,
        anomalyCount: anomalies.length,
        opportunityCount: opportunities.length,
      },
      createdAt: new Date(),
    });

    console.log("[AnalysisService] Weekly analysis complete");
    return report;
  }

  /**
   * Detect patterns across domains
   */
  private async detectPatterns(domainState: DomainState): Promise<PatternAnalysis[]> {
    const patterns: PatternAnalysis[] = [];

    // Work patterns
    if (domainState.work) {
      const workLoad = domainState.work.totalHoursThisWeek;
      patterns.push({
        id: `pattern-work-load-${Date.now()}`,
        domain: "work",
        pattern: "Weekly workload",
        description: `Averaging ${(workLoad / 5).toFixed(1)}h/day, total ${workLoad}h/week`,
        frequency: "weekly",
        strength: Math.min(workLoad / 60, 1), // normalized
        trend: "stable",
        lastObserved: domainState.work.timestamp,
      });

      if (domainState.work.stressLevel > 7) {
        patterns.push({
          id: `pattern-work-stress-${Date.now()}`,
          domain: "work",
          pattern: "High stress indicator",
          description: `Stress level: ${domainState.work.stressLevel}/10`,
          frequency: "daily",
          strength: domainState.work.stressLevel / 10,
          trend: "increasing",
          lastObserved: domainState.work.timestamp,
        });
      }
    }

    // Personal wellness patterns
    if (domainState.personal) {
      const avgMood = this.calculateAverageMood(domainState.personal.notes);
      patterns.push({
        id: `pattern-mood-${Date.now()}`,
        domain: "personal",
        pattern: "Overall mood trend",
        description: `Average mood: ${avgMood}`,
        frequency: "daily",
        strength: 0.7,
        trend: avgMood.includes("stressed") ? "decreasing" : "stable",
        lastObserved: domainState.personal.timestamp,
      });

      if (domainState.personal.sleepHours < 7) {
        patterns.push({
          id: `pattern-sleep-${Date.now()}`,
          domain: "personal",
          pattern: "Below-target sleep",
          description: `Average ${domainState.personal.sleepHours}h/night (target: 7.5h)`,
          frequency: "daily",
          strength: (7 - domainState.personal.sleepHours) / 7,
          trend: "stable",
          lastObserved: domainState.personal.timestamp,
        });
      }
    }

    // Learning patterns
    if (domainState.learning) {
      if (domainState.learning.activeCourses.length > 0) {
        const avgProgress = domainState.learning.activeCourses.reduce((sum, c) => sum + c.completionPercentage, 0) / 
                           domainState.learning.activeCourses.length;
        patterns.push({
          id: `pattern-learning-${Date.now()}`,
          domain: "learning",
          pattern: "Active learning progress",
          description: `${domainState.learning.activeCourses.length} courses, avg ${avgProgress.toFixed(0)}% complete`,
          frequency: "weekly",
          strength: 0.6,
          trend: domainState.learning.growthTrajectory > 0 ? "increasing" : "stable",
          lastObserved: domainState.learning.timestamp,
        });
      }
    }

    return patterns;
  }

  /**
   * Detect anomalies
   */
  private async detectAnomalies(domainState: DomainState, patterns: PatternAnalysis[]): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];

    // Work overload anomaly
    if (domainState.work && domainState.work.totalHoursThisWeek > 52) {
      anomalies.push({
        id: `anomaly-work-overload-${Date.now()}`,
        domain: "work",
        metric: "weekly_hours",
        expectedValue: 40,
        actualValue: domainState.work.totalHoursThisWeek,
        deviation: ((domainState.work.totalHoursThisWeek - 40) / 40) * 100,
        severity: domainState.work.totalHoursThisWeek > 60 ? "high" : "medium",
        rootCauses: ["increased_meeting_load", "deadline_pressure"],
        detectedAt: new Date(),
      });
    }

    // Sleep deficit anomaly
    if (domainState.personal && domainState.personal.sleepHours < 6) {
      anomalies.push({
        id: `anomaly-sleep-deficit-${Date.now()}`,
        domain: "personal",
        metric: "daily_sleep_hours",
        expectedValue: 7.5,
        actualValue: domainState.personal.sleepHours,
        deviation: ((7.5 - domainState.personal.sleepHours) / 7.5) * 100,
        severity: "high",
        rootCauses: ["high_stress", "excessive_caffeine"],
        detectedAt: new Date(),
      });
    }

    // Financial spending spike
    if (domainState.finance && domainState.finance.monthlyExpenses > domainState.finance.monthlyIncome * 0.9) {
      anomalies.push({
        id: `anomaly-spending-spike-${Date.now()}`,
        domain: "finance",
        metric: "monthly_expense_ratio",
        expectedValue: 0.7,
        actualValue: domainState.finance.monthlyExpenses / domainState.finance.monthlyIncome,
        deviation: ((domainState.finance.monthlyExpenses / domainState.finance.monthlyIncome) - 0.7) * 100,
        severity: "medium",
        rootCauses: ["discretionary_increase"],
        detectedAt: new Date(),
      });
    }

    return anomalies;
  }

  /**
   * Detect opportunities
   */
  private async detectOpportunities(domainState: DomainState, patterns: PatternAnalysis[]): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];

    // Time availability opportunity
    if (domainState.work && domainState.work.totalHoursThisWeek < 35) {
      opportunities.push({
        id: `opp-time-availability-${Date.now()}`,
        title: "Extra time available for learning",
        description: "You have ~5h more than typical week. Consider a learning block.",
        domains: ["learning", "personal"],
        confidence: 0.75,
        actionItems: ["Schedule 2h learning block", "Complete course module"],
        expectedImpact: "medium",
        detectedAt: new Date(),
      });
    }

    // Financial runway opportunity
    if (domainState.finance && domainState.finance.savingsRate > 0.25) {
      opportunities.push({
        id: `opp-financial-runway-${Date.now()}`,
        title: "Strong savings runway",
        description: `You're saving ${(domainState.finance.savingsRate * 100).toFixed(0)}% of income. Consider investing in growth.`,
        domains: ["finance", "learning"],
        confidence: 0.82,
        actionItems: ["Invest in skill development", "Consider course investment"],
        expectedImpact: "high",
        detectedAt: new Date(),
      });
    }

    // Relationship reconnection opportunity
    if (domainState.personal) {
      const disconnected = domainState.personal.relationships.filter(r => {
        const daysSinceContact = (new Date().getTime() - r.lastContact.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceContact > 30;
      });

      if (disconnected.length > 0) {
        opportunities.push({
          id: `opp-reconnect-${Date.now()}`,
          title: "Reconnect with important relationships",
          description: `${disconnected.length} contacts haven't been reached out to in 30+ days.`,
          domains: ["personal"],
          confidence: 0.7,
          actionItems: ["Schedule 3 calls/week", "Plan a coffee meeting"],
          expectedImpact: "medium",
          detectedAt: new Date(),
        });
      }
    }

    return opportunities;
  }

  /**
   * Generate interventions (confidence >80% only)
   */
  private async generateInterventions(
    patterns: PatternAnalysis[],
    anomalies: AnomalyDetection[],
    opportunities: Opportunity[]
  ): Promise<Intervention[]> {
    const interventions: Intervention[] = [];

    // Protective interventions (anomalies + high confidence)
    for (const anomaly of anomalies) {
      if (anomaly.severity === "high") {
        interventions.push({
          id: `intervention-protect-${Date.now()}`,
          type: "protective",
          title: `Address ${anomaly.metric} anomaly`,
          description: `${anomaly.metric} is ${anomaly.deviation.toFixed(0)}% above expected.`,
          confidence: 0.85,
          suggestedActions: [
            `Reduce ${anomaly.domain} load by 20%`,
            "Take recovery time this weekend",
          ],
          reasoning: `High-severity anomaly detected. Protective action recommended to prevent burnout.`,
          targetDomains: [anomaly.domain],
          createdAt: new Date(),
        });
      }
    }

    // Opportunity interventions (confidence >80% only)
    for (const opp of opportunities) {
      if (opp.confidence > 0.80) {
        interventions.push({
          id: `intervention-opportunity-${Date.now()}`,
          type: "opportunity",
          title: opp.title,
          description: opp.description,
          confidence: opp.confidence,
          suggestedActions: opp.actionItems,
          reasoning: `Detected high-confidence opportunity across ${opp.domains.join(", ")} domains.`,
          targetDomains: opp.domains,
          createdAt: new Date(),
        });
      }
    }

    return interventions;
  }

  /**
   * Generate summary
   */
  private generateSummary(
    lifeBalance: LifeBalanceScorecard,
    patterns: PatternAnalysis[],
    anomalies: AnomalyDetection[],
    opportunities: Opportunity[]
  ): string {
    const lines: string[] = [];

    lines.push(`# Weekly Analysis Summary`);
    lines.push("");
    lines.push(`## Life Balance: ${(lifeBalance.overallBalance * 100).toFixed(0)}%`);
    lines.push(`- Work: ${lifeBalance.work.status}`);
    lines.push(`- Personal: ${lifeBalance.personal.status}`);
    lines.push(`- Learning: ${lifeBalance.learning.status}`);
    lines.push("");

    if (anomalies.length > 0) {
      lines.push(`## ⚠️ Anomalies Detected: ${anomalies.length}`);
      anomalies.slice(0, 3).forEach(a => {
        lines.push(`- ${a.metric}: ${a.actualValue.toFixed(1)} (expected: ${a.expectedValue.toFixed(1)})`);
      });
      lines.push("");
    }

    if (opportunities.length > 0) {
      lines.push(`## 🚀 Opportunities: ${opportunities.length}`);
      opportunities.slice(0, 3).forEach(o => {
        lines.push(`- ${o.title}`);
      });
      lines.push("");
    }

    lines.push(`## Patterns: ${patterns.length} identified`);
    lines.push(`Overall trend: ${patterns.some(p => p.trend === "increasing") ? "Upward" : "Stable"}`);

    return lines.join("\n");
  }

  /**
   * Extract key insights
   */
  private extractKeyInsights(
    patterns: PatternAnalysis[],
    anomalies: AnomalyDetection[],
    opportunities: Opportunity[],
    lifeBalance: LifeBalanceScorecard
  ): string[] {
    const insights: string[] = [];

    // Balance insights
    const outOfBalance = [
      lifeBalance.work.status !== "on_target" ? `Work: ${lifeBalance.work.status}` : null,
      lifeBalance.personal.status !== "on_target" ? `Personal: ${lifeBalance.personal.status}` : null,
      lifeBalance.learning.status !== "on_target" ? `Learning: ${lifeBalance.learning.status}` : null,
    ].filter(Boolean);

    if (outOfBalance.length > 0) {
      insights.push(`Life balance deviation: ${outOfBalance.join(", ")}`);
    }

    // Risk insights
    const highSeverity = anomalies.filter(a => a.severity === "high");
    if (highSeverity.length > 0) {
      insights.push(`⚠️ ${highSeverity.length} high-severity issues detected`);
    }

    // Pattern insights
    const negativePatterns = patterns.filter(p => p.trend === "decreasing");
    if (negativePatterns.length > 0) {
      insights.push(`Declining patterns: ${negativePatterns.map(p => p.pattern).join(", ")}`);
    }

    // Opportunity insights
    const highConfidenceOpps = opportunities.filter(o => o.confidence > 0.8);
    if (highConfidenceOpps.length > 0) {
      insights.push(`High-confidence opportunities: ${highConfidenceOpps.map(o => o.title).join(", ")}`);
    }

    return insights;
  }

  /**
   * Calculate average mood
   */
  private calculateAverageMood(notes: any[]): string {
    if (notes.length === 0) return "unknown";

    const moodCounts = notes.reduce((acc, note) => {
      acc[note.mood] = (acc[note.mood] || 0) + 1;
      return acc;
    }, {});

    const sorted = Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1]);
    return sorted[0]?.[0] || "neutral";
  }
}

export default AnalysisService;
