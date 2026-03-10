/**
 * End-to-end demo: ControlApi with persistence and queueing
 */

import {
  AgentDescriptor,
  AgentRole,
  createAgentId,
} from "@jamal/shared-types";
import { ControlApi } from "@jamal/control-api";

async function runDemo() {
  // Create supervisor descriptor
  const supervisorDescriptor: AgentDescriptor = {
    id: createAgentId("supervisor-main-demo"),
    role: AgentRole.SUPERVISOR,
    displayName: "Demo Supervisor",
    isEnabled: true,
  };

  // Instantiate ControlApi
  const controlApi = new ControlApi(supervisorDescriptor);

  console.log("=== ControlApi Demo: Persistence + Queueing ===\n");
  console.log("Supervisor:", controlApi.getDescriptor().displayName);
  console.log();

  // Run assistant flow
  console.log("--- Assistant Flow (create → persist → queue → consume → execute) ---");
  const assistantFlowResult = await controlApi.runDemoAssistantFlow();
  console.log("Task ID:", assistantFlowResult.task.id);
  console.log("Persisted:", assistantFlowResult.persistedTask.id, `[${assistantFlowResult.persistedTask.status}]`);
  console.log("Queued:", assistantFlowResult.queuedTask.id, `[${assistantFlowResult.queuedTask.status}]`);
  console.log("Report:", assistantFlowResult.report.summary);
  console.log();

  // Run trading guard flow
  console.log("--- Trading Guard Flow (create → persist → queue → consume → execute) ---");
  const tradingGuardFlowResult = await controlApi.runDemoTradingGuardFlow();
  console.log("Task ID:", tradingGuardFlowResult.task.id);
  console.log("Persisted:", tradingGuardFlowResult.persistedTask.id, `[${tradingGuardFlowResult.persistedTask.status}]`);
  console.log("Queued:", tradingGuardFlowResult.queuedTask.id, `[${tradingGuardFlowResult.queuedTask.status}]`);
  console.log("Report:", tradingGuardFlowResult.report.summary);
  console.log();

  // List all persisted tasks
  console.log("--- Persistence Layer ---");
  const allTasks = await controlApi.listPersistedTasks();
  console.log(`Total persisted tasks: ${allTasks.length}`);
  allTasks.forEach((task) => {
    console.log(`  - ${task.id} (${task.type}) [${task.status}]`);
  });
  console.log();

  // List all queued tasks
  console.log("--- Queue Layer ---");
  const queuedTasks = await controlApi.listQueuedTasks();
  console.log(`Total queued tasks: ${queuedTasks.length}`);
  queuedTasks.forEach((record) => {
    console.log(`  - ${record.id} → ${record.taskId} [${record.status}] role=${record.targetSubagentRole}`);
  });
  console.log();

  console.log("✓ End-to-end demo completed successfully");
}

runDemo().catch((err) => {
  console.error("Demo failed:", err);
  process.exit(1);
});
