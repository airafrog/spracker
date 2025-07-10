<script setup lang="ts">
import type { Layer } from "../types";

const props = defineProps<{
  layer: Layer;
}>();

const layerHeight = defineModel<number>({ required: true });

const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();
</script>

<template>
  <div class="layer-card bg-primary">
    <div class="flex justify-between items-center">
      <q-btn
        icon="fa-solid fa-minus"
        flat
        @click="emit('remove', props.layer.id)"
      />
      <p class="q-mb-none">{{ props.layer.name }}</p>
      <q-input v-model="layerHeight" type="number" step="0.01" dense />
    </div>
  </div>
</template>

<style scoped>
.layer-card {
  padding: 12px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
</style>
