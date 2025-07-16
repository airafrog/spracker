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
  layerStore.addEvenlySpacedLayers(props.gltf, 30);
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
            v-for="layerItem in layerStore.layerItems"
            :key="layerItem.id"
            :layerItem="layerItem"
            @click="layerStore.setActiveLayerItem(layerItem.id)"
          />
        </div>
      </q-scroll-area>
    </div>

    <div v-if="layerStore.activeLayerItem" class="col">
      <active-layer :layerItem="layerStore.activeLayerItem" />
    </div>
  </div>
</template>
