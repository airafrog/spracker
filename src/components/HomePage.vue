<script setup lang="ts">
import { ref } from "vue";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";

const showNewProjectDialog = ref(false);
</script>

<template>
  <div class="full-height">
    <new-project-dialog v-model="showNewProjectDialog" />

    <div class="flex justify-center items-center" style="height: 80%">
      <div class="text-center">
        <h1 class="q-mb-xl">Spracker</h1>

        <div class="q-gutter-sm">
          <q-btn
            color="accent"
            label="New Project"
            icon="add"
            @click="showNewProjectDialog = true"
          />

          <q-btn
            color="primary"
            label="Load Project"
            icon="folder_open"
            @click="showNewProjectDialog = true"
          />
        </div>
      </div>
    </div>

    <div class="row reverse">
      <div class="col-12 col-md-6 q-pa-xl">
        <q-img src="/images/example-car.png" class="rounded-borders" />
      </div>

      <div class="col-12 col-md-6 q-pa-xl">
        <h2 class="q-mb-md">What is it?</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.content-area
  padding: 1em 15vw
</style>
