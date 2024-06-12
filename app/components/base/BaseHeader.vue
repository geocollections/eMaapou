<script setup lang="ts">
defineProps<{
  title?: string;
  icon?: string;
}>();
</script>

<template>
  <div class="mt-md-0" style="background-color: transparent">
    <slot name="before" />
    <slot>
      <div
        style="word-break: normal"
        class="d-flex align-center px-3"
      >
        <VIcon
          v-if="icon"
          start
          color="accent"
          size="x-large"
        >
          {{ icon }}
        </VIcon>
        <span
          class="montserrat font-weight-medium text-h4"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </span>
      </div>
    </slot>
  </div>
</template>
