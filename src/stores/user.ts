import { writable } from "svelte/store";
import type { User } from "src/types/user";

const USER_STORAGE_KEY = "app-user";

export const user = writable<User>({
  token: "",
});

export function loadUserFromStorage(): User {
  try {
    if (localStorage.has(USER_STORAGE_KEY)) {
      const data = localStorage.get(USER_STORAGE_KEY);
      const user = JSON.parse(safeStorage.decryptString(data));
      return user;
    } else {
      const uuid = crypto.randomUUID();
      const newUser = { token: uuid };
      const data = safeStorage.encryptString(JSON.stringify(newUser));
      localStorage.set(USER_STORAGE_KEY, data);
      return newUser;
    }
  } catch (e) {
    alert("Error retriving user data: " + e);
    throw e;
  }
}
