<script setup lang="ts">
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiPageFirst,
  mdiPageLast,
} from "@mdi/js";

const props = defineProps({
  options: {
    type: Object,
    default: () => {
      return {
        page: 0,
        itemsPerPage: 0,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
      };
    },
  },
  pageCount: {
    type: Number,
    default: 0,
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [],
  },
  itemsPerPageText: {
    type: String,
    default: "Items per page",
  },
  pageSelectText: {
    type: String,
    default: `Page 0 / 0`,
  },
  goToText: {
    type: String,
    default: "Go to page",
  },
  goToButtonText: {
    type: String,
    default: "Go",
  },
  selectPageId: {
    type: String,
    default: "page-select-btn",
  },
});
const emit = defineEmits(["update:options"]);

const goToValue = ref(Number.NaN);

function setGoToValue(e) {
  if (isNaN(e))
    goToValue.value = e;
  else goToValue.value = Number.parseInt(e);
}

const goToField = ref();

function selectPage() {
  if (goToField.value.validate(true)) {
    emit("update:options", {
      ...props.options,
      page: goToValue.value,
    });
    goToValue.value = Number.NaN;
  }
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

function changeRowsPerPage(e) {
  emit("update:options", {
    ...props.options,
    itemsPerPage: e,
    page: 1,
  });
}

function pageLimitRule(value) {
  if (isNaN(value))
    return false;
  if (Number.parseInt(value) < 1)
    return false;
  if (Number.parseInt(value) > props.pageCount)
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
        :menu-props="{ bottom: true, offsetY: true, zIndex: 4 }"
        @update:model-value="changeRowsPerPage"
      />
    </div>
    <div class="justify-end my-1 d-inline-flex align-center">
      <VBtn
        :disabled="options.page === 1"
        variant="text"
        :icon="mdiPageFirst"
        @click="first"
      />
      <VBtn
        :disabled="options.page === 1"
        variant="text"
        :icon="mdiChevronLeft"
        @click="previous"
      />
      <!-- NOTE: Template activator based menu is not visible on page load. For more info look at note in BaseDataTableHeaderMenu.vue -->
      <VMenu
        location="bottom"
        :offset="10"
        :close-on-content-click="false"
        z-index="4"
      >
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            variant="text"
            class="text-no-wrap text-caption"
          >
            {{ pageSelectText }}
          </VBtn>
        </template>
        <VCard class="px-2 py-2 d-flex align-center">
          <div class="mr-2 text-no-wrap text-caption">
            {{ goToText }}
          </div>
          <VTextField
            ref="goToField"
            class="mt-0 text-caption"
            style="width: 64px"
            density="compact"
            variant="underlined"
            hide-details
            :model-value="goToValue"
            type="number"
            :rules="[pageLimitRule]"
            @keyup.enter="selectPage"
            @update:model-value="setGoToValue"
          />
          <VBtn
            :disabled="!pageLimitRule(goToValue)"
            class="px-2 ml-2"
            size="small"
            variant="text"
            @click="selectPage"
          >
            {{ goToButtonText }}
            <VIcon size="small">
              {{ mdiChevronRight }}
            </VIcon>
          </VBtn>
        </VCard>
      </VMenu>
      <VBtn
        :disabled="options.page === pageCount"
        :icon="mdiChevronRight"
        variant="text"
        @click="next"
      />
      <VBtn
        :disabled="options.page === pageCount"
        variant="text"
        :icon="mdiPageLast"
        @click="last"
      >
        <VIcon>{{ mdiPageLast }}</VIcon>
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Removes arrows from number input
/* Chrome, Safari, Edge, Opera */
// :deep(input::-webkit-outer-spin-button),
// :deep(input::-webkit-inner-spin-button) {
//   -webkit-appearance: none;
//   margin: 0;
// }

/* Firefox */
// :deep(input[type="number"]) {
//   -moz-appearance: textfield;
// }
</style>
