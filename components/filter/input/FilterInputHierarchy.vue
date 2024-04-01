<script setup lang="ts">
import orderBy from "lodash/orderBy";
import difference from "lodash/difference";
import type { Suggestion } from "./FilterInputAutocomplete.vue";

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
  id: number;
  name: string | { et: string; en: string };
  value: string;
  count: number;
}

const props = defineProps<{
  title: string;
  modelValue: string[];
  rootValue: string;
  hydrationFunction: (values: string[]) => Promise<SelectedItem[]>;
  getChildren: (value: string, { page, perPage }: { page: number; perPage: number }) => Promise<[TreeNode[], number]>;
  suggestionFunction: (query: string, { page, perPage }: { page: number; perPage: number }) => Promise<Suggestion[]>;
}>();

const emit = defineEmits(["update:model-value"]);

defineExpose({
  refreshSuggestions,
});

const { locale, t } = useI18n({ useScope: "local" });

function translateName(name: string | { et: string; en: string }): string {
  if (typeof name === "string")
    return name;

  return locale.value === "et" ? name.et : name.en;
}

const numBucketsMap = ref<{ [key: string]: number }>({});
const paginationMap = ref<{ [key: string]: number }>({});

const { data: tree, refresh: refreshTree } = await useAsyncData<TreeNode[]>(
  `tree-${getCurrentInstance()?.uid}`,
  async () => {
    const res = await props.getChildren(props.rootValue, { page: 1, perPage: 15 });
    const [tree, numBuckets] = res;
    numBucketsMap.value[props.rootValue] = numBuckets;
    paginationMap.value[props.rootValue] = 1;
    return tree;
  },
);

const autocompletePage = ref(1);
const autocompletePerPage = ref(10);
const suggestions = ref<Suggestion[]>([]);
const suggestionsEnd = ref(false);

const query = ref("");
const queryDebounced = refDebounced(query, 200);
const { refresh: refreshAutocomplete, pending } = await useAsyncData<Suggestion[]>(
  `autocomplete-${getCurrentInstance()?.uid}`,
  async () => {
    const res = await props.suggestionFunction(query.value, { page: autocompletePage.value, perPage: 10 });
    if (res.length < 10)
      suggestionsEnd.value = true;

    suggestions.value = [...suggestions.value, ...res];
  },
);

const selectedItems = ref<SelectedItem[]>([]);
selectedItems.value = await props.hydrationFunction(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  if (newVal.length > 0)
    return;

  selectedItems.value = [];
  refreshTree();
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

function getNodes(node: TreeNode) {
  if (node.children.length < 1)
    return [node];

  return node.children.reduce((prev, child) => {
    prev.push(...getNodes(child));
    prev.push(node);
    return prev;
  }, [] as TreeNode[]);
}

const nodes = computed(() => {
  return (
    tree.value?.reduce((prev, node) => {
      prev.push(...getNodes(node));
      return prev;
    }, [] as TreeNode[]) ?? []
  );
});

watch(filteredSelectedValues, (newVal) => {
  if (newVal.length < props.modelValue.length)
    emit("update:model-value", newVal);

  if (difference(newVal, props.modelValue).length === 0)
    return;

  emit("update:model-value", newVal);
});

const orderedSelectedItems = computed(() => {
  return orderBy(
    filteredSelectedItems.value,
    ["count", "name"],
    ["desc", "asc"],
  );
});

async function addChildren(node: TreeNode) {
  const page = paginationMap.value[node.value] ? paginationMap.value[node.value] + 1 : 1;

  const [children, numBuckets] = await props.getChildren(node.value, { page, perPage: 15 });

  numBucketsMap.value[node.value] = numBuckets;
  paginationMap.value[node.value] = page;

  node.children = [...node.children, ...children];
  node.childrenLoaded = true;
  node.showChildren = true;

  return numBuckets ?? 0;
}

function handleRemove(index: number) {
  selectedItems.value.splice(index, 1);
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
  suggestions.value = [];
  refreshAutocomplete();
});

function handleAdd(item: Suggestion) {
  if (selectedItems.value.some(i => i.id === item.id))
    return;

  selectedItems.value.push({
    id: item.id,
    name: item.name,
    value: item.id,
    count: 0,
  });
}

function handleListEnd(isIntersecting: boolean) {
  if (!isIntersecting)
    return;
  if (pending.value)
    return;
  if (suggestionsEnd.value)
    return;

  autocompletePage.value++;
  refreshAutocomplete();
}

const input = ref();

function handleOpen(value) {
  if (!value.value)
    return;

  nextTick(() => {
    input.value.focus();
  });
}
</script>

<template>
  <VExpansionPanel
    bg-color="transparent"
    elevation="0"
    :rounded="0"
    @group:selected="handleOpen"
  >
    <VExpansionPanelTitle
      class="py-1 pl-4 pr-1 font-weight-medium text-body-2"
      style="min-height: 40px;"
    >
      {{ title }}
    </VExpansionPanelTitle>
    <div
      v-if="selectedItems.length > 0"
      class="bg-white"
    >
      <div
        v-for="(item, i) in orderedSelectedItems"
        :key="i"
        class="d-flex selected-item px-2 py-1"
        @click="handleRemove(i)"
      >
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove(i)"
          >
        </span>
        <span
          class="align-self-center d-flex text-body-2 font-weight-medium pl-2 w-100"
          style="word-break: break-word"
        >
          <slot name="selection" :item="item">
            <span class="mr-2">{{ translateName(item.name) }}</span>
            <span class="ml-auto text-medium-emphasis text-caption mr-1" style="word-break: keep-all">{{
              item.count
            }}</span>
          </slot>
        </span>
      </div>
    </div>
    <VExpansionPanelText
      color="white"
    >
      <VAutocomplete
        ref="input"
        class="mx-1 my-2"
        :model-value="null"
        :search="query"
        hide-details
        density="compact"
        :item-title="locale === 'et' ? 'name.et' : 'name.en'"
        item-value="id"
        variant="outlined"
        :placeholder="t('search')"
        persistent-placeholder
        no-filter
        return-object
        :items="suggestions ?? []"
        @update:model-value="handleAdd"
        @update:search="handleSearch"
      >
        <template #append-item>
          <div v-intersect="handleListEnd" />
        </template>
      </VAutocomplete>
      <ul class="ml-1">
        <TreeItem
          v-for="(node, index) in tree"
          :key="`tree-item-${index}`"
          :disabled="false"
          :node="node"
          :num-children="numBucketsMap[node.value] ?? 0"
          :add-children="addChildren"
          :selected-values="selectedValues"
          @select="handleSelect"
        />
      </ul>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}

.selected-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>

<i18n lang="yaml">
et:
  search: Otsi
en:
  search: Search
  </i18n>
