<template>
  <div class="d-inline-flex align-center mr-2 mr-sm-3">
    <div class="">
      <v-select
        density="compact"
        hide-details
        variant="underlined"
        style="min-width: 50px"
        :items="itemsPerPageOptions"
        :model-value="options.itemsPerPage"
        :menu-props="{ bottom: true, offsetY: true, zIndex: 4 }"
        @update:modelValue="changeRowsPerPage"
      />
    </div>
    <div class="justify-end my-1 d-inline-flex align-center">
      <v-btn
        :disabled="options.page === 1"
        variant="text"
        :icon="mdiPageFirst"
        @click="first"
      >
      </v-btn>
      <v-btn
        :disabled="options.page === 1"
        variant="text"
        :icon="mdiChevronLeft"
        @click="previous"
      >
      </v-btn>
      <!-- NOTE: Template activator based menu is not visible on page load. For more info look at note in BaseDataTableHeaderMenu.vue -->
      <v-menu
        location="bottom"
        :offset="10"
        :close-on-content-click="false"
        z-index="4"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="text-no-wrap text-caption"
          >
            {{ pageSelectText }}
          </v-btn>
        </template>
        <v-card class="px-2 py-2 d-flex align-center">
          <div class="mr-2 text-no-wrap text-caption">{{ goToText }}</div>
          <v-text-field
            ref="goToField"
            class="mt-0 text-caption"
            style="width: 64px"
            density="compact"
            variant="underlined"
            hide-details
            :value="goToValue"
            type="number"
            :rules="[pageLimitRule]"
            @keyup.enter="selectPage"
            @input="setGoToValue"
          >
          </v-text-field>
          <v-btn
            :disabled="!pageLimitRule(goToValue)"
            class="px-2 ml-2"
            size="small"
            variant="text"
            @click="selectPage"
          >
            {{ goToButtonText }}
            <v-icon size="small">{{ mdiChevronRight }}</v-icon>
          </v-btn>
        </v-card>
      </v-menu>
      <v-btn
        :disabled="options.page === pageCount"
        :icon="mdiChevronRight"
        variant="text"
        @click="next"
      >
      </v-btn>
      <v-btn
        :disabled="options.page === pageCount"
        variant="text"
        :icon="mdiPageLast"
        @click="last"
      >
        <v-icon>{{ mdiPageLast }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  mdiPageFirst,
  mdiPageLast,
  mdiChevronRight,
  mdiChevronLeft,
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

const goToValue = ref(NaN);

function setGoToValue(e) {
  if (isNaN(e)) goToValue.value = e;
  else goToValue.value = parseInt(e);
}

const goToField = ref();

function selectPage() {
  if (goToField.value.validate(true)) {
    emit("update:options", {
      ...props.options,
      page: goToValue.value,
    });
    goToValue.value = NaN;
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
  if (isNaN(value)) return false;
  if (parseInt(value) < 1) return false;
  if (parseInt(value) > props.pageCount) return false;
  return true;
}
</script>

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
