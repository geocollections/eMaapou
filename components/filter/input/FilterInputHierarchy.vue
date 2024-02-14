<template>
  <v-expansion-panel bg-color="transparent" elevation="0" :rounded="0">
    <v-expansion-panel-title
      class="py-1 pl-4 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray !important"
    >
      {{ title }}
    </v-expansion-panel-title>
    <div
      v-if="selectedItems.length > 0"
      class="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div class="my-1">
        <div
          v-for="(item, i) in orderedSelectedItems"
          :key="i"
          class="d-flex selected-item px-4"
          @click="handleRemove(i)"
        >
          <span>
            <input
              type="checkbox"
              class="checkbox"
              checked
              @click.prevent.stop="handleRemove(i)"
            />
          </span>
          <span
            class="align-self-center d-flex text-body-2 font-weight-medium pl-2 w-100"
            style="word-break: break-word"
          >
            <slot name="selection" :item="item">
              <span class="mr-2">{{ translateName(item.name) }}</span>
              <span class="ml-auto" style="word-break: keep-all">{{
                item.count
              }}</span>
            </slot>
          </span>
        </div>
      </div>
    </div>
    <v-expansion-panel-text
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <ul class="ml-2">
        <TreeItem
          v-for="(node, index) in tree"
          :key="`tree-item-${index}`"
          :disabled="false"
          :node="node"
          :add-children="addChildren"
          :selected-values="selectedValues"
          @select="handleSelect"
        />
      </ul>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import orderBy from "lodash/orderBy";
import difference from "lodash/difference";

export type TreeNode = {
  id: number;
  name: string | { et: string; en: string };
  value: string;
  leaf: boolean;
  children: TreeNode[];
  childrenLoaded: boolean;
  showChildren: boolean;
  count: number;
};

type SelectedItem = {
  id: number;
  name: string | { et: string; en: string };
  value: string;
  count: number;
};

const props = defineProps<{
  title: string;
  modelValue: string[];
  rootValue: string;
  hydrationFunction: (values: string[]) => Promise<SelectedItem[]>;
  getChildren: (value: string) => Promise<TreeNode[]>;
}>();

const emit = defineEmits(["update:model-value"]);

const { locale } = useI18n();

function translateName(name: string | { et: string; en: string }): string {
  if (typeof name === "string") {
    return name;
  }
  return locale.value === "et" ? name.et : name.en;
}

const { data: tree, refresh: refreshTree } = await useLazyAsyncData<TreeNode[]>(
  `tree-${getCurrentInstance()?.uid}`,
  async () => {
    return await props.getChildren(props.rootValue);
  },
);

const selectedItems = ref<SelectedItem[]>([]);
selectedItems.value = await props.hydrationFunction(props.modelValue);

const filteredSelectedItems = computed(() => {
  return [...selectedItems.value].filter((item) => {
    return !selectedItems.value.some((i) => item.value.includes(`${i.value}-`));
  });
});

const selectedValues = computed(() => {
  return selectedItems.value.map((item) => item.value);
});
const filteredSelectedValues = computed(() => {
  return filteredSelectedItems.value.map((item) => item.value);
});

function getNodes(node: TreeNode) {
  if (node.children.length < 1) {
    return [node];
  }
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
  if (newVal.length < props.modelValue.length) {
    emit("update:model-value", newVal);
  }
  if (difference(newVal, props.modelValue).length === 0) {
    return;
  }
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
  if (node.childrenLoaded) {
    node.showChildren = !node.showChildren;
    return;
  }

  const children = await props.getChildren(node.value);

  node.children = children;
  node.childrenLoaded = true;
  node.showChildren = true;
}

function handleRemove(index: number) {
  selectedItems.value.splice(index, 1);
}
function handleSelect(node: TreeNode) {
  if (selectedItems.value.some((item) => item.id === node.id)) {
    const index = selectedItems.value.findIndex((item) => item.id === node.id);
    if (index !== -1) {
      selectedItems.value.splice(index, 1);
    }
  } else {
    selectedItems.value.push({
      id: node.id,
      name: node.name,
      value: node.value,
      count: node.count,
    });
  }
}
async function hydrateSelected() {
  if (props.modelValue.length < 1) return;
  selectedItems.value = await props.hydrationFunction(selectedValues.value);
}
function refreshSuggestions() {
  hydrateSelected();
  refreshTree();
}

defineExpose({
  refreshSuggestions,
});
</script>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding-left: 0;
  padding-right: 0;
}
.checkbox {
  accent-color: rgb(var(--v-theme-accent));
}
</style>
