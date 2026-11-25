<script setup lang="ts">
import { FIELDS_SOLR_TAXON } from "~/constants";

definePageMeta({ layout: false });

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const localePath = useLocalePath();
const taxaStore = useTaxa();
const { resetFilters, resetDataTable } = taxaStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = taxaStore;
const { solrSort, solrQuery, solrFilters, options, headers } = storeToRefs(taxaStore);

setStateFromQueryParams(route);

const {
  data,
  status,
  error,
  refresh: refreshTaxa,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/taxon", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilters.value,
      sort: solrSort.value,
      fields: FIELDS_SOLR_TAXON,
    },
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refreshTaxa();
}, { deep: true });

function setQueryParamsFromState() {
  router.push({
    query: getQueryParams(),
  });
}

function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
}

function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
}

function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
}

const { hydrate: hydrateTaxon } = useTaxonHierarchyFilter("/taxon", {
  filterExclude: "taxon",
  solrParams: { query: solrQuery, filter: solrFilters },
});
const { hydrate: hydrateFossilGroup } = useAutocomplete("/taxon", {
  idField: "fossil_group_id_s",
  nameField: "fossil_group",
  filterExclude: "fossilGroup",
  solrParams: { query: solrQuery, filter: solrFilters },
});
const filterLabels = computed(() => ({
  species: t("portal.taxonSearch.species"),
  author: t("portal.taxonSearch.author"),
  taxon: t("filters.taxonHierarchy"),
  fossilGroup: t("filters.fossilGroup"),
}));
const filterHydrators = {
  taxon: hydrateTaxon,
  fossilGroup: hydrateFossilGroup,
};
const resolvedFilterNames = ref<Record<string, Record<string, string>>>({});

function filterValues(key: string) {
  const raw = route.query[key];
  const values = Array.isArray(raw)
    ? raw
    : [raw];
  return [
    ...new Set(values.flatMap(value => String(value ?? "").split(",")).filter(Boolean)),
  ];
}

watch([
  () => JSON.stringify(Object.keys(filterLabels.value).map(key => route.query[key])),
  locale,
], async (_value, _oldValue, onCleanup) => {
  let cancelled = false;
  onCleanup(() => {
    cancelled = true;
  });

  const names: Record<string, Record<string, string>> = {};
  await Promise.all(Object.entries(filterHydrators).map(async ([key, hydrate]) => {
    const values = filterValues(key);
    if (!values.length)
      return;

    try {
      const items = await hydrate(values);
      names[key] = Object.fromEntries(items.map((item: { id: string | number; value?: string; name: string | { et: string; en: string } }) => [
        String(item.value ?? item.id),
        typeof item.name === "string"
          ? item.name
          : locale.value === "et"
            ? item.name.et
            : item.name.en,
      ]));
    }
    catch (error) {
      console.error(`Could not resolve selected ${key} taxon-search filters.`, error);
    }
  }));

  if (!cancelled)
    resolvedFilterNames.value = names;
}, { immediate: true });

const activeFilters = computed(() => Object.entries(route.query)
  .filter(([key, value]) => (key === "q" || key in filterLabels.value) && value != null && value !== "")
  .flatMap(([key, value]) => {
    const values = key === "q"
      ? [
          String(value),
        ]
      : filterValues(key);

    return values.map(rawValue => ({
      key,
      rawValue,
      label: key === "q"
        ? (t("portal.common.search"))
        : filterLabels.value[key as keyof typeof filterLabels.value],
      value: key === "q" || key === "species" || key === "author"
        ? rawValue
        : resolvedFilterNames.value[key]?.[rawValue] || rawValue,
    }));
  }));

function removeFilter(key: string, value: string) {
  const query: Record<string, any> = { ...route.query, page: "1" };
  if (key === "q") {
    delete query.q;
  }
  else {
    const remaining = filterValues(key).filter(item => item !== value);
    if (remaining.length)
      query[key] = remaining.join(",");
    else
      delete query[key];
  }
  router.push({ query });
}

const text = computed(() => ({
  home: t("portal.common.home"),
  intro: t("portal.taxonSearch.intro"),
  filters: t("portal.common.filters"),
  active: t("portal.common.activeFilters"),
  clear: t("portal.common.clearAll"),
  remove: t("portal.common.removeFilter"),
  results: t("portal.common.searchResults"),
  failed: t("portal.taxonSearch.failed"),
  retry: t("portal.common.retry"),
  empty: t("portal.common.noResults"),
  hintTitle: t("portal.taxonSearch.hintTitle"),
  hintDescription: t("portal.taxonSearch.hintDescription"),
}));

