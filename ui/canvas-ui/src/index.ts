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
export class TaskSubmissionForm implements UIComponent {
  id: string = "task-submission-form";
  type: string = "form";
  private supervisor: PersonalAssistantSupervisor;

  constructor(supervisor: PersonalAssistantSupervisor) {
    this.supervisor = supervisor;
  }

  render(): string {
    return `
<div class="task-submission-form">
  <h2>Submit Task</h2>
  <form id="taskForm">
    <div class="form-group">
      <label for="taskType">Task Type:</label>
      <select id="taskType" name="taskType" required>
        <option value="">Select a task type</option>
        <option value="assistant">Assistant</option>
        <option value="tradingguard">Trading Guard</option>
        <option value="ugc">UGC</option>
        <option value="custom">Custom</option>
      </select>
    </div>

    <div class="form-group">
      <label for="taskTitle">Title:</label>
      <input type="text" id="taskTitle" name="taskTitle" placeholder="Task title" required />
    </div>

    <div class="form-group">
      <label for="taskDescription">Description:</label>
      <textarea id="taskDescription" name="taskDescription" placeholder="Task description" required></textarea>
    </div>

    <div class="form-group">
      <label for="taskPriority">Priority:</label>
      <select id="taskPriority" name="taskPriority" required>
        <option value="low">Low</option>
        <option value="normal" selected>Normal</option>
        <option value="high">High</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary">Submit Task</button>
  </form>
</div>
    `.trim();
  }

  async handleSubmit(formData: FormData): Promise<TaskDefinition> {
    const task = await this.supervisor.submitTask({
      type: (formData.get("taskType") as any) || "custom",
      title: formData.get("taskTitle") as string,
      description: formData.get("taskDescription") as string,
      priority: (formData.get("taskPriority") as any) || "normal",
      status: "pending",
    });

    return task;
  }
}

/**
 * Task Status Display Component
 */
export class TaskStatusDisplay implements UIComponent {
  id: string = "task-status-display";
  type: string = "status-panel";
  private supervisor: PersonalAssistantSupervisor;

  constructor(supervisor: PersonalAssistantSupervisor) {
    this.supervisor = supervisor;
  }

  render(): string {
    return `
<div class="task-status-display">
  <h2>Task Status</h2>
  <div id="taskStatusContent">
    <p>Loading task status...</p>
  </div>
  <style>
    .task-status-display {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .task-item {
      padding: 10px;
      margin: 5px 0;
      border-left: 4px solid #007bff;
      background: #f8f9fa;
    }
    .task-item.completed {
      border-left-color: #28a745;
    }
    .task-item.failed {
      border-left-color: #dc3545;
    }
    .task-item.in_progress {
      border-left-color: #ffc107;
    }
  </style>
</div>
    `.trim();
  }

  async updateStatus(): Promise<void> {
    const state = await this.supervisor.getSupervisorState();
    const html = this.buildStatusHTML(state);
    
    const element = document.getElementById("taskStatusContent");
    if (element) {
      element.innerHTML = html;
    }
  }

  private buildStatusHTML(state: any): string {
    let html = "<div>";

    if (state.currentTask) {
      html += `
<div class="task-item in_progress">
  <strong>Current Task:</strong> ${state.currentTask.title}
  <div><small>ID: ${state.currentTask.id}</small></div>
</div>
      `;
    }

    if (state.taskQueue.length > 0) {
      html += "<div><strong>Pending Tasks:</strong>";
      state.taskQueue.forEach((task: any) => {
        html += `<div class="task-item">${task.title}</div>`;
      });
      html += "</div>";
    }

    if (state.completedTasks.length > 0) {
      html += "<div><strong>Completed:</strong>";
      state.completedTasks.slice(-3).forEach((task: any) => {
        html += `<div class="task-item completed">${task.title}</div>`;
      });
      html += "</div>";
    }

    html += "</div>";
    return html;
  }
}

/**
 * Memory Inspection Component (debugging)
 */
export class MemoryInspectionPanel implements UIComponent {
  id: string = "memory-inspection";
  type: string = "debug-panel";
  private memoryService: MemoryService;
  private sessionId: string;

  constructor(sessionId: string, memoryService: MemoryService) {
    this.sessionId = sessionId;
    this.memoryService = memoryService;
  }

