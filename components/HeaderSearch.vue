<template>
  <div class="d-sm-flex align-center my-4">
    <base-header :title="title" :icon="icon" />
    <v-divider v-if="$vuetify.display.smAndUp" vertical />
    <div class="ml-sm-3 text-h6">
      {{ $t("common.count", { count }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  count: number;
}>();
</script>
