<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";
import { useQuasar } from "quasar";
import { onMounted, shallowRef } from "vue";

import OriginalScene from "./components/OriginalScene.vue";
import StackedScene from "./components/StackedScene.vue";
import TheToolbar from "./components/TheToolbar.vue";
import { gltfService } from "./services/gltf";
import { LayerService } from "./services/layer";

const $q = useQuasar();
$q.dark.set(true);

const gltf = shallowRef<GLTF>();
const layers = shallowRef<LayerService[]>([]);

onMounted(async () => {
  gltf.value = await gltfService.load("/models/car/scene.gltf");

  for (let i = 0; i < 1; i += 0.05) {
    const layer = new LayerService(gltf.value, i, 10);
    layers.value.push(layer);
  }
});
</script>

<template>
  <div class="window-height">
    <div class="row full-height">
      <div class="col">
        <the-toolbar />
      </div>

      <div class="col">
        <original-scene v-if="gltf" :gltf="gltf" :layers="layers" />
      </div>

      <div class="col">
        <stacked-scene v-if="gltf" :layers="layers" />
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
</style>
