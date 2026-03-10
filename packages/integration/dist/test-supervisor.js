/**
 * Integration test for Personal Assistant Supervisor
 * Tests task routing, execution, and feedback loops
 */
import { createSupervisor } from "@jamal/supervisor";
import { createMemoryService } from "@jamal/memory-service";
import { v4 as uuidv4 } from "uuid";
async function testSupervisor() {
    console.log("[TEST] Starting Personal Assistant Supervisor Tests...\n");
    const pgConfig = {
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "jamal",
    };
    const qdrantConfig = {
        url: process.env.QDRANT_URL || "http://localhost:6333",
    };
    try {
        // Initialize memory service
        console.log("[TEST] Initializing memory service...");
        const memoryService = await createMemoryService(pgConfig, qdrantConfig);
        console.log("[TEST] ✓ Memory service initialized\n");
        const sessionId = uuidv4();
        console.log("[TEST] Using session ID:", sessionId);
        // Create supervisor
        console.log("\n[TEST] Creating Personal Assistant Supervisor...");
        const supervisor = await createSupervisor(sessionId, memoryService);
        console.log("[TEST] ✓ Supervisor created");
        // Register mock subagents
        console.log("\n[TEST] Registering mock subagents...");
        const assistantAgent = {
            id: "assistant-agent",
            name: "Assistant Agent",
            capabilities: ["help", "query", "explain"],
            async execute(task, context) {
                console.log("[Agent:Assistant] Processing task:", task.title);
                return { result: "Task completed by assistant", context };
            },
        };
        const tradingGuardAgent = {
            id: "tradingguard-agent",
            name: "Trading Guard Agent",
            capabilities: ["trade_verification", "risk_assessment"],
            async execute(task, context) {
                console.log("[Agent:TradingGuard] Processing task:", task.title);
                return { result: "Trade verified by trading guard", context };
            },
        };
        supervisor.registerSubagent(assistantAgent);
        supervisor.registerSubagent(tradingGuardAgent);
        console.log("[TEST] ✓ Subagents registered");
        // Test 1: Submit and execute task
        console.log("\n[TEST] Testing task submission and execution...");
        const task1 = await supervisor.submitTask({
            type: "assistant",
            title: "Explain async/await",
            description: "Please explain JavaScript async/await",
            priority: "normal",
            status: "pending",
        });
        console.log("[TEST] ✓ Task submitted:", task1.id);
        const result1 = await supervisor.executeTask(task1);
        console.log("[TEST] ✓ Task executed with result:", result1?.result);
        // Test 2: Multiple task queue
        console.log("\n[TEST] Testing task queue processing...");
        const task2 = await supervisor.submitTask({
            type: "tradingguard",
            title: "Verify trade",
            description: "Check if trade is valid",
            priority: "high",
            status: "pending",
        });
        const task3 = await supervisor.submitTask({
            type: "assistant",
            title: "Summarize",
            description: "Summarize the meeting notes",
            priority: "low",
            status: "pending",
        });
        console.log("[TEST] ✓ Submitted 2 additional tasks");
        await supervisor.processTaskQueue();
        console.log("[TEST] ✓ Task queue processed");
        // Test 3: Feedback loops
        console.log("\n[TEST] Testing feedback loop preparation...");
        const loopId = await supervisor.prepareFeedbackLoop(task1, {
            feedback_type: "user_approval",
            required: true,
        });
        console.log("[TEST] ✓ Feedback loop prepared:", loopId);
        await supervisor.submitFeedback(loopId, { approved: true });
        console.log("[TEST] ✓ Feedback submitted");
        // Test 4: Get supervisor state
        console.log("\n[TEST] Testing state retrieval...");
        const state = await supervisor.getSupervisorState();
        console.log("[TEST] ✓ Retrieved supervisor state");
        console.log(`    - Current task: ${state.currentTask?.title || "none"}`);
        console.log(`    - Completed tasks: ${state.completedTasks.length}`);
        console.log(`    - Failed tasks: ${state.failedTasks.length}`);
        console.log(`    - Active feedback loops: ${Object.keys(state.activeFeedbackLoops).length}`);
        // Test 5: Session summary
        console.log("\n[TEST] Testing session summary...");
        const summary = await supervisor.getSessionSummary();
        console.log("[TEST] ✓ Retrieved session summary");
        // Cleanup
        await supervisor.shutdown();
        await memoryService.close();
        console.log("\n[TEST] ✓ All supervisor tests passed!");
    }
    catch (error) {
        console.error("[TEST] ✗ Test failed:", error);
        process.exit(1);
    }
}
testSupervisor();
