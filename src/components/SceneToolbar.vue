<script setup lang="ts">
import type { Axis } from "../types";

const props = defineProps<{
  cameraMode: string;
}>();

const emit = defineEmits<{
  (e: "toggleCameraMode"): void;
  (e: "viewAxis", axis: Axis, distance: number): void;
}>();

const backgroundHex = defineModel<string>("backgroundHex", { required: true });
</script>

<template>
  <div class="toolbar-container full-width flex justify-end">
    <q-btn-dropdown icon="view_in_ar">
      <div>
        <q-btn label="+x" no-caps @click="emit('viewAxis', 'x', 10)" />
        <q-btn label="-x" no-caps @click="emit('viewAxis', 'x', -10)" />
        <q-btn label="+y" no-caps @click="emit('viewAxis', 'y', 10)" />
        <q-btn label="-y" no-caps @click="emit('viewAxis', 'y', -10)" />
        <q-btn label="+z" no-caps @click="emit('viewAxis', 'z', 10)" />
        <q-btn label="-z" no-caps @click="emit('viewAxis', 'z', -10)" />
      </div>
    </q-btn-dropdown>

    <q-btn
      :label="props.cameraMode === 'perspective' ? 'p' : 'o'"
      icon="fas fa-video"
      no-caps
      @click="emit('toggleCameraMode')"
    />

    <q-btn icon="fas fa-fill-drip">
      <q-popup-proxy>
        <q-color v-model="backgroundHex" />
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<style scoped>
.toolbar-container {
  position: absolute;
  top: 0;
  left: 0;

  z-index: 999;
}
</style>
