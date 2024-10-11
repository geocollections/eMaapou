<script setup lang="ts">
import cloneDeep from "lodash/cloneDeep";

const props = defineProps<{
  modelValue: string[][];
  title: string;
}>();

const emit = defineEmits<{
  "update:model-value": [value: string[][]];
}>();

const { locale } = useI18n();
const panel = ref();
const currentDatePickerValue = ref<string[]>();
const internalValue = ref<string[][]>(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  },
  { immediate: true },
);

function handleRemove(i: number) {
  const cloneItems = cloneDeep(internalValue.value);
  cloneItems.splice(i, 1);
  internalValue.value = cloneItems;
  emit("update:model-value", internalValue.value);
}
function handleAdd() {
  if (currentDatePickerValue.value === undefined)
    return;

  internalValue.value = [...internalValue.value, currentDatePickerValue.value];
  emit("update:model-value", internalValue.value);
  currentDatePickerValue.value = undefined;
}
function handleClear() {
  internalValue.value = [];
  emit("update:model-value", internalValue.value);
}
function handleDatePickerInput(e: string[]) {
  currentDatePickerValue.value = e.sort();
}
function handleChange(i: number) {
  const cloneItems = cloneDeep(internalValue.value);
  currentDatePickerValue.value = cloneItems.splice(i, 1)[0];
  internalValue.value = cloneItems;
  emit("update:model-value", internalValue.value);
  if (!panel.value.isActive)
    panel.value.toggle();
}
const isAddActive = computed(() => {
  return currentDatePickerValue.value !== undefined;
});
function getDateStr(dateArray: string[]) {
  const dateFormat = new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const startDateStr = dateArray[0];
  if (startDateStr === undefined)
    return "";
  const startDate = new Date(startDateStr);

  const endDateStr = dateArray[1];
  if (endDateStr !== undefined) {
    const endDate = new Date(endDateStr);
    return dateFormat.formatRange(startDate, endDate);
  }
  return dateFormat.format(startDate);
}
const maxDate = computed(() => {
  return new Date().toISOString().substring(0, 10);
});
</script>

<template>
  <VExpansionPanel
    ref="panel"
    bg-color="transparent"
    elevation="0"
    :rounded="0"
  >
    <VExpansionPanelTitle
      class="py-1 pl-4 pr-1 text-body-2 font-weight-medium"
      style="min-height: 40px;"
    >
      {{ title }}
    </VExpansionPanelTitle>
    <div
      v-if="internalValue.length > 0"
      class="bg-white"
    >
      <div
        v-for="(item, i) in internalValue"
        :key="i"
        class="d-flex selected-item px-2"
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
          {{ getDateStr(item) }}
        </span>
      </div>
    </div>
    <VExpansionPanelText
      color="white"
      :class="{ 'border-t': internalValue.length > 0 }"
    >
      <VDatePicker
        :model-value="currentDatePickerValue"
        color="accent"
        multiple="range"
        hide-header
        first-day-of-week="1"
        show-adjacent-months
        :max="maxDate"
        :locale="$i18n.locale === 'et' ? 'et-EE' : 'en-US'"
        @update:model-value="handleDatePickerInput"
      />
      <div
        style="border-top: 1px solid lightgray !important"
        no-gutters
        class="py-2 px-4"
      >
        <div cols="6">
          <VBtn
            size="small"
            variant="text"
            block
            class="text-center"
            color="accent"
            :disabled="internalValue.length < 1"
            @click="handleClear"
          >
            {{ $t("filter.clear") }}
          </VBtn>
        </div>

        <div cols="6">
          <VBtn
            size="small"
            variant="text"
            block
            class="text-center"
            color="accent"
            :disabled="!isAddActive"
            @click="handleAdd"
          >
            {{ $t("filter.add") }}
          </VBtn>
        </div>
      </div>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}
.checkbox {
  accent-color: rgb(var(--v-theme-accent));
}
</style>