const filtersOpen = ref(true);
const filterPanel = ref<HTMLElement>();
const filterPanelHeight = ref<number>();
useResizeObserver(filterPanel, () => {
  const panel = filterPanel.value;
  if (!panel || !panel.offsetHeight)
    return;

  filterPanelHeight.value = Math.round(panel.getBoundingClientRect().height);
});
const compactScreen = useMediaQuery("(max-width: 700px)");
watch(compactScreen, (compact) => {
  filtersOpen.value = !compact;
}, { immediate: true });

const { exportData } = useExportSolr("/taxon", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_TAXON,
  })),
});

useHead({
  title: t("taxon.pageTitle"),
});
</script>

<template>
  <div class="min-h-dvh bg-portal-background font-sans text-portal-text">
    <AppBar />
    <main
      class="mx-auto w-full max-w-[1600px] px-4 pt-6 pb-8 sm:px-6 lg:px-8"
      style="--color-text: #1F2937; --color-text-muted: #475569"
    >
      <nav class="mb-4 flex flex-wrap items-center gap-3 text-[13px] text-portal-muted" :aria-label="t('portal.common.breadcrumb')">
        <NuxtLink :to="localePath('/')" class="text-portal-link underline-offset-2 hover:underline">
          {{ text.home }}
        </NuxtLink>
        <span aria-hidden="true">›</span>
        <span>{{ $t('taxon.pageTitle') }}</span>
      </nav>

      <section
        class="relative isolate mb-6 grid items-center gap-6 overflow-hidden rounded-portal-card border border-portal-border bg-portal-mint p-3 sm:p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6"
        aria-labelledby="taxa-title"
      >
        <div class="pointer-events-none absolute -top-12 -right-8 size-44 rounded-full border border-portal-link/20" aria-hidden="true" />
        <div class="pointer-events-none absolute -top-4 right-0 size-28 rounded-full border border-portal-link/20" aria-hidden="true" />
        <div class="relative">
          <h1 id="taxa-title" class="m-0 text-[44px] leading-none font-black tracking-[-.06em] text-portal-heading sm:text-[52px] md:text-[60px] lg:text-[68px]">
            {{ $t('taxon.pageTitle') }}
          </h1>
          <p class="mt-4 mb-0 max-w-[80ch] text-[15px] leading-relaxed text-portal-text">
            {{ text.intro }}
          </p>
        </div>
        <div class="relative hidden h-40 items-center justify-center md:flex" aria-hidden="true">
          <svg
            viewBox="0 0 340 170"
            class="h-full w-full overflow-visible"
            fill="none"
          >
            <circle
              cx="170"
              cy="88"
              r="72"
              class="fill-portal-link/[.035]"
            />
            <circle
              cx="170"
              cy="88"
              r="59"
              class="stroke-portal-link/10"
              stroke-width="1"
              stroke-dasharray="2 6"
            />
            <!-- A branching tree with leaf shaped species markers -->
            <path
              d="M171 154c-3-19-2-35 0-49 2-13-4-20-15-29M171 121c10-13 22-19 38-24 13-4 18-12 18-25M168 137c-12-7-25-11-39-13-12-2-19-9-21-20M172 105c2-13 10-22 20-29 8-6 10-14 7-24"
              class="stroke-portal-link/55"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M169 151c-8 4-14 7-22 8m22-8 10 9m-42-37-10-9m10 9-12 5m122-50 9-11m-9 11 13 2m-40 4 1-15m-1 15 13-4m-71 1-12-8m12 8 2-13"
              class="stroke-portal-link/35"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path d="M157 77c-13-1-19-8-18-18 11 1 18 7 18 18Zm0 0c-3-12 1-21 11-25 4 10 0 19-11 25Zm62 5c-10-8-11-17-5-25 9 7 11 15 5 25Zm-109 20c-11 3-19-1-22-10 10-4 18 0 22 10Zm74-47c-2-11 3-19 13-21 3 11-2 18-13 21Zm-4 92c-4-11 0-19 9-23 5 10 2 18-9 23Zm-50-23c-8-9-7-18 1-24 8 8 8 16-1 24Zm119-47c-1-10 5-17 14-18 2 10-3 17-14 18Z" class="fill-portal-link/25" />
            <circle
              cx="171"
              cy="105"
              r="5"
              class="fill-portal-background stroke-portal-link/65"
              stroke-width="2"
            />
            <circle
              cx="138"
              cy="59"
              r="3"
              class="fill-portal-link/65"
            />
            <circle
              cx="227"
              cy="72"
              r="3"
              class="fill-portal-link/65"
            />
            <circle
              cx="108"
              cy="97"
              r="3"
              class="fill-portal-link/65"
            />
            <circle
              cx="198"
              cy="52"
              r="3"
              class="fill-portal-link/65"
            />
            <circle
              cx="213"
              cy="151"
              r="2"
              class="fill-portal-link/30"
            />
            <circle
              cx="93"
              cy="46"
              r="2"
              class="fill-portal-link/25"
            />
          </svg>
        </div>
      </section>

      <div
        class="grid items-start gap-6"
        :class="filtersOpen ? 'portal-filter-grid' : 'portal-results-grid'"
      >
        <aside
          v-show="filtersOpen"
          id="taxon-filters"
          ref="filterPanel"
          class="min-w-0 rounded-portal-card border border-portal-border bg-portal-background px-3 pt-4"
          :aria-label="text.filters"
        >
          <div class="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-portal-border px-1 pb-3">
            <h2 class="m-0 text-lg font-semibold text-portal-heading">
              {{ text.filters }}
            </h2>
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              class="text-[13px] text-portal-link"
              aria-controls="taxon-filters"
              :aria-expanded="filtersOpen"
              @click="filtersOpen = false"
            >
              {{ $t('common.hideFilters') }}
            </UButton>
          </div>
          <SearchFormTaxon
            @submit="handleUpdate"
            @update="handleUpdate"
            @reset="handleReset"
          />
        </aside>

        <section
          class="min-w-0 portal-search-results-matched-height"
          :style="filtersOpen && filterPanelHeight ? { '--portal-search-results-height': `${filterPanelHeight}px` } : undefined"
          :aria-label="text.results"
        >
          <UButton
            v-if="!filtersOpen"
            type="button"
            color="neutral"
            variant="ghost"
            class="mb-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-portal-control border border-portal-border bg-portal-background px-3 py-2 text-sm font-medium text-portal-heading hover:bg-portal-subtle"
            aria-controls="taxon-filters"
            :aria-expanded="filtersOpen"
            @click="filtersOpen = true"
          >
            {{ $t('common.showFilters') }}
          </UButton>

          <div class="mb-2 flex flex-wrap items-center gap-3">
            <h2 class="mr-auto m-0 text-xl font-semibold tracking-tight text-portal-heading">
              {{ text.results }}
              <span v-if="status === 'success'" class="tabular-nums">
                ({{ (data?.response.numFound ?? 0).toLocaleString(locale) }})
              </span>
            </h2>
            <PortalTableTools
              :headers="headers"
              :show-columns="true"
              :sort-by="options.sortBy"
              :export-func="exportData"
              :export-types="['csv', 'xlsx']"
              @change="handleHeadersChange($event.value)"
              @reset="handleHeadersReset(options)"
            />
          </div>

          <div
            v-if="activeFilters.length"
            class="mb-4 flex flex-wrap items-center gap-2 text-[13px]"
            role="group"
            :aria-label="text.active"
          >
            <span class="mr-1 text-portal-muted">{{ text.active }}:</span>
            <UButton
              v-for="filter in activeFilters"
              :key="`${filter.key}:${filter.rawValue}`"
              type="button"
              color="neutral"
              variant="ghost"
              class="portal-filter-chip"
              :aria-label="`${text.remove}: ${filter.label} ${filter.value}`"
              @click="removeFilter(filter.key, filter.rawValue)"
            >
              <span>{{ filter.label }}: {{ filter.value }}</span>
              <UIcon name="i-lucide-x" class="portal-filter-chip-close" />
            </UButton>
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              class="text-portal-link underline"
              @click="handleReset"
            >
              {{ text.clear }}
            </UButton>
          </div>

          <div
            v-if="error"
            role="alert"
            class="mb-4 rounded-portal-control border border-portal-border bg-portal-subtle p-4 text-sm text-portal-text"
          >
            {{ text.failed }}
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              class="ml-1 text-portal-link underline"
              @click="refreshTaxa()"
            >
              {{ text.retry }}
            </UButton>
          </div>
          <p
            v-else-if="status === 'success' && !data?.response.numFound"
            role="status"
            class="mb-4 rounded-portal-control border border-portal-border bg-portal-subtle p-4 text-sm text-portal-muted"
          >
            {{ text.empty }}
          </p>

          <div class="min-h-0 flex-1 portal-search-table-fill">
            <DataTableTaxon
              v-if="!error"
              modern
              mobile-cards
              :show-search="false"
              :show-tools="false"
              :items="data?.response.docs ?? []"
              :count="data?.response.numFound ?? 0"
              :headers="headers"
              :options="options"
              :is-loading="status === 'pending'"
              :export-func="exportData"
              @update="handleDataTableUpdate"
              @change:headers="handleHeadersChange"
              @reset:headers="handleHeadersReset(options)"
            />
          </div>
        </section>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
