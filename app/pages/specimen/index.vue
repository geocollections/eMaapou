<script setup lang="ts">
import type { MapLocation } from "~/types/map";
import { mdiImageMultipleOutline, mdiTableLarge } from "@mdi/js";
import cloneDeep from "lodash/cloneDeep";
import { FIELDS_SOLR_SPECIMEN } from "~/constants";

definePageMeta({ layout: false });

const route = useRoute();

const specimensStore = useSpecimens();
const { resetFilters, resetDataTable } = specimensStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = specimensStore;
const { filters, solrSort, solrQuery, solrFilters, options, headers, currentView, imageOptions }
  = storeToRefs(specimensStore);

const { setSearchPosition } = useSearchPosition();

setStateFromQueryParams(route);

const {
  data,
  status,
  error,
  refresh: refreshSpecimens,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilters.value,
      sort: solrSort.value,
      fields: `${FIELDS_SOLR_SPECIMEN},latlong`,
    },
  })),
  watch: false,
});

const specimenImageJoinOption = "{!join from=id_l fromIndex=specimen to=specimen_id}";
const specimenImageQuery = computed(() => `${specimenImageJoinOption}${solrQuery.value}`);
const specimenImageSolrFilters = computed(() => {
  const res = cloneDeep(solrFilters.value).map((filter) => {
    if (typeof filter === "string") {
      return `${specimenImageJoinOption}${filter}`;
    }
    const joinEntries = Object.entries(filter).map(([key, value]) => [key, `${specimenImageJoinOption}${value}`]);

    return Object.fromEntries(joinEntries);
  });

  return res;
});

function currentSearch() {
  return {
    query: solrQuery.value,
    filters: solrFilters.value,
    imageQuery: specimenImageQuery.value,
    imageFilters: specimenImageSolrFilters.value,
  };
}
const appliedSearch = shallowRef(currentSearch());
const { data: mapData, status: mapStatus, refresh: refreshMap } = await useSolrFetch<{
  facets?: { locations?: { buckets?: { val: number; longitudes?: { buckets?: { val: number; count: number; name?: { buckets?: { val: string }[] }; nameEn?: { buckets?: { val: string }[] } }[] } }[] } };
}>("/specimen", {
  query: computed(() => ({
    json: {
      query: appliedSearch.value.query,
      filter: [
        ...appliedSearch.value.filters,
        "has_map:true",
        "latitude:[-90 TO 90]",
        "longitude:[-180 TO 180]",
      ],
      limit: 0,
      facet: {
        locations: {
          type: "terms",
          field: "latitude",
          limit: 1000,
          sort: "count desc",
          facet: {
            longitudes: {
              type: "terms",
              field: "longitude",
              facet: {
                name: { type: "terms", field: "locality", limit: 1 },
                nameEn: { type: "terms", field: "locality_en", limit: 1 },
              },
              limit: 1000,
              sort: "count desc",
            },
          },
        },
      },
    },
  })),
});
const mapLocations = computed<MapLocation[]>(() => {
  if (mapStatus.value !== "success")
    return [];
  const locations: MapLocation[] = [];
  for (const latitude of mapData.value?.facets?.locations?.buckets ?? []) {
    for (const longitude of latitude.longitudes?.buckets ?? []) {
      locations.push({
        latitude: latitude.val,
        longitude: longitude.val,
        count: longitude.count,
        name: longitude.name?.buckets?.[0]?.val,
        nameEn: longitude.nameEn?.buckets?.[0]?.val,
      });
      if (locations.length === 1000)
        return locations;
    }
  }
  return locations;
});

