<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref } from "vue";

import { CameraService } from "@/services/camera";
import { gltfService } from "@/services/gltf";

const DOWNSCALE_AMOUNT = 5;
const scene = new THREE.Scene();
const canvas = ref<HTMLCanvasElement>();
const cameraService = new CameraService();
let gltfScene: THREE.Group;
let renderer: THREE.WebGLRenderer;
let resizeFunction = () => {};

onMounted(async () => {
  if (!canvas.value) throw new Error("Canvas is not defined");
  const canvasWidth = canvas.value.clientWidth;
  const canvasHeight = canvas.value.clientHeight;

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(
    canvasWidth / DOWNSCALE_AMOUNT,
    canvasHeight / DOWNSCALE_AMOUNT
  );
  renderer.setAnimationLoop(animate);

  canvas.value.style.width = "100%";
  canvas.value.style.height = "100%";

  cameraService.resize(canvasWidth, canvasHeight);
  cameraService.camera.position.set(0, 4, 2);
  cameraService.camera.lookAt(0, 0, 0);

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);

  const gltf = await gltfService.load("/models/car-stack.glb");
  gltfScene = gltf.scene;
  scene.add(gltfScene);

  scene.background = new THREE.Color("#261e26");

  function animate() {
    cameraService.animate();
    if (gltfScene) gltfScene.rotation.y -= 0.005;
    renderer.render(scene, cameraService.camera);
  }

  resizeFunction = () => {
    if (!canvas.value) return;
    const canvasWidth = canvas.value.clientWidth;
    const canvasHeight = canvas.value.clientHeight;
    renderer.setSize(
      canvasWidth / DOWNSCALE_AMOUNT,
      canvasHeight / DOWNSCALE_AMOUNT
    );
    cameraService.resize(canvasWidth, canvasHeight);
  };
  window.addEventListener("resize", resizeFunction);
});

onUnmounted(() => {
  scene.clear();
  if (renderer) renderer.dispose();
  window.removeEventListener("resize", resizeFunction);
});
</script>

<template>
  <div class="absolute full-width">
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
