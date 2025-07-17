import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const originalSceneBackgroundHex = ref("#23343d");
  const stackedSceneBackgroundHex = ref("#23343d");
  const pngBackgroundHex = ref("#23343d");

  return {
    originalSceneBackgroundHex,
    pngBackgroundHex,
    stackedSceneBackgroundHex,
  };
});
