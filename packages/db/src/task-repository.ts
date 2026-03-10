import { TaskStatus } from "@jamal/shared-types";
import { PersistedTaskRecord } from "./task-records";

export interface TaskRepository {
  create(task: PersistedTaskRecord): Promise<PersistedTaskRecord>;
  findById(id: string): Promise<PersistedTaskRecord | null>;
  list(): Promise<PersistedTaskRecord[]>;
  updateStatus(
    id: string,
    status: TaskStatus,
    updatedAt: string
  ): Promise<PersistedTaskRecord | null>;
}
