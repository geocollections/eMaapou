<script setup lang="ts">
import type { TableColumn, TableRow } from "@nuxt/ui";
import type { ExportFunc, ExportType } from "~/composables/useExport";

export interface PortalTableProps { mobileCards?: boolean; items: any[]; headers: Header[]; options: DataTableOptions; count: number; isLoading: boolean; exportFunc?: ExportFunc; exportTypes?: ExportType[]; modern?: boolean; onlyTable?: boolean; showSearch?: boolean; showTools?: boolean; dynamicHeaders?: boolean; expandable?: boolean; itemTo?: (item: any) => string; externalTo?: boolean }
const props = withDefaults(defineProps<PortalTableProps>(), { showSearch: true, showTools: true, dynamicHeaders: true });
const emit = defineEmits<{ "update": [payload: { options: DataTableOptions; search: string }]; "change:headers": [key: string]; "reset:headers": []; "click:row": [payload: { index: number; id: string }] }>();
const search = ref("");
watchDebounced(search, () => emit("update", {
  options: { ...props.options, page: 1 },
  search: search.value,
}), { debounce: 400 });
const slots = useSlots();
const { t } = useI18n();
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
const cardHeaders = computed(() => props.headers.filter(header => header.show));
const primaryHeaders = computed(() => cardHeaders.value.filter(header => [
  "id",
  "specimen_full_name",
  "name",
  "locality",
].includes(header.value)));
const detailHeaders = computed(() => cardHeaders.value.filter(header => !primaryHeaders.value.includes(header)));
const rowNavigation = computed(() => props.modern && !!props.itemTo);
function recordLabel(item: any) {
  return t("portal.dataTable.openNamedRecord", { name: item.specimen_full_name || item.id });
}
function recordClick(item: any, index: number) {
  emit("click:row", {
    index,
    id: String(item.id),
  });
}
function openRow(event: Event, item: any, index: number) {
  if (!rowNavigation.value || (event.target as HTMLElement).closest("a, button, input, label, select, textarea, [role='button']"))
    return;
  if (window.getSelection()?.toString())
    return;
  const destination = props.itemTo?.(item);
  if (!destination)
    return;
  recordClick(item, index);
  const mouse = event as MouseEvent;
  navigateTo(destination, mouse.ctrlKey || mouse.metaKey
    ? {
        open: { target: "_blank" },
      }
    : { external: props.externalTo });
}
function selectRow(event: Event, row: TableRow<any>) {
  openRow(event, row.original, row.index);
}
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
  <div class="portal-data-table" :class="{ 'portal-data-table-linked': rowNavigation }">
    <div v-if="!onlyTable && (showSearch || showTools)" class="portal-table-toolbar">
      <UInput
        v-if="showSearch !== false"
        v-model="search"
        :aria-label="t('common.search')"
        :placeholder="t('common.search')"
        class="portal-table-search"
      />
      <PortalTableTools
        v-if="showTools"
        :headers="headers"
        :show-columns="dynamicHeaders !== false"
        :sort-by="options.sortBy"
        :export-func="exportFunc"
        :export-types="exportTypes"
        @change="emit('change:headers', $event.value)"
        @reset="emit('reset:headers')"
      />
    </div>
    <p v-if="rowNavigation" class="portal-table-navigation-hint">
      <UIcon name="i-lucide-mouse-pointer-2" />
      {{ t('portal.dataTable.clickARowToOpenItsDetails') }}
    </p>
    <div
      v-if="mobileCards"
      class="portal-record-cards"
      :aria-busy="isLoading"
    >
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="portal-record-card"
        @click="openRow($event, item, index)"
      >
        <UButton
          v-if="itemTo"
          :to="itemTo(item)"
          :aria-label="recordLabel(item)"
          color="primary"
          variant="soft"
          trailing-icon="i-lucide-arrow-right"
          class="portal-record-card-action"
          @click="recordClick(item, index)"
        >
          {{ t('portal.dataTable.openRecordDetails') }}
        </UButton>
        <dl>
          <div
            v-for="header in primaryHeaders"
            :key="header.value"
            class="portal-record-field"
          >
            <dt>{{ header.title }}</dt>
            <dd>
              <slot
                :name="`item.${header.value}`"
                :item="item"
                :index="index"
              >
                {{ item[header.value] ?? '—' }}
              </slot>
            </dd>
          </div>
        </dl>
        <UCollapsible v-if="detailHeaders.length">
          <UButton
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
          >
            {{ t('portal.dataTable.details') }}
          </UButton>
          <template #content>
            <dl>
              <div
                v-for="header in detailHeaders"
                :key="header.value"
                class="portal-record-field"
              >
                <dt>{{ header.title }}</dt>
                <dd>
                  <slot
                    :name="`item.${header.value === 'depth' ? 'depthCombined' : header.value}`"
                    :item="item"
                    :index="index"
                  >
                    {{ item[header.value] ?? '—' }}
                  </slot>
                </dd>
              </div>
            </dl>
          </template>
        </UCollapsible>
      </article>
      <p v-if="!items.length">
        {{ isLoading ? (t('portal.dataTable.loading')) : t('table.noData') }}
      </p>
    </div>
    <UTable
      :data="items"
      :columns="columns"
      :loading="isLoading"
      :sorting="options.sortBy.map(sort => ({ id: sort.key, desc: sort.order === 'desc' }))"
      :sorting-options="{ manualSorting: true }"
      sticky="header"
      :on-select="rowNavigation ? selectRow : undefined"
      :expanded-options="{ getRowCanExpand: row => !!row.original.canExpand }"
      class="portal-table-scroll"
      :class="{ 'portal-table-desktop': mobileCards }"
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
        <UTooltip :text="recordLabel(row.original)" :delay-duration="250">
          <UButton
            color="primary"
            :variant="modern ? 'soft' : 'ghost'"
            :to="itemTo?.(row.original)"
            :target="externalTo ? '_blank' : undefined"
            :trailing-icon="externalTo ? 'i-lucide-external-link' : 'i-lucide-arrow-right'"
            :aria-label="recordLabel(row.original)"
            class="portal-table-record-action header-focus"
            @click="recordClick(row.original, row.index)"
          >
            {{ modern ? (t('portal.dataTable.view')) : '' }}
          </UButton>
        </UTooltip>
      </template>
      <template #expand-cell="{ row }">
        <UButton
          v-if="row.original.canExpand"
          color="neutral"
          variant="ghost"
          :icon="row.getIsExpanded() ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          :aria-label="t('portal.dataTable.showRecordDetails')"
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
