<script setup lang="ts">
defineProps<{ page: number; first: boolean; last: boolean; loading?: boolean }>();
const emit = defineEmits<{ previous: []; next: [] }>();
const { t } = useI18n();
</script>

<template>
  <nav class="portal-filter-pages" :aria-label="t('portal.filterPagination.filterOptions')">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-chevron-left"
      :aria-label="t('portal.filterPagination.previousOptions')"
      :disabled="first || loading"
      @click="emit('previous')"
    /><span>{{ page }}</span><UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-chevron-right"
      :aria-label="t('portal.filterPagination.nextOptions')"
      :disabled="last || loading"
      @click="emit('next')"
    />
  </nav>
</template>
