import { createRouter } from "sv-router";
import Join from "./pages/Join.svelte";
import TodoApp from "./pages/TodoApp.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/": TodoApp,
  "/join": Join,
});
