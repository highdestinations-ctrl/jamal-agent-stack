/**
 * @jamal/queue
 * Task queue abstraction with in-memory implementation
 */

import { InMemoryTaskQueue } from "./in-memory-task-queue";

export { QueuedTaskRecord, QueueRecordStatus } from "./queue-records";
export { TaskQueue } from "./task-queue";
export { InMemoryTaskQueue } from "./in-memory-task-queue";

export default {
  InMemoryTaskQueue,
};
