<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { ExportFunc, ExportType } from "~/composables/useExport";

export interface PortalTableProps { items: any[]; headers: Header[]; options: DataTableOptions; count: number; isLoading: boolean; exportFunc?: ExportFunc; exportTypes?: ExportType[]; modern?: boolean; onlyTable?: boolean; showSearch?: boolean; dynamicHeaders?: boolean; expandable?: boolean; itemTo?: (item: any) => string; externalTo?: boolean }
const props = withDefaults(defineProps<PortalTableProps>(), { showSearch: true, dynamicHeaders: true });
const emit = defineEmits<{ "update": [payload: { options: DataTableOptions; search: string }]; "change:headers": [key: string]; "reset:headers": []; "click:row": [payload: { index: number; id: string }] }>();
const search = ref("");
watchDebounced(search, () => emit("update", {
  options: { ...props.options, page: 1 },
  search: search.value,
}), { debounce: 400 });
const slots = useSlots();
const { t, locale } = useI18n();
const { $formatDate } = useNuxtApp();
const cellSlots = computed(() => Object.keys(slots).filter(name => name.startsWith("item.")));
const columns = computed<TableColumn<any>[]>(() => {
  const result: TableColumn<any>[] = props.headers.filter(header => header.show).map(header => ({
    id: header.value === "depth"
      ? "depthCombined"
      : header.value,
    accessorKey: header.value,
    header: header.title,
    enableSorting: header.sortable !== false && !header.children,
    cell: ({ getValue }) => ["date_added", "date_changed"].includes(header.value) && getValue()
      ? $formatDate(String(getValue()))
      : getValue() ?? "—",
  }));
  if (props.itemTo && !props.modern)
    result.unshift({ id: "record", header: "", enableSorting: false });
  if (props.expandable)
    result.unshift({ id: "expand", header: "", enableSorting: false });
  return result;
});
function sortBy(key: string) {
  const current = props.options.sortBy.find(sort => sort.key === key);
  const sortBy: SortItem[] = !current
    ? [
        { key, order: "asc" },
      ]
    : current.order === "asc"
      ? [
          { key, order: "desc" },
        ]
      : [];
  emit("update", {
    options: { ...props.options, page: 1, sortBy },
    search: "",
  });
}
</script>

<template>
  <div class="portal-data-table">
    <div v-if="!onlyTable" class="portal-table-toolbar">
      <UInput
        v-if="showSearch !== false"
        v-model="search"
        :aria-label="t('common.search')"
        :placeholder="t('common.search')"
        class="portal-table-search"
      />
      <PortalTableTools
        :headers="headers"
        :show-columns="dynamicHeaders !== false"
        :sort-by="options.sortBy"
        :export-func="exportFunc"
        :export-types="exportTypes"
        @change="emit('change:headers', $event.value)"
        @reset="emit('reset:headers')"
      />
    </div>
    <UTable
      :data="items"
      :columns="columns"
      :loading="isLoading"
      sticky="header"
      :expanded-options="{ getRowCanExpand: row => !!row.original.canExpand }"
      class="portal-table-scroll"
      :ui="{ base: 'portal-table-base', thead: 'portal-table-head', tbody: 'portal-table-body', tr: 'portal-table-row', th: 'portal-table-heading', td: 'portal-table-cell' }"
    >
      <template
        v-for="column in columns"
        :key="column.id"
        #[`${column.id}-header`]
      >
        <UButton
          v-if="column.enableSorting"
          color="neutral"
          variant="ghost"
          class="portal-sort-button header-focus"
          :aria-label="`${column.header}: ${t('common.sort', 'Sort')}`"
          @click="sortBy(String(column.id))"
        >
          {{ column.header }}<UIcon :name="options.sortBy.find(s => s.key === column.id)?.order === 'asc' ? 'i-lucide-arrow-up' : options.sortBy.find(s => s.key === column.id)?.order === 'desc' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up-down'" class="size-3.5" />
        </UButton><span v-else>{{ column.header }}</span>
      </template>
      <template
        v-for="name in cellSlots"
        :key="name"
        #[`${name.slice(5)}-cell`]="{ row }"
      >
        <slot
          :name="name"
          :item="row.original"
          :index="row.index"
        />
      </template>
      <template #record-cell="{ row }">
        <UButton
          color="neutral"
          variant="ghost"
          :to="itemTo?.(row.original)"
          :target="externalTo ? '_blank' : undefined"
          :icon="externalTo ? 'i-lucide-external-link' : 'i-lucide-arrow-right'"
          :aria-label="locale === 'et' ? 'Ava kirje' : 'Open record'"
          @click="emit('click:row', { index: row.index, id: String(row.original.id) })"
        />
      </template>
      <template #expand-cell="{ row }">
        <UButton
          v-if="row.original.canExpand"
          color="neutral"
          variant="ghost"
          :icon="row.getIsExpanded() ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          :aria-label="locale === 'et' ? 'Näita kirje andmeid' : 'Show record details'"
          @click="row.toggleExpanded()"
        />
      </template>
      <template #expanded="{ row }">
        <slot
          name="expanded-row"
          :item="row.original"
          :columns="columns"
        />
      </template>
      <template #empty>
        {{ t('table.noData') }}
      </template>
    </UTable>
    <PortalPagination
      v-if="!onlyTable"
      :options="options"
      :count="count"
      :loading="isLoading"
      @update="emit('update', { options: $event, search: '' })"
    />
  </div>
</template>
