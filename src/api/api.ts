import ky from "ky";
import type { Task } from "../types/task";
import type { Board } from "../types/board";
import { getUserId } from "../stores/user";

const API_URL = "http://localhost:3002";

const request = ky.create({
  prefixUrl: API_URL,

  hooks: {
    beforeRequest: [(request) => request.headers.set("X-User-ID", getUserId())],
  },
});

class ServiceAPI {
  async createBoard(user: string): Promise<Board> {
    return request.post<Board>("boards", { json: { user } }).json();
  }

  async getBoard(boardId: string): Promise<Board> {
    return request.get<Board>(`boards/${boardId}`).json();
  }

  async createTask(boardId: string, task: Task): Promise<Task> {
    return request.post(`boards/${boardId}/tasks`, { json: task }).json();
  }

  async updateTask(boardId: string, task: Task): Promise<Task> {
    return request.put(`boards/${boardId}/tasks/${task.id}`, { json: task }).json();
  }

  async deleteTask(boardId: string, taskId: string): Promise<void> {
    return request.delete(`boards/${boardId}/tasks/${taskId}`).json();
  }

  subscribe(boardId: string): EventSource {
    return new EventSource(`${API_URL}/events?stream=${boardId}`);
  }
}

export const api = new ServiceAPI();
