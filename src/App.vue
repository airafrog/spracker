<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";
import { useQuasar } from "quasar";
import { onMounted, shallowRef } from "vue";

import OriginalScene from "./components/OriginalScene.vue";
import { gltfService } from "./services/gltf";
import { LayerService } from "./services/layer";

const $q = useQuasar();
$q.dark.set(true);

const gltf = shallowRef<GLTF>();
const layers = shallowRef<LayerService[]>([]);

onMounted(async () => {
  gltf.value = await gltfService.load("/models/car/scene.gltf");

  for (let i = 0.1; i < 1; i += 0.1) {
    const layer = new LayerService(gltf.value, i);
    layers.value.push(layer);
  }
});
</script>

<template>
  <div class="window-height">
    <div class="row full-height">
      <div class="col">
        <original-scene v-if="gltf" :gltf="gltf" />
      </div>

      <div class="col">
        <img
          v-for="(layer, index) in layers"
          :key="index"
          :src="layer.canvas.toDataURL()"
        />
      </div>

      <!-- <div class="col">
       
      </div> -->
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
