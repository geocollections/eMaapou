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
      <ClientOnly>
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
      </ClientOnly>
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
      <VBtn
        variant="text"
        class="text-no-wrap text-caption"
      >
        {{ pageSelectText ?? $t('portal.pagination.pageNumber', { current: options.page, count: pageCount }) }}
        <ClientOnly>
          <VMenu
            activator="parent"
            location="bottom"
            :offset="10"
            :close-on-content-click="false"
            z-index="4"
          >
            <VCard class="px-2 py-2 d-flex align-center">
              <div class="mr-2 text-no-wrap text-caption">
                {{ goToText ?? $t('common.goTo') }}
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
              <VBtn
                :disabled="!pageLimitRule(goToValue)"
                class="px-2 ml-2"
                size="small"
                variant="text"
                @click="selectPage"
              >
                {{ goToButtonText ?? $t('common.goToBtn') }}
                <VIcon size="small">
                  {{ mdiChevronRight }}
                </VIcon>
              </VBtn>
            </VCard>
          </VMenu>
        </ClientOnly>
      </VBtn>
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
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(input[type="number"]) {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
