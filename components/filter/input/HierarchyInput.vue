<script setup lang="ts">
import { mdiMenuDown } from "@mdi/js";

defineProps<{
  search: string;
  items: any[];
}>();

const emit = defineEmits(["update:search", "select", "end"]);

const { t } = useI18n({ useScope: "local" });
const { $translate } = useNuxtApp();
</script>

<template>
  <div>
    <VMenu location="bottom" :close-on-content-click="false">
      <template #activator="{ props: menu }">
        <VTextField
          v-bind="menu"
          :model-value="search"
          variant="outlined"
          density="compact"
          bg-color="white"
          hide-details
          :placeholder="t('search')"
          :append-inner-icon="mdiMenuDown"
          @update:model-value="emit('update:search', $event)"
        />
      </template>
      <VList>
        <VListItem
          v-for="(item, index) in items"
          :key="index"
          @click="emit('select', item)"
        >
          <VListItemTitle>{{ $translate(item.name) }}</VListItemTitle>
        </VListItem>
        <div v-intersect="emit('end')" />
      </VList>
    </VMenu>
  </div>
</template>

<i18n lang="yaml">
et:
  search: Otsi
en:
  search: Search
  </i18n>
