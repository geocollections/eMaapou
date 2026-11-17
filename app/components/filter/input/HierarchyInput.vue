<script setup lang="ts">
const props = defineProps<{ search: string; items: any[] }>();
const emit = defineEmits<{ "update:search": [value: string]; "select": [item: any]; "end": [value: boolean] }>();
const { locale } = useI18n();
const { $translate } = useNuxtApp();
const input = ref();
const open = ref(false);
watch(() => props.search, value => open.value = !!value);
function focus() {
  nextTick(() => input.value?.inputRef?.focus());
}
defineExpose({ focus });
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ align: 'start' }"
    :ui="{ content: 'portal-hierarchy-menu' }"
  >
    <template #anchor>
      <UInput
        ref="input"
        type="text"
        :model-value="search"
        :aria-label="locale === 'et' ? 'Otsi hierarhiast' : 'Search hierarchy'"
        :placeholder="locale === 'et' ? 'Otsi' : 'Search'"
        trailing-icon="i-lucide-chevron-down"
        class="portal-full-field"
        @update:model-value="emit('update:search', String($event ?? ''))"
      />
    </template>
    <template #content>
      <div class="portal-hierarchy-options">
        <UButton
          v-for="item in items"
          :key="String(item.id)"
          color="neutral"
          variant="ghost"
          class="portal-hierarchy-option"
          @click="emit('select', item)"
        >
          {{ $translate(item.name) }}
        </UButton><UButton
          v-if="items.length"
          color="neutral"
          variant="link"
          @click="emit('end', true)"
        >
          {{ locale === 'et' ? 'Näita rohkem' : 'Load more' }}
        </UButton>
      </div>
    </template>
  </UPopover>
</template>
