<script setup lang="ts">
defineProps<{
  src: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <NuxtImg
    id="preview-img"
    class="thumbnail-image rounded"
    style="object-fit: cover"
    height="80"
    width="80"
    :src="src"
    @click="emit('click')"
  />
</template>

<style lang="scss" scoped>
.thumbnail-image {
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  border: 1px solid transparent;

  &:hover {
    cursor: pointer;
    border: 1px solid #1565C0;
  }
}
</style>
