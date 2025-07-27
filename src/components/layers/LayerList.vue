<script setup lang="ts">
import { ref } from "vue";

import EvenlySpacedLayersDialog from "@/components/dialogs/EvenlySpacedLayersDialog.vue";
import LayerSizeDialog from "@/components/dialogs/LayerSizeDialog.vue";
import LayerCard from "@/components/layers/LayerCard.vue";
import { useLayerStore } from "@/stores";

const layerStore = useLayerStore();

function handleCreateLayer() {
  layerStore.createLayer();
}

const showEvenlySpacedDialog = ref(false);
const showLayerSizeDialog = ref(false);
</script>

<template>
  <div class="full-height">
    <evenly-spaced-layers-dialog v-model="showEvenlySpacedDialog" />

    <layer-size-dialog v-model="showLayerSizeDialog" />

    <div class="column full-height">
      <div class="col-auto">
        <q-toolbar class="bg-primary">
          <q-toolbar-title class="q-mr-auto">Layers</q-toolbar-title>
          <q-btn
            flat
            icon="photo_size_select_large"
            :label="`${layerStore.layerWidth}x${layerStore.layerHeight}`"
            no-caps
            @click="showLayerSizeDialog = true"
          />
          <q-btn
            flat
            icon="fas fa-layer-group"
            @click="showEvenlySpacedDialog = true"
          />
          <q-btn flat icon="fas fa-plus" @click="handleCreateLayer" />
        </q-toolbar>
      </div>

      <div class="col">
        <q-scroll-area style="height: 100%; max-width: 100%">
          <div v-if="layerStore.layers.length" class="q-gutter-y-sm q-pa-md">
            <TransitionGroup name="list">
              <layer-card
                v-for="layer in layerStore.layers.slice().reverse()"
                :key="layer.id"
                :layer="layer"
                @click="layerStore.activeLayer = layer"
              />
            </TransitionGroup>
          </div>

          <div v-else class="q-gutter-y-sm q-pa-md">
            <q-btn
              label="Create layer"
              icon="add"
              size="lg"
              color="secondary"
              class="full-width"
              align="left"
              no-caps
              @click="handleCreateLayer"
            />
          </div>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layer-card {
  padding: 0.5em;
  border-radius: 0.5em;
  background-color: $secondary;
  cursor: pointer;
}

/* Transition styles for the layer cards */

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
