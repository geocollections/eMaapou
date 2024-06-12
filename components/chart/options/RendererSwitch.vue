<script setup lang="ts">
import type { Renderer } from "~/types/enums";

defineProps<{ renderer: Renderer }>();

const emit = defineEmits(["update"]);
</script>

<template>
  <div>
    <div class="text-caption" v-text="$t('common.render')" />
    <VBtnToggle
      density="compact"
      color="accent"
      :model-value="renderer"
      @update:model-value="emit('update', $event)"
    >
      <VBtn
        width="65"
        size="small"
        class="text-none montserrat"
        :variant="renderer !== 'canvas' ? 'outlined' : undefined"
        value="canvas"
      >
        Canvas
      </VBtn>
      <VBtn
        width="65"
        size="small"
        class="text-none montserrat"
        :variant="renderer !== 'svg' ? 'outlined' : undefined"
        value="svg"
      >
        SVG
      </VBtn>
    </VBtnToggle>
  </div>
</template>
