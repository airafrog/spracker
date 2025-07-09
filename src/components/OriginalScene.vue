<script setup lang="ts">
import * as THREE from "three";

import PerspectiveView from "./PerspectiveView.vue";
import OrthographicView from "./OrthographicView.vue";
import { onMounted } from "vue";

const scene = new THREE.Scene();

onMounted(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    requestAnimationFrame(animate);
  };
  animate();
});
</script>

<template>
  <div class="full-height column">
    <div class="col canvas-container">
      <perspective-view :scene="scene" />
    </div>
    <div class="col canvas-container">
      <orthographic-view :scene="scene" />
    </div>
  </div>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
