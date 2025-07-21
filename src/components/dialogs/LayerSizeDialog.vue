<script setup lang="ts">
import { Notify } from "quasar";
import { ref } from "vue";

import { useLayerStore } from "../../stores";

const model = defineModel<boolean>({ required: true });

const layerStore = useLayerStore();
const newLayerWidth = ref(layerStore.layerWidth);
const newLayerHeight = ref(layerStore.layerHeight);

function handleSetLayerSize() {
  layerStore.setLayerSize(newLayerWidth.value, newLayerHeight.value);

  Notify.create({
    icon: "fas fa-check-circle",
    message: `Set layer size to ${newLayerWidth.value}x${newLayerHeight.value} px!`,
    color: "positive",
    position: "top",
  });

  model.value = false;
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card>
      <q-card-section>
        <div class="text-h6">Layer Size</div>
      </q-card-section>

      <q-card-section>
        <p>Change the width and depth of all layers</p>
        <div class="flex q-gutter-x-md">
          <q-input
            v-model="newLayerWidth"
            type="number"
            label="Width"
            min="1"
            filled
          />
          <q-input
            v-model="newLayerHeight"
            type="number"
            label="Length"
            min="1"
            filled
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" flat v-close-popup />
        <q-btn color="primary" label="Submit" @click="handleSetLayerSize" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
