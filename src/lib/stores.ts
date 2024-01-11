import { writable } from "svelte/store";
import type { Place } from "./types";

export const editMode = writable(false);
export const places = writable<Place[]>([]);
export const view3d = writable(false);
export const user = writable(null);
export const settings = writable({ allowMove: true });
