<script setup lang="ts">
const props = defineProps<{
  cameraMode: string;
}>();

const emit = defineEmits<{
  (e: "toggleCameraMode"): void;
}>();

const backgroundHex = defineModel<string>("backgroundHex", { required: true });
</script>

<template>
  <div class="toolbar-container">
    <q-btn
      :label="props.cameraMode === 'perspective' ? 'p' : 'o'"
      icon="fas fa-video"
      no-caps
      @click="emit('toggleCameraMode')"
    />
    <q-btn icon="fas fa-fill-drip">
      <q-popup-proxy>
        <q-color v-model="backgroundHex" />
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<style scoped>
.toolbar-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>
