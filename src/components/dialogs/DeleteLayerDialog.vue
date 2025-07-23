<script setup lang="ts">
import { Notify } from "quasar";

import { useLayerStore } from "@/stores";
import type { Layer } from "@/types";

const model = defineModel<boolean>({ required: true });
const props = defineProps<{
  layer: Layer;
}>();

const layerStore = useLayerStore();

function handleDelete() {
  layerStore.removeLayer(props.layer.id);
  model.value = false;

  Notify.create({
    icon: "fas fa-check-circle",
    message: `Deleted layer "${props.layer.name}"`,
    color: "positive",
    position: "top",
  });
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete Layer</div>
      </q-card-section>

      <q-card-section>
        <p>Are you sure you want to delete "{{ props.layer.name }}"?</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" flat v-close-popup />
        <q-btn color="negative" label="Delete" @click="handleDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
