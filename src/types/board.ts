import { Task } from "./task";

export interface Board {
  id: string;
  createdBy: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
