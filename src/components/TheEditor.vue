<script setup lang="ts">
import OriginalScene from "@/components/scenes/OriginalScene.vue";
import StackedScene from "@/components/scenes/StackedScene.vue";
import TheToolbar from "@/components/toolbars/TheToolbar.vue";
import TheNavbar from "@/components/toolbars/TheNavbar.vue";
</script>

<template>
  <div class="column full-height">
    <div class="col-auto">
      <the-navbar />
    </div>

    <div class="col">
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
    </div>
  </div>
</template>
