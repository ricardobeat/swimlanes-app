import { get } from "svelte/store";
import { api } from "src/api/api";
import { user } from "src/stores/user";
import { currentBoardId } from "src/stores/board";
import { tasks } from "src/stores/tasks";

import type { Board } from "../types/board";

/**
 * Create board
 */
export async function createBoard(): Promise<Board> {
  const author = get(user).id;
  const board = await api.createBoard(author);
  currentBoardId.set(board.id);
  return board;
}

/**
 * Load board (and all tasks within)
 */
export async function loadBoard(boardId: string): Promise<void> {
  if (!boardId) return;
  currentBoardId.set(boardId);

  try {
    const board = await api.getBoard(boardId);
    tasks.set(board.tasks);
  } catch (e) {
    tasks.set([]);
    throw new Error("Failed to load board " + boardId);
  }
}
