<script setup lang="ts" generic="T">
import orderBy from "lodash/orderBy";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";

export interface Suggestion { id: T; name: string; count: number }

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array as PropType<T[]>,
    required: true,
  },
  perPage: {
    type: Number,
    default: 8,
  },
  primary: {
    type: String,
    default: "name",
  },
  showFilter: {
    type: Boolean,
    default: true,
  },
  queryFunction: {
    type: Function as PropType<
      ({
        query,
        pagination,
        values,
      }: {
        query: string;
        pagination: { page: number; perPage: number };
        values: T[];
      }) => Promise<Suggestion[]>
    >,
    required: true,
  },
  hydrationFunction: {
    type: Function as PropType<(values: T[]) => Promise<Suggestion[]>>,
    required: true,
  },
});
const emit = defineEmits(["update:model-value"]);

defineExpose({
  refreshSuggestions,
});

const query = ref("");
const queryDebounced = refDebounced(query, 200);

const pagination = ref({
  page: 1,
  perPage: props.perPage,
});

const showPagination = computed(() => props.perPage > -1);

const selectedItems = ref<Suggestion[]>([]);

const selectedIds = computed(() => selectedItems.value.map(i => i.id));

if (props.modelValue.length > 0)
  selectedItems.value = await props.hydrationFunction(props.modelValue);

const orderedSelectedItems = computed(() => {
  return orderBy(selectedItems.value, ["count", "name"], ["desc", "asc"]);
});

const id = useId();

const { data: suggestions, refresh } = await useAsyncData(
  `autocomplete-${id}`,
  async () => {
    return await props.queryFunction({
      query: query.value,
      pagination: pagination.value,
      values: selectedIds.value,
    });
  },
);

watch(queryDebounced, () => {
  pagination.value.page = 1;
  refresh();
});

watch(() => props.modelValue, (newVal, oldVal) => {
  // Clear selected items if new model value is empty and previous was not
  if (oldVal.length > 0 && newVal.length < 1) {
    selectedItems.value = [];
    refresh();
  }
});

const isFirstPage = computed(() => pagination.value.page === 1);
const isLastPage = computed(() => {
  return (suggestions.value?.length ?? 0) < pagination.value.perPage;
});

function nextPage() {
  pagination.value.page++;
  refresh();
}

function prevPage() {
  pagination.value.page--;
  refresh();
}

function handleAdd(item: Suggestion) {
  const index = selectedIds.value.indexOf(item.id);
  if (index > -1) {
    handleRemove(index);
    return;
  }
  selectedItems.value.push(item);
  emit("update:model-value", selectedIds.value);
}

function handleRemove(id: number) {
  const index = selectedIds.value.indexOf(id);
  selectedItems.value.splice(index, 1);

  emit("update:model-value", selectedIds.value);
}

async function hydrateSelected() {
  if (props.modelValue.length < 1)
    return;
  selectedItems.value = await props.hydrationFunction(props.modelValue);
}

function refreshSuggestions() {
  hydrateSelected();
  refresh();
}

const input = ref();

function handleOpen(value) {
  if (!value.value)
    return;

  nextTick(() => {
    input.value.focus();
  });
}
</script>

<template>
  <VExpansionPanel
    bg-color="transparent"
    elevation="0"
    :rounded="0"
    @group:selected="handleOpen"
  >
    <VExpansionPanelTitle
      class="py-1 pl-4 pr-1 font-weight-medium text-body-2"
      style="min-height: 40px;"
    >
      {{ title }}
    </VExpansionPanelTitle>
    <div
      v-if="selectedItems.length > 0"
      class="bg-white"
    >
      <div
        v-for="(item, i) in orderedSelectedItems"
        :key="i"
        class="d-flex selected-item px-2 py-1"
        @click="handleRemove(item.id)"
      >
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove(item.id)"
          >
        </span>
        <span
          class="align-self-center d-flex text-body-2 font-weight-medium pl-2 w-100"
          style="word-break: break-word"
        >
          <slot name="selection" :item="item">
            <span class="mr-2">{{ item.name }}</span>
            <span class="ml-auto mr-1 text-medium-emphasis text-caption" style="word-break: keep-all">{{
              item.count
            }}</span>
          </slot>
        </span>
      </div>
    </div>
    <VExpansionPanelText
      class="py-0"
      color="white"
    >
      <div class="my-2">
        <VTextField
          v-if="showFilter"
          ref="input"
          v-model="query"
          variant="outlined"
          bg-color="white"
          hide-details
          density="compact"
          class="mb-2"
          :placeholder="$t('filters.filter')"
        />
        <div
          v-if="(suggestions?.length ?? 0) < 1"
          class="text-medium-emphasis text-body-2"
        >
          No options available
        </div>
        <template v-else>
          <div
            v-for="(item, i) in suggestions"
            :key="i"
            class="d-flex selected-item"
            @click="handleAdd(item)"
          >
            <span>
              <input
                type="checkbox"
                class="checkbox"
                :checked="selectedIds.includes(item.id)"
                @click.prevent.stop="handleAdd(item)"
              >
            </span>
            <span
              class="align-self-center d-flex text-body-2 font-weight-medium pl-2 w-100"
              style="word-break: break-word"
            >
              <slot name="selection" :item="item">
                <span class="mr-2">{{ item.name }}</span>
                <span class="ml-auto text-medium-emphasis mr-1 text-caption" style="word-break: keep-all">{{
                  item.count
                }}</span>
              </slot>
            </span>
          </div>
        </template>
        <div
          v-if="showPagination"
          class="d-flex align-center justify-space-around"
        >
          <VBtn
            :icon="mdiChevronLeft"
            variant="text"
            size="small"
            :disabled="isFirstPage"
            @click="prevPage"
          />
          <span>{{ pagination.page }}</span>
          <VBtn
            :icon="mdiChevronRight"
            variant="text"
            size="small"
            :disabled="isLastPage"
            @click="nextPage"
          />
        </div>
      </div>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped lang="scss">
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
  padding-top: 0px;
}

.selected-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

// .checkbox {
//   accent-color: rgb(var(--v-theme-accent));
// }
</style>
