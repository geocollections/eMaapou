<script setup lang="ts">
const props = defineProps<{
  modelValue: [string | undefined, string | undefined];
  title: string;
}>();

const emit = defineEmits<{
  "update:model-value": [value: [string | undefined, string | undefined]];
}>();

const { locale } = useI18n();
const panel = ref();
const internalValue = ref<[string | undefined, string | undefined]>(props.modelValue);
const internalDateValue = ref<[Date | undefined, Date | undefined]>([undefined, undefined]);

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;

    if (newVal[0] !== undefined) {
      internalDateValue.value[0] = new Date(newVal[0]);
    }
    if (newVal[1] !== undefined) {
      internalDateValue.value[1] = new Date(newVal[1]);
    }
  },
  { immediate: true },
);

function handleRemove() {
  emit("update:model-value", [undefined, undefined]);
}

function handleEnter() {
  if (
    props.modelValue[0] === internalValue.value[0]
    && props.modelValue[1] === internalValue.value[1]
  ) {
    return;
  }

  emit("update:model-value", internalValue.value);
}

function removeDateTimezoneOffset(date: Date | null | undefined) {
  if (date === null || date === undefined) {
    return null;
  }

  const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  return new Date(date.valueOf() - tzoffset)
    .toISOString()
    .slice(0, -1);
}

function handleInput(input: Date | null, isMin: boolean) {
  const dateWithoutTimezone = removeDateTimezoneOffset(input);
  const isoDate = dateWithoutTimezone?.substring(0, dateWithoutTimezone.indexOf("T"));

  if (isMin) {
    internalValue.value = [isoDate ?? undefined, props.modelValue[1]];
    internalDateValue.value = [input ?? undefined, internalDateValue.value[1]];
  }
  else {
    internalValue.value = [props.modelValue[0], isoDate ?? undefined];
    internalDateValue.value = [internalDateValue.value[0], input ?? undefined];
  }
}

const dateAdapter = useDate();
function format(date: Date) {
  return dateAdapter.toISO(date);
}

function getDateStr(dateArray: [string | undefined, string | undefined]) {
  const dateFormat = new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const startDateStr = dateArray[0];
  const endDateStr = dateArray[1];
  if (startDateStr === undefined && endDateStr === undefined) {
    return "";
  }
  else if (startDateStr === undefined && endDateStr !== undefined) {
    const endDate = new Date(endDateStr);
    return `* - ${dateFormat.format(endDate)}`;
  }
  else if (startDateStr !== undefined && endDateStr === undefined) {
    const startDate = new Date(startDateStr);
    return `${dateFormat.format(startDate)} - *`;
  }
  else {
    const startDate = new Date(startDateStr as string);
    const endDate = new Date(endDateStr as string);
    return dateFormat.formatRange(startDate, endDate);
  }
}

const currentDate = computed(() => {
  return new Date().toISOString().substring(0, 10);
});

const maxDate = computed(() => {
  const selectedMaxValue = removeDateTimezoneOffset(internalDateValue.value[1]);
  if (selectedMaxValue) {
    return selectedMaxValue.substring(0, 10);
  }
  return currentDate.value;
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
      v-if="modelValue[0] !== undefined || modelValue[1] !== undefined"
      class="bg-white"
    >
      <div
        class="d-flex selected-item px-2"
      >
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove"
          >
        </span>
        <span
          class="align-self-center text-body-2 font-weight-medium pl-2"
          style="word-break: break-word"
        >
          {{ getDateStr(internalValue) }}
        </span>
      </div>
    </div>
    <VExpansionPanelText
      class="pt-1"
      color="white"
    >
      <VRow no-gutters>
        <VCol cols="6" class="">
          <VDateInput
            v-model="internalDateValue[0]"
            color="accent"
            variant="outlined"
            bg-color="white"
            hide-header
            hide-details
            density="compact"
            prepend-icon=""
            first-day-of-week="1"
            :display-format="format"
            input-format="yyyy-mm-dd"
            show-adjacent-months
            clearable
            clear-icon=""
            :max="maxDate"
            @update:model-value="handleInput($event, true)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          />
        </VCol>
        <VCol cols="6" class="pl-1">
          <VDateInput
            :model-value="internalDateValue[1]"
            color="accent"
            variant="outlined"
            bg-color="white"
            hide-header
            hide-details
            density="compact"
            prepend-icon=""
            first-day-of-week="1"
            :display-format="format"
            input-format="yyyy-mm-dd"
            show-adjacent-months
            clearable
            clear-icon=""
            :max="currentDate"
            :min="internalDateValue[0]"
            @update:model-value="handleInput($event, false)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          />
        </VCol>
      </VRow>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
}

:deep(.v-field__clearable) {
  display: none;
}

.checkbox {
  accent-color: rgb(var(--v-theme-accent));
}
</style>
