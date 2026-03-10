/**
 * Domain Tracker: Multi-domain tracking system
 * Tracks 5 key life domains and derives signals
 */
import { z } from "zod";
/**
 * Work Domain: professional activities, calendar, tasks, stress
 */
export const WorkDomainSchema = z.object({
    sessionId: z.string().uuid(),
    // Calendar
    meetings: z.array(z.object({
        id: z.string(),
        title: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        type: z.enum(["meeting", "focus_block", "travel"]),
        context: z.string().optional(),
    })).default([]),
    // Tasks
    tasks: z.array(z.object({
        id: z.string(),
        title: z.string(),
        estimatedHours: z.number().positive(),
        completed: z.boolean().default(false),
        priority: z.enum(["low", "normal", "high"]),
        completedAt: z.date().optional(),
    })).default([]),
    // Metrics
    totalHoursThisWeek: z.number().nonnegative().default(0),
    contextSwitches: z.number().nonnegative().default(0),
    focusBlocks: z.number().nonnegative().default(0),
    stressLevel: z.number().min(0).max(10).default(5), // 0=relaxed, 10=overwhelmed
    timestamp: z.date(),
});
/**
 * Personal Domain: notes, relationships, wellbeing, hobbies
 */
export const PersonalDomainSchema = z.object({
    sessionId: z.string().uuid(),
    // Notes & Reflections
    notes: z.array(z.object({
        id: z.string(),
        content: z.string(),
        mood: z.enum(["great", "good", "neutral", "stressed", "exhausted"]),
        tags: z.array(z.string()),
        createdAt: z.date(),
    })).default([]),
    // Relationships
    relationships: z.array(z.object({
        name: z.string(),
        lastContact: z.date(),
        frequencyDays: z.number().positive().optional(),
        health: z.enum(["strong", "good", "neutral", "distant"]),
    })).default([]),
    // Wellbeing
    exerciseCount: z.number().nonnegative().default(0),
    sleepHours: z.number().nonnegative().default(7),
    wellbeingScore: z.number().min(0).max(10).default(7),
    // Hobbies/Personal Projects
    hobbies: z.array(z.object({
        name: z.string(),
        lastEngagement: z.date(),
        priority: z.enum(["low", "normal", "high"]),
    })).default([]),
    timestamp: z.date(),
});
/**
 * Finance Domain: income, expenses, trading, goals
 */
export const FinanceDomainSchema = z.object({
    sessionId: z.string().uuid(),
    // Tracking
    balance: z.number().default(0),
    monthlyIncome: z.number().nonnegative().default(0),
    monthlyExpenses: z.number().nonnegative().default(0),
    savingsRate: z.number().min(0).max(1).default(0.2), // 0-1 fraction
    // Trading
    tradingJournal: z.array(z.object({
        id: z.string(),
        date: z.date(),
        decision: z.string(),
        outcome: z.enum(["win", "loss", "break_even"]),
        pnl: z.number(),
        notes: z.string().optional(),
    })).default([]),
    // Goals
    goals: z.array(z.object({
        id: z.string(),
        title: z.string(),
        targetAmount: z.number().positive(),
        currentAmount: z.number().nonnegative().default(0),
        deadline: z.date(),
    })).default([]),
    // Risk tolerance
    riskTolerance: z.enum(["conservative", "moderate", "aggressive"]).default("moderate"),
    disciplineScore: z.number().min(0).max(10).default(5),
    timestamp: z.date(),
});
/**
 * Learning Domain: courses, books, certifications, progress
 */
export const LearningDomainSchema = z.object({
    sessionId: z.string().uuid(),
    // Active Learning
    activeCourses: z.array(z.object({
        id: z.string(),
        title: z.string(),
        topic: z.string(),
        hoursCompleted: z.number().nonnegative(),
        totalHours: z.number().positive(),
        completionPercentage: z.number().min(0).max(100),
        startDate: z.date(),
        targetCompleteDate: z.date().optional(),
    })).default([]),
    // Skills
    skills: z.array(z.object({
        name: z.string(),
        proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
        hoursInvested: z.number().nonnegative(),
        lastPracticedAt: z.date().optional(),
    })).default([]),
    // Books
    books: z.array(z.object({
        title: z.string(),
        author: z.string(),
        status: z.enum(["reading", "completed", "backlog"]),
        startDate: z.date(),
        completedDate: z.date().optional(),
    })).default([]),
    // Growth metrics
    weeklyLearningHours: z.number().nonnegative().default(0),
    growthTrajectory: z.number().min(-1).max(1).default(0), // -1=declining, 0=stable, 1=accelerating
    interestStability: z.number().min(0).max(10).default(7),
    timestamp: z.date(),
});
/**
 * Attention Domain: Meta-tracking of user behavior patterns
 */
