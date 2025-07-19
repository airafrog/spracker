<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";

import LayerList from "./LayerList.vue";
import ActiveLayer from "./ActiveLayer.vue";

import { useLayerStore } from "../stores";

const props = defineProps<{
  gltf: GLTF;
}>();

const layerStore = useLayerStore();
</script>

<template>
  <div class="column full-height">
    <div class="col">
      <layer-list :gltf="props.gltf" />
    </div>

    <div v-if="layerStore.activeLayer" class="col-7">
      <active-layer :layer="layerStore.activeLayer" />
    </div>
  </div>
</template>
