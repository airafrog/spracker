<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  scene: THREE.Scene;
}>();

const canvas = ref<HTMLCanvasElement>();
const canvasContainer = ref<HTMLDivElement>();
let resizeFunction = () => {};

onMounted(() => {
  if (!canvas.value) throw new Error("Canvas is not defined");
  if (!canvasContainer.value) {
    throw new Error("Canvas container is not defined");
  }

  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(
    canvasContainer.value.clientWidth,
    canvasContainer.value.clientHeight
  );
  renderer.setAnimationLoop(animate);

  // ortho camera based on the canvas size
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  const aspect = width / height;
  const camera = new THREE.OrthographicCamera(
    -aspect * 5, // left
    aspect * 5, // right
    5, // top
    -5, // bottom
    0.1, // near
    1000 // far
  );
  camera.position.z = 5;

  function animate() {
    renderer.render(props.scene, camera);
  }

  resizeFunction = () => {
    if (!canvasContainer.value) return;
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;
    const aspect = width / height;
    renderer.setSize(width, height);
    camera.left = -aspect * 5;
    camera.right = aspect * 5;
    camera.top = 5;
    camera.bottom = -5;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resizeFunction);
});

onUnmounted(() => {
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
