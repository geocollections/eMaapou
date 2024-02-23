<script setup lang="ts">
import cloneDeep from "lodash/cloneDeep";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["update:model-value"]);

const internalValue = ref("");
const selectedItems = ref(props.modelValue);
watch(
  () => props.modelValue,
  (newVal) => {
    selectedItems.value = newVal;
  },
  { immediate: true },
);
function handleAdd() {
  if (internalValue.value === "")
    return;
  selectedItems.value = [...selectedItems.value, internalValue.value];
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
  internalValue.value = cloneItems.splice(i, 1)[0];
  selectedItems.value = cloneItems;
  emit("update:model-value", selectedItems.value);
  // if (!panel.value.isActive) panel.value.toggle();
}
</script>

<template>
  <v-expansion-panel
    bg-color="transparent"
    elevation="0"
    :rounded="0"
  >
    <v-expansion-panel-title
      class="py-1 pl-4 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray !important"
    >
      {{ title }}
    </v-expansion-panel-title>
    <div
      v-if="selectedItems.length > 0"
      class="bg-white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div
        v-for="(item, i) in selectedItems"
        :key="i"
        class="d-flex py-1 selected-item pl-4 pr-2"
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
    <v-expansion-panel-text
      class="py-0"
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <v-text-field
        v-model="internalValue"
        variant="underlined"
        hide-details
        density="compact"
        :placeholder="$t('filters.filter')"
        @keydown.enter="handleAdd"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped lang="scss">
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 8px;
}

.selected-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
