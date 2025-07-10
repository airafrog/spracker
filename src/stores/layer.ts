import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { reactive, ref } from "vue";

import type { Layer } from "../types";

export const useLayerStore = defineStore("layer", () => {
  const layers = reactive<{ [id: string]: Layer }>({});

  function addLayer() {
    const id = uuidv4();
    const layerCount = Object.keys(layers).length;

    layers[id] = {
      id,
      name: `Layer ${layerCount}`,
      height: 0,
    };
  }

  function removeLayer(uuid: string) {
    delete layers[uuid];
  }

  return {
    layers,
    addLayer,
    removeLayer,
  };
});
