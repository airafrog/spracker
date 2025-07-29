<script setup lang="ts">
import { Notify } from "quasar";
import { computed, ref } from "vue";

import { useLayerStore } from "@/stores";

const model = defineModel<boolean>({ required: true });

const layerStore = useLayerStore();
const newLayerWidth = ref(layerStore.layerWidth);
const newLayerHeight = ref(layerStore.layerHeight);

const lockAspectRatios = ref(true);
const lockedLayerDepth = computed(() =>
  Math.round(newLayerWidth.value / gltfAspectRatio.value)
);

const gltfAspectRatio = computed(() => {
  return layerStore.gltfSize.x / layerStore.gltfSize.z;
});

const layerAspectRatio = computed(() => {
  return lockAspectRatios.value
    ? lockedLayerDepth.value / newLayerHeight.value
    : newLayerWidth.value / newLayerHeight.value;
});

function handleSetLayerSize() {
  const depth = lockAspectRatios.value
    ? lockedLayerDepth.value
    : newLayerHeight.value;
  layerStore.setLayerSize(newLayerWidth.value, depth);

  Notify.create({
    icon: "fas fa-check-circle",
    message: `Set layer size to ${newLayerWidth.value}x${depth} px!`,
    color: "positive",
  });

  model.value = false;
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card>
      <q-card-section>
        <h3 class="q-mb-sm">Sprite Dimensions</h3>
        <p>Change the width and depth of all layer sprites.</p>

        <h4>GLTF</h4>
        <p>
          Dimensions:
          <span class="text-info">{{ layerStore.gltfSize.x.toFixed(4) }}</span>
          x
          <span class="text-info">{{ layerStore.gltfSize.z.toFixed(4) }}</span>
          <br />
          Aspect Ratio:
          <span class="text-info">{{ gltfAspectRatio.toFixed(4) }}</span>
        </p>

        <h4>Sprite</h4>
        <div class="row q-col-gutter-x-md q-mb-sm">
          <div class="col">
            <q-input
              v-model="newLayerWidth"
              type="number"
              label="Width"
              min="1"
              suffix="px"
              filled
            />
          </div>

          <div class="col">
            <q-input
              v-if="lockAspectRatios"
              :model-value="lockedLayerDepth"
              type="number"
              label="Depth"
              suffix="px"
              filled
              disable
            />
            <q-input
              v-else
              v-model="newLayerHeight"
              type="number"
              label="Depth"
              min="1"
              suffix="px"
              filled
            />
          </div>

          <div class="col-auto">
            <q-btn
              :icon="lockAspectRatios ? 'fas fa-lock' : 'fas fa-lock-open'"
              class="full-height"
              color="secondary"
              @click="lockAspectRatios = !lockAspectRatios"
            />
          </div>
        </div>

        <p>
          Aspect Ratio:
          <span
            :class="{
              'text-warning': layerAspectRatio !== gltfAspectRatio,
              'text-positive': layerAspectRatio === gltfAspectRatio,
            }"
          >
            {{ layerAspectRatio.toFixed(4) }}
          </span>
          <q-icon
            v-if="layerAspectRatio !== gltfAspectRatio"
            name="fas fa-warning"
            class="text-warning q-ml-sm"
            size="xs"
          >
            <q-tooltip class="bg-warning">
              The sprite aspect ratio does not match the GLTF aspect ratio.<br />This
              is often unavoidable due to the nature of converting from 3D scale
              to pixels
            </q-tooltip>
          </q-icon>
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" flat v-close-popup />
        <q-btn color="primary" label="Submit" @click="handleSetLayerSize" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
