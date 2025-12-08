import { get } from "svelte/store";
import {
  tasks,
  getTaskIndexById,
  removeTaskById,
  updateTask,
  getTasks,
  createTask,
} from "src/stores/tasks";
import { currentBoardId } from "src/stores/board";
import { user } from "src/stores/user";
import { api } from "./api";

import type { Task } from "../types/task";

/**
 * Add task
 */
export async function addTask(text: string, status: Task["status"] = "todo"): Promise<void> {
  const boardId = get(currentBoardId);
  const currentUser = get(user);
  if (!boardId) {
    throw new Error("No board selected");
  }

  const id = crypto.randomUUID();
  const newTask: Task = {
    id,
    text,
    status,
    createdBy: currentUser.id,
  };

  createTask(newTask);

  try {
    await api.createTask(boardId, newTask);
  } catch (e) {
    console.error("Failed to create task", e);
    tasks.update((ts) => ts.filter((t) => t.id !== id));
    throw e;
  }
}

/**
 * Update task
 */
export async function updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
  const index = getTaskIndexById(id);
  const task = getTasks().at(index);
  const updatedTask = updateTask(id, { status });

  try {
    await api.updateTask(get(currentBoardId), updatedTask);
  } catch (e) {
    console.error("Failed to update task", e);
    tasks.update((list) => {
      list.splice(index, 0, task); // put it back at the same index
      return list;
    });
  }
}

/**
 * Remove task
 */
export async function deleteTask(id: string): Promise<void> {
  const boardId = get(currentBoardId);
  if (!boardId) return;

  const removed = removeTaskById(id);

  try {
    await api.deleteTask(boardId, id);
  } catch (e) {
    console.error("Failed to delete task", e);
    tasks.update((ts) => [...ts, removed]);
    throw e;
  }
}
