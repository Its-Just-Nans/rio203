import { writable } from "svelte/store";

export const editMode = writable(false);
export const view3d = writable(false);
export const user = writable(null);
