<script setup lang="ts">
import { Notify } from "quasar";
import * as THREE from "three";
import { ref, shallowRef } from "vue";

import { gltfService } from "@/services/gltf";
import { useLayerStore } from "@/stores";

const show = defineModel<boolean>({ required: true });

const layerStore = useLayerStore();
const file = shallowRef<File>();
const projectName = ref<string>("");

async function handleCreate() {
  if (!file.value) throw new Error("File is not defined");

  const fileUrl = URL.createObjectURL(file.value);
  const gltf = await gltfService.load(fileUrl);
  // Remove metalness
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.metalness = 0;
      child.material.roughness = 1;
      child.material.needsUpdate = true;
    }
  });
  layerStore.gltf = gltf;

  Notify.create({
    type: "positive",
    message: `Project "${projectName.value}" created successfully!`,
  });

  show.value = false;
}
</script>

<template>
  <q-dialog v-model="show">
    <q-card style="min-width: 30vw">
      <q-card-section class="q-mb-lg">
        <h3>New Project</h3>
        <p>Spracker currently only supports .glb files</p>

        <q-input
          v-model="projectName"
          label="Project Name"
          filled
          class="q-mb-md"
        />

        <q-file v-model="file" label="GLB File" accept=".glb" filled>
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" flat v-close-popup />
        <q-btn
          :disable="!projectName || !file"
          label="Create Project"
          color="primary"
          @click="handleCreate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
