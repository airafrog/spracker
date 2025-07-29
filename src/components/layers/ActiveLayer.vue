<script setup lang="ts">
import { ref } from "vue";

import DeleteLayerDialog from "@/components/dialogs/DeleteLayerDialog.vue";
import { useLayerStore, useSettingsStore } from "@/stores";
import type { Layer } from "@/types";

const props = defineProps<{
  layer: Layer;
}>();

const layerStore = useLayerStore();
const settingsStore = useSettingsStore();
const showDeleteDialog = ref(false);

function handleThicknessUpdate(value: number | string | null) {
  if (value === null) return;
  if (typeof value === "string") value = parseFloat(value);
  layerStore.setLayerThickness(props.layer.id, value);
}

function handleHeightUpdate(value: number | string | null) {
  if (value === null) return;
  if (typeof value === "string") value = parseFloat(value);
  layerStore.setLayerHeight(props.layer.id, value);
}

function handleNameUpdate(value: string | number | null) {
  if (value === null) return;
  if (typeof value === "number") value = String(value);
  layerStore.setLayerName(props.layer.id, value);
}

function handleSetOrder(value: number | string | null) {
  if (value === null) return;
  if (typeof value === "string") value = parseInt(value);
  layerStore.setLayerOrder(props.layer.id, value);
}
</script>

<template>
  <div class="full-height">
    <delete-layer-dialog v-model="showDeleteDialog" :layer="props.layer" />

    <div class="column full-height">
      <div class="col-auto">
        <q-toolbar class="bg-primary">
          <q-input
            :model-value="props.layer.name"
            type="text"
            class="q-mr-sm"
            filled
            dense
            @update:model-value="handleNameUpdate"
          />

          <q-input
            :model-value="layerStore.getLayerIndex(props.layer.id)"
            type="number"
            style="width: 6em"
            filled
            dense
            @update:model-value="handleSetOrder"
          />

          <q-btn
            class="q-ml-auto"
            icon="fas fa-trash"
            flat
            stretch
            @click="showDeleteDialog = true"
          />
          <q-btn
            icon="fas fa-close"
            flat
            stretch
            @click="layerStore.activeLayer = null"
          />
        </q-toolbar>

        <div class="q-px-lg q-py-md">
          <p class="q-ma-none">Height:</p>
          <q-slider
            :model-value="props.layer.height"
            :step="1"
            :min="0"
            :max="100"
            :label-value="`${props.layer.height}%`"
            label
            @update:model-value="handleHeightUpdate"
          />

          <p class="q-ma-none">Thickness:</p>
          <q-slider
            :model-value="props.layer.thickness"
            :step="1"
            :min="1"
            :max="100"
            :label-value="`${props.layer.thickness}%`"
            label
            @update:model-value="handleThicknessUpdate"
          />
        </div>
      </div>

      <div class="col">
        <div
          class="flex justify-center items-center full-height"
          :style="{ 'background-color': settingsStore.pngBackgroundHex }"
        >
          <div class="full-width full-height q-pa-lg">
            <img
              :src="props.layer.canvasDataUrl"
              style="
                width: 100%;
                height: 100%;
                object-fit: contain;
                image-rendering: pixelated;
              "
            />
          </div>
        </div>

        <q-btn
          icon="fas fa-fill-drip"
          style="position: absolute; left: 0; bottom: 0"
        >
          <q-popup-proxy>
            <q-color v-model="settingsStore.pngBackgroundHex" />
          </q-popup-proxy>
        </q-btn>
      </div>
    </div>
  </div>
</template>
