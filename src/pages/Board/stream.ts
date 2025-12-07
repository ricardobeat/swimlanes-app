import { api } from "src/api/api";
import { tasks, removeTaskById, updateTask, createTask } from "src/stores/tasks";
import type { Task } from "src/types/task";
import { get } from "svelte/store";

interface Subscription {
  unsubscribe: () => void;
}

export function subscribeToBoard(boardId: string): Subscription {
  const eventSource = api.subscribe(boardId);

  function getTaskData(e: MessageEvent): Task {
    try {
      return JSON.parse(e.data);
    } catch (e) {
      console.error(e);
      return {} as Task;
    }
  }

  eventSource.addEventListener("create", (e) => {
    const task = getTaskData(e);
    createTask(task);
  });

  eventSource.addEventListener("update", (e) => {
    const task = getTaskData(e);
    updateTask(task.id, task);
  });

  eventSource.addEventListener("delete", (e) => {
    const task = getTaskData(e);
    removeTaskById(task.id);
  });

  return {
    unsubscribe: () => eventSource.close(),
  };
}
