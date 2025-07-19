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
          <TransitionGroup name="list">
            <layer-card
              v-for="layer in layerStore.layers.slice().reverse()"
              :key="layer.id"
              :layer="layer"
              @click="layerStore.activeLayer = layer"
            />
          </TransitionGroup>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
