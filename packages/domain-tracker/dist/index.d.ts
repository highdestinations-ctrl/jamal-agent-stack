/**
 * Domain Tracker: Multi-domain tracking system
 * Tracks 5 key life domains and derives signals
 */
import { z } from "zod";
/**
 * Work Domain: professional activities, calendar, tasks, stress
 */
export declare const WorkDomainSchema: z.ZodObject<{
    sessionId: z.ZodString;
    meetings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        startTime: z.ZodDate;
        endTime: z.ZodDate;
        type: z.ZodEnum<["meeting", "focus_block", "travel"]>;
        context: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "meeting" | "focus_block" | "travel";
        id: string;
        title: string;
        startTime: Date;
        endTime: Date;
        context?: string | undefined;
    }, {
        type: "meeting" | "focus_block" | "travel";
        id: string;
        title: string;
        startTime: Date;
        endTime: Date;
        context?: string | undefined;
    }>, "many">>;
    tasks: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        estimatedHours: z.ZodNumber;
        completed: z.ZodDefault<z.ZodBoolean>;
        priority: z.ZodEnum<["low", "normal", "high"]>;
        completedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        estimatedHours: number;
        completed: boolean;
        priority: "low" | "normal" | "high";
        completedAt?: Date | undefined;
    }, {
        id: string;
        title: string;
        estimatedHours: number;
        priority: "low" | "normal" | "high";
        completed?: boolean | undefined;
        completedAt?: Date | undefined;
    }>, "many">>;
    totalHoursThisWeek: z.ZodDefault<z.ZodNumber>;
    contextSwitches: z.ZodDefault<z.ZodNumber>;
    focusBlocks: z.ZodDefault<z.ZodNumber>;
    stressLevel: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    meetings: {
        type: "meeting" | "focus_block" | "travel";
        id: string;
        title: string;
        startTime: Date;
        endTime: Date;
        context?: string | undefined;
    }[];
    tasks: {
        id: string;
        title: string;
        estimatedHours: number;
        completed: boolean;
        priority: "low" | "normal" | "high";
        completedAt?: Date | undefined;
    }[];
    totalHoursThisWeek: number;
    contextSwitches: number;
    focusBlocks: number;
    stressLevel: number;
    timestamp: Date;
}, {
    sessionId: string;
    timestamp: Date;
    meetings?: {
        type: "meeting" | "focus_block" | "travel";
        id: string;
        title: string;
        startTime: Date;
        endTime: Date;
        context?: string | undefined;
    }[] | undefined;
    tasks?: {
        id: string;
        title: string;
        estimatedHours: number;
        priority: "low" | "normal" | "high";
        completed?: boolean | undefined;
        completedAt?: Date | undefined;
    }[] | undefined;
    totalHoursThisWeek?: number | undefined;
    contextSwitches?: number | undefined;
    focusBlocks?: number | undefined;
    stressLevel?: number | undefined;
}>;
export type WorkDomain = z.infer<typeof WorkDomainSchema>;
/**
 * Personal Domain: notes, relationships, wellbeing, hobbies
 */
export declare const PersonalDomainSchema: z.ZodObject<{
    sessionId: z.ZodString;
    notes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        mood: z.ZodEnum<["great", "good", "neutral", "stressed", "exhausted"]>;
        tags: z.ZodArray<z.ZodString, "many">;
        createdAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        content: string;
        mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
        tags: string[];
        createdAt: Date;
    }, {
        id: string;
        content: string;
        mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
        tags: string[];
        createdAt: Date;
    }>, "many">>;
    relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        lastContact: z.ZodDate;
        frequencyDays: z.ZodOptional<z.ZodNumber>;
        health: z.ZodEnum<["strong", "good", "neutral", "distant"]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        lastContact: Date;
        health: "good" | "neutral" | "strong" | "distant";
        frequencyDays?: number | undefined;
    }, {
        name: string;
        lastContact: Date;
        health: "good" | "neutral" | "strong" | "distant";
        frequencyDays?: number | undefined;
    }>, "many">>;
    exerciseCount: z.ZodDefault<z.ZodNumber>;
    sleepHours: z.ZodDefault<z.ZodNumber>;
    wellbeingScore: z.ZodDefault<z.ZodNumber>;
    hobbies: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        lastEngagement: z.ZodDate;
        priority: z.ZodEnum<["low", "normal", "high"]>;
    }, "strip", z.ZodTypeAny, {
        priority: "low" | "normal" | "high";
        name: string;
        lastEngagement: Date;
    }, {
        priority: "low" | "normal" | "high";
        name: string;
        lastEngagement: Date;
    }>, "many">>;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    timestamp: Date;
    notes: {
        id: string;
        content: string;
        mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
        tags: string[];
        createdAt: Date;
    }[];
    relationships: {
        name: string;
        lastContact: Date;
        health: "good" | "neutral" | "strong" | "distant";
        frequencyDays?: number | undefined;
    }[];
    exerciseCount: number;
    sleepHours: number;
    wellbeingScore: number;
    hobbies: {
        priority: "low" | "normal" | "high";
        name: string;
        lastEngagement: Date;
    }[];
}, {
    sessionId: string;
    timestamp: Date;
    notes?: {
        id: string;
        content: string;
        mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
        tags: string[];
        createdAt: Date;
    }[] | undefined;
    relationships?: {
        name: string;
        lastContact: Date;
        health: "good" | "neutral" | "strong" | "distant";
        frequencyDays?: number | undefined;
    }[] | undefined;
    exerciseCount?: number | undefined;
    sleepHours?: number | undefined;
    wellbeingScore?: number | undefined;
    hobbies?: {
        priority: "low" | "normal" | "high";
        name: string;
        lastEngagement: Date;
    }[] | undefined;
}>;
export type PersonalDomain = z.infer<typeof PersonalDomainSchema>;
/**
 * Finance Domain: income, expenses, trading, goals
 */
