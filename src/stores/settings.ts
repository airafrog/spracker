import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const originalSceneBackgroundHex = ref("#120d12");
  const stackedSceneBackgroundHex = ref("#1a131a");
  const pngBackgroundHex = ref("#1a131a");

  return {
    originalSceneBackgroundHex,
    pngBackgroundHex,
    stackedSceneBackgroundHex,
  };
});
