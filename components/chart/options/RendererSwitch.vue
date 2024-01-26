<template>
  <div>
    <div class="text-caption" v-text="$t('common.render')" />
    <v-btn-toggle
      density="compact"
      color="accent"
      :value="renderer"
      @change="$emit('update', $event)"
    >
      <v-btn
        width="65"
        size="small"
        class="text-none montserrat"
        :outlined="renderer !== 'canvas'"
        value="canvas"
      >
        Canvas
      </v-btn>
      <v-btn
        width="65"
        size="small"
        class="text-none montserrat"
        :outlined="renderer !== 'svg'"
        value="svg"
      >
        SVG
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

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
