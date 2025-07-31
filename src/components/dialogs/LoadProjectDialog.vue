<script setup lang="ts">
import { Loading, Notify } from "quasar";
import { shallowRef } from "vue";

import { gltfService } from "@/services/gltf";
import { useLayerStore } from "@/stores";
import type { Layer } from "@/types";
import { zSprackFile } from "@/types";
import * as Rules from "@/utils/quasar";

const show = defineModel<boolean>({ required: true });

const layerStore = useLayerStore();
const file = shallowRef<File>();

async function handleLoad() {
  try {
    Loading.show({ message: "Loading project..." });

    if (!file.value) throw new Error("File is not defined");
    const fileContent = await file.value.text();
    const fileJson = JSON.parse(fileContent);
    const sprackFile = zSprackFile.parse(fileJson);

    // Convert the serialized GLB to a buffer for three.js
    const glbData = Object.values(sprackFile.glb) as number[];
    const glbArrayBuffer = new Uint8Array(glbData).buffer;
    const glbBlob = new Blob([glbArrayBuffer], { type: "model/gltf-binary" });
    const glbBlobUrl = URL.createObjectURL(glbBlob);
    const gltf = await gltfService.load(glbBlobUrl);

    layerStore.projectName = sprackFile.projectName;
    layerStore.layerWidth = sprackFile.layerWidth;
    layerStore.layerHeight = sprackFile.layerHeight;
    layerStore.gltf = gltf;
    layerStore.removeAllLayers();
    sprackFile.layers.forEach((layer: Layer) => {
      layerStore.createLayer(layer.height, layer.thickness, layer.name);
    });

    Notify.create({
      type: "positive",
      message: `Project "${sprackFile.projectName}" loaded successfully!`,
    });

    show.value = false;
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Failed to load project: ${error}`,
    });
  } finally {
    Loading.hide();
  }
}
</script>

<template>
  <q-dialog v-model="show">
    <q-card style="min-width: 40vw">
      <q-form @submit="handleLoad">
        <q-card-section class="q-mb-lg">
          <h3 class="q-mb-sm">Load Project</h3>

          <q-file
            v-model="file"
            :rules="[Rules.required()]"
            label=".sprack File"
            accept=".sprack"
            filled
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" flat v-close-popup />
          <q-btn type="submit" label="Load Project" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
