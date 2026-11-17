<script setup lang="ts" generic="T">
import orderBy from "lodash/orderBy";

export interface Suggestion<T = string> { id: T; name: string; count: number }

const props = withDefaults(defineProps<{
  title: string;
  modelValue: T[];
  perPage?: number;
  primary?: string;
  showFilter?: boolean;
  queryFunction: ({
    query,
    pagination,
    values,
  }: {
    query: string;
    pagination: { page: number; perPage: number };
    values: T[];
  }) => Promise<Suggestion<T>[]>;
  hydrationFunction: (values: T[]) => Promise<Suggestion<T>[]>;
}>(), {
  perPage: 8,
  primary: "name",
  showFilter: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: T[]];
}>();

defineExpose({
  refreshSuggestions,
});

const { t } = useI18n({ useScope: "local" });

const query = ref("");
const queryDebounced = refDebounced(query, 200);

const pagination = ref({
  page: 1,
  perPage: props.perPage,
});

const showPagination = computed(() => props.perPage > -1);

const selectedItems = shallowRef<Suggestion<T>[]>([]);

const selectedIds = computed(() => selectedItems.value.map(i => i.id));

if (props.modelValue.length > 0)
  selectedItems.value = await props.hydrationFunction(props.modelValue);

const orderedSelectedItems = computed(() => {
  return orderBy(selectedItems.value, ["count", "name"], ["desc", "asc"]);
});

const id = useId();

const { data: suggestions, refresh, status } = await useAsyncData(
  `autocomplete-${id}`,
  async () => {
    return await props.queryFunction({
      query: query.value,
      pagination: pagination.value,
      values: selectedIds.value,
    });
  },
  { immediate: false },
);

const choices = computed(() => {
  const selected = new Set(selectedIds.value);
  return [
    ...orderedSelectedItems.value,
    ...(suggestions.value ?? []).filter(item => !selected.has(item.id)),
  ];
});

watch(queryDebounced, () => {
  pagination.value.page = 1;
  refresh();
});

watch(() => props.modelValue, async (values) => {
  const hasMissing = values.some(value => !selectedItems.value.some(item => item.id === value));
  const items = hasMissing
    ? await props.hydrationFunction(values)
    : selectedItems.value;
  selectedItems.value = items.filter(item => props.modelValue.includes(item.id));
});

const isFirstPage = computed(() => pagination.value.page === 1);
const isLastPage = computed(() => {
  return (suggestions.value?.length ?? 0) < pagination.value.perPage;
});

function nextPage() {
  pagination.value.page++;
  refresh();
}

function prevPage() {
  pagination.value.page--;
  refresh();
}

function handleAdd(item: Suggestion<T>) {
  const index = selectedIds.value.indexOf(item.id);
  if (index > -1) {
    handleRemove(item.id);
    return;
  }
  selectedItems.value = [...selectedItems.value, item];
  emit("update:modelValue", selectedIds.value);
}

function handleRemove(id: T) {
  const index = selectedIds.value.indexOf(id);
  selectedItems.value = selectedItems.value.filter((_, position) => position !== index);

  emit("update:modelValue", selectedIds.value);
}

async function hydrateSelected() {
  if (props.modelValue.length < 1)
    return;
  selectedItems.value = await props.hydrationFunction(props.modelValue);
}

function refreshSuggestions() {
  hydrateSelected();
  refresh();
}

const input = ref();
const open = ref(false);
const isFirstOpen = ref(true);
useFilterFocus(open, input);
watch(open, async (value) => {
  if (!value || !isFirstOpen.value)
    return;
  await refresh();
  isFirstOpen.value = false;
});
</script>

<template>
  <PortalFilterSection
    v-model:open="open"
    :title="title"
    :selected-count="selectedItems.length"
  >
    <template #selection>
      <div v-if="!open && selectedItems.length" class="portal-filter-summary">
        <PortalFilterChoice
          v-for="item in orderedSelectedItems"
          :key="String(item.id)"
          :label="item.name"
          :count="item.count"
          :selected="true"
          @select="handleRemove(item.id)"
        />
      </div>
    </template>
    <UInput
      v-if="showFilter"
      ref="input"
      v-model="query"
      type="search"
      icon="i-lucide-search"
      :loading="status === 'pending'"
      :aria-label="`${title}: ${$t('filters.filter')}`"
      :placeholder="$t('filters.filter')"
      class="portal-full-field"
    />
    <p
      v-if="status === 'pending' && !choices.length"
      role="status"
      class="portal-supporting"
    >
      {{ t('loading') }}
    </p>
    <UButton
      v-else-if="status === 'error'"
      color="neutral"
      variant="outline"
      icon="i-lucide-refresh-cw"
      @click="refresh()"
    >
      {{ t('retry') }}
    </UButton>
    <p v-else-if="status === 'success' && !choices.length" class="portal-supporting">
      {{ t('noOptions') }}
    </p>
    <PortalFilterChoice
      v-for="item in choices"
      :key="String(item.id)"
      :label="item.name"
      :count="item.count"
      :selected="selectedIds.includes(item.id)"
      @select="handleAdd(item)"
    />
    <PortalFilterPages
      v-if="showPagination && (!isFirstPage || !isLastPage)"
      :loading="status === 'pending'"
      :page="pagination.page"
      :first="isFirstPage"
      :last="isLastPage"
      @previous="prevPage"
      @next="nextPage"
    />
  </PortalFilterSection>
</template>

<i18n lang="yaml">
et:
  noOptions: Valikuid ei leitud
  loading: Laadin valikuid…
  retry: Laadimine ebaõnnestus. Proovi uuesti
en:
  noOptions: No matching options
  loading: Loading options…
  retry: Could not load options. Try again
</i18n>
