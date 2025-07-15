<script setup lang="ts">
import { useQuasar } from "quasar";

import OriginalScene from "./components/OriginalScene.vue";
import TheToolbar from "./components/TheToolbar.vue";

const $q = useQuasar();
$q.dark.set(true);
</script>

<template>
  <div class="window-height">
    <div class="row full-height">
      <div class="col">
        <the-toolbar />
      </div>

      <div class="col">
        <original-scene />
      </div>

      <div class="col">
        <!-- <original-scene /> -->
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
</style>
