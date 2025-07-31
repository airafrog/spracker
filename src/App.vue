<script setup lang="ts">
import { useQuasar } from "quasar";

import TheEditor from "@/components/TheEditor.vue";
import LandingPage from "@/components/LandingPage.vue";
import { useLayerStore } from "@/stores";

const $q = useQuasar();
$q.dark.set(true);

const layerStore = useLayerStore();
</script>

<template>
  <div class="window-height">
    <the-editor v-if="layerStore.gltf" />
    <landing-page v-else />
  </div>
</template>

<style>
html,
body {
  padding: 0;
  margin: 0;
}

canvas {
  image-rendering: pixelated !important;
  image-rendering: crisp-edges !important;
}
</style>
