/**
 * @jamal/db
 * Persistence layer with in-memory task repository
 */

export { PersistedTaskRecord } from "./task-records";
export { TaskRepository } from "./task-repository";
export { InMemoryTaskRepository } from "./in-memory-task-repository";

export default {
  InMemoryTaskRepository,
};
