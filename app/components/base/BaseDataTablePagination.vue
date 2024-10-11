<script setup lang="ts">
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiPageFirst,
  mdiPageLast,
} from "@mdi/js";

const props = withDefaults(defineProps<{
  options: DataTableOptions;
  pageCount?: number;
  itemsPerPageOptions?: number[];
  itemsPerPageText?: string;
  pageSelectText?: string;
  goToText?: string;
  goToButtonText?: string;
  selectPageId?: string;
}>(), {
  pageCount: 0,
  itemsPerPageText: "Items per page",
  pageSelectText: `Page 0 / 0`,
  goToText: "Go to page",
  goToButtonText: "Go",
  selectPageId: "page-select-btn",
  itemsPerPageOptions: () => [],
});

const emit = defineEmits<{
  "update:options": [options: DataTableOptions];
}>();

const goToValue = ref(Number.NaN);

const goToField = ref();

function selectPage() {
  if (!goToField.value.validate(true))
    return;

  emit("update:options", {
    ...props.options,
    page: goToValue.value,
  });
  goToValue.value = Number.NaN;
}

function first() {
  emit("update:options", {
    ...props.options,
    page: 1,
  });
}
function next() {
  emit("update:options", {
    ...props.options,
    page: props.options.page + 1,
  });
}

function previous() {
  emit("update:options", {
    ...props.options,
    page: props.options.page - 1,
  });
}

function last() {
  emit("update:options", {
    ...props.options,
    page: props.pageCount,
  });
}

function changeRowsPerPage(e: number) {
  emit("update:options", {
    ...props.options,
    itemsPerPage: e,
    page: 1,
  });
}

function pageLimitRule(value: number) {
  if (Number.isNaN(value))
    return false;
  if (value < 1)
    return false;
  if (value > props.pageCount)
    return false;
  return true;
}
</script>

<template>
  <div class="d-inline-flex align-center mr-2 mr-sm-3">
    <div class="">
      <VSelect
        density="compact"
        hide-details
        variant="outlined"
        style="min-width: 50px"
        :items="itemsPerPageOptions"
        :model-value="options.itemsPerPage"
        :menu-props="{ location: 'bottom', zIndex: 4 }"
        @update:model-value="changeRowsPerPage"
      />
    </div>
    <div class="justify-end my-1 d-inline-flex align-center">
      <button
        :disabled="options.page === 1"
        variant="text"
        :icon="mdiPageFirst"
        @click="first"
      />
      <button
        :disabled="options.page === 1"
        variant="text"
        :icon="mdiChevronLeft"
        @click="previous"
      />
      <!-- NOTE: Template activator based menu is not visible on page load. For more info look at note in BaseDataTableHeaderMenu.vue -->
      <div
        location="bottom"
        :offset="10"
        :close-on-content-click="false"
        z-index="4"
      >
        <template #activator="{ props: activator }">
          <button
            v-bind="activator"
            variant="text"
            class="text-no-wrap text-caption"
          >
            {{ pageSelectText }}
          </button>
        </template>
        <div class="px-2 py-2 d-flex align-center">
          <div class="mr-2 text-no-wrap text-caption">
            {{ goToText }}
          </div>
          <VTextField
            ref="goToField"
            v-model.number="goToValue"
            class="mt-0 text-caption"
            style="width: 64px"
            density="compact"
            variant="underlined"
            hide-details
            type="number"
            :rules="[pageLimitRule]"
            @keyup.enter="selectPage"
          />
          <button
            :disabled="!pageLimitRule(goToValue)"
            class="px-2 ml-2"
            size="small"
            variant="text"
            @click="selectPage"
          >
            {{ goToButtonText }}
            <div size="small">
              {{ mdiChevronRight }}
            </div>
          </button>
        </div>
      </div>
      <button
        :disabled="options.page === pageCount"
        :icon="mdiChevronRight"
        variant="text"
        @click="next"
      />
      <button
        :disabled="options.page === pageCount"
        variant="text"
        :icon="mdiPageLast"
        @click="last"
      >
        <div>{{ mdiPageLast }}</div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Removes arrows from number input
/* Chrome, Safari, Edge, Opera */
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type="number"]) {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
