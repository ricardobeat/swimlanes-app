import { writable, get } from "svelte/store";
import { user } from "../stores/user";

import type { Task } from "../types/task";

export const tasks = writable<Task[]>([]);

export function getTasks(): Task[] {
  return get(tasks);
}

export function createTask(task: Task): void {
  tasks.update((ts) => [...ts, task]);
}

export function getTaskById(id: string): Task | undefined {
  return get(tasks).find((t) => t.id === id);
}

export function getTaskIndexById(id: string): number {
  return get(tasks).findIndex((t) => t.id === id);
}

export function removeTaskById(id: string): Task {
  const task = getTaskById(id);
  tasks.update((ts) => ts.filter((t) => t.id !== id));
  return task;
}

export function updateTask(id: string, updates: Partial<Task>): Task {
  const task = getTaskById(id);
  const updatedAt = new Date().toISOString();
  const updatedTask: Task = { ...task, ...updates, updatedAt };
  tasks.update((ts) => ts.map((t) => (t.id === task.id ? updatedTask : t)));
  return updatedTask;
}
