<script setup lang="ts">
import { Loading, Notify } from "quasar";
import { shallowRef } from "vue";

import { gltfService } from "@/services/gltf";
import { useLayerStore } from "@/stores";
import * as Rules from "@/utils/quasar";
import type { Layer } from "@/types";

const show = defineModel<boolean>({ required: true });

const layerStore = useLayerStore();
const file = shallowRef<File>();

async function handleLoad() {
  try {
    Loading.show({ message: "Loading project..." });

    if (!file.value) throw new Error("File is not defined");
    const fileContent = await file.value.text();
    const fileJson = JSON.parse(fileContent);

    if (!("projectName" in fileJson))
      throw new Error("File missing project name");
    if (!("glb" in fileJson)) throw new Error("File missing glb data");
    if (!("layers" in fileJson)) throw new Error("File missing layer data");
    if (!("layerWidth" in fileJson))
      throw new Error("File missing layer width");
    if (!("layerHeight" in fileJson))
      throw new Error("File missing layer height");

    // Convert the serialized Uint8Array back to proper binary data
    const glbData = Object.values(fileJson.glb) as number[];
    const glbArrayBuffer = new Uint8Array(glbData).buffer;
    const glbBlob = new Blob([glbArrayBuffer], { type: "model/gltf-binary" });
    const glbBlobUrl = URL.createObjectURL(glbBlob);
    const gltf = await gltfService.load(glbBlobUrl);

    layerStore.gltf = gltf;
    layerStore.layerWidth = fileJson.layerWidth;
    layerStore.layerHeight = fileJson.layerHeight;
    fileJson.layers.forEach((layer: Layer) => {
      layerStore.createLayer(layer.height, layer.thickness, layer.name);
    });
    layerStore.projectName = fileJson.projectName;

    Notify.create({
      type: "positive",
      message: `Project "${fileJson.projectName}" loaded successfully!`,
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
