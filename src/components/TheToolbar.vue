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
  layerStore.addEvenlySpacedLayers(props.gltf, 20);
});
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <the-navbar />
    </div>
    <div class="col">
      <q-scroll-area style="height: 100%; max-width: 100%">
        <div v-for="layerItem in layerStore.layerItems" :key="layerItem.id">
          {{ layerItem.name }}
        </div>
      </q-scroll-area>
    </div>
    <div class="col">
      <img
        :src="layerStore.layerItems[0].layer.canvasDataUrl"
        alt="Layer Preview"
      />
    </div>
  </div>
</template>
