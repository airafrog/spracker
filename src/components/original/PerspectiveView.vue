<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  scene: THREE.Scene;
}>();

const canvas = ref<HTMLCanvasElement>();
const canvasContainer = ref<HTMLDivElement>();
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

  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const controls = new OrbitControls(camera, renderer.domElement);

  function animate() {
    controls.update();
    renderer.render(props.scene, camera);
  }

  resizeFunction = () => {
    if (!canvasContainer.value) return;
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resizeFunction);
});

onUnmounted(() => {
  if (renderer) renderer.dispose();
  window.removeEventListener("resize", resizeFunction);
});
</script>

<template>
  <div ref="canvasContainer" class="canvas-container">
    <canvas ref="canvas" />
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
