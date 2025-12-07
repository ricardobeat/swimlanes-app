import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  onInitialData: (callback: (data: unknown) => void) =>
    ipcRenderer.on("initial-data", (event, data) => callback(data)),
});
