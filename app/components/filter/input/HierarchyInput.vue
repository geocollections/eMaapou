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
    <input
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
    <div
      ref="menuRef"
      v-model="menuOpen"
      activator="parent"
      location="bottom"
      max-height="400px"
      :close-on-content-click="false"
    >
      <ul elevation="0" class="border">
        <li
          v-for="(item, index) in items"
          :key="index"
          @click="emit('select', item)"
        >
          <div>{{ $translate(item.name) }}</div>
        </li>
        <div v-intersect="handleEnd" />
      </ul>
    </div>
  </div>
</template>

<i18n lang="yaml">
et:
  search: Otsi
en:
  search: Search
  </i18n>
