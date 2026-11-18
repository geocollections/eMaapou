<script setup lang="ts">
const props = withDefaults(defineProps<{ options: DataTableOptions; count: number; loading?: boolean; images?: boolean; compact?: boolean }>(), { loading: false, images: false });
const emit = defineEmits<{ update: [options: DataTableOptions] }>();
const { locale } = useI18n();
const labels = computed(() => locale.value === "et"
  ? {
      rows: props.images ? "Pilte lehel" : "Ridu lehel",
      previous: "Eelmine leht",
      next: "Järgmine leht",
      page: "Lehekülg",
      of: "/",
      records: props.images ? "pilti" : "kirjet",
    }
  : {
      rows: props.images ? "Images per page" : "Rows per page",
      previous: "Previous page",
      next: "Next page",
      page: "Page",
      of: "of",
      records: props.images ? "images" : "records",
    });
const pageCount = computed(() => Math.max(1, Math.ceil(props.count / props.options.itemsPerPage)));
function changePage(page: number) {
  if (!Number.isInteger(page) || page < 1 || page > pageCount.value || props.loading)
    return;
  emit("update", { ...props.options, page });
}
function changeSize(value: number) {
  emit("update", {
    ...props.options,
    page: 1,
    itemsPerPage: Number(value),
  });
}
</script>

<template>
  <div class="portal-data-table__pagination" :class="{ 'portal-pagination-compact': compact }">
    <label v-if="!compact" class="portal-data-table__page-size">{{ labels.rows }}<USelect
      :model-value="options.itemsPerPage"
      :items="[10, 25, 50, 100, 250, 500, 1000]"
      :disabled="loading"
      :aria-label="labels.rows"
      color="neutral"
      class="portal-page-size-select"
      :ui="{ base: 'portal-select-control', content: 'z-[1400]' }"
      @update:model-value="changeSize"
    /></label>
    <span v-if="!compact" class="hidden min-[700px]:inline">{{ count ? (options.page - 1) * options.itemsPerPage + 1 : 0 }}–{{ Math.min(options.page * options.itemsPerPage, count) }} / {{ count.toLocaleString(locale) }} {{ labels.records }}</span>
    <nav class="portal-pagination-nav" :aria-label="labels.page">
      <UButton
        :disabled="options.page <= 1 || loading"
        :aria-label="labels.previous"
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="outline"
        class="portal-pagination-arrow"
        @click="changePage(options.page - 1)"
      />
      <label class="portal-pagination-page"><span class="sr-only">{{ labels.page }}</span><UInput
        type="number"
        :min="1"
        :max="pageCount"
        :model-value="options.page"
        :disabled="loading"
        :aria-label="labels.page"
        color="neutral"
        :class="compact ? 'w-12' : 'w-14'"
        :ui="{ base: 'portal-page-input' }"
        @change="changePage(Number(($event.target as HTMLInputElement).value))"
      /> {{ labels.of }} {{ pageCount.toLocaleString(locale) }}</label>
      <UButton
        :disabled="options.page >= pageCount || loading"
        :aria-label="labels.next"
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="outline"
        class="portal-pagination-arrow"
        @click="changePage(options.page + 1)"
      />
    </nav>
  </div>
</template>
