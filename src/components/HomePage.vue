<script setup lang="ts">
import { ref } from "vue";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";

const showNewProjectDialog = ref(false);
</script>

<template>
  <div class="full-height">
    <new-project-dialog v-model="showNewProjectDialog" />

    <div class="row q-col-gutter-x-xl full-height q-px-lg">
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
