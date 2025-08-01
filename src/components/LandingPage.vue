<script setup lang="ts">
import { ref } from "vue";

import ContentImageRow from "@/components/ContentImageRow.vue";
import LandingScene from "@/components/scenes/LandingScene.vue";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";
import LoadProjectDialog from "@/components/dialogs/LoadProjectDialog.vue";

const showNewProjectDialog = ref(false);
const showLoadProjectDialog = ref(false);
</script>

<template>
  <div>
    <new-project-dialog v-model="showNewProjectDialog" />
    <load-project-dialog v-model="showLoadProjectDialog" />

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
                @click="showLoadProjectDialog = true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="padding: 6em 12vw">
      <content-image-row src="/images/example-car.png" class="mb-xxl" reverse>
        <h2 class="q-mb-md">What is it?</h2>
        <p>
          Spracker is a tool that generates sprite stacks from 3D models.
          Creating sprite-stacked assets can be a time consuming task. Spracker
          aims to streamline the process by providing a quick way to convert
          your existing 3D assets!
        </p>
        <p>
          Spracker is NOT an image editing tool. Stacks will often require some
          manual adjustment to achieve perfection! Think of it as a starting
          point for your creative process.
        </p>
      </content-image-row>

      <content-image-row
        src="/images/fauxton3d.png"
        :ratio="19 / 9"
        caption='"Fauxton 3D" by Gizmo199'
        class="mb-xxl"
      >
        <h2 class="q-mb-md">Why stack sprites?</h2>
        <p>
          Good question! For many developers it's an easy way to create a
          3D-style game while using a 2D game engine. However, this technique
          has a rather unique style that many find pleasing and fun! Some
          developers even create sprite stacked games by layering 3D planes in a
          3D engine.
        </p>
        <p>
          Whether or not you should use this technique is up to you! Stacking
          sprites can be a fun way to achieve a unique visual style, but can
          also add limitations to your project. It's important to weigh the pros
          and cons before deciding on your approach.
        </p>
      </content-image-row>

      <content-image-row src="/images/open-source.png" :ratio="19 / 9" reverse>
        <h2 class="q-mb-md">Open source</h2>
        <p>
          Spracker is open source and completely free to use! It is licensed
          under the GPLv3 license, which means you can use it in your personal
          and commercial projects as long as you adhere to the terms of the
          license.
        </p>
        <q-btn
          href="https://github.com/airafrog/spracker"
          color="accent"
          icon="fab fa-github"
          label="View on GitHub"
          target="_blank"
        />
      </content-image-row>
    </div>

    <q-toolbar class="bg-black">
      <q-btn
        href="https://github.com/airafrog/spracker"
        icon="fab fa-github"
        label="Spracker"
        target="_blank"
        stretch
        no-caps
        flat
      />
    </q-toolbar>
  </div>
</template>

<style scoped>
.mb-xxl {
  margin-bottom: 8em;
}
</style>
