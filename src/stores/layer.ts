import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { shallowRef } from "vue";

import type { LayerItem } from "../types";
import { LayerService } from "../services/layer";
import type { GLTF } from "three/examples/jsm/Addons.js";

export const useLayerStore = defineStore("layer", () => {
  const layerItems = shallowRef<LayerItem[]>([]);

  function addLayer(gltf: GLTF, layerHeight = 0, layerThickness = 1) {
    const id = uuidv4();
    const layer = new LayerService(gltf, layerHeight, layerThickness);

    layerItems.value.push({
      id,
      layerHeight,
      layerThickness,
      name: `Layer ${layerItems.value.length + 1}`,
      layer,
    });
  }

  function addEvenlySpacedLayers(gltf: GLTF, layerCount: number) {
    layerItems.value = []; // Clear existing layers

    const layerSeparation = 1 / layerCount;
    const layerThickness = 1;

    for (let i = 0; i < layerCount; i++) {
      addLayer(gltf, layerSeparation * i, layerThickness);
    }
  }

  function removeLayer(id: string) {
    const index = layerItems.value.findIndex(
      (layerItem) => layerItem.id === id
    );
    if (index === -1) return;

    layerItems.value[index].layer.dispose();
    layerItems.value.splice(index, 1);
  }

  function removeAllLayers() {
    layerItems.value.forEach((layerItem) => layerItem.layer.dispose());
    layerItems.value = [];
  }

  return {
    addEvenlySpacedLayers,
    addLayer,
    layerItems,
    removeAllLayers,
    removeLayer,
  };
});
