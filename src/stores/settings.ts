import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const originalSceneBackgroundHex = ref("#120d12");
  const stackedSceneBackgroundHex = ref("#0b080b");
  const pngBackgroundHex = ref("#3e3546");

  return {
    originalSceneBackgroundHex,
    pngBackgroundHex,
    stackedSceneBackgroundHex,
  };
});
