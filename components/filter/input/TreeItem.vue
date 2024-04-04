<script setup lang="ts">
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import type { TreeNode } from "./FilterInputHierarchy.vue";

const props = defineProps<{
  node: TreeNode;
  selectedValues: string[];
  addChildren: (node: TreeNode) => Promise<number>;
  disabled?: boolean;
  hasChildren?: boolean;
}>();

const emit = defineEmits(["select"]);

const checkbox = ref<HTMLInputElement>();

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

watch(isIndeterminate, (val) => {
  if (checkbox.value)
    checkbox.value.indeterminate = val;
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

  return locale.value === "et" ? name.et : name.en;
}
function select(node: TreeNode) {
  emit("select", node);
}

const numChildren = ref(0);
async function handleAddChildren(node: TreeNode) {
  node.showChildren = !node.showChildren;
  if (node.children.length > 0)
    return;
  const _numChildren = await props.addChildren(node);
  numChildren.value = _numChildren;
  return _numChildren ?? 0;
}

async function handleAddSiblings() {
  const _numChildren = await props.addChildren(props.node);
  return _numChildren;
}
</script>

<template>
  <li style="list-style-type: none">
    <div class="d-flex align-center mt-1">
      <div style="position: relative">
        <div
          class="d-flex align-center px-1"
          :class="{ 'child-node': hasChildren }"
          style="min-height: 28px"
        >
          <input
            :id="`checkbox-${node.id}`"
            ref="checkbox"
            type="checkbox"
            :checked="selected || disabled"
            :disabled="disabled || node.count < 1"
            :indeterminate="isIndeterminate"
            @click="select(node)"
          >
          <label :for="`checkbox-${node.id}`" class="ml-2 text-body-2">
            <span class="font-weight-medium">{{
              translateName(node.name)
            }}</span>
            <span class="text-caption font-italic">
              ({{ formatCount(node.count) }})
            </span>
          </label>
        </div>
      </div>
      <VBtn
        v-if="!node.leaf"
        variant="text"
        class="text-body-2"
        slim
        :icon="node.showChildren ? mdiChevronUp : mdiChevronDown"
        height="28"
        width="28"
        style="text-transform: none"
        :disabled="node.childrenLoaded && node.children.length < 1"
        @click="handleAddChildren(node)"
      />
    </div>
    <ul v-if="node.showChildren" class="border-s ml-2">
      <div
        v-for="(child, index) in node.children"
        :key="index"
        style="position: relative"
      >
        <TreeItem
          class="ml-2"
          :disabled="selected || disabled"
          :selected-values="selectedValues"
          :node="child"
          :add-children="addChildren"
          :add-siblings="handleAddSiblings"
          :child="true"
          @select="select"
        />
      </div>
      <VBtn
        v-if="node.children.length < numChildren"
        class="ml-1 text-none text-body-2"
        variant="text"
        color="accent"
        @click="handleAddSiblings"
      >
        {{ t("more") }}
      </VBtn>
    </ul>
  </li>
</template>

<style scoped lang="scss">
.child-node {
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -8px;
    width: 8px;
    height: 0;
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
</style>

<i18n lang="yaml">
et:
  more: "...rohkem"
en:
  more: "...more"
</i18n>
