<script setup lang="ts">
import OriginalScene from "@/components/scenes/OriginalScene.vue";
import StackedScene from "@/components/scenes/StackedScene.vue";
import TheToolbar from "@/components/toolbars/TheToolbar.vue";
</script>

<template>
  <div class="row full-height">
    <div class="col">
      <the-toolbar />
    </div>

    <div class="col">
      <original-scene />
    </div>

    <div class="col">
      <stacked-scene />
    </div>
  </div>
</template>
