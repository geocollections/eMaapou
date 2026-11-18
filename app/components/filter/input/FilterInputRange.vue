<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

const props = withDefaults(
  defineProps<{
    modelValue: [null | number, null | number];
    title: string;
    fieldLabels?: { min: string; max: string };
    intervalLabels?: string;
    numberType?: "int" | "float";
    step?: number;
  }>(),
  {
    fieldLabels: () => ({ min: "min", max: "max" }),
    intervalLabels: "intervals.default",
    numberType: "int",
    step: 1,
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: [null | number, null | number]];
}>();

const { t, locale } = useI18n();
const errorId = useId();
function parseInput(input: string) {
  if (isEmpty(input))
    return null;
  if (Number.isNaN(Number(input)))
    return null;

  if (props.numberType === "float")
    return Number.parseFloat(input);
  else return Number.parseInt(input);
}

const internalValue = ref<[null | number, null | number]>([...props.modelValue]);

watch(
  () => props.modelValue,
  (val, previous) => {
    if (val[0] === previous[0] && val[1] === previous[1])
      return;
    internalValue.value = [...val];
  },
);

const invalidRange = computed(() => internalValue.value[0] !== null && internalValue.value[1] !== null && internalValue.value[0] > internalValue.value[1]);
const rangeError = computed(() => locale.value === "et"
  ? "Miinimum ei tohi olla maksimumist suurem."
  : props.title === t("filters.depth")
    ? "Minimum depth must not exceed maximum depth."
    : "Minimum must not exceed maximum.");

function handleEnter() {
  if (invalidRange.value)
    return;
  if (
    props.modelValue[0] === internalValue.value[0]
    && props.modelValue[1] === internalValue.value[1]
  ) {
    return;
  }

  emit("update:modelValue", internalValue.value);
}

function handleInput(input: string, isMin: boolean) {
  if (isMin)
    internalValue.value = [parseInput(input) ?? null, internalValue.value[1]];
  else
    internalValue.value = [internalValue.value[0], parseInput(input) ?? null];
}

const valueString = computed(() => {
  if (props.modelValue[0] === null && props.modelValue[1] !== null) {
    return t(`${props.intervalLabels}.lessThanEquals`, {
      max: props.modelValue[1],
    });
  }

  if (props.modelValue[0] !== null && props.modelValue[1] === null) {
    return t(`${props.intervalLabels}.greaterThanEquals`, {
      min: props.modelValue[0],
    });
  }
  return t(`${props.intervalLabels}.between`, {
    min: props.modelValue[0],
    max: props.modelValue[1],
  });
});

function handleRemove() {
  emit("update:modelValue", [null, null]);
}

const input = ref();
const open = ref(false);
useFilterFocus(open, input);
</script>

<template>
  <PortalFilterSection
    v-model:open="open"
    :title="title"
    :selected-count="modelValue.some(value => value !== null) ? 1 : 0"
  >
    <template #selection>
      <PortalFilterChoice
        v-if="modelValue[0] !== null || modelValue[1] !== null"
        :label="valueString"
        :selected="true"
        @select="handleRemove"
      />
    </template>
    <div class="portal-filter-pair">
      <UFormField :label="fieldLabels.min" :error="invalidRange">
        <UInput
          ref="input"
          :model-value="String(internalValue[0] ?? '')"
          :aria-invalid="invalidRange"
          :aria-describedby="invalidRange ? errorId : undefined"
          :color="invalidRange ? 'error' : undefined"
          type="number"
          :step="step"
          class="portal-full-field"
          @update:model-value="handleInput(String($event ?? ''), true)"
          @keydown.enter.prevent.stop="handleEnter"
          @blur="handleEnter"
        />
      </UFormField><UFormField :label="fieldLabels.max" :error="invalidRange">
        <UInput
          :model-value="String(internalValue[1] ?? '')"
          :aria-invalid="invalidRange"
          :aria-describedby="invalidRange ? errorId : undefined"
          :color="invalidRange ? 'error' : undefined"
          type="number"
          :step="step"
          class="portal-full-field"
          @update:model-value="handleInput(String($event ?? ''), false)"
          @keydown.enter.prevent.stop="handleEnter"
          @blur="handleEnter"
        />
      </UFormField>
    </div>
    <p
      v-if="invalidRange"
      :id="errorId"
      role="alert"
      class="portal-range-error"
    >
      {{ rangeError }}
    </p>
  </PortalFilterSection>
</template>
