import { writable, get } from "svelte/store";
import type { User } from "src/types/user";

export const user = writable<User>({
  id: crypto.randomUUID(),
});

export function getUserId(): string {
  return get(user).id;
}
