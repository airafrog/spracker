import { defineStore } from "pinia";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

import { LayerService } from "../services/layer";
import type { Layer } from "../types";

export const useLayerStore = defineStore("layer", () => {
  const layers = ref<{ [id: string]: Layer }>({});
  const activeLayer = ref<Layer | null>(null);
  const layerServices: { [id: string]: LayerService } = {};

  function addLayer(gltf: GLTF, height = 0, thickness = 10) {
    const id = uuidv4();

    const layerService = new LayerService(gltf, height, thickness);
    layerServices[id] = layerService;

    layers.value[id] = {
      canvasDataUrl: layerService.render(),
      id,
      height,
      thickness,
      name: `Layer ${Object.keys(layers.value).length}`,
    };
  }

  function addEvenlySpacedLayers(
    gltf: GLTF,
    layerCount: number,
    thickness: number
  ) {
    const separation = 100 / layerCount;
    for (let i = 0; i < layerCount; i++) {
      const height = Math.floor(separation * i);
      addLayer(gltf, height, thickness);
    }
  }

  function getLayerService(id: string): LayerService | null {
    if (!(id in layerServices)) return null;
    return layerServices[id];
  }

  function removeLayer(id: string) {
    if (!(id in layers.value)) return;
    if (!(id in layerServices)) return;

    layerServices[id].dispose();

    delete layers.value[id];
    delete layerServices[id];
  }

  function removeAllLayers() {
    const ids = Object.keys(layers.value);
    ids.forEach((id) => removeLayer(id));
  }

  function setLayerThickness(id: string, thickness: number) {
    if (!(id in layers.value)) return;
    if (!(id in layerServices)) return;
    const layer = layers.value[id];
    const layerService = layerServices[id];

    layerService.setThickness(thickness);

    layer.thickness = thickness;
    layer.canvasDataUrl = layerService.render();
  }

  function setLayerHeight(id: string, height: number) {
    if (!(id in layers.value)) return;
    if (!(id in layerServices)) return;
    const layer = layers.value[id];
    const layerService = layerServices[id];

    layerService.setHeight(height);

    layer.height = height;
    layer.canvasDataUrl = layerService.render();
  }

  function setLayerName(id: string, name: string) {
    if (!(id in layers.value)) return;
    layers.value[id].name = name;
  }

  return {
    activeLayer,
    addEvenlySpacedLayers,
    addLayer,
    setLayerHeight,
    setLayerName,
    getLayerService,
    setLayerThickness,
    layers,
    removeAllLayers,
    removeLayer,
  };
});
