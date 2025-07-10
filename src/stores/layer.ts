import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

import type { Layer } from "../types";

export const useLayerStore = defineStore("layer", () => {
  const layers = ref<{ [id: string]: Layer }>({});

  function addLayer() {
    const id = uuidv4();
    const layerCount = Object.keys(layers.value).length;

    layers.value[id] = {
      id,
      name: `Layer ${layerCount}`,
      height: ref(0),
    };
  }

  function removeLayer(uuid: string) {
    delete layers.value[uuid];
  }

  return {
    layers,
    addLayer,
    removeLayer,
  };
});
