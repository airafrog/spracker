<script setup lang="ts">
import { ref } from "vue";

import NewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";

const showNewProjectDialog = ref(false);
</script>

<template>
  <div>
    <new-project-dialog v-model="showNewProjectDialog" />

    <q-toolbar class="bg-primary">
      <q-toolbar-title>Spracker</q-toolbar-title>

      <q-btn-dropdown stretch flat label="File" no-caps>
        <q-list>
          <q-item clickable @click="showNewProjectDialog = true">
            <q-item-section avatar>
              <q-avatar icon="add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>New Project</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="save" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Save Project</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="folder_open" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Load Project</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="download" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Export</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
  </div>
</template>
