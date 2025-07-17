<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";

import LayerCard from "./LayerCard.vue";
import { useLayerStore } from "../stores";

const props = defineProps<{
  gltf: GLTF;
}>();

const layerStore = useLayerStore();

function handleAddLayer() {
  layerStore.addLayer(props.gltf);
}
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <q-toolbar class="bg-primary">
        <q-toolbar-title class="q-mr-auto">Layers</q-toolbar-title>
        <q-btn flat icon="fas fa-list" @click="" />
        <q-btn flat icon="fas fa-layer-group" @click="" />
        <q-btn flat icon="fas fa-plus" @click="handleAddLayer" />
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
