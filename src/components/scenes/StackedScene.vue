<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, watch } from "vue";

import SceneToolbar from "@/components/toolbars/SceneToolbar.vue";
import { CameraService } from "@/services/camera";
import { useLayerStore, useModelStore, useSettingsStore } from "@/stores";
import type { Axis, CameraMode } from "@/types";

const layerStore = useLayerStore();
const modelStore = useModelStore();
const settingsStore = useSettingsStore();
const cameraMode = ref<CameraMode>("perspective");
const downscaleFactor = ref(1);

const scene = new THREE.Scene();
const canvas = ref<HTMLCanvasElement>();
const cameraService = new CameraService();
let renderer: THREE.WebGLRenderer;
let resizeFunction = () => {};

function createStack() {
  const layerValues = Object.values(layerStore.layers);
  layerValues.forEach((layer, i) => {
    const layerService = layerStore.getLayerService(layer.id);
    if (!layerService) return;

    const separation = modelStore.modelSize.y / layerValues.length;

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
  const canvasWidth = canvas.value.clientWidth;
  const canvasHeight = canvas.value.clientHeight;

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(
    canvasWidth / downscaleFactor.value,
    canvasHeight / downscaleFactor.value
  );
  renderer.setAnimationLoop(animate);

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
    if (!canvas.value) return;
    const canvasWidth = canvas.value.clientWidth;
    const canvasHeight = canvas.value.clientHeight;
    renderer.setSize(
      canvasWidth / downscaleFactor.value,
      canvasHeight / downscaleFactor.value
    );
    cameraService.resize(canvasWidth, canvasHeight);
  };

  window.addEventListener("resize", resizeFunction);
  watch(downscaleFactor, resizeFunction);

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

function handleSetDownscaleFactor(factor: number) {
  downscaleFactor.value = factor;
}
</script>

<template>
  <div class="full-height" style="position: relative">
    <scene-toolbar
      v-model:background-hex="settingsStore.stackedSceneBackgroundHex"
      :camera-mode="cameraMode"
      :downscale-factor="downscaleFactor"
      @set-camera-mode="handleSetCameraMode"
      @set-downscale-factor="handleSetDownscaleFactor"
      @view-axis="handleViewAxis"
    />

    <canvas ref="canvas" class="absolute full-width full-height" />
  </div>
</template>
