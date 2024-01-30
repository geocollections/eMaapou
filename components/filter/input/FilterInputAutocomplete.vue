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
      v-if="selectedItems.length > 0"
      class="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div class="my-1">
        <div
          v-for="(item, i) in orderedSelectedItems"
          :key="i"
          class="d-flex selected-item px-4"
          @click="handleRemove(item.id)"
        >
          <span>
            <input
              type="checkbox"
              class="checkbox"
              checked
              @click.prevent.stop="handleRemove(item.id)"
            />
          </span>
          <span
            class="align-self-center d-flex text-body-2 font-weight-medium pl-2 w-100"
            style="word-break: break-word"
          >
            <slot name="selection" :item="item">
              <span class="mr-2">{{ item.name }}</span>
              <span class="ml-auto" style="word-break: keep-all">{{
                item.count
              }}</span>
            </slot>
          </span>
        </div>
      </div>
    </div>
    <v-expansion-panel-text
      class="py-0"
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div class="my-1">
        <v-text-field
          v-model="query"
          variant="underlined"
          hide-details
          density="compact"
          class="mb-2"
          :placeholder="$t('filters.filter')"
        >
        </v-text-field>
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
              />
            </span>
            <span
              class="align-self-center d-flex text-body-2 font-weight-medium pl-2 w-100"
              style="word-break: break-word"
            >
              <slot name="selection" :item="item">
                <span class="mr-2">{{ item.name }}</span>
                <span class="ml-auto" style="word-break: keep-all">{{
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
          <v-btn
            :icon="mdiChevronLeft"
            variant="text"
            size="small"
            :disabled="isFirstPage"
            @click="prevPage"
          />
          <span>{{ pagination.page }}</span>
          <v-btn
            :icon="mdiChevronRight"
            variant="text"
            size="small"
            :disabled="isLastPage"
            @click="nextPage"
          />
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts" generic="T">
import orderBy from "lodash/orderBy";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
export type Suggestion = { id: T; name: string; count: number };

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

const query = ref("");
const queryDebounced = refDebounced(query, 200);

const pagination = ref({
  page: 1,
  perPage: props.perPage,
});

const showPagination = computed(() => props.perPage > -1);

const selectedItems = ref<Suggestion[]>([]);
const panel = ref();

const selectedIds = computed(() => selectedItems.value.map((i) => i.id));
const selectedNames = computed(() => selectedItems.value.map((i) => i.name));

if (props.modelValue.length > 0) {
  selectedItems.value = await props.hydrationFunction(props.modelValue);
}

const orderedSelectedItems = computed(() => {
  return orderBy(selectedItems.value, ["count", "name"], ["desc", "asc"]);
});

const component = getCurrentInstance();

const { data: suggestions, refresh } = await useAsyncData(
  `autocomplete-${component?.vnode.key?.toString() ?? component?.uid}`,
  async () => {
    return await props.queryFunction({
      query: query.value,
      pagination: pagination.value,
      values: selectedNames.value,
    });
  },
);

watch(queryDebounced, () => {
  pagination.value.page = 1;
  refresh();
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
  if (props.modelValue.length < 1) return;
  selectedItems.value = await props.hydrationFunction(props.modelValue);
}

function refreshSuggestions() {
  hydrateSelected();
  refresh();
}

defineExpose({
  refreshSuggestions,
});
</script>

<style scoped lang="scss">
:deep(.v-expansion-panel-text__wrapper) {
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 8px;
}

.selected-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
