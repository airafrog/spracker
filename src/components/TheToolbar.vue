<script setup lang="ts">
import TheNavbar from "./TheNavbar.vue";

import { useLayerStore } from "../stores";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { onMounted } from "vue";

const props = defineProps<{
  gltf: GLTF;
}>();

const layerStore = useLayerStore();

onMounted(() => {
  layerStore.addEvenlySpacedLayers(props.gltf, 10);
});
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <the-navbar />
    </div>
    <div class="col">
      <div v-for="layerItem in layerStore.layerItems" :key="layerItem.id">
        {{ layerItem.name }}
      </div>
    </div>
    <div class="col">Tools</div>
  </div>
</template>
