<script setup lang="ts"></script>

<template>
  <VCard
    flat
    rounded="0"
    color="transparent"
    class="mt-2 mr-2 d-flex justify-end align-center"
  >
    <SearchResetButton @click="$emit('click')" />
    <SearchButton />
  </VCard>
</template>
