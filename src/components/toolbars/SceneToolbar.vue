<script setup lang="ts">
import type { Axis, CameraMode } from "@/types";

const props = defineProps<{
  cameraMode: string;
  downscaleFactor: number;
}>();

const emit = defineEmits<{
  (e: "setCameraMode", mode: CameraMode): void;
  (e: "setDownscaleFactor", factor: number): void;
  (e: "viewAxis", axis: Axis, distance: number): void;
}>();

const backgroundHex = defineModel<string>("backgroundHex", { required: true });

function handleDownscaleFactorUpdate(value: string | number | null) {
  if (value === null) return;
  if (typeof value === "string") value = parseFloat(value);
  if (value < 1) value = 1;
  if (value > 8) value = 8;
  emit("setDownscaleFactor", value);
}
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
        <div class="row no-wrap q-pa-sm q-mb-md">
          <div class="column">
            <q-btn
              :color="props.cameraMode === 'perspective' ? 'primary' : ''"
              label="perspective"
              no-caps
              @click="emit('setCameraMode', 'perspective')"
            />
          </div>

          <q-separator vertical class="q-mx-sm" />

          <div class="column">
            <q-btn
              :color="props.cameraMode === 'orthographic' ? 'primary' : ''"
              label="orthographic"
              no-caps
              @click="emit('setCameraMode', 'orthographic')"
            />
          </div>
        </div>

        <div class="q-px-sm">
          <q-input
            :model-value="props.downscaleFactor"
            type="number"
            label="Downscale Factor"
            suffix="x"
            dense
            filled
            @update:model-value="handleDownscaleFactorUpdate"
          />
        </div>
      </q-menu>
    </q-btn>

    <q-btn icon="fas fa-gear">
      <q-menu anchor="bottom right" self="top right">
        <q-color v-model="backgroundHex" />
      </q-menu>
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
