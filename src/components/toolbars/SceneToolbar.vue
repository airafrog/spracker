<script setup lang="ts">
import type { Axis, CameraMode } from "@/types";

const props = defineProps<{
  cameraMode: string;
}>();

const emit = defineEmits<{
  (e: "setCameraMode", mode: CameraMode): void;
  (e: "viewAxis", axis: Axis, distance: number): void;
}>();

const backgroundHex = defineModel<string>("backgroundHex", { required: true });
</script>

<template>
  <div class="toolbar-container full-width flex justify-end">
    <q-btn icon="view_in_ar">
      <q-menu anchor="bottom right" self="top right">
        <q-btn label="+x" no-caps @click="emit('viewAxis', 'x', 10)" />
        <q-btn label="-x" no-caps @click="emit('viewAxis', 'x', -10)" />
        <q-btn label="+y" no-caps @click="emit('viewAxis', 'y', 10)" />
        <q-btn label="-y" no-caps @click="emit('viewAxis', 'y', -10)" />
        <q-btn label="+z" no-caps @click="emit('viewAxis', 'z', 10)" />
        <q-btn label="-z" no-caps @click="emit('viewAxis', 'z', -10)" />
      </q-menu>
    </q-btn>

    <q-btn icon="fas fa-video">
      <q-menu anchor="bottom right" self="top right">
        <q-list>
          <q-item
            :active="props.cameraMode === 'perspective'"
            clickable
            @click="emit('setCameraMode', 'perspective')"
          >
            <q-item-section>Perspective</q-item-section>
          </q-item>
          <q-item
            :active="props.cameraMode === 'orthographic'"
            clickable
            @click="emit('setCameraMode', 'orthographic')"
          >
            <q-item-section>Orthographic</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

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
