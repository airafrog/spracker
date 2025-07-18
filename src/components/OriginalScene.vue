<script setup lang="ts">
import { storeToRefs } from "pinia";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { onMounted, onUnmounted, ref, watch } from "vue";

import SceneToolbar from "./SceneToolbar.vue";
import { CameraService } from "../services/camera";
import { useLayerStore, useSettingsStore } from "../stores";

const props = defineProps<{
  gltf: GLTF;
}>();

const settingsStore = useSettingsStore();

const scene = new THREE.Scene();
const canvas = ref<HTMLCanvasElement>();
const canvasContainer = ref<HTMLDivElement>();
const cameraService = new CameraService();
let renderer: THREE.WebGLRenderer;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const geo = new THREE.EdgesGeometry(geometry);
const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
const layerWireframe = new THREE.LineSegments(geo, mat);

let resizeFunction = () => {};

onMounted(() => {
  if (!canvas.value) throw new Error("Canvas is not defined");
  if (!canvasContainer.value) {
    throw new Error("Canvas container is not defined");
  }

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(
    canvasContainer.value.clientWidth,
    canvasContainer.value.clientHeight
  );
  renderer.setAnimationLoop(animate);

  const canvasWidth = canvasContainer.value.clientWidth;
  const canvasHeight = canvasContainer.value.clientHeight;
  cameraService.resize(canvasWidth, canvasHeight);
  cameraService.enableOrbitControls(canvas.value);

  function animate() {
    cameraService.animate();
    renderer.render(scene, cameraService.camera);
  }

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);
  scene.add(props.gltf.scene);
  scene.add(layerWireframe);

  resizeFunction = () => {
    if (!canvasContainer.value) return;
    const canvasWidth = canvasContainer.value.clientWidth;
    const canvasHeight = canvasContainer.value.clientHeight;
    renderer.setSize(canvasWidth, canvasHeight);
    cameraService.resize(canvasWidth, canvasHeight);
  };
  window.addEventListener("resize", resizeFunction);

  watch(
    () => settingsStore.originalSceneBackgroundHex,
    (newColor) => {
      scene.background = new THREE.Color(newColor);
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  scene.clear();
  if (renderer) renderer.dispose();
  window.removeEventListener("resize", resizeFunction);
});

const layerStore = useLayerStore();
const { activeLayer } = storeToRefs(layerStore);
watch(
  activeLayer,
  (newLayer) => {
    if (!newLayer) {
      layerWireframe.visible = false;
      return;
    }
    layerWireframe.visible = true;

    const layerService = layerStore.getLayerService(newLayer.id);
    if (!layerService) return;
    const height = layerService.getWorldHeight();
    const thickness = layerService.getWorldThickness();

    layerWireframe.position.y = height;
    layerWireframe.scale.set(
      layerService.gltfSize.x,
      thickness,
      layerService.gltfSize.z
    );
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <div class="full-height" style="position: relative">
    <scene-toolbar
      v-model:background-hex="settingsStore.originalSceneBackgroundHex"
      :camera-mode="cameraService.getCameraMode().value"
      @toggle-camera-mode="cameraService.toggleCameraMode()"
    />

    <div ref="canvasContainer" class="canvas-container">
      <canvas ref="canvas" />
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
}
</style>
