import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { computed, ref, shallowRef } from "vue";

import type { LayerItem } from "../types";
import { LayerService } from "../services/layer";
import type { GLTF } from "three/examples/jsm/Addons.js";

export const useLayerStore = defineStore("layer", () => {
  const layerItems = shallowRef<LayerItem[]>([]);

  const activeLayerItemId = ref<string>();
  const activeLayerItem = computed(() => {
    if (!activeLayerItemId.value) return null;
    return layerItems.value.find((item) => item.id === activeLayerItemId.value);
  });

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
    for (let i = 1; i <= layerCount; i++) {
      addLayer(gltf, layerSeparation * i, layerSeparation * 2);
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

  function setAllLayerThickness(thickness: number) {
    layerItems.value.forEach((layerItem) => {
      layerItem.layerThickness = thickness;
      layerItem.layer.setLayerThickness(thickness);
    });
  }

  function setActiveLayerItem(id: string) {
    const layerItem = layerItems.value.find((item) => item.id === id);
    if (!layerItem) throw new Error(`Layer with id "${id}" not found`);
    activeLayerItemId.value = id;
  }

  function getActiveLayerItem() {
    return activeLayerItem.value;
  }

  return {
    activeLayerItem,
    addEvenlySpacedLayers,
    addLayer,
    getActiveLayerItem,
    layerItems,
    setActiveLayerItem,
    setAllLayerThickness,
    removeAllLayers,
    removeLayer,
  };
});
