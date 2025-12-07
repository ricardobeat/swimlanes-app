import { writable } from "svelte/store";

export const applicationError = writable<Error>();
