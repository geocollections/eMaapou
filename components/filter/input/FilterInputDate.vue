<template>
  <v-expansion-panel
    ref="panel"
    bg-color="transparent"
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
      v-if="internalValue.length > 0"
      class="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div
        v-for="(item, i) in internalValue"
        :key="i"
        class="d-flex py-1 selected-item pl-4 pr-2"
        @click="handleChange(i)"
      >
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove(i)"
          />
        </span>
        <span
          class="align-self-center text-body-2 font-weight-medium pl-2"
          style="word-break: break-word"
        >
          {{ getDateStr(item) }}
        </span>
      </div>
    </div>
    <v-expansion-panel-text
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <v-date-picker
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
      <v-row
        style="border-top: 1px solid lightgray !important"
        no-gutters
        class="py-2 px-4"
      >
        <v-col cols="6">
          <v-btn
            size="small"
            variant="text"
            block
            class="text-center"
            color="accent"
            :disabled="internalValue.length < 1"
            @click="handleClear"
          >
            {{ $t("filter.clear") }}
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            size="small"
            variant="text"
            block
            class="text-center"
            color="accent"
            :disabled="!isAddActive"
            @click="handleAdd"
          >
            {{ $t("filter.add") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import cloneDeep from "lodash/cloneDeep";

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[][]>,
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:model-value"]);

const { t, locale } = useI18n();
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

const handleRemove = (i: number) => {
  const cloneItems = cloneDeep(internalValue.value);
  cloneItems.splice(i, 1);
  internalValue.value = cloneItems;
  emit("update:model-value", internalValue.value);
};
const handleAdd = () => {
  if (currentDatePickerValue.value === undefined) return;

  internalValue.value = [...internalValue.value, currentDatePickerValue.value];
  emit("update:model-value", internalValue.value);
  currentDatePickerValue.value = undefined;
};
const handleClear = () => {
  internalValue.value = [];
  emit("update:model-value", internalValue.value);
};
const handleDatePickerInput = (e: string[]) => {
  currentDatePickerValue.value = e.sort();
};
const handleChange = (i: number) => {
  const cloneItems = cloneDeep(internalValue.value);
  currentDatePickerValue.value = cloneItems.splice(i, 1)[0];
  internalValue.value = cloneItems;
  emit("update:model-value", internalValue.value);
  if (!panel.value.isActive) panel.value.toggle();
};
const isAddActive = computed(() => {
  return currentDatePickerValue.value !== undefined;
});
const getDateStr = (dateArray: string[]) => {
  console.log(internalValue.value, dateArray);
  const dateFormat = new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const startDate = new Date(dateArray[0]);
  if (dateArray.length > 1) {
    const endDate = new Date(dateArray[1]);
    // @ts-ignore
    return dateFormat.formatRange(startDate, endDate);
  }
  return dateFormat.format(startDate);
};
const maxDate = computed(() => {
  return new Date().toISOString().substr(0, 10);
});
</script>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}
.checkbox {
  accent-color: rgb(var(--v-theme-accent));
}
</style>
