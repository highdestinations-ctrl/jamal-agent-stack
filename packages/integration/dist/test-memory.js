/**
 * Integration test for Memory Service
 * Tests all 3 layers: working, session, and long-term memory
 */
import { createMemoryService } from "@jamal/memory-service";
import { v4 as uuidv4 } from "uuid";
async function testMemoryService() {
    console.log("[TEST] Starting Memory Service Integration Tests...\n");
    // Note: These tests assume PostgreSQL and Qdrant are running
    // Default connection strings:
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
        console.log("[TEST] Connecting to PostgreSQL:", pgConfig.host);
        const memoryService = await createMemoryService(pgConfig, qdrantConfig);
        console.log("[TEST] ✓ Memory service initialized\n");
        const sessionId = uuidv4();
        console.log("[TEST] Using session ID:", sessionId);
        // Test 1: Working Memory
        console.log("\n[TEST] Testing Working Memory Layer...");
        const taskId = uuidv4();
        const workingMemory = await memoryService.createWorkingMemory({
            taskId,
            sessionId,
            context: { type: "test", data: "sample" },
            status: "active",
        });
        console.log("[TEST] ✓ Created working memory:", workingMemory.taskId);
        const retrieved = await memoryService.getWorkingMemory(taskId);
        console.log("[TEST] ✓ Retrieved working memory:", retrieved?.taskId);
        // Test 2: Session Memory
        console.log("\n[TEST] Testing Session Memory Layer...");
        const messages = [
            {
                id: "msg-1",
                role: "user",
                content: "Hello, assistant",
                timestamp: new Date(),
            },
            {
                id: "msg-2",
                role: "assistant",
                content: "Hi! How can I help?",
                timestamp: new Date(),
            },
        ];
        const sessionMemory = await memoryService.createSessionMemory(sessionId, messages);
        console.log("[TEST] ✓ Created session memory with", messages.length, "messages");
        const sessionRetrieved = await memoryService.getSessionMemory(sessionId);
        console.log("[TEST] ✓ Retrieved session memory with", sessionRetrieved?.messages.length, "messages");
        // Test 3: Long-term Memory
        console.log("\n[TEST] Testing Long-term Memory Layer...");
        await memoryService.storeLongTermMemory({
            vectorId: "ltm-1",
            sessionId,
            content: "Important decision: User prefers morning meetings",
            contentType: "user_preference",
            category: "preferences",
            tags: ["user_preference", "meeting", "time"],
            importanceScore: 0.9,
            metadata: { reason: "explicitly stated" },
            createdAt: new Date(),
        });
        console.log("[TEST] ✓ Stored long-term memory");
        const ltmRetrieved = await memoryService.retrieveLongTermMemory({
            sessionId,
            limit: 10,
            offset: 0,
            minImportance: 0,
        });
        console.log("[TEST] ✓ Retrieved", ltmRetrieved.length, "long-term memories");
        // Test 4: Supervisor State
        console.log("\n[TEST] Testing Supervisor State...");
        const supervisorState = await memoryService.createOrUpdateSupervisorState({
            sessionId,
            currentNode: "task_router",
            routingHistory: [
                {
                    timestamp: new Date(),
                    fromNode: "start",
                    toNode: "task_router",
                    reason: "Initial routing",
                },
            ],
            subagentAssignments: {},
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log("[TEST] ✓ Created supervisor state");
        const stateRetrieved = await memoryService.getSupervisorState(sessionId);
        console.log("[TEST] ✓ Retrieved supervisor state:", stateRetrieved?.currentNode);
        // Test 5: Cleanup
        console.log("\n[TEST] Testing cleanup functions...");
        await memoryService.cleanupExpiredMemory();
        console.log("[TEST] ✓ Cleanup completed");
        await memoryService.close();
        console.log("\n[TEST] ✓ All memory service tests passed!");
    }
    catch (error) {
        console.error("[TEST] ✗ Test failed:", error);
        process.exit(1);
    }
}
testMemoryService();
