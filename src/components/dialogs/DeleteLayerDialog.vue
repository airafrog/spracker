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
  });
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card style="min-width: 50em">
      <q-card-section>
        <h3 class="q-mb-sm">Delete Layer</h3>
        <p>
          Are you sure you want to
          <span class="text-negative">DELETE</span> layer "<span
            class="text-info"
            >{{ props.layer.name }}</span
          >"?
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" flat v-close-popup />
        <q-btn color="negative" label="Delete" @click="handleDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
