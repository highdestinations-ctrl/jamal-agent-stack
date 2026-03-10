/**
 * Control API HTTP Server
 * Starts the Express server for the control-api
 */

import { ControlApi } from "./index";
import { createAgentId, AgentRole } from "@jamal/shared-types";

const port = parseInt(process.env.PORT || "3000", 10);

const supervisorDescriptor = {
  id: createAgentId("supervisor-control-api"),
  role: AgentRole.SUPERVISOR,
  displayName: "Control API Supervisor",
  isEnabled: true,
};

const api = new ControlApi(supervisorDescriptor);

api.start(port).catch((error) => {
  console.error("Failed to start Control API:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  api.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...");
  api.stop();
  process.exit(0);
});
