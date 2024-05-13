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
        class="d-flex align-center px-3"
      >
        <VIcon
          v-if="icon.length > 0"
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