  render(): string {
    return `
<div class="memory-inspection-panel">
  <h2>Memory Inspection</h2>
  <div class="tabs">
    <button class="tab-btn active" data-tab="working">Working Memory</button>
    <button class="tab-btn" data-tab="session">Session Memory</button>
    <button class="tab-btn" data-tab="longterm">Long-term Memory</button>
  </div>
  <div id="memoryContent" class="memory-content">
    <p>Select a tab to inspect memory...</p>
  </div>
  <style>
    .memory-inspection-panel {
      padding: 20px;
      border: 1px solid #e0e0e0;
      background: #fafafa;
      border-radius: 8px;
      font-family: monospace;
    }
    .tabs {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }
    .tab-btn {
      padding: 8px 16px;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    .tab-btn.active {
      background: #007bff;
      color: white;
    }
    .memory-content {
      background: white;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      max-height: 400px;
      overflow-y: auto;
    }
    .memory-item {
      padding: 8px;
      margin: 4px 0;
      background: #f5f5f5;
      border-radius: 3px;
      font-size: 12px;
    }
  </style>
</div>
    `.trim();
  }

  async inspectWorkingMemory(taskId: string): Promise<void> {
    const memory = await this.memoryService.getWorkingMemory(taskId);
    const content = JSON.stringify(memory, null, 2);
    this.updateContent(content);
  }

  async inspectSessionMemory(): Promise<void> {
    const memory = await this.memoryService.getSessionMemory(this.sessionId);
    const content = JSON.stringify(memory, null, 2);
    this.updateContent(content);
  }

  async inspectLongTermMemory(): Promise<void> {
    const memories = await this.memoryService.retrieveLongTermMemory({
      sessionId: this.sessionId,
      limit: 10,
      offset: 0,
      minImportance: 0,
    });
    const content = JSON.stringify(memories, null, 2);
    this.updateContent(content);
  }

  private updateContent(content: string): void {
    const element = document.getElementById("memoryContent");
    if (element) {
      element.innerHTML = `<pre class="memory-item">${content}</pre>`;
    }
  }
}

/**
 * Built-in Tools Component
 */
export class BuiltInToolsPanel implements UIComponent {
  id: string = "builtin-tools";
  type: string = "tools-panel";

  render(): string {
    return `
<div class="tools-panel">
  <h2>Built-in Tools</h2>
  <div class="tool-buttons">
    <button class="tool-btn" data-tool="web-search">🔍 Web Search</button>
    <button class="tool-btn" data-tool="calendar">📅 Calendar</button>
    <button class="tool-btn" data-tool="notes">📝 Notes</button>
  </div>
  <div id="toolContent" class="tool-content"></div>
  <style>
    .tools-panel {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .tool-buttons {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }
    .tool-btn {
      padding: 8px 16px;
      border: 1px solid #007bff;
      background: white;
      color: #007bff;
      cursor: pointer;
      border-radius: 4px;
      font-weight: bold;
    }
    .tool-btn:hover {
      background: #007bff;
      color: white;
    }
    .tool-content {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
      min-height: 100px;
    }
  </style>
</div>
    `.trim();
  }

  async useWebSearch(query: string): Promise<any> {
    // TODO: Implement web search via OpenClaw tools
    console.log("[Tools] Web search for:", query);
    return { results: [] };
  }

  async useCalendar(action: string): Promise<any> {
    // TODO: Implement calendar access via OpenClaw tools
    console.log("[Tools] Calendar action:", action);
    return { events: [] };
  }

  async useNotes(action: string, content?: string): Promise<any> {
    // TODO: Implement notes via OpenClaw tools
    console.log("[Tools] Notes action:", action, "Content:", content);
    return { success: true };
  }
}

/**
 * Unified Canvas UI Manager
 */
export class CanvasUIManager {
  private supervisor: PersonalAssistantSupervisor;
  private memoryService: MemoryService;
  private sessionId: string;
  private components: Map<string, UIComponent> = new Map();

  constructor(
    sessionId: string,
    supervisor: PersonalAssistantSupervisor,
    memoryService: MemoryService
  ) {
    this.sessionId = sessionId;
    this.supervisor = supervisor;
    this.memoryService = memoryService;
    this.initializeComponents();
  }

  private initializeComponents(): void {
    this.components.set("task-form", new TaskSubmissionForm(this.supervisor));
    this.components.set("task-status", new TaskStatusDisplay(this.supervisor));
    this.components.set("memory-inspector", new MemoryInspectionPanel(this.sessionId, this.memoryService));
    this.components.set("tools", new BuiltInToolsPanel());
  }

  render(componentId: string): string {
    const component = this.components.get(componentId);
    if (!component) {
      return `<div>Component not found: ${componentId}</div>`;
    }
    return component.render();
  }

  renderDashboard(): string {
    return `
<div class="canvas-dashboard">
  <h1>Personal Assistant</h1>
  <div class="dashboard-grid">
    <div class="panel">${this.render("task-form")}</div>
    <div class="panel">${this.render("task-status")}</div>
    <div class="panel">${this.render("memory-inspector")}</div>
    <div class="panel">${this.render("tools")}</div>
  </div>
  <style>
    .canvas-dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .panel {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
  </style>
</div>
    `.trim();
  }
}

export { PersonalAssistantSupervisor, MemoryService };
