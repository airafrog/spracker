<script setup lang="ts">
import { computed } from "vue";
import { useLayerStore } from "../stores";
import type { LayerItem } from "../types";

const props = defineProps<{
  layerItem: LayerItem;
}>();

const layerStore = useLayerStore();

const isActive = computed(() => {
  const activeLayerItem = layerStore.getActiveLayerItem();
  if (!activeLayerItem) return false;
  return props.layerItem.id === activeLayerItem.id;
});

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}
</script>

<template>
  <div :class="{ active: isActive }" class="layer-card flex justify-between">
    <div>{{ props.layerItem.name }}</div>
    <div>{{ formatPercentage(props.layerItem.layerThickness) }}</div>
    <div>{{ formatPercentage(props.layerItem.layerHeight) }}</div>
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
