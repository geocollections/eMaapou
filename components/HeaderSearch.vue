<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  count: number;
}>();
</script>

<template>
  <div class="d-sm-flex align-center my-4">
    <BaseHeader :title="title" :icon="icon" />
    <VDivider v-if="$vuetify.display.smAndUp" vertical />
    <div class="ml-sm-3 text-h6">
      {{ $t("common.count", { count }) }}
    </div>
  </div>
</template>
