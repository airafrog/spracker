<script setup lang="ts">
import { Notify } from "quasar";
import { ref } from "vue";

import { useLayerStore } from "@/stores";

const model = defineModel<boolean>({ required: true });

const layerStore = useLayerStore();
const layerCount = ref(10);
const layerThickness = ref(10);

function handleCreate() {
  layerStore.createEvenlySpacedLayers(layerCount.value, layerThickness.value);
  model.value = false;

  Notify.create({
    icon: "fas fa-check-circle",
    message: `Created ${layerCount.value} layers`,
    color: "positive",
  });
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card>
      <q-card-section>
        <h3>Batch Layers</h3>
        <p>
          Create numerous evenly spaced layers at once. This will
          <span class="text-negative">DELETE</span> all existing layers!
        </p>
        <p></p>
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
