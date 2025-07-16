<script setup lang="ts">
import type { LayerItem } from "../types";

const props = defineProps<{
  layerItem: LayerItem;
}>();
</script>

<template>
  <q-toolbar class="bg-primary">
    <q-toolbar-title>{{ props.layerItem.name }}</q-toolbar-title>
  </q-toolbar>
  <div>
    <img :src="props.layerItem.layer.canvasDataUrl" style="width: 100%" />
  </div>
</template>
