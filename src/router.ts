import { createRouter } from "sv-router";
import Create from "./pages/Create.svelte";
import Join from "./pages/Join.svelte";
import TodoApp from "./pages/TodoApp.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/": TodoApp,
  "/join": Join,
  "/create": Create,
});
