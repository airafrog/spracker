<script setup lang="ts">
import LayerList from "@/components/layers/LayerList.vue";
import ActiveLayer from "@/components/layers/ActiveLayer.vue";

import { useLayerStore } from "@/stores";

const layerStore = useLayerStore();
</script>

<template>
  <div class="column full-height">
    <div class="col">
      <layer-list />
    </div>

    <div v-if="layerStore.activeLayer" class="col-7">
      <active-layer :layer="layerStore.activeLayer" />
    </div>
  </div>
</template>