const {
  data: imageData,
  status: imageStatus,
  error: imageError,
  refresh: refreshSpecimenImages,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen_image", {
  query: computed(() => ({
    json: {
      query: specimenImageQuery.value,
      limit: imageOptions.value.itemsPerPage,
      offset: getOffset(imageOptions.value.page, imageOptions.value.itemsPerPage),
      filter: specimenImageSolrFilters.value,
      fields: "id,image,specimen_id,specimen_full_name,locality,locality_en",
    },
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  const search = currentSearch();
  if (JSON.stringify(search) !== JSON.stringify(appliedSearch.value))
    appliedSearch.value = search;
  await refreshData();
}, { deep: true });

const router = useRouter();
function setResultView(view: "table" | "image") {
  currentView.value = view;
  setQueryParamsFromState();
}

function setQueryParamsFromState() {
  router.push({
    query: {
      ...getQueryParams(),
    },
  });
}

async function refreshData() {
  await refreshSpecimens();
  await refreshSpecimenImages();
}

function applyMapGeometry(geometry: any | null) {
  specimensStore.filters.geometry.value = geometry;
  handleUpdate();
}

async function handleUpdate() {
  options.value.page = 1;
  imageOptions.value.page = 1;
  setQueryParamsFromState();
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
}

async function handleImageUpdate({ options: newOptions }: { options: DataTableOptions }) {
  imageOptions.value = newOptions;
  setQueryParamsFromState();
}

function handleClickRow({ index, id }: { index: number; id: number }) {
  if (currentView.value === "image") {
    setSearchPosition(
      {
        name: "specimen-id",
        params: { id },
      },
      index + getOffset(imageOptions.value.page, imageOptions.value.itemsPerPage),
      "specimenImage",
    );
  }
  else {
    setSearchPosition(
      {
        name: "specimen-id",
        params: { id },
      },
      index + getOffset(options.value.page, options.value.itemsPerPage),
      "specimen",
    );
  }
}
const { t, locale } = useI18n();
const localePath = useLocalePath();
const filtersOpen = ref(true);
const filterPanel = ref<HTMLElement>();
const defaultFilterHeight = ref<number>();
useResizeObserver(filterPanel, () => {
  const panel = filterPanel.value;
  if (!panel || !panel.offsetHeight)
    return;
  const extraHeight = Array.from(panel.querySelectorAll<HTMLElement>(".portal-filter-section > [data-slot='content'], .portal-filter-selection"))
    .reduce((height, element) => height + element.getBoundingClientRect().height, 0);
  defaultFilterHeight.value = Math.round(panel.getBoundingClientRect().height - extraHeight);
});
const compactScreen = useMediaQuery("(max-width: 700px)");
watch(compactScreen, (compact) => {
  filtersOpen.value = !compact;
}, { immediate: true });
const copyStatus = ref("");
const mapOpen = ref(true);
const text = computed(() => ({
  home: t("portal.common.home"),
  intro: t("portal.specimenSearch.intro"),
  filters: t("portal.common.filters"),
  active: t("portal.common.activeFilters"),
  clear: t("portal.common.clearAll"),
  remove: t("portal.common.removeFilter"),
  results: t("portal.common.searchResults"),
  copy: t("portal.specimenSearch.copy"),
  copied: t("portal.specimenSearch.copied"),
  copyError: t("portal.specimenSearch.copyError"),
  failed: t("portal.specimenSearch.failed"),
  retry: t("portal.common.retry"),
  empty: t("portal.common.noResults"),
  map: t("portal.specimenSearch.map"),
  hideMap: t("portal.specimenSearch.hideMap"),
  showMap: t("portal.specimenSearch.showMap"),
  mapNote: t("portal.specimenSearch.mapNote"),
}));
const filterLabels: Record<string, string> = {
  number: "number",
  locality: "locality",
  depth: "depth",
  stratigraphy: "stratigraphyHierarchy",
  rock: "rockHierarchy",
  taxon: "taxonHierarchy",
  collector: "collector",
  collection: "collection",
  fossilGroup: "fossilGroup",
  country: "country",
  originalStatus: "originalStatus",
  institution: "institution",
  hasImage: "hasImage",
  hasCoordinates: "hasCoordinates",
  reference: "reference",
  geometry: "map",
};
const selectionFilters = computed(() => currentView.value === "image"
  ? [...appliedSearch.value.filters, "has_image:true"]
  : appliedSearch.value.filters);
const selectionOptions = {
  query: computed(() => appliedSearch.value.query),
  filter: selectionFilters,
};
const resolvedFilterCounts = ref<Record<string, Record<string, number>>>({});
const resolvedFilterNames = ref<Record<string, Record<string, string>>>({});
const labelHydrators = Object.fromEntries(Object.entries({
  country: [
    "country_id_s",
    { et: "country", en: "country_en" },
  ],
  locality: [
    "locality_id_s",
    { et: "locality", en: "locality_en" },
  ],
  institution: ["database_id_s", "acronym"],
  collector: ["collector_id_s", "collector"],
  collection: ["collection_id_s", "collection_number"],
  fossilGroup: ["fossilgroup_id_s", "fossilgroup"],
  originalStatus: [
    "original_status_id_s",
    { et: "original_status", en: "original_status_en" },
  ],
}).map(([key, fields]) => [key, useAutocomplete("/specimen", {
  solrParams: selectionOptions,
  idField: fields[0] as string,
  nameField: fields[1] as string | { et: string; en: string },
}).hydrate]));
const hierarchyOptions = selectionOptions;
const hierarchyHydrators = {
  stratigraphy: useStratigraphyHierarchyFilter("/specimen", { solrParams: hierarchyOptions, filter: filters.value.stratigraphy }).hydrate,
  rock: useRockHierarchyFilter("/specimen", { solrParams: hierarchyOptions, filter: filters.value.rock }).hydrate,
  taxon: useTaxonHierarchyFilter("/specimen", { solrParams: hierarchyOptions }).hydrate,
};
const nameHydrators = {
  ...labelHydrators,
  ...hierarchyHydrators,
  reference: useAutocompleteReference("/specimen", { field: "specimen_references_kws", solrParams: selectionOptions }).hydrate,
};
function filterValues(key: string) {
  const raw = route.query[key];
  const values = Array.isArray(raw)
    ? raw
    : [raw];
  const separator = key === "reference"
    ? ";"
    : ",";
  return [
    ...new Set(values.flatMap(value => String(value ?? "").split(separator)).filter(Boolean)),
  ];
}
watch([
  () => JSON.stringify(Object.keys(filterLabels).map(key => route.query[key])),
  locale,
  () => JSON.stringify([appliedSearch.value, currentView.value]),
], async (_value, _oldValue, onCleanup) => {
  let cancelled = false;
  onCleanup(() => {
    cancelled = true;
  });
  const names: Record<string, Record<string, string>> = {};
  const counts: Record<string, Record<string, number>> = {};
  await Promise.allSettled(Object.entries(nameHydrators).map(async ([key, hydrate]) => {
    const values = filterValues(key);
    if (!values.length)
      return;
    const items = await hydrate(values);
    counts[key] = Object.fromEntries(items.map((item: { value?: string; id: string | number; count?: number }) => [
      String(item.value ?? item.id),
      item.count ?? 0,
    ]));
    names[key] = Object.fromEntries(items.map((item: { id: string | number; value?: string; name: string | { et: string; en: string } }) => [
      item.value ?? String(item.id),
      typeof item.name === "string"
        ? item.name
        : locale.value === "et"
          ? item.name.et
          : item.name.en,
    ]));
  }));
  if (!cancelled) {
    resolvedFilterNames.value = names;
    resolvedFilterCounts.value = counts;
  }
}, { immediate: true });
const listFilters = new Set([
  ...Object.keys(nameHydrators),
  "number",
]);
const activeFilters = computed(() => Object.entries(route.query)
  .filter(([key, value]) => (key === "q" || key in filterLabels) && value != null && value !== "" && value !== "false")
  .flatMap(([key, value]) => {
    const values = listFilters.has(key)
      ? filterValues(key)
      : [
          String(value),
        ];
    return values.map(rawValue => ({
      key,
      rawValue,
      count: resolvedFilterCounts.value[key]?.[rawValue],
      label: key === "q"
        ? (t("portal.common.search"))
        : t(`filters.${filterLabels[key]}`),
      value: ["geometry", "hasImage", "hasCoordinates"].includes(key)
        ? ""
        : resolvedFilterNames.value[key]?.[rawValue] || rawValue,
    }));
  }));
function removeFilter(key: string, value: string) {
  const query: Record<string, any> = { ...route.query, page: "1" };
  const remaining = listFilters.has(key)
    ? filterValues(key).filter(item => item !== value)
    : [];
  if (remaining.length) {
    query[key] = remaining.join(key === "reference"
      ? ";"
      : ",");
  }
  else {
    delete query[key];
  }
  router.push({ query });
}
async function copySearchLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyStatus.value = text.value.copied;
  }
  catch { copyStatus.value = text.value.copyError; }
}

