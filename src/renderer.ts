import { mount } from "svelte";
import "./app.css";
import "./types/globals";

import App from "./App.svelte";
import { user } from "./stores/user";

const app = mount(App, {
  target: document.getElementById("app"),
});

window.electron.onInitialData((data) => {
  user.set(data.user);
});

export default app;
