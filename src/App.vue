<script setup lang="ts">
import { useQuasar } from "quasar";

import TheEditor from "@/components/TheEditor.vue";
import LandingPage from "@/components/LandingPage.vue";
import { useModelStore } from "@/stores";

const $q = useQuasar();
$q.dark.set(true);

const modelStore = useModelStore();
</script>

<template>
  <div class="window-height">
    <the-editor v-if="modelStore.model" />
    <landing-page v-else />
  </div>
</template>

<style>
html,
body {
  padding: 0;
  margin: 0;
}

canvas {
  image-rendering: pixelated !important;
  image-rendering: crisp-edges !important;
}

/* Scrollbar */
/* width */
::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #0c0c0c;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #cdcdcd;
  border-radius: 0.5em;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f1f1f1;
}
</style>