const { exportData } = useExportSolr("/specimen", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_SPECIMEN,
  })),
});

useHead({
  title: t("specimen.pageTitle"),
});
</script>

<template>
  <div class="specimen-search">
    <AppBar />
    <main class="specimen-search__main">
      <div class="specimen-search__page">
        <nav class="specimen-search__breadcrumbs" :aria-label="t('portal.common.breadcrumb')">
          <NuxtLink :to="localePath('/')">{{ text.home }}</NuxtLink>
          <span aria-hidden="true">›</span><span>{{ $t('specimen.pageTitle') }}</span>
        </nav>
        <section class="specimen-search__intro" aria-labelledby="specimens-title">
          <div class="specimen-search__heading">
            <h1 id="specimens-title">
              {{ $t('specimen.pageTitle') }}
            </h1><p>{{ text.intro }}</p>
          </div>
          <SpecimenIntroCollage :query="appliedSearch.imageQuery" :filters="appliedSearch.imageFilters" />
        </section>
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          class="mb-1 header-focus specimen-search__map-toggle text-portal-link"
          aria-controls="specimen-results-map"
          :aria-expanded="mapOpen"
          @click="mapOpen = !mapOpen"
        >
          {{ mapOpen ? text.hideMap : text.showMap }}
        </UButton>
        <section
          v-if="mapOpen"
          id="specimen-results-map"
          class="specimen-search__map"
          :aria-label="text.map"
        >
          <SpecimenResultsMap
            :locations="mapLocations"
            :query="appliedSearch.query"
            :filters="appliedSearch.filters"
            :label="text.map"
            :loading="mapStatus === 'pending'"
            :error="mapStatus === 'error'"
            :geometry="specimensStore.filters.geometry.value"
            @retry="refreshMap()"
            @update:geometry="applyMapGeometry"
          />
          <p>{{ text.mapNote }}</p>
        </section>
        <div class="specimen-search__layout" :class="filtersOpen ? 'portal-filter-grid' : 'portal-results-grid'">
          <aside
            v-show="filtersOpen"
            id="specimen-filters"
            ref="filterPanel"
            class="specimen-search__filters"
            :aria-label="text.filters"
          >
            <div class="specimen-search__filter-heading">
              <h2>{{ text.filters }}</h2>
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                aria-controls="specimen-filters"
                :aria-expanded="filtersOpen"
                @click="filtersOpen = false"
              >
                {{ $t('common.hideFilters') }}
              </UButton>
            </div>
            <SearchFormSpecimen
              :result-view="currentView"
              @submit="handleUpdate"
              @update="handleUpdate"
              @reset="handleReset"
            />
          </aside>
          <section
            class="specimen-search__results"
            :class="{ 'portal-search-results-matched-height': currentView === 'table' }"
            :aria-label="text.results"
            :style="defaultFilterHeight ? { '--portal-search-results-height': `${defaultFilterHeight}px` } : undefined"
          >
            <UButton
              v-if="!filtersOpen"
              type="button"
              color="neutral"
              variant="ghost"
              class="specimen-search__show header-focus"
              aria-controls="specimen-filters"
              :aria-expanded="filtersOpen"
              @click="filtersOpen = true"
            >
              {{ $t('common.showFilters') }}
            </UButton>
            <div class="specimen-search__toolbar">
              <h2>{{ text.results }} <span v-if="status === 'success'">({{ (currentView === 'image' ? imageData?.response.numFound ?? 0 : data?.response.numFound ?? 0).toLocaleString(locale) }})</span></h2>
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                class="specimen-search__show"
                @click="copySearchLink"
              >
                {{ text.copy }}
              </UButton>
              <span role="status">{{ copyStatus }}</span>
            </div>
            <div
              v-if="activeFilters.length"
              class="specimen-search__chips"
              role="group"
              :aria-label="text.active"
            >
              <span>{{ text.active }}:</span>
              <UButton
                v-for="filter in activeFilters"
                :key="`${filter.key}:${filter.rawValue}`"
                type="button"
                color="neutral"
                variant="ghost"
                :aria-label="`${text.remove}: ${filter.label} ${filter.value}`"
                @click="removeFilter(filter.key, filter.rawValue)"
              >
                <span>{{ filter.label }}<template v-if="filter.value">: {{ filter.value }}</template><template v-if="filter.count !== undefined"> ({{ filter.count.toLocaleString(locale) }})</template></span><UIcon name="i-lucide-x" class="portal-filter-chip-close" />
              </UButton>
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                class="specimen-search__clear"
                @click="handleReset"
              >
                {{ text.clear }}
              </UButton>
            </div>
            <p
              v-if="currentView === 'image'"
              class="specimen-image-explanation"
              role="status"
            >
              {{ t('portal.specimenSearch.imagesSelectedTheResultCountShowsPhotographs') }}
            </p>
            <div
              v-if="error"
              role="alert"
              class="specimen-search__message"
            >
              {{ text.failed }} <UButton
                type="button"
                color="neutral"
                variant="ghost"
                @click="refreshData"
              >
                {{ text.retry }}
              </UButton>
            </div>
            <p
              v-else-if="status === 'success' && !data?.response.numFound"
              role="status"
              class="specimen-search__message"
            >
              {{ text.empty }}
            </p>
            <ClientOnly>
              <div class="specimen-results-toolbar">
                <div
                  class="specimen-view-switch"
                  role="group"
                  :aria-label="t('portal.specimenSearch.resultsView')"
                >
                  <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    :aria-pressed="currentView === 'table'"
                    class="portal-view-button"
                    :class="currentView === 'table' ? 'portal-view-active' : 'portal-view-inactive'"
                    aria-controls="specimen-table-view"
                    @click="setResultView('table')"
                  >
                    <svg
                      class="portal-view-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    ><path :d="mdiTableLarge" /></svg>
                    <span>{{ $t('common.table') }}</span>
                  </UButton>
                  <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    :aria-pressed="currentView === 'image'"
                    class="portal-view-button"
                    :class="currentView === 'image' ? 'portal-view-active' : 'portal-view-inactive'"
                    aria-controls="specimen-image-view"
                    @click="setResultView('image')"
                  >
                    <svg
                      class="portal-view-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    ><path :d="mdiImageMultipleOutline" /></svg>
                    <span>{{ $t('common.image') }}</span>
                    <span v-if="imageData" class="specimen-view-switch__count">{{ imageData.response.numFound.toLocaleString(locale) }}</span>
                  </UButton>
                </div>
                <PortalTableTools
                  v-if="currentView === 'table'"
                  :headers="headers"
                  :show-columns="true"
                  :sort-by="options.sortBy"
                  :export-func="exportData"
                  :export-types="['csv']"
                  @change="handleHeadersChange($event.value)"
                  @reset="handleHeadersReset(options)"
                />
              </div>
              <div class="specimen-search__views">
                <section
                  v-show="currentView === 'table'"
                  id="specimen-table-view"
                  class="h-full portal-search-table-fill"
                  value="table"
                  role="region"
                  :aria-label="$t('common.table')"
                >
                  <DataTableSpecimen
                    modern
                    :show-search="false"
                    :show-tools="false"
                    :items="data?.response.docs ?? []"
                    :count="data?.response.numFound ?? 0"
                    :headers="headers"
                    :options="options"
                    :is-loading="status === 'pending'"
                    @update="handleDataTableUpdate"
                    @change:headers="handleHeadersChange"
                    @reset:headers="handleHeadersReset(options)"
                    @click:row="handleClickRow"
                  />
                </section>
                <section
                  v-if="currentView === 'image'"
                  id="specimen-image-view"
                  value="image"
                  role="region"
                  :aria-label="$t('common.image')"
                >
                  <SpecimenImageView
                    class="specimen-search__image-results"
                    :items="imageData?.response.docs ?? []"
                    :count="imageData?.response.numFound ?? 0"
                    :options="imageOptions"
                    :loading="imageStatus === 'pending'"
                    :error="!!imageError"
                    @retry="refreshSpecimenImages"
                    @click:record="handleClickRow"
                    @update="handleImageUpdate"
                  />
                </section>
              </div>
            </ClientOnly>
          </section>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
