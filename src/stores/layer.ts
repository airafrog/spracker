import { defineStore } from "pinia";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { ref, shallowRef } from "vue";

import { LayerService } from "@/services/layer";
import type { Layer } from "@/types";

export const useLayerStore = defineStore("layer", () => {
  const layers = ref<Layer[]>([]);
  const activeLayer = ref<Layer | null>(null);
  const layerServices: { [id: string]: LayerService } = {};
  const layerWidth = ref(32);
  const layerHeight = ref(32);
  const stackGroup = shallowRef(new THREE.Group());
  const projectName = ref("");

  function createLayer(
    model: THREE.Object3D,
    modelBox: THREE.Box3,
    modelSize: THREE.Vector3,
    height = 0,
    thickness = 10,
    layerName?: string
  ) {
    if (!model) throw new Error("Model is undefined");
    const id = uuidv4();

    const layerService = new LayerService(
      model,
      modelBox,
      modelSize,
      height,
      thickness,
      layerWidth.value,
      layerHeight.value
    );
    layerServices[id] = layerService;

    layers.value.push({
      canvasDataUrl: layerService.render(),
      id,
      height,
      thickness,
      name: layerName || `Layer ${layers.value.length}`,
    });
  }

  function createEvenlySpacedLayers(
    model: THREE.Object3D,
    modelBox: THREE.Box3,
    modelSize: THREE.Vector3,
    layerCount: number,
    thickness: number
  ) {
    removeAllLayers();

    const separation = 100 / layerCount;
    for (let i = 0; i < layerCount; i++) {
      const height = Math.floor(separation * i);
      createLayer(model, modelBox, modelSize, height, thickness);
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

    if (activeLayer.value && activeLayer.value.id === id) {
      activeLayer.value = null;
    }
  }

  function removeAllLayers() {
    layers.value.forEach((layer) => {
      if (!(layer.id in layerServices)) return;
      layerServices[layer.id].dispose();
      delete layerServices[layer.id];
    });

    layers.value = [];
    activeLayer.value = null;
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

  function setLayerSize(width: number, height: number) {
    layerWidth.value = width;
    layerHeight.value = height;

    layers.value.forEach((layer) => {
      if (!(layer.id in layerServices)) return;
      const layerService = layerServices[layer.id];
      layerService.setRendererSize(width, height);
      layer.canvasDataUrl = layerService.render();
    });
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

  function resetStore() {
    removeAllLayers();
    activeLayer.value = null;
    layerWidth.value = 32;
    layerHeight.value = 32;
    stackGroup.value.clear();
  }

  return {
    activeLayer,
    createEvenlySpacedLayers,
    createLayer,
    getLayerIndex,
    getLayerService,
    layers,
    layerWidth,
    layerHeight,
    projectName,
    resetStore,
    removeAllLayers,
    removeLayer,
    setLayerHeight,
    setLayerName,
    setLayerSize,
    setLayerThickness,
    setLayerOrder,
    shiftLayerOrder,
    stackGroup,
  };
});
