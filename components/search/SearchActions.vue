<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <div
    class="mt-2 mr-2 d-flex justify-end align-center"
  >
    <SearchResetButton @click="$emit('click')" />
    <SearchButton />
  </div>
</template>