export declare const FinanceDomainSchema: z.ZodObject<{
    sessionId: z.ZodString;
    balance: z.ZodDefault<z.ZodNumber>;
    monthlyIncome: z.ZodDefault<z.ZodNumber>;
    monthlyExpenses: z.ZodDefault<z.ZodNumber>;
    savingsRate: z.ZodDefault<z.ZodNumber>;
    tradingJournal: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        date: z.ZodDate;
        decision: z.ZodString;
        outcome: z.ZodEnum<["win", "loss", "break_even"]>;
        pnl: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        id: string;
        decision: string;
        outcome: "win" | "loss" | "break_even";
        pnl: number;
        notes?: string | undefined;
    }, {
        date: Date;
        id: string;
        decision: string;
        outcome: "win" | "loss" | "break_even";
        pnl: number;
        notes?: string | undefined;
    }>, "many">>;
    goals: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        targetAmount: z.ZodNumber;
        currentAmount: z.ZodDefault<z.ZodNumber>;
        deadline: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        targetAmount: number;
        currentAmount: number;
        deadline: Date;
    }, {
        id: string;
        title: string;
        targetAmount: number;
        deadline: Date;
        currentAmount?: number | undefined;
    }>, "many">>;
    riskTolerance: z.ZodDefault<z.ZodEnum<["conservative", "moderate", "aggressive"]>>;
    disciplineScore: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    timestamp: Date;
    balance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    tradingJournal: {
        date: Date;
        id: string;
        decision: string;
        outcome: "win" | "loss" | "break_even";
        pnl: number;
        notes?: string | undefined;
    }[];
    goals: {
        id: string;
        title: string;
        targetAmount: number;
        currentAmount: number;
        deadline: Date;
    }[];
    riskTolerance: "conservative" | "moderate" | "aggressive";
    disciplineScore: number;
}, {
    sessionId: string;
    timestamp: Date;
    balance?: number | undefined;
    monthlyIncome?: number | undefined;
    monthlyExpenses?: number | undefined;
    savingsRate?: number | undefined;
    tradingJournal?: {
        date: Date;
        id: string;
        decision: string;
        outcome: "win" | "loss" | "break_even";
        pnl: number;
        notes?: string | undefined;
    }[] | undefined;
    goals?: {
        id: string;
        title: string;
        targetAmount: number;
        deadline: Date;
        currentAmount?: number | undefined;
    }[] | undefined;
    riskTolerance?: "conservative" | "moderate" | "aggressive" | undefined;
    disciplineScore?: number | undefined;
}>;
export type FinanceDomain = z.infer<typeof FinanceDomainSchema>;
/**
 * Learning Domain: courses, books, certifications, progress
 */
export declare const LearningDomainSchema: z.ZodObject<{
    sessionId: z.ZodString;
    activeCourses: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        topic: z.ZodString;
        hoursCompleted: z.ZodNumber;
        totalHours: z.ZodNumber;
        completionPercentage: z.ZodNumber;
        startDate: z.ZodDate;
        targetCompleteDate: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        topic: string;
        hoursCompleted: number;
        totalHours: number;
        completionPercentage: number;
        startDate: Date;
        targetCompleteDate?: Date | undefined;
    }, {
        id: string;
        title: string;
        topic: string;
        hoursCompleted: number;
        totalHours: number;
        completionPercentage: number;
        startDate: Date;
        targetCompleteDate?: Date | undefined;
    }>, "many">>;
    skills: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        proficiency: z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>;
        hoursInvested: z.ZodNumber;
        lastPracticedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        proficiency: "beginner" | "intermediate" | "advanced" | "expert";
        hoursInvested: number;
        lastPracticedAt?: Date | undefined;
    }, {
        name: string;
        proficiency: "beginner" | "intermediate" | "advanced" | "expert";
        hoursInvested: number;
        lastPracticedAt?: Date | undefined;
    }>, "many">>;
    books: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        author: z.ZodString;
        status: z.ZodEnum<["reading", "completed", "backlog"]>;
        startDate: z.ZodDate;
        completedDate: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        status: "completed" | "reading" | "backlog";
        title: string;
        startDate: Date;
        author: string;
        completedDate?: Date | undefined;
    }, {
        status: "completed" | "reading" | "backlog";
        title: string;
        startDate: Date;
        author: string;
        completedDate?: Date | undefined;
    }>, "many">>;
    weeklyLearningHours: z.ZodDefault<z.ZodNumber>;
    growthTrajectory: z.ZodDefault<z.ZodNumber>;
    interestStability: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    timestamp: Date;
    activeCourses: {
        id: string;
        title: string;
        topic: string;
        hoursCompleted: number;
        totalHours: number;
        completionPercentage: number;
        startDate: Date;
        targetCompleteDate?: Date | undefined;
    }[];
    skills: {
        name: string;
        proficiency: "beginner" | "intermediate" | "advanced" | "expert";
        hoursInvested: number;
        lastPracticedAt?: Date | undefined;
    }[];
    books: {
        status: "completed" | "reading" | "backlog";
        title: string;
        startDate: Date;
        author: string;
        completedDate?: Date | undefined;
    }[];
    weeklyLearningHours: number;
    growthTrajectory: number;
    interestStability: number;
}, {
    sessionId: string;
    timestamp: Date;
    activeCourses?: {
        id: string;
        title: string;
        topic: string;
        hoursCompleted: number;
        totalHours: number;
        completionPercentage: number;
        startDate: Date;
        targetCompleteDate?: Date | undefined;
    }[] | undefined;
    skills?: {
        name: string;
        proficiency: "beginner" | "intermediate" | "advanced" | "expert";
        hoursInvested: number;
        lastPracticedAt?: Date | undefined;
    }[] | undefined;
    books?: {
        status: "completed" | "reading" | "backlog";
        title: string;
        startDate: Date;
        author: string;
        completedDate?: Date | undefined;
    }[] | undefined;
    weeklyLearningHours?: number | undefined;
    growthTrajectory?: number | undefined;
    interestStability?: number | undefined;
}>;
export type LearningDomain = z.infer<typeof LearningDomainSchema>;
/**
 * Attention Domain: Meta-tracking of user behavior patterns
 */
