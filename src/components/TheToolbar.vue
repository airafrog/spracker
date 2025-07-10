<script setup lang="ts">
import LayerCard from "./LayerCard.vue";

import { useLayerStore } from "../stores";

const layerStore = useLayerStore();
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <q-toolbar class="bg-primary">
        <h4 class="q-my-none">Spracker</h4>
      </q-toolbar>
    </div>

    <div class="col q-gutter-y-sm q-pa-md">
      <div v-for="(layer, id) in layerStore.layers" :key="id">
        <layer-card
          v-model:height="layer.height"
          v-model:name="layer.name"
          :id="layer.id"
          @remove="layerStore.removeLayer"
        />
      </div>
    </div>

    <div class="col-auto" style="background-color: #08161e">
      <div class="flex">
        <q-btn icon="fa-regular fa-plus" @click="layerStore.addLayer()" />
        <q-btn icon="fa-solid fa-layer-group" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-btn {
  width: 5em;
  height: 5em;
}
</style>
