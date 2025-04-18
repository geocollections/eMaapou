<script setup lang="ts">
import { mdiMenuDown } from "@mdi/js";

const props = defineProps<{
  search: string;
  items: any[];
}>();

const emit = defineEmits<{
  "update:search": [value: string];
  "select": [item: any];
  "end": [isIntersecting: boolean];
}>();

const { t } = useI18n({ useScope: "local" });
const { $translate } = useNuxtApp();
const input = ref();
const menuRef = ref();
const menuOpen = ref(false);

watch(() => props.search, () => {
  if (props.search)
    menuOpen.value = true;
});

function focus() {
  nextTick(() => {
    input.value.focus();
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
    <VTextField
      ref="input"
      :model-value="search"
      variant="outlined"
      density="compact"
      bg-color="white"
      hide-details
      :placeholder="t('search')"
      :append-inner-icon="mdiMenuDown"
      @update:model-value="emit('update:search', $event)"
    >
      <ClientOnly>
        <VMenu
          ref="menuRef"
          v-model="menuOpen"
          activator="parent"
          location="bottom"
          max-height="400px"
          :close-on-content-click="false"
        >
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
      </ClientOnly>
    </VTextField>
  </div>
</template>

<i18n lang="yaml">
et:
  search: Otsi
en:
  search: Search
  </i18n>
