import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { reactive } from "vue";
import * as THREE from "three";

import type { Layer } from "../types";

export const useLayerStore = defineStore("layer", () => {
  const layers = reactive<{ [id: string]: Layer }>({});
  const planes: { [id: string]: THREE.Plane } = {};
  const originalScene: THREE.Scene = new THREE.Scene();

  function addLayer() {
    const id = uuidv4();
    const layerCount = Object.keys(layers).length;

    layers[id] = {
      id,
      name: `Layer ${layerCount}`,
      height: 0,
    };

    planes[id] = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    return layers[id];
  }

  function removeLayer(uuid: string) {
    delete layers[uuid];
    delete planes[uuid];
  }

  return {
    layers,
    addLayer,
    removeLayer,
  };
});
