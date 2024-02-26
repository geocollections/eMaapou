<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="mt-md-0" style="background-color: transparent">
    <slot name="before" />
    <slot>
      <div
        style="word-break: normal"
        class="montserrat d-flex align-center font-weight-medium text-h4 pt-0 pr-3 pb-0"
      >
        <VIcon
          v-if="icon.length > 0"
          start
          color="accent"
          size="large"
        >
          {{ icon }}
        </VIcon>
        <slot name="title">
          {{ title }}
        </slot>
      </div>
    </slot>
  </div>
</template>
