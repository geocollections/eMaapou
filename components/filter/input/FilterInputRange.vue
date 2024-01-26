<template>
  <v-expansion-panel
    style="background-color: transparent"
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
      v-if="modelValue[0] !== null || modelValue[1] !== null"
      class="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div class="d-flex py-1 pl-4 pr-2">
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove"
          />
        </span>
        <span class="align-self-center pl-2 text-body-2 font-weight-medium">
          {{ valueString }}
        </span>
      </div>
    </div>
    <v-expansion-panel-text
      class="pt-1"
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <v-row no-gutters>
        <v-col cols="6" class="pl-r">
          <v-text-field
            :model-value="modelValue[0]"
            color="primary darken-3"
            :label="fieldLabels.min"
            hide-details
            single-line
            variant="underlined"
            density="compact"
            type="number"
            :step="step"
            @update:model-value="handleInput($event, true)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          >
          </v-text-field>
        </v-col>
        <v-col cols="6" class="pl-1">
          <v-text-field
            :model-value="modelValue[1]"
            color="primary darken-3"
            :label="fieldLabels.max"
            hide-details
            single-line
            variant="underlined"
            density="compact"
            type="number"
            :step="step"
            @update:model-value="handleInput($event, false)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          />
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

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
    fieldLabels: { min: "min", max: "max" },
    intervalLabels: "intervals.default",
    numberType: "int",
    step: 1,
  }
);
const emit = defineEmits(["update:model-value"]);

const { t } = useI18n();
const parseInput = (input: string) => {
  if (isEmpty(input)) return null;

  if (props.numberType === "float") {
    return parseFloat(input);
  } else return parseInt(input);
};

const internalValue = ref<(null | number)[]>([null, null]);

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);
const handleEnter = () => {
  if (
    props.modelValue[0] === internalValue.value[0] &&
    props.modelValue[1] === internalValue.value[1]
  )
    return;

  emit("update:model-value", internalValue.value);
};
const handleInput = (input: string, isMin: boolean) => {
  if (isMin) {
    internalValue.value = [parseInput(input) ?? null, props.modelValue[1]];
  } else {
    internalValue.value = [props.modelValue[0], parseInput(input) ?? null];
  }
};
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
const handleRemove = () => {
  emit("update:model-value", [null, null]);
};
</script>

<style lang="scss" scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 8px;
}
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}
.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
