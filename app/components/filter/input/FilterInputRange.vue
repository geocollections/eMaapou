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

const { t } = useI18n();
function parseInput(input: string) {
  if (isEmpty(input))
    return null;
  if (Number.isNaN(Number(input)))
    return null;

  if (props.numberType === "float")
    return Number.parseFloat(input);
  else return Number.parseInt(input);
}

const internalValue = ref<[null | number, null | number]>([null, null]);

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  },
);

function handleEnter() {
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
    internalValue.value = [parseInput(input) ?? null, props.modelValue[1]];
  else
    internalValue.value = [props.modelValue[0], parseInput(input) ?? null];
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
  <PortalFilterSection v-model:open="open" :title="title">
    <template #selection>
      <PortalFilterChoice
        v-if="modelValue[0] !== null || modelValue[1] !== null"
        :label="valueString"
        :selected="true"
        @select="handleRemove"
      />
    </template>
    <div class="portal-filter-pair">
      <UFormField :label="fieldLabels.min">
        <UInput
          ref="input"
          :model-value="String(modelValue[0] ?? '')"
          type="number"
          :step="step"
          class="portal-full-field"
          @update:model-value="handleInput(String($event ?? ''), true)"
          @keydown.enter.prevent.stop="handleEnter"
          @blur="handleEnter"
        />
      </UFormField><UFormField :label="fieldLabels.max">
        <UInput
          :model-value="String(modelValue[1] ?? '')"
          type="number"
          :step="step"
          class="portal-full-field"
          @update:model-value="handleInput(String($event ?? ''), false)"
          @keydown.enter.prevent.stop="handleEnter"
          @blur="handleEnter"
        />
      </UFormField>
    </div>
  </PortalFilterSection>
</template>
