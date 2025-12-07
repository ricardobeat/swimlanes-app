import type { InitialData } from "./initialData";

declare global {
  interface Window {
    electron: {
      onInitialData: (fn: (data: InitialData) => void) => void;
    };
  }
}

export {};
