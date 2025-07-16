import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const pngBackgroundHex = ref("#23343d");

  return {
    pngBackgroundHex,
  };
});
