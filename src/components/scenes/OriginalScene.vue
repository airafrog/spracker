<script setup lang="ts">
import { storeToRefs } from "pinia";
import * as THREE from "three";
import { onMounted, onUnmounted, ref, watch } from "vue";

import SceneToolbar from "@/components/toolbars/SceneToolbar.vue";
import { CameraService } from "@/services/camera";
import { useLayerStore, useModelStore, useSettingsStore } from "@/stores";
import type { Axis, CameraMode } from "@/types";

const layerStore = useLayerStore();
const { activeLayer } = storeToRefs(layerStore);

const modelStore = useModelStore();
const { model } = storeToRefs(modelStore);

const settingsStore = useSettingsStore();
const cameraMode = ref<CameraMode>("perspective");
const downscaleFactor = ref(1);

const scene = new THREE.Scene();
const canvas = ref<HTMLCanvasElement>();
const cameraService = new CameraService();
let renderer: THREE.WebGLRenderer;
let resizeFunction = () => {};

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 1,
});
const layerWireframe = new THREE.LineSegments(edgesGeometry, lineMaterial);

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
  scene.add(layerWireframe);

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
});

onUnmounted(() => {
  scene.clear();
  if (renderer) renderer.dispose();
  window.removeEventListener("resize", resizeFunction);
});

watch(
  model,
  (newModel) => {
    if (!newModel) return;

    cameraService.setPosition(
      modelStore.modelSize.x * 2,
      modelStore.modelSize.y * 2,
      modelStore.modelSize.z * 2
    );

    scene.add(newModel);
  },
  { immediate: true }
);

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
      modelStore.modelSize.x,
      thickness,
      modelStore.modelSize.z
    );
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => settingsStore.originalSceneBackgroundHex,
  (newColor) => (scene.background = new THREE.Color(newColor)),
  { immediate: true }
);

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
      v-model:background-hex="settingsStore.originalSceneBackgroundHex"
      :camera-mode="cameraMode"
      :downscale-factor="downscaleFactor"
      @set-camera-mode="handleSetCameraMode"
      @set-downscale-factor="handleSetDownscaleFactor"
      @view-axis="handleViewAxis"
    />

    <canvas ref="canvas" class="absolute full-width full-height" />
  </div>
</template>
