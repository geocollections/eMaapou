<script setup lang="ts">
import { mdiClose, mdiMinus, mdiPlus } from "@mdi/js";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import type { Suggestion } from "./FilterInputAutocomplete.vue";
import type { ParameterValue } from "~/composables/useFilter";

const props = defineProps({
  queryFunction: {
    type: Function as PropType<
      ({
        query,
        pagination,
        values,
      }: {
        query: string;
        pagination: { page: number; perPage: number };
        values: ParameterValue[];
      }) => Promise<Suggestion[]>
    >,
    required: true,
  },
  disableRemove: {
    type: Boolean,
    default: false,
  },
  disableAdd: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array as PropType<ParameterValue[]>,
    required: true,
  },
  label: {
    type: String,
    default: "Parameter",
  },
});

const emit = defineEmits(["update:model-value"]);

const { t } = useI18n();
const panel = ref();

const internalValue = ref<ParameterValue[]>(cloneDeep(props.modelValue));

const pagination = ref({
  page: 1,
  perPage: 10,
});

const query = ref("");

const suggestions = ref<Suggestion[]>(await props.queryFunction({
  query: query.value,
  pagination: pagination.value,
  values: [],
})
?? []);

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = cloneDeep(newVal);
  },
);
watch(() => props.modelValue, (newVal) => {
  if (newVal.length > 0)
    return;

  internalValue.value = [];
});

function parseInput(input: string) {
  if (isEmpty(input))
    return null;
  return Number.parseFloat(input);
}

function validateFilter(filter: ParameterValue) {
  return !isNull(filter.parameter);
}

function handleValue(value: ParameterValue["value"], i: number) {
  internalValue.value[i].value = value;
}
function handleParameter(value: ParameterValue["parameter"], i: number) {
  internalValue.value[i].parameter = value;

  if (isEqual(props.modelValue, internalValue.value))
    return;
  emit("update:model-value", internalValue.value);
}

function handleAdd() {
  internalValue.value = [
    ...internalValue.value,
    { value: [null, null], parameter: null },
  ];
}
function handleRemove(i: number) {
  if (internalValue.value.length <= 1) {
    internalValue.value = [{ parameter: null, value: [null, null] }];
    emit("update:model-value", internalValue.value);
    return;
  }
  const cloneItems = cloneDeep(internalValue.value);
  cloneItems.splice(i, 1);
  internalValue.value = cloneItems;
  emit("update:model-value", internalValue.value);
}
function handleClear() {
  internalValue.value = [{ parameter: null, value: [null, null] }];
  emit("update:model-value", internalValue.value);
}
function handleEnter() {
  if (isEqual(props.modelValue, internalValue.value))
    return;
  emit("update:model-value", internalValue.value);
}
function handleFocus(focus: boolean) {
  if (focus)
    return;

  emit("update:model-value", internalValue.value);
}

function handleSearch(newQuery: string) {
  pagination.value.page = 1;
  query.value = newQuery;
}

const isAddActive = computed(() => {
  if (internalValue.value.length >= 10)
    return false;

  return !internalValue.value.some((v) => {
    return isNull(v.parameter); // || (isNull(v.value[0]) && isNull(v.value[1]))
  });
});

const validFilters = computed(() => {
  return internalValue.value.filter((v) => {
    return validateFilter(v);
  }) as ParameterValue[];
});

const isPanelOpen = computed(() => {
  return panel.value?.isActive ?? false;
});
const parameterIndex = computed(() => {
  return suggestions.value.reduce(
    (prev: any, param: any): { [K: string]: string } => {
      return { ...prev, [param.id]: param.name };
    },
    {},
  ) as { [K: string]: string };
});

function valueString(value: ParameterValue["value"]) {
  if (value[0] === null && value[1] === null)
    return t(`intervals.default.exists`);

  if (value[0] === null && value[1] !== null) {
    return t(`intervals.default.lessThanEquals`, {
      max: value[1],
    });
  }

  if (value[0] !== null && value[1] === null) {
    return t(`intervals.default.greaterThanEquals`, {
      min: value[0],
    });
  }
  return t(`intervals.default.between`, {
    min: value[0],
    max: value[1],
  });
}
</script>

<template>
  <VExpansionPanel
    ref="panel"
    bg-color="transparent"
    elevation="0"
    :rounded="0"
  >
    <VExpansionPanelTitle
      class="py-1 pl-4 pr-1 font-weight-medium border-b"
      style="min-height: 40px; "
    >
      {{ label }}
    </VExpansionPanelTitle>
    <div
      v-if="validFilters.length > 0 && !isPanelOpen"
      class="bg-white border-b"
    >
      <div
        v-for="(item, i) in validFilters"
        :key="i"
        class="d-flex py-1 selected-item pl-4 pr-2"
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
            <div>{{ parameterIndex[item.parameter] }}</div>
            <div class="font-weight-regular font-italic">
              {{ valueString(item.value) }}
            </div>
          </slot>
        </span>
      </div>
    </div>
    <VExpansionPanelText
      class="py-0"
      color="white"
    >
      <div
        v-for="(v, i) in internalValue"
        :key="i"
        class="pb-2 border-b"
      >
        <VRow no-gutters class="px-2 ">
          <VCol cols="8">
            <VAutocomplete
              :model-value="v.parameter"
              hide-details
              density="compact"
              item-title="name"
              item-value="id"
              variant="underlined"
              :placeholder="$t('filters.parameter')"
              persistent-placeholder
              :items="suggestions ?? []"
              @update:model-value="handleParameter($event, i)"
              @update:search="handleSearch"
            />
          </VCol>
          <VCol class="d-flex justify-end">
            <VBtn
              class="mt-1"
              :icon="mdiClose"
              size="x-small"
              variant="text"
              @click="handleRemove(i)"
            />
          </VCol>
        </VRow>
        <VRow no-gutters>
          <VCol cols="6" class="pl-2 pr-1">
            <VTextField
              class="pt-4"
              hide-details
              type="number"
              :value="v.value[0]"
              step="0.1"
              density="compact"
              variant="underlined"
              persistent-placeholder
              :label="$t('common.from')"
              @update:model-value="handleValue([parseInput($event), v.value[1]], i)"
              @keydown.enter="handleEnter"
              @update:focused="handleFocus"
            />
          </VCol>

          <VCol cols="6" class="pl-1 pr-2">
            <VTextField
              class="pt-4"
              hide-details
              type="number"
              :value="v.value[1]"
              step="0.1"
              persistent-placeholder
              density="compact"
              variant="underlined"
              :label="$t('common.to')"
              @update:model-value="handleValue([v.value[0], parseInput($event)], i)"
              @keydown.enter="handleEnter"
              @update:focused="handleFocus"
            />
          </VCol>
        </VRow>
      </div>
      <VRow no-gutters class="pt-2 px-4">
        <VCol cols="6">
          <VBtn
            size="small"
            variant="text"
            block
            class="text-center"
            color="accent"
            :disabled="validFilters.length < 1"
            @click="handleClear"
          >
            {{ $t('filter.clear') }}
          </VBtn>
        </VCol>

        <VCol cols="6">
          <VBtn
            size="small"
            variant="text"
            block
            class="text-center"
            color="accent"
            :disabled="!isAddActive"
            @click="handleAdd"
          >
            {{ $t('filter.add') }}
          </VBtn>
        </VCol>
      </VRow>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 8px;
}
.checkbox {
  accent-color: rgb(var(--v-theme-accent));
}
</style>
