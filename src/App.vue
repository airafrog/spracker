<script setup lang="ts">
import type { GLTF } from "three/examples/jsm/Addons.js";
import { useQuasar } from "quasar";
import { ref, shallowRef } from "vue";

import ShowNewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";
import OriginalScene from "@/components/scenes/OriginalScene.vue";
import StackedScene from "@/components/scenes/StackedScene.vue";
import TheToolbar from "@/components/toolbars/TheToolbar.vue";

const $q = useQuasar();
$q.dark.set(true);

const gltf = shallowRef<GLTF>();
const showNewProjectDialog = ref(false);

function handleNewProject(projectName: string, loadedGltf: GLTF) {
  gltf.value = loadedGltf;

  $q.notify({
    type: "positive",
    message: `Project "${projectName}" created successfully!`,
    position: "top",
  });
}
</script>

<template>
  <div class="window-height">
    <show-new-project-dialog
      v-model="showNewProjectDialog"
      @new-project="handleNewProject"
    />

    <div v-if="gltf" class="row full-height">
      <div class="col">
        <the-toolbar :gltf="gltf" />
      </div>

      <div class="col">
        <original-scene :gltf="gltf" />
      </div>

      <div class="col">
        <stacked-scene />
      </div>
    </div>

    <div v-else class="row q-col-gutter-x-xl full-height q-px-lg">
      <div class="col-12 col-md-6">
        <div class="q-mb-xl">
          <h2 class="q-mb-md">Spracker</h2>
          <p>Easily turn 3D models into sprite stacks!</p>
        </div>

        <div class="column q-gutter-y-md">
          <q-btn
            color="primary"
            label="New Project"
            icon="add"
            align="left"
            size="lg"
            no-caps
            @click="showNewProjectDialog = true"
          />
          <q-btn
            color="primary"
            label="Load Project"
            icon="folder_open"
            align="left"
            size="lg"
            no-caps
            @click=""
          />
        </div>
      </div>

      <div class="col-12 col-md-6"></div>
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
