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
const emit = defineEmits(["update:model-value"]);

const { t } = useI18n();
function parseInput(input: string) {
  if (isEmpty(input))
    return null;

  if (props.numberType === "float")
    return Number.parseFloat(input);
  else return Number.parseInt(input);
}

const internalValue = ref<(null | number)[]>([null, null]);

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
  )
    return;

  emit("update:model-value", internalValue.value);
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
  emit("update:model-value", [null, null]);
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
    style="background-color: transparent"
    elevation="0"
    :rounded="0"
    @group:selected="handleOpen"
  >
    <VExpansionPanelTitle
      class="py-1 pl-4 pr-1 text-body-2 font-weight-medium"
      style="min-height: 40px;"
    >
      {{ title }}
    </VExpansionPanelTitle>
    <div
      v-if="modelValue[0] !== null || modelValue[1] !== null"
      class="bg-white"
    >
      <div class="d-flex selected-item py-1 px-2">
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove"
          >
        </span>
        <span class="align-self-center pl-2 text-body-2 font-weight-medium">
          {{ valueString }}
        </span>
      </div>
    </div>
    <VExpansionPanelText
      class="pt-1"
      color="white"
    >
      <VRow no-gutters>
        <VCol cols="6" class="">
          <VTextField
            ref="input"
            :model-value="modelValue[0]"
            color="primary-darken-3"
            :label="fieldLabels.min"
            hide-details
            single-line
            bg-color="white"
            variant="outlined"
            density="compact"
            type="number"
            :step="step"
            @update:model-value="handleInput($event, true)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          />
        </VCol>
        <VCol cols="6" class="pl-1">
          <VTextField
            :model-value="modelValue[1]"
            color="primary-darken-3"
            :label="fieldLabels.max"
            hide-details
            single-line
            bg-color="white"
            variant="outlined"
            density="compact"
            type="number"
            :step="step"
            @update:model-value="handleInput($event, false)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          />
        </VCol>
      </VRow>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style lang="scss" scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
}
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}
.selected-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>
