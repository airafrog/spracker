import { defineStore } from "pinia";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

import { LayerService } from "../services/layer";
import type { Layer } from "../types";

export const useLayerStore = defineStore("layer", () => {
  const layers = ref<Layer[]>([]);
  const activeLayer = ref<Layer | null>(null);
  const layerServices: { [id: string]: LayerService } = {};

  function createLayer(gltf: GLTF, height = 0, thickness = 10) {
    const id = uuidv4();

    const layerService = new LayerService(gltf, height, thickness);
    layerServices[id] = layerService;

    layers.value.push({
      canvasDataUrl: layerService.render(),
      id,
      height,
      thickness,
      name: `Layer ${layers.value.length}`,
    });
  }

  function createEvenlySpacedLayers(
    gltf: GLTF,
    layerCount: number,
    thickness: number
  ) {
    removeAllLayers();

    const separation = 100 / layerCount;
    for (let i = 0; i < layerCount; i++) {
      const height = Math.floor(separation * i);
      createLayer(gltf, height, thickness);
    }
  }

  function getLayerIndex(id: string): number {
    return layers.value.findIndex((layer) => layer.id === id);
  }

  function getLayerService(id: string): LayerService | null {
    if (!(id in layerServices)) return null;
    return layerServices[id];
  }

  function removeLayer(id: string) {
    if (!(id in layerServices)) return;
    layerServices[id].dispose();
    delete layerServices[id];

    const layerIndex = getLayerIndex(id);
    if (layerIndex === -1) return;
    layers.value.splice(layerIndex, 1);
  }

  function removeAllLayers() {
    layers.value.forEach((layer) => removeLayer(layer.id));
  }

  function setLayerThickness(id: string, thickness: number) {
    const layer = layers.value.find((layer) => layer.id === id);
    if (!layer) return;

    if (!(id in layerServices)) return;
    const layerService = layerServices[id];

    layerService.setThickness(thickness);

    layer.thickness = thickness;
    layer.canvasDataUrl = layerService.render();
  }

  function setLayerHeight(id: string, height: number) {
    const layer = layers.value.find((layer) => layer.id === id);
    if (!layer) return;

    if (!(id in layerServices)) return;
    const layerService = layerServices[id];

    layerService.setHeight(height);

    layer.height = height;
    layer.canvasDataUrl = layerService.render();
  }

  function setLayerName(id: string, name: string) {
    const layer = layers.value.find((layer) => layer.id === id);
    if (!layer) return;
    layer.name = name;
  }

  function setLayerOrder(id: string, newIndex: number) {
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= layers.value.length) newIndex = layers.value.length - 1;

    const layerIndex = layers.value.findIndex((layer) => layer.id === id);
    const layer = layers.value[layerIndex];
    layers.value.splice(layerIndex, 1);
    layers.value.splice(newIndex, 0, layer);
  }

  function shiftLayerOrder(id: string, delta: number) {
    const layerIndex = layers.value.findIndex((layer) => layer.id === id);
    if (layerIndex === -1) return;

    const newIndex = layerIndex + delta;
    setLayerOrder(id, newIndex);
  }

  return {
    activeLayer,
    createEvenlySpacedLayers,
    createLayer,
    setLayerOrder,
    shiftLayerOrder,
    getLayerIndex,
    getLayerService,
    layers,
    removeAllLayers,
    removeLayer,
    setLayerHeight,
    setLayerName,
    setLayerThickness,
  };
});
