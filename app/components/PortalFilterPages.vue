<script setup lang="ts">
defineProps<{ page: number; first: boolean; last: boolean; loading?: boolean }>();
const emit = defineEmits<{ previous: []; next: [] }>();
const { locale } = useI18n();
</script>

<template>
  <nav class="portal-filter-pages" :aria-label="locale === 'et' ? 'Filtri valikud' : 'Filter options'">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-chevron-left"
      :aria-label="locale === 'et' ? 'Eelmised valikud' : 'Previous options'"
      :disabled="first || loading"
      @click="emit('previous')"
    /><span>{{ page }}</span><UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-chevron-right"
      :aria-label="locale === 'et' ? 'Järgmised valikud' : 'Next options'"
      :disabled="last || loading"
      @click="emit('next')"
    />
  </nav>
</template>
