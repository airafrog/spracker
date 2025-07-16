<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";
import { useQuasar } from "quasar";
import { onMounted, shallowRef } from "vue";

import OriginalScene from "./components/OriginalScene.vue";
import StackedScene from "./components/StackedScene.vue";
import TheToolbar from "./components/TheToolbar.vue";
import { gltfService } from "./services/gltf";

const $q = useQuasar();
$q.dark.set(true);

const gltf = shallowRef<GLTF>();

onMounted(async () => {
  gltf.value = await gltfService.load("/models/car/scene.gltf");
});
</script>

<template>
  <div class="window-height">
    <div v-if="gltf" class="row full-height">
      <div class="col">
        <the-toolbar :gltf="gltf" />
      </div>

      <div class="col">
        <original-scene :gltf="gltf" />
      </div>

      <div class="col">
        <stacked-scene />
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
