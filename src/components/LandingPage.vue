<script setup lang="ts">
import { ref } from "vue";

import LandingScene from "@/components/scenes/LandingScene.vue";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";

const showNewProjectDialog = ref(false);
</script>

<template>
  <div class="full-height">
    <new-project-dialog v-model="showNewProjectDialog" />

    <div style="height: 75vh">
      <landing-scene class="absolute" style="height: 75vh" />

      <div class="absolute full-width" style="height: 75vh">
        <div class="flex justify-center items-center full-height text-center">
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
      </div>
    </div>

    <div class="q-mt-xl" style="padding: 0 10vw">
      <div class="row reverse q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-img src="/images/example-car.png" class="rounded-borders" />
        </div>

        <div class="col-12 col-md-6">
          <h2 class="q-mb-md">What is it?</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.content-area
  padding: 1em 15vw
</style>