export const AttentionDomainSchema = z.object({
    sessionId: z.string().uuid(),
    // Question patterns
    recentQuestions: z.array(z.object({
        question: z.string(),
        category: z.string(),
        timestamp: z.date(),
        feedbackGiven: z.boolean().default(false),
    })).default([]),
    // Help patterns
    helpRequests: z.array(z.object({
        topic: z.string(),
        frequency: z.number().nonnegative(),
        avgResponseTime: z.number().nonnegative(), // seconds
    })).default([]),
    // Feedback patterns
    feedbackStats: z.object({
        thumbsUpCount: z.number().nonnegative().default(0),
        thumbsDownCount: z.number().nonnegative().default(0),
        customFeedbackCount: z.number().nonnegative().default(0),
        ignoreCount: z.number().nonnegative().default(0),
    }).default({}),
    // Time patterns
    peakActivityHours: z.array(z.number().min(0).max(23)).default([9, 10, 14, 15]),
    responseTimeByHour: z.record(z.number()).default({}), // hour -> avg response time
    // Derived signals
    attentionSpan: z.number().min(0).max(10).default(7),
    fatiguePatterns: z.array(z.object({
        timeOfDay: z.string(),
        fatigueLevel: z.number().min(0).max(10),
    })).default([]),
    priorityDrift: z.number().min(-1).max(1).default(0), // -1=falling, 0=stable, 1=rising
    timestamp: z.date(),
});
/**
 * Unified Domain State
 */
export const DomainStateSchema = z.object({
    sessionId: z.string().uuid(),
    userId: z.string().optional(),
    work: WorkDomainSchema.optional(),
    personal: PersonalDomainSchema.optional(),
    finance: FinanceDomainSchema.optional(),
    learning: LearningDomainSchema.optional(),
    attention: AttentionDomainSchema.optional(),
    // Time windows
    timeWindow: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
    periodStart: z.date(),
    periodEnd: z.date(),
    // Metadata
    dataQuality: z.number().min(0).max(1).default(0.8),
    lastUpdated: z.date(),
});
/**
 * Life Balance Scorecard
 */
export const LifeBalanceScorecardSchema = z.object({
    work: z.object({
        target: z.number().min(0).max(100).default(40),
        actual: z.number().min(0).max(100),
        status: z.enum(["on_target", "overcommitted", "underutilized"]),
    }),
    personal: z.object({
        target: z.number().min(0).max(100).default(20),
        actual: z.number().min(0).max(100),
        status: z.enum(["on_target", "overcommitted", "underutilized"]),
    }),
    learning: z.object({
        target: z.number().min(0).max(100).default(10),
        actual: z.number().min(0).max(100),
        status: z.enum(["on_target", "overcommitted", "underutilized"]),
    }),
    health: z.object({
        target: z.number().min(0).max(100).default(15),
        actual: z.number().min(0).max(100),
        status: z.enum(["on_target", "overcommitted", "underutilized"]),
    }),
    finance: z.object({
        target: z.number().min(0).max(100).default(15),
        actual: z.number().min(0).max(100),
        status: z.enum(["on_target", "overcommitted", "underutilized"]),
    }),
    overallBalance: z.number().min(0).max(1).default(0.7),
    timestamp: z.date(),
});
/**
 * Domain Tracker Service
 */
