<script setup lang="ts">
import { Notify } from "quasar";
import { ref } from "vue";

import { useLayerStore, useModelStore } from "@/stores";
import * as Rules from "@/utils/quasar";

const model = defineModel<boolean>({ required: true });

const layerStore = useLayerStore();
const modelStore = useModelStore();
const layerCount = ref(10);
const layerThickness = ref(10);

function handleCreate() {
  if (!modelStore.model) return;

  layerStore.createEvenlySpacedLayers(
    modelStore.model,
    modelStore.modelBox,
    modelStore.modelSize,
    layerCount.value,
    layerThickness.value
  );
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
    <q-card style="min-width: 40vw">
      <q-form @submit="handleCreate">
        <q-card-section>
          <h3 class="q-mb-sm">Batch Layers</h3>
          <p>
            Create numerous evenly spaced layers at once. This will
            <span class="text-negative">DELETE</span> all existing layers!
          </p>

          <div class="flex q-gutter-x-md">
            <q-input
              v-model.number="layerCount"
              :rules="[
                Rules.required(),
                Rules.gt(0),
                Rules.lt(9999),
                Rules.int(),
              ]"
              type="number"
              label="Number of Layers"
              filled
            />
            <q-input
              v-model.number="layerThickness"
              :rules="[Rules.required(), Rules.gt(0), Rules.lte(100)]"
              type="number"
              label="Layer Thickness"
              suffix="%"
              filled
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" flat v-close-popup />
          <q-btn type="submit" color="primary" label="Create" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
