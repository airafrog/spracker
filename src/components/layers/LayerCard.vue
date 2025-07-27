<script setup lang="ts">
import { computed } from "vue";
import { useLayerStore } from "@/stores";
import type { Layer } from "@/types";

const props = defineProps<{
  layer: Layer;
}>();

const layerStore = useLayerStore();

const isActive = computed(() => {
  if (!layerStore.activeLayer) return false;
  return props.layer.id === layerStore.activeLayer.id;
});

function handleThicknessUpdate(value: number | string | null) {
  if (value === null) return;
  if (typeof value === "string") value = parseFloat(value);
  if (value < 1 || value > 100) return;
  layerStore.setLayerThickness(props.layer.id, value);
}

function handleHeightUpdate(value: number | string | null) {
  if (value === null) return;
  if (typeof value === "string") value = parseFloat(value);
  if (value < 0 || value > 100) return;
  layerStore.setLayerHeight(props.layer.id, value);
}

function handleOrderShift(delta: number) {
  layerStore.shiftLayerOrder(props.layer.id, delta);
}
</script>

<template>
  <div :class="{ active: isActive }" class="layer-card">
    <div class="row q-col-gutter-x-sm">
      <div class="col-auto column justify-center">
        <div class="col">
          <q-btn
            icon="fas fa-caret-up"
            size="xs"
            flat
            @click="handleOrderShift(1)"
          />
        </div>
        <div class="col">
          <q-btn
            icon="fas fa-caret-down"
            size="xs"
            flat
            @click="handleOrderShift(-1)"
          />
        </div>
      </div>

      <div class="col column justify-center">
        <p class="q-ma-none">{{ props.layer.name }}</p>
      </div>

      <div class="col-auto">
        <q-input
          :model-value="props.layer.height"
          type="number"
          step="1"
          min="0"
          max="100"
          label="Height"
          suffix="%"
          dense
          filled
          @update:model-value="handleHeightUpdate"
        />
      </div>

      <div class="col-auto">
        <q-input
          :model-value="props.layer.thickness"
          type="number"
          step="1"
          min="1"
          max="100"
          label="Thickness"
          suffix="%"
          dense
          filled
          @update:model-value="handleThicknessUpdate"
        />
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

.active {
  background-color: $accent !important;
}
</style>
