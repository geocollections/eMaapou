<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div
    style="word-break: normal; flex-wrap: wrap"
    class="border-b bg-white px-4 w-100"
  >
    <div class="py-4 py-md-6 px-2 px-md-4">
      <div class="mb-1">
        <slot name="prepend" />
      </div>
      <div class="d-flex align-start font-weight-medium text-md-h3 text-h4">
        <slot>
          {{ title }}
        </slot>
        <slot name="titleAppend" />
      </div>
      <div>
        <slot name="sub" />
      </div>
    </div>
    <slot name="tabs" />
  </div>
</template>
