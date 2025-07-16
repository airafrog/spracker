<script setup lang="ts">
import { ref } from "vue";

import { useLayerStore } from "../stores";
import type { Layer } from "../types";

const props = defineProps<{
  layer: Layer;
}>();

const layerStore = useLayerStore();
const hex = ref("#23343d");

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
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <q-toolbar class="bg-primary">
        <q-input
          :model-value="props.layer.name"
          type="text"
          filled
          dense
          @update:model-value="handleNameUpdate"
        />
      </q-toolbar>

      <div class="q-px-lg q-py-md">
        <label>Height:</label>
        <q-slider
          :model-value="props.layer.height"
          :step="0.01"
          :min="0"
          :max="1"
          :label-value="`${(props.layer.height * 100).toFixed(0)}%`"
          label
          @update:model-value="handleHeightUpdate"
        />

        <label>Thickness:</label>
        <q-slider
          :model-value="props.layer.thickness"
          :step="0.01"
          :min="0"
          :max="1"
          :label-value="`${(props.layer.thickness * 100).toFixed(0)}%`"
          label
          @update:model-value="handleThicknessUpdate"
        />
      </div>
    </div>

    <div class="col">
      <div
        class="flex justify-center q-pa-lg full-height"
        :style="{ 'background-color': hex }"
      >
        <img :src="props.layer.canvasDataUrl" style="height: 100%" />
        <q-btn
          icon="fas fa-fill-drip"
          size="small"
          color="primary"
          style="position: absolute; left: 0; bottom: 0"
          round
        >
          <q-popup-proxy>
            <q-color v-model="hex" />
          </q-popup-proxy>
        </q-btn>
      </div>
    </div>
  </div>
</template>
