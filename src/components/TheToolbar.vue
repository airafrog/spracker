<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";
import { onMounted } from "vue";

import TheNavbar from "./TheNavbar.vue";
import LayerCard from "./LayerCard.vue";
import ActiveLayer from "./ActiveLayer.vue";
import { useLayerStore } from "../stores";

const props = defineProps<{
  gltf: GLTF;
}>();

const layerStore = useLayerStore();

onMounted(() => {
  layerStore.addEvenlySpacedLayers(props.gltf, 20, 0.1);
});
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <the-navbar />
    </div>

    <div class="col">
      <q-scroll-area style="height: 100%; max-width: 100%">
        <div class="q-gutter-y-sm q-pa-md">
          <layer-card
            v-for="layer in layerStore.layers"
            :key="layer.id"
            :layer="layer"
            @click="layerStore.activeLayer = layer"
          />
        </div>
      </q-scroll-area>
    </div>

    <div v-if="layerStore.activeLayer" class="col">
      <active-layer :layer="layerStore.activeLayer" />
    </div>
  </div>
</template>
