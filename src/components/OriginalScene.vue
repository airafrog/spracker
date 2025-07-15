<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref } from "vue";

import { CameraService } from "../services/camera";
import { gltfService } from "../services/gltf";
import { useLayerStore } from "../stores";

import { LayerService } from "../services/layer";

const scene = new THREE.Scene();

const canvas = ref<HTMLCanvasElement>();
const canvasContainer = ref<HTMLDivElement>();
const cameraService = new CameraService();
let renderer: THREE.WebGLRenderer;
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

  cameraService.enableOrbitControls(canvas.value);

  const canvasWidth = canvasContainer.value.clientWidth;
  const canvasHeight = canvasContainer.value.clientHeight;
  cameraService.resize(canvasWidth, canvasHeight);

  function animate() {
    cameraService.animate();
    renderer.render(scene, cameraService.camera);
  }

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  resizeFunction = () => {
    if (!canvasContainer.value) return;
    const canvasWidth = canvasContainer.value.clientWidth;
    const canvasHeight = canvasContainer.value.clientHeight;
    renderer.setSize(canvasWidth, canvasHeight);
    cameraService.resize(canvasWidth, canvasHeight);
  };
  window.addEventListener("resize", resizeFunction);

  loadModel();
});

async function loadModel() {
  const gltf = await gltfService.load("/models/car/scene.gltf");
  scene.add(gltf.scene);

  const layer = new LayerService(gltf, 0.5);
}

onUnmounted(() => {
  scene.clear();
  if (renderer) renderer.dispose();
  window.removeEventListener("resize", resizeFunction);
});
</script>

<template>
  <div class="full-height" style="position: relative">
    <q-btn
      :label="cameraService.getCameraMode().value === 'perspective' ? 'p' : 'o'"
      class="camera-mode-btn"
      no-caps
      @click="cameraService.toggleCameraMode()"
    />
    <div ref="canvasContainer" class="canvas-container">
      <canvas ref="canvas" />
    </div>
  </div>
</template>

<style scoped>
.camera-mode-btn {
  position: absolute;
  top: 1em;
  left: 1em;
  z-index: 999;
  color: white;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
}
</style>
