<script setup lang="ts">
import { computed } from "vue";
import { useLayerStore } from "../stores";
import type { Layer } from "../types";

const props = defineProps<{
  layer: Layer;
}>();

const layerStore = useLayerStore();

const isActive = computed(() => {
  if (!layerStore.activeLayer) return false;
  return props.layer.id === layerStore.activeLayer.id;
});

// function formatPercentage(value: number): string {
//   return `${(value * 100).toFixed(2)}%`;
// }

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
</script>

<template>
  <div :class="{ active: isActive }" class="layer-card">
    <div class="row q-col-gutter-x-sm">
      <div class="col column justify-center">
        <span>{{ props.layer.name }}</span>
      </div>

      <div class="col">
        <q-input
          :model-value="props.layer.height"
          type="number"
          step="0.01"
          min="0"
          max="1"
          label="Height"
          dense
          filled
          @update:model-value="handleHeightUpdate"
        />
      </div>

      <div class="col">
        <q-input
          :model-value="props.layer.thickness"
          type="number"
          step="0.01"
          min="0"
          max="1"
          label="Thickness"
          dense
          filled
          @update:model-value="handleThicknessUpdate"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layer-card {
  padding: 0.5em;
  border-radius: 0.5em;
  background-color: #1c313a;
  cursor: pointer;
}

.active {
  background-color: #355b6c !important;
}
</style>
