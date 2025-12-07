import { writable, get } from "svelte/store";

interface Task {
  id: string;
  text: string;
  status: string;
}

export const MT_PREFIX = "text/x-task-";

export const tasks = writable<Task[]>([
  { id: "1", text: "Bake the cake", status: "todo" },
  { id: "2", text: "Replace servo #2", status: "todo" },
  { id: "3", text: "Buy chlorine tablets", status: "todo" },
  {
    id: "4",
    text: "Write new release announcement",
    status: "done",
  },
]);

export function getTask(id: string): Task {
  return get(tasks).find((t) => t.id === id);
}
