<script setup lang="ts">
defineProps<{
  src: string;
}>();

const emit = defineEmits(["click"]);
</script>

<template>
  <VImg
    id="preview-img"
    class="thumbnail-image rounded"
    width="100px"
    :src="src"
    @click="emit('click')"
  />
</template>

<style lang="scss" scoped>
.thumbnail-image {
  transition: all 0.2s ease-in-out;

  border: 1px solid transparent;
  &:hover {
    cursor: pointer;
    border: 1px solid #1565C0;
    box-sizing: border-box;
  }
}
</style>
