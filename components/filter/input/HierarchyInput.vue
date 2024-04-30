<script setup lang="ts">
import { mdiMenuDown } from "@mdi/js";

defineProps<{
  search: string;
  items: any[];
}>();

const emit = defineEmits(["update:search", "select", "end"]);

const { t } = useI18n({ useScope: "local" });
const { $translate } = useNuxtApp();
const input = ref();
const menuRef = ref();

function focus() {
  nextTick(() => {
    input.value.click();
  });
}

defineExpose({
  focus,
});

function handleEnd(isIntersecting: boolean) {
  emit("end", isIntersecting);
}
</script>

<template>
  <div>
    <VMenu
      ref="menuRef"
      location="bottom"
      max-height="400px"
      :close-on-content-click="false"
    >
      <template #activator="{ props: menu }">
        <VTextField
          v-bind="menu"
          ref="input"
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
      <VList elevation="0" class="border">
        <VListItem
          v-for="(item, index) in items"
          :key="index"
          @click="emit('select', item)"
        >
          <VListItemTitle>{{ $translate(item.name) }}</VListItemTitle>
        </VListItem>
        <div v-intersect="handleEnd" />
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
