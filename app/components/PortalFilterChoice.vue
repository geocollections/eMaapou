<script setup lang="ts">
defineProps<{ label: string; selected: boolean; count?: number }>();
const emit = defineEmits<{ select: [] }>();
</script>

<template>
  <UCheckbox
    :model-value="selected"
    :aria-label="label"
    class="portal-filter-choice"
    :class="{ 'portal-filter-choice-selected': selected }"
    :ui="{ wrapper: 'portal-choice-wrapper', label: 'portal-choice-label' }"
    @update:model-value="emit('select')"
  >
    <template #label>
      <span class="portal-choice-name">{{ label }}</span><span v-if="count !== undefined" class="portal-choice-count">{{ count.toLocaleString() }}</span>
    </template>
  </UCheckbox>
</template>
