<script setup lang="ts">
import { Renderer } from "~/types/enums";

defineProps({
  renderer: {
    type: String,
    default: Renderer.Canvas,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="text-caption" v-text="$t('common.render')" />
    <v-btn-toggle
      density="compact"
      color="accent"
      :model-value="renderer"
      @update:model-value="$emit('update', $event)"
    >
      <v-btn
        width="65"
        size="small"
        class="text-none montserrat"
        :variant="renderer !== 'canvas' && 'outlined'"
        value="canvas"
      >
        Canvas
      </v-btn>
      <v-btn
        width="65"
        size="small"
        class="text-none montserrat"
        :variant="renderer !== 'svg' && 'outlined'"
        value="svg"
      >
        SVG
      </v-btn>
    </v-btn-toggle>
  </div>
</template>
