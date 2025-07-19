<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";

import LayerCard from "./LayerCard.vue";
import { useLayerStore } from "../stores";
import { ref } from "vue";

const props = defineProps<{
  gltf: GLTF;
}>();

const layerStore = useLayerStore();

function handleCreateLayer() {
  layerStore.createLayer(props.gltf);
}

const showCreateEvenlySpacedLayersDialog = ref(false);
const evenlySpacedLayerCount = ref(10);
const evenlySpacedLayerThickness = ref(10);
function handleCreateEvenlySpacedLayers() {
  layerStore.createEvenlySpacedLayers(
    props.gltf,
    evenlySpacedLayerCount.value,
    evenlySpacedLayerThickness.value
  );
}
</script>

<template>
  <div class="full-height">
    <q-dialog v-model="showCreateEvenlySpacedLayersDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Create Evenly Spaced Layers</div>
        </q-card-section>

        <q-card-section class="flex q-gutter-x-md">
          <q-input
            v-model="evenlySpacedLayerCount"
            type="number"
            label="Number of Layers"
            min="1"
            filled
          />
          <q-input
            v-model="evenlySpacedLayerThickness"
            type="number"
            label="Layer Thickness"
            min="1"
            suffix="%"
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" flat v-close-popup />
          <q-btn
            color="primary"
            label="Create"
            @click="handleCreateEvenlySpacedLayers"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="column full-height">
      <div class="col-auto">
        <q-toolbar class="bg-primary">
          <q-toolbar-title class="q-mr-auto">Layers</q-toolbar-title>
          <q-btn flat icon="fas fa-list" @click="" />
          <q-btn
            flat
            icon="fas fa-layer-group"
            @click="showCreateEvenlySpacedLayersDialog = true"
          />
          <q-btn flat icon="fas fa-plus" @click="handleCreateLayer" />
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
