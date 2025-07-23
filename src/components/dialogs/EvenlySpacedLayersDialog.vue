<script setup lang="ts">
import { Notify } from "quasar";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { ref } from "vue";

import { useLayerStore } from "@/stores";

const model = defineModel<boolean>({ required: true });
const props = defineProps<{
  gltf: GLTF;
}>();

const layerStore = useLayerStore();
const layerCount = ref(10);
const layerThickness = ref(10);

function handleCreate() {
  layerStore.createEvenlySpacedLayers(
    props.gltf,
    layerCount.value,
    layerThickness.value
  );
  model.value = false;

  Notify.create({
    icon: "fas fa-check-circle",
    message: `Created ${layerCount.value} layers`,
    color: "positive",
    position: "top",
  });
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card>
      <q-card-section>
        <div class="text-h6">Create Evenly Spaced Layers</div>
      </q-card-section>

      <q-card-section>
        <p>This will delete all existing layers!</p>
        <div class="flex q-gutter-x-md">
          <q-input
            v-model="layerCount"
            type="number"
            label="Number of Layers"
            min="1"
            filled
          />
          <q-input
            v-model="layerThickness"
            type="number"
            label="Layer Thickness"
            min="1"
            suffix="%"
            filled
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" flat v-close-popup />
        <q-btn color="primary" label="Create" @click="handleCreate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
