import { createRouter } from "sv-router";
import Create from "./pages/Create.svelte";
import Join from "./pages/Join.svelte";
import Board from "./pages/Board.svelte";
import Ooops from "./pages/Ooops.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/": Join,
  "/board/:boardId": Board,
  "/create": Create,
  "/error": Ooops,
});
