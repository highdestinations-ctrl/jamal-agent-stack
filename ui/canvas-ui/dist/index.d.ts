/**
 * OpenClaw Canvas UI Components
 *
 * Scaffolds UI for:
 * - Task submission interface
 * - Status display and monitoring
 * - Memory inspection (debugging)
 * - Basic tools: web.search, calendar, notes
 */
import { PersonalAssistantSupervisor, TaskDefinition } from "@jamal/supervisor";
import { MemoryService } from "@jamal/memory-service";
/**
 * Canvas UI Component Types
 */
export interface UIComponent {
    id: string;
    type: string;
    render(): string;
}
/**
 * Task Submission Form Component
 */
export declare class TaskSubmissionForm implements UIComponent {
    id: string;
    type: string;
    private supervisor;
    constructor(supervisor: PersonalAssistantSupervisor);
    render(): string;
    handleSubmit(formData: FormData): Promise<TaskDefinition>;
}
/**
 * Task Status Display Component
 */
export declare class TaskStatusDisplay implements UIComponent {
    id: string;
    type: string;
    private supervisor;
    constructor(supervisor: PersonalAssistantSupervisor);
    render(): string;
    updateStatus(): Promise<void>;
    private buildStatusHTML;
}
/**
 * Memory Inspection Component (debugging)
 */
export declare class MemoryInspectionPanel implements UIComponent {
    id: string;
    type: string;
    private memoryService;
    private sessionId;
    constructor(sessionId: string, memoryService: MemoryService);
    render(): string;
    inspectWorkingMemory(taskId: string): Promise<void>;
    inspectSessionMemory(): Promise<void>;
    inspectLongTermMemory(): Promise<void>;
    private updateContent;
}
/**
 * Built-in Tools Component
 */
export declare class BuiltInToolsPanel implements UIComponent {
    id: string;
    type: string;
    render(): string;
    useWebSearch(query: string): Promise<any>;
    useCalendar(action: string): Promise<any>;
    useNotes(action: string, content?: string): Promise<any>;
}
/**
 * Unified Canvas UI Manager
 */
export declare class CanvasUIManager {
    private supervisor;
    private memoryService;
    private sessionId;
    private components;
    constructor(sessionId: string, supervisor: PersonalAssistantSupervisor, memoryService: MemoryService);
    private initializeComponents;
    render(componentId: string): string;
    renderDashboard(): string;
}
export { PersonalAssistantSupervisor, MemoryService };
//# sourceMappingURL=index.d.ts.map