import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const originalSceneBackgroundHex = ref("#1a252b");
  const stackedSceneBackgroundHex = ref("#1a252b");
  const pngBackgroundHex = ref("#23343d");

  return {
    originalSceneBackgroundHex,
    pngBackgroundHex,
    stackedSceneBackgroundHex,
  };
});
