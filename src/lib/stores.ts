import { writable } from "svelte/store";

export const user = writable(null);
export const settings = writable({ allowMove: true });

export const APP_NAME = "🇦 🇷 🇰 🇮 🇳 🇬";
