<script setup lang="ts">
import { downloadZip } from "client-zip";
import { ref } from "vue";

import NewProjectDialog from "@/components/dialogs/NewProjectDialog.vue";
import LoadProjectDialog from "@/components/dialogs/LoadProjectDialog.vue";
import { exportGltf } from "@/utils/gltf";
import { downloadBlob } from "@/utils/blob";
import { useLayerStore, useModelStore } from "@/stores";
import type { SprackFile } from "@/types";
import { Loading, Notify } from "quasar";

const layerStore = useLayerStore();
const modelStore = useModelStore();
const showNewProjectDialog = ref(false);
const showLoadProjectDialog = ref(false);

async function handleSaveProject() {
  try {
    Loading.show({ message: "Saving project..." });

    if (!modelStore.model) throw new Error("No model data available to save");

    const glb = await exportGltf(modelStore.model, true);
    if (!(glb instanceof ArrayBuffer)) {
      throw new Error("GLB is not an ArrayBuffer");
    }

    const fileContent: SprackFile = {
      projectName: layerStore.projectName,
      layers: layerStore.layers,
      layerWidth: layerStore.layerWidth,
      layerHeight: layerStore.layerHeight,
      glb: new Uint8Array(glb),
    };

    const fileBlob = new Blob([JSON.stringify(fileContent)], {
      type: "application/json",
    });

    downloadBlob(fileBlob, `${layerStore.projectName}.sprack`);

    Notify.create({
      type: "positive",
      message: `Project "${layerStore.projectName}" saved successfully!`,
    });
  } catch (error) {
    console.error(error);
    Notify.create({
      type: "negative",
      message: `Failed to save project: ${error}`,
    });
  } finally {
    Loading.hide();
  }
}

async function handle3dExport(binary: boolean) {
  try {
    Loading.show({ message: "Exporting file..." });

    const output = await exportGltf(layerStore.stackGroup, binary);
    const isArrayBuffer = output instanceof ArrayBuffer;

    const blob = isArrayBuffer
      ? new Blob([output], { type: "application/octet-stream" })
      : new Blob([JSON.stringify(output)], { type: "application/json" });

    const fileName = isArrayBuffer
      ? `${layerStore.projectName}.glb`
      : `${layerStore.projectName}.gltf`;

    downloadBlob(blob, fileName);
  } catch (error) {
    console.error(error);
    Notify.create({
      type: "negative",
      message: `Failed to export file: ${error}`,
    });
  } finally {
    Loading.hide();
  }
}

async function handlePngExport() {
  try {
    Loading.show({ message: "Exporting PNG(s)..." });

    const canvasDataUrls = layerStore.layers.map(
      (layer) => layer.canvasDataUrl
    );
    const canvasBlobPromises = canvasDataUrls.map((dataUrl) =>
      fetch(dataUrl).then((response) => response.blob())
    );
    const canvasBlobs = await Promise.all(canvasBlobPromises);

    const files = canvasBlobs.map(
      (blob, index) =>
        new File([blob], `layer-${index + 1}.png`, { type: "image/png" })
    );

    const zipBlob = await downloadZip(files).blob();
    downloadBlob(zipBlob, `${layerStore.projectName}.zip`);

    Notify.create({
      type: "positive",
      message: `PNG(s) exported successfully!`,
    });
  } catch (error) {
    console.error(error);
    Notify.create({
      type: "negative",
      message: `Failed to export PNG(s): ${error}`,
    });
  } finally {
    Loading.hide();
  }
}
</script>

<template>
  <div>
    <new-project-dialog v-model="showNewProjectDialog" />
    <load-project-dialog v-model="showLoadProjectDialog" />

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
            <q-item
              clickable
              v-close-popup
              @click="showLoadProjectDialog = true"
            >
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
