<template>
  <v-card
    flat
    tile
    color="transparent"
    class="mt-2 mr-2 d-flex justify-end align-center"
  >
    <search-reset-button @click="$emit('click')" />
    <search-button />
  </v-card>
</template>

<script setup lang="ts"></script>
