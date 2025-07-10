<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();

const name = defineModel<string>("name", { required: true });
const height = defineModel<number>("height", { required: true });

const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();
</script>

<template>
  <div class="layer-card bg-primary">
    <div class="flex justify-between items-center">
      <q-btn icon="fa-solid fa-minus" flat @click="emit('remove', props.id)" />
      <q-input v-model="name" type="text" dense />
      <q-input v-model="height" type="number" step="0.01" dense />
    </div>
  </div>
</template>

<style scoped>
.layer-card {
  padding: 12px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
</style>
