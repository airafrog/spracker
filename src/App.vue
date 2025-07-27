<script setup lang="ts">
import { useQuasar } from "quasar";

import TheEditor from "@/components/TheEditor.vue";
import HomePage from "@/components/HomePage.vue";
import { useLayerStore } from "@/stores";

const $q = useQuasar();
$q.dark.set(true);

const layerStore = useLayerStore();
</script>

<template>
  <div class="window-height">
    <the-editor v-if="layerStore.gltf" />
    <home-page v-else />
  </div>
</template>

<style lang="sass">
html,
body
  padding: 0
  margin: 0
</style>
