<template>
  <div
    style="word-break: normal; flex-wrap: wrap"
    class="border-b bg-grey-lighten-3 pt-4 px-4 w-100"
  >
    <div class="pb-4">
      <div class="d-flex align-start font-weight-medium text-h4">
        <slot>
          {{ title }}
        </slot>
        <edit-button />
      </div>
      <div>
        <slot name="sub" />
      </div>
    </div>
    <slot name="tabs" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