export class DomainTracker {
    constructor(sessionId) {
        this.domainState = {
            sessionId,
            timeWindow: "weekly",
            periodStart: this.getWeekStart(),
            periodEnd: this.getWeekEnd(),
            lastUpdated: new Date(),
            dataQuality: 0.8,
        };
    }
    /**
     * Update work domain
     */
    updateWorkDomain(updates) {
        this.domainState.work = {
            sessionId: this.domainState.sessionId,
            meetings: [],
            tasks: [],
            totalHoursThisWeek: 0,
            contextSwitches: 0,
            focusBlocks: 0,
            stressLevel: 5,
            timestamp: new Date(),
            ...this.domainState.work,
            ...updates,
        };
    }
    /**
     * Update personal domain
     */
    updatePersonalDomain(updates) {
        this.domainState.personal = {
            sessionId: this.domainState.sessionId,
            notes: [],
            relationships: [],
            exerciseCount: 0,
            sleepHours: 7,
            wellbeingScore: 7,
            hobbies: [],
            timestamp: new Date(),
            ...this.domainState.personal,
            ...updates,
        };
    }
    /**
     * Update finance domain
     */
    updateFinanceDomain(updates) {
        this.domainState.finance = {
            sessionId: this.domainState.sessionId,
            balance: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            savingsRate: 0.2,
            tradingJournal: [],
            goals: [],
            riskTolerance: "moderate",
            disciplineScore: 5,
            timestamp: new Date(),
            ...this.domainState.finance,
            ...updates,
        };
    }
    /**
     * Update learning domain
     */
    updateLearningDomain(updates) {
        this.domainState.learning = {
            sessionId: this.domainState.sessionId,
            activeCourses: [],
            skills: [],
            books: [],
            weeklyLearningHours: 0,
            growthTrajectory: 0,
            interestStability: 7,
            timestamp: new Date(),
            ...this.domainState.learning,
            ...updates,
        };
    }
    /**
     * Update attention domain
     */
    updateAttentionDomain(updates) {
        this.domainState.attention = {
            sessionId: this.domainState.sessionId,
            recentQuestions: [],
            helpRequests: [],
            feedbackStats: {
                thumbsUpCount: 0,
                thumbsDownCount: 0,
                customFeedbackCount: 0,
                ignoreCount: 0,
            },
            peakActivityHours: [9, 10, 14, 15],
            responseTimeByHour: {},
            attentionSpan: 7,
            fatiguePatterns: [],
            priorityDrift: 0,
            timestamp: new Date(),
            ...this.domainState.attention,
            ...updates,
        };
    }
    /**
     * Calculate life balance scorecard
     */
    calculateLifeBalance() {
        const work = this.domainState.work;
        const personal = this.domainState.personal;
        const learning = this.domainState.learning;
        const finance = this.domainState.finance;
        // Calculate percentages (example: hours/168 hours per week)
        const workPercent = work?.totalHoursThisWeek ? (work.totalHoursThisWeek / 168) * 100 : 0;
        const personalPercent = personal?.exerciseCount ? Math.min((personal.exerciseCount * 5 / 168) * 100, 100) : 0;
        const learningPercent = learning?.weeklyLearningHours ? (learning.weeklyLearningHours / 168) * 100 : 0;
        const healthPercent = personal?.sleepHours ? (personal.sleepHours * 7 / 168) * 100 : 0;
        const financePercent = finance?.savingsRate ? finance.savingsRate * 100 : 0;
        return {
            work: {
                target: 40,
                actual: Math.min(workPercent, 100),
                status: workPercent > 45 ? "overcommitted" : workPercent < 35 ? "underutilized" : "on_target",
            },
            personal: {
                target: 20,
                actual: Math.min(personalPercent, 100),
                status: personalPercent > 25 ? "overcommitted" : personalPercent < 15 ? "underutilized" : "on_target",
            },
            learning: {
                target: 10,
                actual: Math.min(learningPercent, 100),
                status: learningPercent > 12 ? "overcommitted" : learningPercent < 8 ? "underutilized" : "on_target",
            },
            health: {
                target: 15,
                actual: Math.min(healthPercent, 100),
                status: healthPercent > 18 ? "overcommitted" : healthPercent < 12 ? "underutilized" : "on_target",
            },
            finance: {
                target: 15,
                actual: financePercent,
                status: financePercent > 18 ? "overcommitted" : financePercent < 12 ? "underutilized" : "on_target",
            },
            overallBalance: this.calculateBalanceScore(workPercent, personalPercent, learningPercent, healthPercent),
            timestamp: new Date(),
        };
    }
    /**
     * Get domain state
     */
    getState() {
        return this.domainState;
    }
    /**
     * Reset for new period
     */
    resetPeriod() {
        this.domainState.periodStart = this.getWeekStart();
        this.domainState.periodEnd = this.getWeekEnd();
        this.domainState.work = undefined;
        this.domainState.personal = undefined;
        this.domainState.finance = undefined;
        this.domainState.learning = undefined;
        this.domainState.attention = undefined;
    }
    /**
     * Helper: Get start of week (Monday)
     */
    getWeekStart() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(now.setDate(diff));
    }
    /**
     * Helper: Get end of week (Sunday)
     */
    getWeekEnd() {
        const start = this.getWeekStart();
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return end;
    }
    /**
     * Helper: Calculate overall balance score
     */
    calculateBalanceScore(...percentages) {
        const targets = [40, 20, 10, 15];
        const variance = percentages.reduce((acc, pct, idx) => {
            return acc + Math.abs(pct - targets[idx]);
        }, 0);
        const maxVariance = 100;
        return Math.max(0, 1 - variance / maxVariance);
    }
}
export default DomainTracker;
//# sourceMappingURL=index.js.map