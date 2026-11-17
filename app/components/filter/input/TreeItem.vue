<script setup lang="ts">
import type { TreeNode } from "./FilterInputHierarchy.vue";

const props = defineProps<{
  node: TreeNode;
  selectedValues: string[];
  addChildren: (node: TreeNode) => Promise<number>;
  disabled?: boolean;
  hasChildren?: boolean;
}>();

const emit = defineEmits<{
  select: [node: TreeNode];
}>();

const { t } = useI18n({ useScope: "local" });

const selected = computed(() => {
  return props.selectedValues.includes(props.node.value);
});
const isIndeterminate = computed(() => {
  if (selected.value)
    return false;

  return props.selectedValues.some((value) => {
    return value.split("-").slice(0, -1).includes(props.node.id.toString());
  });
});

function formatCount(count: number): string {
  if (count < 1000)
    return count.toLocaleString();

  return `${Math.floor(count / 1000).toLocaleString()}k+`;
}

const { locale } = useI18n();
function translateName(name: string | { et: string; en: string }): string {
  if (typeof name === "string")
    return name;

  return locale.value === "et"
    ? name.et
    : name.en;
}
function select(node: TreeNode) {
  emit("select", node);
}

async function handleAddChildren(node: TreeNode) {
  node.showChildren = !node.showChildren;
  if (node.children.length > 0)
    return;
  const _numChildren = await props.addChildren(node);
  return _numChildren ?? 0;
}

async function handleAddSiblings() {
  const _numChildren = await props.addChildren(props.node);
  return _numChildren;
}
</script>

<template>
  <li class="portal-tree-node">
    <div class="portal-tree-choice">
      <UCheckbox
        :model-value="selected || disabled ? true : isIndeterminate ? 'indeterminate' : false"
        :disabled="disabled || node.count < 1"
        :label="`${translateName(node.name)} (${formatCount(node.count)})`"
        @update:model-value="select(node)"
      /><UButton
        v-if="!node.leaf"
        data-test="show-children"
        color="neutral"
        variant="ghost"
        :icon="node.showChildren ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        :aria-label="translateName(node.name)"
        @click="handleAddChildren(node)"
      />
    </div><ul v-if="node.showChildren" class="portal-tree-children">
      <TreeItem
        v-for="child in node.children"
        :key="child.value"
        data-test="tree-item"
        :disabled="selected || disabled"
        :selected-values="selectedValues"
        :node="child"
        :add-children="addChildren"
        @select="select"
      /><UButton
        v-if="!node.childrenLoaded"
        data-test="show-more"
        color="neutral"
        variant="link"
        @click="handleAddSiblings"
      >
        {{ t('more') }}
      </UButton>
    </ul>
  </li>
</template>

<i18n lang="yaml">
et:
  more: Näita rohkem
en:
  more: Load more
</i18n>
