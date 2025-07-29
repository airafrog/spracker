<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string;
    caption?: string;
    reverse?: boolean;
  }>(),
  {
    reverse: false,
    caption: "",
  }
);
</script>

<template>
  <div style="margin-bottom: 8em">
    <div class="row q-col-gutter-lg" :class="{ reverse: props.reverse }">
      <div class="col-12 col-md-6">
        <q-img
          :src="props.src"
          class="rounded-borders"
          :ratio="20 / 9"
          caption="hi"
        />
        <p class="text-accent">{{ props.caption }}</p>
      </div>

      <div class="col-12 col-md-6">
        <slot />
      </div>
    </div>
  </div>
</template>