export declare const AttentionDomainSchema: z.ZodObject<{
    sessionId: z.ZodString;
    recentQuestions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        category: z.ZodString;
        timestamp: z.ZodDate;
        feedbackGiven: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        question: string;
        category: string;
        feedbackGiven: boolean;
    }, {
        timestamp: Date;
        question: string;
        category: string;
        feedbackGiven?: boolean | undefined;
    }>, "many">>;
    helpRequests: z.ZodDefault<z.ZodArray<z.ZodObject<{
        topic: z.ZodString;
        frequency: z.ZodNumber;
        avgResponseTime: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        topic: string;
        frequency: number;
        avgResponseTime: number;
    }, {
        topic: string;
        frequency: number;
        avgResponseTime: number;
    }>, "many">>;
    feedbackStats: z.ZodDefault<z.ZodObject<{
        thumbsUpCount: z.ZodDefault<z.ZodNumber>;
        thumbsDownCount: z.ZodDefault<z.ZodNumber>;
        customFeedbackCount: z.ZodDefault<z.ZodNumber>;
        ignoreCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        thumbsUpCount: number;
        thumbsDownCount: number;
        customFeedbackCount: number;
        ignoreCount: number;
    }, {
        thumbsUpCount?: number | undefined;
        thumbsDownCount?: number | undefined;
        customFeedbackCount?: number | undefined;
        ignoreCount?: number | undefined;
    }>>;
    peakActivityHours: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
    responseTimeByHour: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    attentionSpan: z.ZodDefault<z.ZodNumber>;
    fatiguePatterns: z.ZodDefault<z.ZodArray<z.ZodObject<{
        timeOfDay: z.ZodString;
        fatigueLevel: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        timeOfDay: string;
        fatigueLevel: number;
    }, {
        timeOfDay: string;
        fatigueLevel: number;
    }>, "many">>;
    priorityDrift: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    timestamp: Date;
    recentQuestions: {
        timestamp: Date;
        question: string;
        category: string;
        feedbackGiven: boolean;
    }[];
    helpRequests: {
        topic: string;
        frequency: number;
        avgResponseTime: number;
    }[];
    feedbackStats: {
        thumbsUpCount: number;
        thumbsDownCount: number;
        customFeedbackCount: number;
        ignoreCount: number;
    };
    peakActivityHours: number[];
    responseTimeByHour: Record<string, number>;
    attentionSpan: number;
    fatiguePatterns: {
        timeOfDay: string;
        fatigueLevel: number;
    }[];
    priorityDrift: number;
}, {
    sessionId: string;
    timestamp: Date;
    recentQuestions?: {
        timestamp: Date;
        question: string;
        category: string;
        feedbackGiven?: boolean | undefined;
    }[] | undefined;
    helpRequests?: {
        topic: string;
        frequency: number;
        avgResponseTime: number;
    }[] | undefined;
    feedbackStats?: {
        thumbsUpCount?: number | undefined;
        thumbsDownCount?: number | undefined;
        customFeedbackCount?: number | undefined;
        ignoreCount?: number | undefined;
    } | undefined;
    peakActivityHours?: number[] | undefined;
    responseTimeByHour?: Record<string, number> | undefined;
    attentionSpan?: number | undefined;
    fatiguePatterns?: {
        timeOfDay: string;
        fatigueLevel: number;
    }[] | undefined;
    priorityDrift?: number | undefined;
}>;
export type AttentionDomain = z.infer<typeof AttentionDomainSchema>;
/**
 * Unified Domain State
 */
