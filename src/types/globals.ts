import type { User } from "./user";

interface InitialData {
  user: User;
}

declare global {
  interface Window {
    electron: {
      onInitialData: (fn: (data: InitialData) => void) => void;
    };
  }
}

export {};
