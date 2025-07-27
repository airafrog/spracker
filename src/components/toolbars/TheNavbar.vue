<script setup lang="ts"></script>

<template>
  <div>
    <q-toolbar class="bg-primary">
      <q-toolbar-title>Spracker</q-toolbar-title>

      <q-btn-dropdown stretch flat label="File" no-caps>
        <q-list>
          <q-item clickable>
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
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
  </div>
</template>