export declare const DomainStateSchema: z.ZodObject<{
    sessionId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    work: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        meetings: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            startTime: z.ZodDate;
            endTime: z.ZodDate;
            type: z.ZodEnum<["meeting", "focus_block", "travel"]>;
            context: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "meeting" | "focus_block" | "travel";
            id: string;
            title: string;
            startTime: Date;
            endTime: Date;
            context?: string | undefined;
        }, {
            type: "meeting" | "focus_block" | "travel";
            id: string;
            title: string;
            startTime: Date;
            endTime: Date;
            context?: string | undefined;
        }>, "many">>;
        tasks: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            estimatedHours: z.ZodNumber;
            completed: z.ZodDefault<z.ZodBoolean>;
            priority: z.ZodEnum<["low", "normal", "high"]>;
            completedAt: z.ZodOptional<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            estimatedHours: number;
            completed: boolean;
            priority: "low" | "normal" | "high";
            completedAt?: Date | undefined;
        }, {
            id: string;
            title: string;
            estimatedHours: number;
            priority: "low" | "normal" | "high";
            completed?: boolean | undefined;
            completedAt?: Date | undefined;
        }>, "many">>;
        totalHoursThisWeek: z.ZodDefault<z.ZodNumber>;
        contextSwitches: z.ZodDefault<z.ZodNumber>;
        focusBlocks: z.ZodDefault<z.ZodNumber>;
        stressLevel: z.ZodDefault<z.ZodNumber>;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        meetings: {
            type: "meeting" | "focus_block" | "travel";
            id: string;
            title: string;
            startTime: Date;
            endTime: Date;
            context?: string | undefined;
        }[];
        tasks: {
            id: string;
            title: string;
            estimatedHours: number;
            completed: boolean;
            priority: "low" | "normal" | "high";
            completedAt?: Date | undefined;
        }[];
        totalHoursThisWeek: number;
        contextSwitches: number;
        focusBlocks: number;
        stressLevel: number;
        timestamp: Date;
    }, {
        sessionId: string;
        timestamp: Date;
        meetings?: {
            type: "meeting" | "focus_block" | "travel";
            id: string;
            title: string;
            startTime: Date;
            endTime: Date;
            context?: string | undefined;
        }[] | undefined;
        tasks?: {
            id: string;
            title: string;
            estimatedHours: number;
            priority: "low" | "normal" | "high";
            completed?: boolean | undefined;
            completedAt?: Date | undefined;
        }[] | undefined;
        totalHoursThisWeek?: number | undefined;
        contextSwitches?: number | undefined;
        focusBlocks?: number | undefined;
        stressLevel?: number | undefined;
    }>>;
    personal: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        notes: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            content: z.ZodString;
            mood: z.ZodEnum<["great", "good", "neutral", "stressed", "exhausted"]>;
            tags: z.ZodArray<z.ZodString, "many">;
            createdAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            id: string;
            content: string;
            mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
            tags: string[];
            createdAt: Date;
        }, {
            id: string;
            content: string;
            mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
            tags: string[];
            createdAt: Date;
        }>, "many">>;
        relationships: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            lastContact: z.ZodDate;
            frequencyDays: z.ZodOptional<z.ZodNumber>;
            health: z.ZodEnum<["strong", "good", "neutral", "distant"]>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            lastContact: Date;
            health: "good" | "neutral" | "strong" | "distant";
            frequencyDays?: number | undefined;
        }, {
            name: string;
            lastContact: Date;
            health: "good" | "neutral" | "strong" | "distant";
            frequencyDays?: number | undefined;
        }>, "many">>;
        exerciseCount: z.ZodDefault<z.ZodNumber>;
        sleepHours: z.ZodDefault<z.ZodNumber>;
        wellbeingScore: z.ZodDefault<z.ZodNumber>;
        hobbies: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            lastEngagement: z.ZodDate;
            priority: z.ZodEnum<["low", "normal", "high"]>;
        }, "strip", z.ZodTypeAny, {
            priority: "low" | "normal" | "high";
            name: string;
            lastEngagement: Date;
        }, {
            priority: "low" | "normal" | "high";
            name: string;
            lastEngagement: Date;
        }>, "many">>;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        timestamp: Date;
        notes: {
            id: string;
            content: string;
            mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
            tags: string[];
            createdAt: Date;
        }[];
        relationships: {
            name: string;
            lastContact: Date;
            health: "good" | "neutral" | "strong" | "distant";
            frequencyDays?: number | undefined;
        }[];
        exerciseCount: number;
        sleepHours: number;
        wellbeingScore: number;
        hobbies: {
            priority: "low" | "normal" | "high";
            name: string;
            lastEngagement: Date;
        }[];
    }, {
        sessionId: string;
        timestamp: Date;
        notes?: {
            id: string;
            content: string;
            mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
            tags: string[];
            createdAt: Date;
        }[] | undefined;
        relationships?: {
            name: string;
            lastContact: Date;
            health: "good" | "neutral" | "strong" | "distant";
            frequencyDays?: number | undefined;
        }[] | undefined;
        exerciseCount?: number | undefined;
        sleepHours?: number | undefined;
        wellbeingScore?: number | undefined;
        hobbies?: {
            priority: "low" | "normal" | "high";
            name: string;
            lastEngagement: Date;
        }[] | undefined;
    }>>;
    finance: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        balance: z.ZodDefault<z.ZodNumber>;
        monthlyIncome: z.ZodDefault<z.ZodNumber>;
        monthlyExpenses: z.ZodDefault<z.ZodNumber>;
        savingsRate: z.ZodDefault<z.ZodNumber>;
        tradingJournal: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            date: z.ZodDate;
            decision: z.ZodString;
            outcome: z.ZodEnum<["win", "loss", "break_even"]>;
            pnl: z.ZodNumber;
            notes: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            date: Date;
            id: string;
            decision: string;
            outcome: "win" | "loss" | "break_even";
            pnl: number;
            notes?: string | undefined;
        }, {
            date: Date;
            id: string;
            decision: string;
            outcome: "win" | "loss" | "break_even";
            pnl: number;
            notes?: string | undefined;
        }>, "many">>;
        goals: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            targetAmount: z.ZodNumber;
            currentAmount: z.ZodDefault<z.ZodNumber>;
            deadline: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            targetAmount: number;
            currentAmount: number;
            deadline: Date;
        }, {
            id: string;
            title: string;
            targetAmount: number;
            deadline: Date;
            currentAmount?: number | undefined;
        }>, "many">>;
        riskTolerance: z.ZodDefault<z.ZodEnum<["conservative", "moderate", "aggressive"]>>;
        disciplineScore: z.ZodDefault<z.ZodNumber>;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        timestamp: Date;
        balance: number;
        monthlyIncome: number;
        monthlyExpenses: number;
        savingsRate: number;
        tradingJournal: {
            date: Date;
            id: string;
            decision: string;
            outcome: "win" | "loss" | "break_even";
            pnl: number;
            notes?: string | undefined;
        }[];
        goals: {
            id: string;
            title: string;
            targetAmount: number;
            currentAmount: number;
            deadline: Date;
        }[];
        riskTolerance: "conservative" | "moderate" | "aggressive";
        disciplineScore: number;
    }, {
        sessionId: string;
        timestamp: Date;
        balance?: number | undefined;
        monthlyIncome?: number | undefined;
        monthlyExpenses?: number | undefined;
        savingsRate?: number | undefined;
        tradingJournal?: {
            date: Date;
            id: string;
            decision: string;
            outcome: "win" | "loss" | "break_even";
            pnl: number;
            notes?: string | undefined;
        }[] | undefined;
        goals?: {
            id: string;
            title: string;
            targetAmount: number;
            deadline: Date;
            currentAmount?: number | undefined;
        }[] | undefined;
        riskTolerance?: "conservative" | "moderate" | "aggressive" | undefined;
        disciplineScore?: number | undefined;
    }>>;
    learning: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        activeCourses: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            topic: z.ZodString;
            hoursCompleted: z.ZodNumber;
            totalHours: z.ZodNumber;
            completionPercentage: z.ZodNumber;
            startDate: z.ZodDate;
            targetCompleteDate: z.ZodOptional<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            topic: string;
            hoursCompleted: number;
            totalHours: number;
            completionPercentage: number;
            startDate: Date;
            targetCompleteDate?: Date | undefined;
        }, {
            id: string;
            title: string;
            topic: string;
            hoursCompleted: number;
            totalHours: number;
            completionPercentage: number;
            startDate: Date;
            targetCompleteDate?: Date | undefined;
        }>, "many">>;
        skills: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            proficiency: z.ZodEnum<["beginner", "intermediate", "advanced", "expert"]>;
            hoursInvested: z.ZodNumber;
            lastPracticedAt: z.ZodOptional<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            proficiency: "beginner" | "intermediate" | "advanced" | "expert";
            hoursInvested: number;
            lastPracticedAt?: Date | undefined;
        }, {
            name: string;
            proficiency: "beginner" | "intermediate" | "advanced" | "expert";
            hoursInvested: number;
            lastPracticedAt?: Date | undefined;
        }>, "many">>;
        books: z.ZodDefault<z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            author: z.ZodString;
            status: z.ZodEnum<["reading", "completed", "backlog"]>;
            startDate: z.ZodDate;
            completedDate: z.ZodOptional<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
            status: "completed" | "reading" | "backlog";
            title: string;
            startDate: Date;
            author: string;
            completedDate?: Date | undefined;
        }, {
            status: "completed" | "reading" | "backlog";
            title: string;
            startDate: Date;
            author: string;
            completedDate?: Date | undefined;
        }>, "many">>;
        weeklyLearningHours: z.ZodDefault<z.ZodNumber>;
        growthTrajectory: z.ZodDefault<z.ZodNumber>;
        interestStability: z.ZodDefault<z.ZodNumber>;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        timestamp: Date;
        activeCourses: {
            id: string;
            title: string;
            topic: string;
            hoursCompleted: number;
            totalHours: number;
            completionPercentage: number;
            startDate: Date;
            targetCompleteDate?: Date | undefined;
        }[];
        skills: {
            name: string;
            proficiency: "beginner" | "intermediate" | "advanced" | "expert";
            hoursInvested: number;
            lastPracticedAt?: Date | undefined;
        }[];
        books: {
            status: "completed" | "reading" | "backlog";
            title: string;
            startDate: Date;
            author: string;
            completedDate?: Date | undefined;
        }[];
        weeklyLearningHours: number;
        growthTrajectory: number;
        interestStability: number;
    }, {
        sessionId: string;
        timestamp: Date;
        activeCourses?: {
            id: string;
            title: string;
            topic: string;
            hoursCompleted: number;
            totalHours: number;
            completionPercentage: number;
            startDate: Date;
            targetCompleteDate?: Date | undefined;
        }[] | undefined;
        skills?: {
            name: string;
            proficiency: "beginner" | "intermediate" | "advanced" | "expert";
            hoursInvested: number;
            lastPracticedAt?: Date | undefined;
        }[] | undefined;
        books?: {
            status: "completed" | "reading" | "backlog";
            title: string;
            startDate: Date;
            author: string;
            completedDate?: Date | undefined;
        }[] | undefined;
        weeklyLearningHours?: number | undefined;
        growthTrajectory?: number | undefined;
        interestStability?: number | undefined;
    }>>;
    attention: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        recentQuestions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            question: z.ZodString;
            category: z.ZodString;
            timestamp: z.ZodDate;
            feedbackGiven: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            timestamp: Date;
            question: string;
            category: string;
            feedbackGiven: boolean;
        }, {
            timestamp: Date;
            question: string;
            category: string;
            feedbackGiven?: boolean | undefined;
        }>, "many">>;
        helpRequests: z.ZodDefault<z.ZodArray<z.ZodObject<{
            topic: z.ZodString;
            frequency: z.ZodNumber;
            avgResponseTime: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            topic: string;
            frequency: number;
            avgResponseTime: number;
        }, {
            topic: string;
            frequency: number;
            avgResponseTime: number;
        }>, "many">>;
        feedbackStats: z.ZodDefault<z.ZodObject<{
            thumbsUpCount: z.ZodDefault<z.ZodNumber>;
            thumbsDownCount: z.ZodDefault<z.ZodNumber>;
            customFeedbackCount: z.ZodDefault<z.ZodNumber>;
            ignoreCount: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            thumbsUpCount: number;
            thumbsDownCount: number;
            customFeedbackCount: number;
            ignoreCount: number;
        }, {
            thumbsUpCount?: number | undefined;
            thumbsDownCount?: number | undefined;
            customFeedbackCount?: number | undefined;
            ignoreCount?: number | undefined;
        }>>;
        peakActivityHours: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        responseTimeByHour: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        attentionSpan: z.ZodDefault<z.ZodNumber>;
        fatiguePatterns: z.ZodDefault<z.ZodArray<z.ZodObject<{
            timeOfDay: z.ZodString;
            fatigueLevel: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            timeOfDay: string;
            fatigueLevel: number;
        }, {
            timeOfDay: string;
            fatigueLevel: number;
        }>, "many">>;
        priorityDrift: z.ZodDefault<z.ZodNumber>;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        timestamp: Date;
        recentQuestions: {
            timestamp: Date;
            question: string;
            category: string;
            feedbackGiven: boolean;
        }[];
        helpRequests: {
            topic: string;
            frequency: number;
            avgResponseTime: number;
        }[];
        feedbackStats: {
            thumbsUpCount: number;
            thumbsDownCount: number;
            customFeedbackCount: number;
            ignoreCount: number;
        };
        peakActivityHours: number[];
        responseTimeByHour: Record<string, number>;
        attentionSpan: number;
        fatiguePatterns: {
            timeOfDay: string;
            fatigueLevel: number;
        }[];
        priorityDrift: number;
    }, {
        sessionId: string;
        timestamp: Date;
        recentQuestions?: {
            timestamp: Date;
            question: string;
            category: string;
            feedbackGiven?: boolean | undefined;
        }[] | undefined;
        helpRequests?: {
            topic: string;
            frequency: number;
            avgResponseTime: number;
        }[] | undefined;
        feedbackStats?: {
            thumbsUpCount?: number | undefined;
            thumbsDownCount?: number | undefined;
            customFeedbackCount?: number | undefined;
            ignoreCount?: number | undefined;
        } | undefined;
        peakActivityHours?: number[] | undefined;
        responseTimeByHour?: Record<string, number> | undefined;
        attentionSpan?: number | undefined;
        fatiguePatterns?: {
            timeOfDay: string;
            fatigueLevel: number;
        }[] | undefined;
        priorityDrift?: number | undefined;
    }>>;
    timeWindow: z.ZodDefault<z.ZodEnum<["daily", "weekly", "monthly"]>>;
    periodStart: z.ZodDate;
    periodEnd: z.ZodDate;
    dataQuality: z.ZodDefault<z.ZodNumber>;
    lastUpdated: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    timeWindow: "daily" | "weekly" | "monthly";
    periodStart: Date;
    periodEnd: Date;
    dataQuality: number;
    lastUpdated: Date;
    userId?: string | undefined;
    work?: {
        sessionId: string;
        meetings: {
            type: "meeting" | "focus_block" | "travel";
            id: string;
            title: string;
            startTime: Date;
            endTime: Date;
            context?: string | undefined;
        }[];
        tasks: {
            id: string;
            title: string;
            estimatedHours: number;
            completed: boolean;
            priority: "low" | "normal" | "high";
            completedAt?: Date | undefined;
        }[];
        totalHoursThisWeek: number;
        contextSwitches: number;
        focusBlocks: number;
        stressLevel: number;
        timestamp: Date;
    } | undefined;
    personal?: {
        sessionId: string;
        timestamp: Date;
        notes: {
            id: string;
            content: string;
            mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
            tags: string[];
            createdAt: Date;
        }[];
        relationships: {
            name: string;
            lastContact: Date;
            health: "good" | "neutral" | "strong" | "distant";
            frequencyDays?: number | undefined;
        }[];
        exerciseCount: number;
        sleepHours: number;
        wellbeingScore: number;
        hobbies: {
            priority: "low" | "normal" | "high";
            name: string;
            lastEngagement: Date;
        }[];
    } | undefined;
    finance?: {
        sessionId: string;
        timestamp: Date;
        balance: number;
        monthlyIncome: number;
        monthlyExpenses: number;
        savingsRate: number;
        tradingJournal: {
            date: Date;
            id: string;
            decision: string;
            outcome: "win" | "loss" | "break_even";
            pnl: number;
            notes?: string | undefined;
        }[];
        goals: {
            id: string;
            title: string;
            targetAmount: number;
            currentAmount: number;
            deadline: Date;
        }[];
        riskTolerance: "conservative" | "moderate" | "aggressive";
        disciplineScore: number;
    } | undefined;
    learning?: {
        sessionId: string;
        timestamp: Date;
        activeCourses: {
            id: string;
            title: string;
            topic: string;
            hoursCompleted: number;
            totalHours: number;
            completionPercentage: number;
            startDate: Date;
            targetCompleteDate?: Date | undefined;
        }[];
        skills: {
            name: string;
            proficiency: "beginner" | "intermediate" | "advanced" | "expert";
            hoursInvested: number;
            lastPracticedAt?: Date | undefined;
        }[];
        books: {
            status: "completed" | "reading" | "backlog";
            title: string;
            startDate: Date;
            author: string;
            completedDate?: Date | undefined;
        }[];
        weeklyLearningHours: number;
        growthTrajectory: number;
        interestStability: number;
    } | undefined;
    attention?: {
        sessionId: string;
        timestamp: Date;
        recentQuestions: {
            timestamp: Date;
            question: string;
            category: string;
            feedbackGiven: boolean;
        }[];
        helpRequests: {
            topic: string;
            frequency: number;
            avgResponseTime: number;
        }[];
        feedbackStats: {
            thumbsUpCount: number;
            thumbsDownCount: number;
            customFeedbackCount: number;
            ignoreCount: number;
        };
        peakActivityHours: number[];
        responseTimeByHour: Record<string, number>;
        attentionSpan: number;
        fatiguePatterns: {
            timeOfDay: string;
            fatigueLevel: number;
        }[];
        priorityDrift: number;
    } | undefined;
}, {
    sessionId: string;
    periodStart: Date;
    periodEnd: Date;
    lastUpdated: Date;
    userId?: string | undefined;
    work?: {
        sessionId: string;
        timestamp: Date;
        meetings?: {
            type: "meeting" | "focus_block" | "travel";
            id: string;
            title: string;
            startTime: Date;
            endTime: Date;
            context?: string | undefined;
        }[] | undefined;
        tasks?: {
            id: string;
            title: string;
            estimatedHours: number;
            priority: "low" | "normal" | "high";
            completed?: boolean | undefined;
            completedAt?: Date | undefined;
        }[] | undefined;
        totalHoursThisWeek?: number | undefined;
        contextSwitches?: number | undefined;
        focusBlocks?: number | undefined;
        stressLevel?: number | undefined;
    } | undefined;
    personal?: {
        sessionId: string;
        timestamp: Date;
        notes?: {
            id: string;
            content: string;
            mood: "great" | "good" | "neutral" | "stressed" | "exhausted";
            tags: string[];
            createdAt: Date;
        }[] | undefined;
        relationships?: {
            name: string;
            lastContact: Date;
            health: "good" | "neutral" | "strong" | "distant";
            frequencyDays?: number | undefined;
        }[] | undefined;
        exerciseCount?: number | undefined;
        sleepHours?: number | undefined;
        wellbeingScore?: number | undefined;
        hobbies?: {
            priority: "low" | "normal" | "high";
            name: string;
            lastEngagement: Date;
        }[] | undefined;
    } | undefined;
    finance?: {
        sessionId: string;
        timestamp: Date;
        balance?: number | undefined;
        monthlyIncome?: number | undefined;
        monthlyExpenses?: number | undefined;
        savingsRate?: number | undefined;
        tradingJournal?: {
            date: Date;
            id: string;
            decision: string;
            outcome: "win" | "loss" | "break_even";
            pnl: number;
            notes?: string | undefined;
        }[] | undefined;
        goals?: {
            id: string;
            title: string;
            targetAmount: number;
            deadline: Date;
            currentAmount?: number | undefined;
        }[] | undefined;
        riskTolerance?: "conservative" | "moderate" | "aggressive" | undefined;
        disciplineScore?: number | undefined;
    } | undefined;
    learning?: {
        sessionId: string;
        timestamp: Date;
        activeCourses?: {
            id: string;
            title: string;
            topic: string;
            hoursCompleted: number;
            totalHours: number;
            completionPercentage: number;
            startDate: Date;
            targetCompleteDate?: Date | undefined;
        }[] | undefined;
        skills?: {
            name: string;
            proficiency: "beginner" | "intermediate" | "advanced" | "expert";
            hoursInvested: number;
            lastPracticedAt?: Date | undefined;
        }[] | undefined;
        books?: {
            status: "completed" | "reading" | "backlog";
            title: string;
            startDate: Date;
            author: string;
            completedDate?: Date | undefined;
        }[] | undefined;
        weeklyLearningHours?: number | undefined;
        growthTrajectory?: number | undefined;
        interestStability?: number | undefined;
    } | undefined;
    attention?: {
        sessionId: string;
        timestamp: Date;
        recentQuestions?: {
            timestamp: Date;
            question: string;
            category: string;
            feedbackGiven?: boolean | undefined;
        }[] | undefined;
        helpRequests?: {
            topic: string;
            frequency: number;
            avgResponseTime: number;
        }[] | undefined;
        feedbackStats?: {
            thumbsUpCount?: number | undefined;
            thumbsDownCount?: number | undefined;
            customFeedbackCount?: number | undefined;
            ignoreCount?: number | undefined;
        } | undefined;
        peakActivityHours?: number[] | undefined;
        responseTimeByHour?: Record<string, number> | undefined;
        attentionSpan?: number | undefined;
        fatiguePatterns?: {
            timeOfDay: string;
            fatigueLevel: number;
        }[] | undefined;
        priorityDrift?: number | undefined;
    } | undefined;
    timeWindow?: "daily" | "weekly" | "monthly" | undefined;
    dataQuality?: number | undefined;
}>;
export type DomainState = z.infer<typeof DomainStateSchema>;
/**
 * Life Balance Scorecard
 */
