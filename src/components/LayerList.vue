<script setup lang="ts">
import { useLayerStore } from "../stores";

import LayerCard from "./LayerCard.vue";

const layerStore = useLayerStore();
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <q-toolbar class="bg-primary">
        <q-toolbar-title>Layers</q-toolbar-title>
      </q-toolbar>
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
  </div>
</template>
