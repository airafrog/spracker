<script setup lang="ts">
import { useQuasar } from "quasar";

import OriginalScene from "./components/OriginalScene.vue";
import TheToolbar from "./components/TheToolbar.vue";

const $q = useQuasar();
$q.dark.set(true);
</script>

<template>
  <div class="window-height">
    <div class="column full-height">
      <div class="col-auto">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>SPRACKER</q-toolbar-title>
        </q-toolbar>
      </div>
      <div class="col">
        <div class="row full-height">
          <div class="col-auto">
            <the-toolbar />
          </div>
          <div class="col">
            <original-scene />
          </div>
          <div class="col"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #2f3127;
}
</style>
