<script setup lang="ts">
import type { Suggestion } from "./FilterInputAutocomplete.vue";
import difference from "lodash/difference";
import orderBy from "lodash/orderBy";

export interface TreeNode {
  id: number;
  name: string | { et: string; en: string };
  value: string;
  leaf: boolean;
  children: TreeNode[];
  childrenLoaded: boolean;
  showChildren: boolean;
  count: number;
}

interface SelectedItem {
  id: string | number;
  name: string | { et: string; en: string };
  value: string;
  count: number;
}

const props = defineProps<{
  title: string;
  modelValue: string[];
  rootValue: string;
  defaultOpen?: boolean;
  hydrationFunction: (values: string[]) => Promise<SelectedItem[]>;
  getChildren: (value: string, { page, perPage }: { page: number; perPage: number }) => Promise<[TreeNode[], number]>;
  suggestionFunction: (query: string, { page, perPage }: { page: number; perPage: number }) => Promise<Suggestion[]>;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

defineExpose({
  refreshSuggestions,
});

const id = useId();
const { locale, t } = useI18n();

function translateName(name: string | { et: string; en: string }): string {
  if (typeof name === "string")
    return name;

  return locale.value === "et"
    ? name.et
    : name.en;
}

const numBucketsMap = ref<{ [key: string]: number }>({});
const paginationMap = ref<{ [key: string]: number }>({});

const {
  data: tree,
  refresh: refreshTree,
  status: treeStatus,
  error: treeError,
} = await useAsyncData<TreeNode[]>(
  `tree-${id}`,
  async () => {
    const res = await props.getChildren(props.rootValue, { page: 1, perPage: 15 });
    const [tree, numBuckets] = res;
    numBucketsMap.value[props.rootValue] = numBuckets;
    paginationMap.value[props.rootValue] = 1;
    return tree;
  },
  { deep: true, immediate: false },
);

const autocompletePage = ref(1);
const suggestions = ref<Suggestion[]>([]);
const suggestionsEnd = ref(false);

const query = ref("");
const queryDebounced = refDebounced(query, 200);

const { refresh: refreshAutocomplete, status } = await useAsyncData(
  `autocomplete-hierarchy-${id}`,
  async () => {
    const res = await props.suggestionFunction(query.value, { page: autocompletePage.value, perPage: 10 });
    if (res.length < 10)
      suggestionsEnd.value = true;

    if (autocompletePage.value > 1) {
      suggestions.value = [
        ...suggestions.value,
        ...res,
      ];
    }
    else {
      suggestions.value = res;
    }

    return suggestions.value;
  },
  {
    immediate: false,
  },
);

const selectedItems = ref<SelectedItem[]>([]);
selectedItems.value = await props.hydrationFunction(props.modelValue);

watch(() => props.modelValue, async (values) => {
  const hasMissing = values.some(value => !selectedItems.value.some(item => item.value === value));
  const items = hasMissing
    ? await props.hydrationFunction(values)
    : selectedItems.value;
  selectedItems.value = items.filter(item => props.modelValue.includes(item.value));
});

const filteredSelectedItems = computed(() => {
  return [...selectedItems.value].filter((item) => {
    return !selectedItems.value.some(i => item.value.includes(`${i.value}-`));
  });
});

const selectedValues = computed(() => {
  return selectedItems.value.map(item => item.value);
});
const filteredSelectedValues = computed(() => {
  return filteredSelectedItems.value.map(item => item.value);
});

watch(filteredSelectedValues, (newVal) => {
  if (newVal.length < props.modelValue.length)
    emit("update:modelValue", newVal);

  if (difference(newVal, props.modelValue).length === 0)
    return;

  emit("update:modelValue", newVal);
});

const orderedSelectedItems = computed(() => {
  return orderBy(
    filteredSelectedItems.value,
    ["count", "name"],
    ["desc", "asc"],
  );
});

async function addChildren(node: TreeNode) {
  const nodePage = paginationMap.value[node.value];
  const newPage = nodePage !== undefined
    ? nodePage + 1
    : 1;

  const perPage = 15;
  const [children, numBuckets] = await props.getChildren(node.value, { page: newPage, perPage });

  numBucketsMap.value[node.value] = numBuckets;
  paginationMap.value[node.value] = newPage;

  node.children = [
    ...node.children,
    ...children,
  ];
  if (numBuckets < newPage * perPage) {
    node.childrenLoaded = true;
  }
  node.showChildren = true;

  return numBuckets ?? 0;
}

function handleRemove(value: string) {
  selectedItems.value = selectedItems.value.filter(item => item.value !== value);
}
function handleSelect(node: TreeNode) {
  if (selectedItems.value.some(item => item.id === node.id)) {
    const index = selectedItems.value.findIndex(item => item.id === node.id);
    if (index !== -1)
      selectedItems.value.splice(index, 1);
  }
  else {
    selectedItems.value.push({
      id: node.id,
      name: node.name,
      value: node.value,
      count: node.count,
    });
  }
}
async function hydrateSelected() {
  if (props.modelValue.length < 1)
    return;

  selectedItems.value = await props.hydrationFunction(selectedValues.value);
}

function refreshSuggestions() {
  paginationMap.value = {};
  hydrateSelected();
  refreshTree();
}

function handleSearch(value: string) {
  query.value = value;
}

watch(queryDebounced, () => {
  autocompletePage.value = 1;
  suggestionsEnd.value = false;

  refreshAutocomplete();
});

async function handleAdd(item: Suggestion) {
  if (selectedItems.value.some(i => i.id === item.id))
    return;

  selectedItems.value.push({
    id: item.id,
    name: item.name,
    value: item.id,
    count: 0,
  });

  selectedItems.value = await props.hydrationFunction(selectedValues.value);
}

function handleListEnd(isIntersecting: boolean) {
  if (!isIntersecting)
    return;
  if (status.value === "pending")
    return;
  if (suggestionsEnd.value)
    return;

  autocompletePage.value++;
  refreshAutocomplete();
}

const open = ref(props.defaultOpen ?? false);
const visibleValues = computed(() => {
  const values = new Set<string>();
  function visit(nodes: TreeNode[]) {
    for (const node of nodes) {
      values.add(node.value);
      if (node.showChildren)
        visit(node.children);
    }
  }
  visit(tree.value ?? []);
  return values;
});
const summaryItems = computed(() => orderedSelectedItems.value.filter(item => !open.value || !visibleValues.value.has(item.value)));

const input = ref();
const isFirstOpen = ref(true);
useFilterFocus(open, input);
watch(open, async (value) => {
  if (!value || !isFirstOpen.value)
    return;
  await refreshTree();
  isFirstOpen.value = false;
}, { immediate: true });
</script>

<template>
  <PortalFilterSection
    v-model:open="open"
    :title="title"
    :selected-count="orderedSelectedItems.length"
  >
    <template #selection>
      <PortalFilterChoice
        v-for="item in summaryItems"
        :key="item.value"
        :label="translateName(item.name)"
        :count="item.count"
        :selected="true"
        @select="handleRemove(item.value)"
      />
    </template>
    <HierarchyInput
      ref="input"
      :search="query"
      :items="suggestions ?? []"
      @update:search="handleSearch"
      @select="handleAdd"
      @end="handleListEnd"
    />
    <p
      v-if="treeStatus === 'pending'"
      role="status"
      class="portal-supporting"
    >
      {{ t('portal.hierarchyFilter.loading') }}
    </p>
    <div
      v-else-if="treeError"
      role="alert"
      class="portal-supporting"
    >
      <p>{{ t('portal.hierarchyFilter.loadError') }}</p>
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        class="text-portal-link underline"
        @click="refreshTree()"
      >
        {{ t('portal.common.retry') }}
      </UButton>
    </div>
    <p v-else-if="!tree?.length" class="portal-supporting">
      {{ t('portal.hierarchyFilter.noOptions') }}
    </p>
    <ul v-else class="portal-filter-tree">
      <TreeItem
        v-for="node in tree"
        :key="node.value"
        data-test="tree-item"
        :disabled="false"
        :node="node"
        :add-children="addChildren"
        :selected-values="selectedValues"
        @select="handleSelect"
      />
    </ul>
  </PortalFilterSection>
</template>
