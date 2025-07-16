<script setup lang="ts">
import type { Layer } from "../types";

const props = defineProps<{
  layer: Layer;
}>();
</script>

<template>
  <q-toolbar class="bg-primary">
    <q-toolbar-title>{{ props.layer.name }}</q-toolbar-title>
  </q-toolbar>
  <div>
    <img :src="props.layer.canvasDataUrl" style="width: 100%" />
  </div>
</template>
