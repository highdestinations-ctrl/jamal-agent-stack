import { TaskStatus } from "@jamal/shared-types";
import { TaskRepository } from "./task-repository";
import { PersistedTaskRecord } from "./task-records";

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<string, PersistedTaskRecord> = new Map();

  async create(task: PersistedTaskRecord): Promise<PersistedTaskRecord> {
    this.tasks.set(task.id, { ...task });
    return this.tasks.get(task.id)!;
  }

  async findById(id: string): Promise<PersistedTaskRecord | null> {
    return this.tasks.get(id) || null;
  }

  async list(): Promise<PersistedTaskRecord[]> {
    return Array.from(this.tasks.values());
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    updatedAt: string
  ): Promise<PersistedTaskRecord | null> {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updated = { ...task, status, updatedAt };
    this.tasks.set(id, updated);
    return updated;
  }
}
