/**
 * OpenClaw Canvas UI Components
 *
 * Scaffolds UI for:
 * - Task submission interface
 * - Status display and monitoring
 * - Memory inspection (debugging)
 * - Basic tools: web.search, calendar, notes
 */
import { PersonalAssistantSupervisor } from "@jamal/supervisor";
import { MemoryService } from "@jamal/memory-service";
/**
 * Task Submission Form Component
 */
export class TaskSubmissionForm {
    constructor(supervisor) {
        this.id = "task-submission-form";
        this.type = "form";
        this.supervisor = supervisor;
    }
    render() {
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
    async handleSubmit(formData) {
        const task = await this.supervisor.submitTask({
            type: formData.get("taskType") || "custom",
            title: formData.get("taskTitle"),
            description: formData.get("taskDescription"),
            priority: formData.get("taskPriority") || "normal",
            status: "pending",
        });
        return task;
    }
}
/**
 * Task Status Display Component
 */
export class TaskStatusDisplay {
    constructor(supervisor) {
        this.id = "task-status-display";
        this.type = "status-panel";
        this.supervisor = supervisor;
    }
    render() {
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
    async updateStatus() {
        const state = await this.supervisor.getSupervisorState();
        const html = this.buildStatusHTML(state);
        const element = document.getElementById("taskStatusContent");
        if (element) {
            element.innerHTML = html;
        }
    }
    buildStatusHTML(state) {
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
            state.taskQueue.forEach((task) => {
                html += `<div class="task-item">${task.title}</div>`;
            });
            html += "</div>";
        }
        if (state.completedTasks.length > 0) {
            html += "<div><strong>Completed:</strong>";
            state.completedTasks.slice(-3).forEach((task) => {
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
export class MemoryInspectionPanel {
    constructor(sessionId, memoryService) {
        this.id = "memory-inspection";
        this.type = "debug-panel";
        this.sessionId = sessionId;
        this.memoryService = memoryService;
    }
    render() {
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
    async inspectWorkingMemory(taskId) {
        const memory = await this.memoryService.getWorkingMemory(taskId);
        const content = JSON.stringify(memory, null, 2);
        this.updateContent(content);
    }
    async inspectSessionMemory() {
        const memory = await this.memoryService.getSessionMemory(this.sessionId);
        const content = JSON.stringify(memory, null, 2);
        this.updateContent(content);
    }
    async inspectLongTermMemory() {
        const memories = await this.memoryService.retrieveLongTermMemory({
            sessionId: this.sessionId,
            limit: 10,
            offset: 0,
            minImportance: 0,
        });
        const content = JSON.stringify(memories, null, 2);
        this.updateContent(content);
    }
    updateContent(content) {
        const element = document.getElementById("memoryContent");
        if (element) {
            element.innerHTML = `<pre class="memory-item">${content}</pre>`;
        }
    }
}
/**
 * Built-in Tools Component
 */
export class BuiltInToolsPanel {
    constructor() {
        this.id = "builtin-tools";
        this.type = "tools-panel";
    }
    render() {
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
    async useWebSearch(query) {
        // TODO: Implement web search via OpenClaw tools
        console.log("[Tools] Web search for:", query);
        return { results: [] };
    }
    async useCalendar(action) {
        // TODO: Implement calendar access via OpenClaw tools
        console.log("[Tools] Calendar action:", action);
        return { events: [] };
    }
    async useNotes(action, content) {
        // TODO: Implement notes via OpenClaw tools
        console.log("[Tools] Notes action:", action, "Content:", content);
        return { success: true };
    }
}
/**
 * Unified Canvas UI Manager
 */
export class CanvasUIManager {
    constructor(sessionId, supervisor, memoryService) {
        this.components = new Map();
        this.sessionId = sessionId;
        this.supervisor = supervisor;
        this.memoryService = memoryService;
        this.initializeComponents();
    }
    initializeComponents() {
        this.components.set("task-form", new TaskSubmissionForm(this.supervisor));
        this.components.set("task-status", new TaskStatusDisplay(this.supervisor));
        this.components.set("memory-inspector", new MemoryInspectionPanel(this.sessionId, this.memoryService));
        this.components.set("tools", new BuiltInToolsPanel());
    }
    render(componentId) {
        const component = this.components.get(componentId);
        if (!component) {
            return `<div>Component not found: ${componentId}</div>`;
        }
        return component.render();
    }
    renderDashboard() {
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
/**
 * Feedback UI Component
 */
export class FeedbackPanel {
    constructor(sessionId) {
        this.id = "feedback-panel";
        this.type = "feedback";
        this.sessionId = sessionId;
    }
    render() {
        return `
<div class="feedback-panel">
  <h2>Provide Feedback</h2>
  <div class="feedback-form">
    <div class="form-group">
      <label>Was this helpful?</label>
      <div class="feedback-buttons">
        <button class="feedback-btn" data-feedback="thumbs_up">👍 Yes</button>
        <button class="feedback-btn" data-feedback="thumbs_down">👎 No</button>
      </div>
    </div>
    
    <div class="form-group">
      <label for="feedbackNote">Additional Comments:</label>
      <textarea id="feedbackNote" placeholder="Share your thoughts..." rows="4"></textarea>
      <button class="btn btn-submit" onclick="submitFeedback()">Submit Feedback</button>
    </div>
  </div>
  <style>
    .feedback-panel {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }
    .feedback-buttons {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }
    .feedback-btn {
      padding: 10px 20px;
      border: 2px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      transition: all 0.2s;
    }
    .feedback-btn:hover {
      border-color: #007bff;
      background: #e3f2fd;
    }
    .feedback-btn.selected {
      border-color: #28a745;
      background: #e8f5e9;
    }
    .form-group {
      margin: 15px 0;
    }
    .btn-submit {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .btn-submit:hover {
      background: #0056b3;
    }
  </style>
</div>
    `.trim();
    }
}
/**
 * Weekly Analysis Display Component
 */
export class WeeklyAnalysisDisplay {
    constructor(analysis) {
        this.id = "weekly-analysis";
        this.type = "analysis";
        this.analysis = analysis || {
            lifeBalance: {
                work: { actual: 45, target: 40, status: "overcommitted" },
                personal: { actual: 18, target: 20, status: "on_target" },
                learning: { actual: 8, target: 10, status: "underutilized" },
                health: { actual: 14, target: 15, status: "on_target" },
                finance: { actual: 15, target: 15, status: "on_target" },
            },
            patterns: [],
            anomalies: [],
            opportunities: [],
            summary: "Week overview",
            keyInsights: [],
        };
    }
    render() {
        const lb = this.analysis.lifeBalance;
        const anomalyCount = this.analysis.anomalies?.length || 0;
        const opportunityCount = this.analysis.opportunities?.length || 0;
        return `
<div class="weekly-analysis">
  <h2>📊 Weekly Analysis</h2>
  
  <div class="life-balance-scorecard">
    <h3>Life Balance: ${(this.analysis.lifeBalance.overallBalance * 100).toFixed(0)}%</h3>
    
    <div class="balance-items">
      ${this.renderBalanceItem("Work", lb.work.actual, lb.work.target, lb.work.status)}
      ${this.renderBalanceItem("Personal", lb.personal.actual, lb.personal.target, lb.personal.status)}
      ${this.renderBalanceItem("Learning", lb.learning.actual, lb.learning.target, lb.learning.status)}
      ${this.renderBalanceItem("Health", lb.health.actual, lb.health.target, lb.health.status)}
      ${this.renderBalanceItem("Finance", lb.finance.actual, lb.finance.target, lb.finance.status)}
    </div>
  </div>

  <div class="analysis-sections">
    ${anomalyCount > 0 ? `
    <div class="section anomalies">
      <h4>⚠️ Anomalies Detected: ${anomalyCount}</h4>
      <p>Review issues preventing optimal performance.</p>
    </div>
    ` : ''}

    ${opportunityCount > 0 ? `
    <div class="section opportunities">
      <h4>🚀 Opportunities: ${opportunityCount}</h4>
      <p>High-confidence actions for improvement.</p>
    </div>
    ` : ''}
  </div>

  <div class="summary">
    <h4>Summary</h4>
    <p>${this.analysis.summary}</p>
  </div>

  <style>
    .weekly-analysis {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .life-balance-scorecard {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: 8px;
    }
    .balance-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }
    .balance-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .balance-label {
      width: 100px;
      font-weight: bold;
    }
    .balance-bar {
      flex: 1;
      height: 20px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    .balance-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #ffc107);
      transition: width 0.3s;
    }
    .balance-text {
      width: 80px;
      text-align: right;
      font-size: 12px;
    }
    .analysis-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin: 20px 0;
    }
    .section {
      padding: 15px;
      border-radius: 8px;
      background: white;
    }
    .section.anomalies {
      border-left: 4px solid #dc3545;
    }
    .section.opportunities {
      border-left: 4px solid #28a745;
    }
    .summary {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-top: 10px;
    }
  </style>
</div>
    `.trim();
    }
    renderBalanceItem(label, actual, target, status) {
        const percent = Math.min((actual / target) * 100, 100);
        const statusColor = status === "on_target" ? "#28a745" : status === "overcommitted" ? "#dc3545" : "#ffc107";
        return `
<div class="balance-item">
  <div class="balance-label">${label}</div>
  <div class="balance-bar">
    <div class="balance-fill" style="width: ${percent}%; background-color: ${statusColor};"></div>
  </div>
  <div class="balance-text">${actual.toFixed(0)}% / ${target.toFixed(0)}%</div>
</div>
    `.trim();
    }
}
/**
 * Daily Summary Card Component
 */
export class DailySummaryCard {
    constructor(summary) {
        this.id = "daily-summary";
        this.type = "summary";
        this.summary = summary || {
            date: new Date().toLocaleDateString(),
            tasksCompleted: 0,
            focusTime: 0,
            moodScore: 7,
            keyEvent: "No significant events",
        };
    }
    render() {
        return `
<div class="daily-summary-card">
  <h3>📅 ${this.summary.date}</h3>
  
  <div class="summary-stats">
    <div class="stat">
      <span class="stat-label">Tasks Completed</span>
      <span class="stat-value">${this.summary.tasksCompleted}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Focus Time (h)</span>
      <span class="stat-value">${this.summary.focusTime.toFixed(1)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Mood Score</span>
      <span class="stat-value">${this.summary.moodScore}/10</span>
    </div>
  </div>

  <div class="key-event">
    <strong>Today's Highlight:</strong> ${this.summary.keyEvent}
  </div>

  <style>
    .daily-summary-card {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 15px 0;
    }
    .stat {
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      text-align: center;
    }
    .stat-label {
      display: block;
      font-size: 12px;
      color: #666;
    }
    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
    }
    .key-event {
      margin-top: 15px;
      padding: 10px;
      background: #e3f2fd;
      border-left: 3px solid #007bff;
      border-radius: 4px;
    }
  </style>
</div>
    `.trim();
    }
}
export { PersonalAssistantSupervisor, MemoryService };
