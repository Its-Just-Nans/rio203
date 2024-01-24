import { writable } from "svelte/store";
import type { Place, Parking } from "../../../shared/types";

export const places = writable<Place[]>([]);
export const parkings = writable<Parking[]>([]);
export const editMode = writable(false);
export const view3d = writable(false);
