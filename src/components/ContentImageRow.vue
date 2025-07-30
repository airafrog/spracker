<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string;
    caption?: string;
    ratio?: number;
    reverse?: boolean;
  }>(),
  {
    caption: "",
    ratio: undefined,
    reverse: false,
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
          :ratio="props.ratio"
          caption="hi"
        />
        <p v-if="props.caption" class="text-accent">{{ props.caption }}</p>
      </div>

      <div class="col-12 col-md-6">
        <slot />
      </div>
    </div>
  </div>
</template>
