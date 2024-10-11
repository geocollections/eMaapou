<script setup lang="ts">
import cloneDeep from "lodash/cloneDeep";

const props = defineProps<{
  title: string;
  modelValue: string[];
}>();

const emit = defineEmits<{
  "update:model-value": [value: string[]];
}>();

const { t } = useI18n();

const internalValue = ref("");
const panel = ref();
const selectedItems = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    selectedItems.value = newVal;
  },
  { immediate: true },
);

function handleAdd() {
  const trimmedValue = internalValue.value.trim();
  if (trimmedValue === "")
    return;
  selectedItems.value = [...selectedItems.value, trimmedValue];
  internalValue.value = "";
  emit("update:model-value", selectedItems.value);
}
function handleRemove(i: number) {
  const cloneItems = cloneDeep(selectedItems.value);
  cloneItems.splice(i, 1);
  selectedItems.value = cloneItems;

  emit("update:model-value", selectedItems.value);
}
function handleChange(i: number) {
  const cloneItems = cloneDeep(selectedItems.value);
  internalValue.value = cloneItems.splice(i, 1)[0]!; // NOTE: the item has to exist, as otherwise it would be impossible to change it
  selectedItems.value = cloneItems;
  emit("update:model-value", selectedItems.value);
  if (!panel.value.groupItem.isSelected.value)
    panel.value.groupItem.toggle();
}

const input = ref();

function handleOpen(value: { value: boolean }) {
  if (!value.value)
    return;

  nextTick(() => {
    input.value.focus();
  });
}
</script>

<template>
  <VExpansionPanel
    ref="panel"
    data-test="panel"
    bg-color="transparent"
    elevation="0"
    :rounded="0"
    @group:selected="handleOpen"
  >
    <VExpansionPanelTitle
      class="py-1 pl-4 pr-1 text-body-2 font-weight-medium"
      style="min-height: 40px;"
      data-test="title"
    >
      {{ title }}
    </VExpansionPanelTitle>
    <div
      v-if="selectedItems.length > 0"
      class="bg-white"
    >
      <div
        v-for="(item, i) in selectedItems"
        :key="i"
        class="d-flex py-1 selected-item px-2"
        data-test="selected-item"
        @click="handleChange(i)"
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
          class="align-self-center text-body-2 font-weight-medium pl-2"
          style="word-break: break-word"
        >
          <slot name="selection" :item="item">
            {{ item }}
          </slot>
        </span>
      </div>
    </div>
    <VExpansionPanelText
      class="py-2 text-right"
      color="white"
    >
      <input
        ref="input"
        v-model="internalValue"
        data-test="text-input"
        variant="outlined"
        bg-color="white"
        hide-details
        density="compact"
        :placeholder="t('filters.filter')"
        @keydown.enter="handleAdd"
      >
      <button
        class="mt-2"
        color="accent"
        variant="tonal"
        size="small"
        data-test="add-button"
        :disabled="internalValue.length < 1"
        @click="handleAdd"
      >
        {{ t("filter.add") }}
      </button>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped lang="scss">
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
  padding-top:0;
}

.selected-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
