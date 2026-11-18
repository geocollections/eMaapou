<script setup lang="ts">
defineProps<{ title: string; open: boolean; selectedCount?: number }>();
const emit = defineEmits<{ "update:open": [value: boolean] }>();
</script>

<template>
  <UCollapsible
    :open="open"
    class="portal-filter-section"
    @update:open="emit('update:open', $event)"
  >
    <UButton
      data-test="title"
      :aria-label="title"
      color="neutral"
      variant="ghost"
      class="portal-filter-trigger"
      :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
    >
      <span class="portal-filter-title">{{ title }}<UBadge
        v-if="selectedCount"
        color="primary"
        variant="soft"
        class="portal-filter-count"
      >{{ selectedCount }}</UBadge></span>
    </UButton>
    <div v-if="open" class="portal-filter-selection">
      <slot name="selection" />
    </div>
    <template #content>
      <div class="portal-filter-content">
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>
