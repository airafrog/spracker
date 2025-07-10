<script setup lang="ts">
import * as THREE from "three";

import PerspectiveView from "./PerspectiveView.vue";
import OrthographicView from "./OrthographicView.vue";
import { onMounted, onUnmounted, ref } from "vue";

const cameraMode = ref<"perspective" | "orthographic">("perspective");
const scene = new THREE.Scene();

function toggleCameraMode() {
  cameraMode.value =
    cameraMode.value === "perspective" ? "orthographic" : "perspective";
}

onMounted(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // const animate = () => {
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  //   requestAnimationFrame(animate);
  // };
  // animate();
});

onUnmounted(() => {
  scene.clear();
});
</script>

<template>
  <div class="full-height" style="position: relative">
    <q-btn
      :label="cameraMode === 'perspective' ? 'p' : 'o'"
      class="camera-mode-btn"
      no-caps
      @click="toggleCameraMode"
    />
    <perspective-view v-if="cameraMode === 'perspective'" :scene="scene" />
    <orthographic-view v-if="cameraMode === 'orthographic'" :scene="scene" />
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
</style>