export declare const LifeBalanceScorecardSchema: z.ZodObject<{
    work: z.ZodObject<{
        target: z.ZodDefault<z.ZodNumber>;
        actual: z.ZodNumber;
        status: z.ZodEnum<["on_target", "overcommitted", "underutilized"]>;
    }, "strip", z.ZodTypeAny, {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    }, {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    }>;
    personal: z.ZodObject<{
        target: z.ZodDefault<z.ZodNumber>;
        actual: z.ZodNumber;
        status: z.ZodEnum<["on_target", "overcommitted", "underutilized"]>;
    }, "strip", z.ZodTypeAny, {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    }, {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    }>;
    learning: z.ZodObject<{
        target: z.ZodDefault<z.ZodNumber>;
        actual: z.ZodNumber;
        status: z.ZodEnum<["on_target", "overcommitted", "underutilized"]>;
    }, "strip", z.ZodTypeAny, {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    }, {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    }>;
    health: z.ZodObject<{
        target: z.ZodDefault<z.ZodNumber>;
        actual: z.ZodNumber;
        status: z.ZodEnum<["on_target", "overcommitted", "underutilized"]>;
    }, "strip", z.ZodTypeAny, {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    }, {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    }>;
    finance: z.ZodObject<{
        target: z.ZodDefault<z.ZodNumber>;
        actual: z.ZodNumber;
        status: z.ZodEnum<["on_target", "overcommitted", "underutilized"]>;
    }, "strip", z.ZodTypeAny, {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    }, {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    }>;
    overallBalance: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    timestamp: Date;
    health: {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    };
    work: {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    };
    personal: {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    };
    finance: {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    };
    learning: {
        status: "on_target" | "overcommitted" | "underutilized";
        target: number;
        actual: number;
    };
    overallBalance: number;
}, {
    timestamp: Date;
    health: {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    };
    work: {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    };
    personal: {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    };
    finance: {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    };
    learning: {
        status: "on_target" | "overcommitted" | "underutilized";
        actual: number;
        target?: number | undefined;
    };
    overallBalance?: number | undefined;
}>;
export type LifeBalanceScorecard = z.infer<typeof LifeBalanceScorecardSchema>;
/**
 * Domain Tracker Service
 */
export declare class DomainTracker {
    private domainState;
    constructor(sessionId: string);
    /**
     * Update work domain
     */
    updateWorkDomain(updates: Partial<WorkDomain>): void;
    /**
     * Update personal domain
     */
    updatePersonalDomain(updates: Partial<PersonalDomain>): void;
    /**
     * Update finance domain
     */
    updateFinanceDomain(updates: Partial<FinanceDomain>): void;
    /**
     * Update learning domain
     */
    updateLearningDomain(updates: Partial<LearningDomain>): void;
    /**
     * Update attention domain
     */
    updateAttentionDomain(updates: Partial<AttentionDomain>): void;
    /**
     * Calculate life balance scorecard
     */
    calculateLifeBalance(): LifeBalanceScorecard;
    /**
     * Get domain state
     */
    getState(): DomainState;
    /**
     * Reset for new period
     */
    resetPeriod(): void;
    /**
     * Helper: Get start of week (Monday)
     */
    private getWeekStart;
    /**
     * Helper: Get end of week (Sunday)
     */
    private getWeekEnd;
    /**
     * Helper: Calculate overall balance score
     */
    private calculateBalanceScore;
}
export default DomainTracker;
//# sourceMappingURL=index.d.ts.map