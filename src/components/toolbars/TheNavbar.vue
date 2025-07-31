<script setup lang="ts">
import { downloadZip } from "client-zip";
import { ref } from "vue";

import NewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";
import { gltfService } from "@/services/gltf";
import { blobService } from "@/services/blob";
import { useLayerStore } from "@/stores";

const layerStore = useLayerStore();
const showNewProjectDialog = ref(false);

async function handleSaveProject() {
  if (!layerStore.gltf) throw new Error("No GLTF data available to save");
  const glb = await gltfService.export(layerStore.gltf.scene, true);
  if (!(glb instanceof ArrayBuffer)) throw new Error("Wrong type");

  const fileContent = {
    projectName: layerStore.projectName,
    layers: layerStore.layers,
    layerWidth: layerStore.layerWidth,
    layerHeight: layerStore.layerHeight,
    glb: new Uint8Array(glb),
  };

  const blob = new Blob([JSON.stringify(fileContent)], {
    type: "application/json",
  });

  blobService.downloadBlob(blob, `${layerStore.projectName}.sprack`);
}

async function handle3dExport(binary: boolean) {
  const output = await gltfService.export(layerStore.stackGroup, binary);
  const isArrayBuffer = output instanceof ArrayBuffer;

  const blob = isArrayBuffer
    ? new Blob([output], { type: "application/octet-stream" })
    : new Blob([JSON.stringify(output)], { type: "application/json" });

  const fileName = isArrayBuffer
    ? `${layerStore.projectName}.glb`
    : `${layerStore.projectName}.gltf`;

  blobService.downloadBlob(blob, fileName);
}

async function handlePngExport() {
  const canvasDataUrls = layerStore.layers.map((layer) => layer.canvasDataUrl);
  const canvasBlobPromises = canvasDataUrls.map((dataUrl) =>
    fetch(dataUrl).then((response) => response.blob())
  );
  const canvasBlobs = await Promise.all(canvasBlobPromises);

  const files = canvasBlobs.map(
    (blob, index) =>
      new File([blob], `layer-${index + 1}.png`, { type: "image/png" })
  );

  const zipBlob = await downloadZip(files).blob();
  blobService.downloadBlob(zipBlob, `${layerStore.projectName}.zip`);
}
</script>

<template>
  <div>
    <new-project-dialog v-model="showNewProjectDialog" />

    <q-toolbar class="bg-primary">
      <h4 class="q-mr-xl">{{ layerStore.projectName }}</h4>

      <q-space />
      <q-separator dark vertical />

      <q-btn stretch flat label="File" no-caps>
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item
              clickable
              v-close-popup
              @click="showNewProjectDialog = true"
            >
              <q-item-section>New Project</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSaveProject">
              <q-item-section>Save Project</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Load Project</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable>
              <q-item-section>Export</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list dense>
                  <q-item
                    clickable
                    v-close-popup
                    @click="handle3dExport(false)"
                  >
                    <q-item-section>.gltf</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="handle3dExport(true)">
                    <q-item-section>.glb</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="handlePngExport">
                    <q-item-section>.png(s)</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-separator dark vertical />

      <q-btn
        href="https://github.com/airafrog/spracker"
        icon="fab fa-github"
        target="_blank"
        stretch
        flat
      />
    </q-toolbar>
  </div>
</template>
