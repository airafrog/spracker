<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, watch } from "vue";

import SceneToolbar from "@/components/toolbars/SceneToolbar.vue";
import { CameraService } from "@/services/camera";
import { useLayerStore, useSettingsStore } from "@/stores";
import type { Axis, CameraMode } from "@/types";

const layerStore = useLayerStore();
const settingsStore = useSettingsStore();

const scene = new THREE.Scene();
const canvas = ref<HTMLCanvasElement>();
const canvasContainer = ref<HTMLDivElement>();
const cameraService = new CameraService();
const cameraMode = ref<CameraMode>("perspective");
let renderer: THREE.WebGLRenderer;
let resizeFunction = () => {};

function createStack() {
  const layerValues = Object.values(layerStore.layers);
  layerValues.forEach((layer, i) => {
    const layerService = layerStore.getLayerService(layer.id);
    if (!layerService) return;
    const separation = layerService.gltfSize.y / layerValues.length;

    const layerMesh = layerService.getMesh();
    layerMesh.position.set(0, separation * i, 0);
    layerMesh.rotation.x = -Math.PI / 2; // Rotate to face up
    layerStore.stackGroup.add(layerMesh);
  });
}

watch(
  [
    () => layerStore.layers.map((layer) => layer.id),
    () => layerStore.layerWidth,
    () => layerStore.layerHeight,
  ],
  () => {
    layerStore.stackGroup.clear();
    createStack();
  },
  { immediate: true }
);

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

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);
  scene.add(layerStore.stackGroup);

  function animate() {
    cameraService.animate();
    renderer.render(scene, cameraService.camera);
  }

  resizeFunction = () => {
    if (!canvasContainer.value) return;
    const canvasWidth = canvasContainer.value.clientWidth;
    const canvasHeight = canvasContainer.value.clientHeight;
    renderer.setSize(canvasWidth, canvasHeight);
    cameraService.resize(canvasWidth, canvasHeight);
  };
  window.addEventListener("resize", resizeFunction);

  watch(
    () => settingsStore.stackedSceneBackgroundHex,
    (newColor) => (scene.background = new THREE.Color(newColor)),
    { immediate: true }
  );
});

onUnmounted(() => {
  scene.clear();
  if (renderer) renderer.dispose();
  window.removeEventListener("resize", resizeFunction);
});

function handleViewAxis(axis: Axis, distance: number) {
  cameraService.viewAxis(axis, distance);
}

function handleSetCameraMode(mode: CameraMode) {
  cameraService.setCameraMode(mode);
  cameraMode.value = mode;
}
</script>

<template>
  <div class="full-height" style="position: relative">
    <scene-toolbar
      v-model:background-hex="settingsStore.stackedSceneBackgroundHex"
      :camera-mode="cameraMode"
      @set-camera-mode="handleSetCameraMode"
      @view-axis="handleViewAxis"
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
