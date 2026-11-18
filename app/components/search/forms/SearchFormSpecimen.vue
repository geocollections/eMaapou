<script setup lang="ts">
const props = defineProps<{ resultView: "table" | "image" }>();

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const { locale } = useI18n();
const specimensStore = useSpecimens();
const { filters, query, solrQuery, solrFilters } = storeToRefs(specimensStore);
const suggestionFilters = computed(() => props.resultView === "image"
  ? [...solrFilters.value, "has_image:true"]
  : solrFilters.value);

const { suggest: suggestLocality, hydrate: hydrateLocality }
  = useAutocomplete("/specimen", {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: suggestionFilters },
  });
const { suggest: suggestCollector, hydrate: hydrateCollector }
  = useAutocomplete("/specimen", {
    idField: "collector_id_s",
    nameField: "collector",
    filterExclude: "collector",
    solrParams: { query: solrQuery, filter: suggestionFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/specimen", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: suggestionFilters },
  });
const { suggest: suggestCollection, hydrate: hydrateCollection }
  = useAutocomplete("/specimen", {
    idField: "collection_id_s",
    nameField: "collection_number",
    filterExclude: "collection",
    solrParams: { query: solrQuery, filter: suggestionFilters },
  });
const { suggest: suggestFossilGroup, hydrate: hydrateFossilGroup }
  = useAutocomplete("/specimen", {
    idField: "fossilgroup_id_s",
    nameField: "fossilgroup",
    filterExclude: "fossilGroup",
    solrParams: { query: solrQuery, filter: suggestionFilters },
  });
const { suggest: suggestCountry, hydrate: hydrateCountry }
  = useAutocomplete("/specimen", {
    idField: "country_id_s",
    nameField: { et: "country", en: "country_en" },
    filterExclude: "country",
    solrParams: { query: solrQuery, filter: suggestionFilters },
  });
const { suggest: suggestOriginalStatus, hydrate: hydrateOriginalStatus }
  = useAutocomplete("/specimen", {
    idField: "original_status_id_s",
    nameField: { et: "original_status", en: "original_status_en" },
    filterExclude: "originalStatus",
    solrParams: { query: solrQuery, filter: suggestionFilters },
  });

const { suggest: suggestReference, hydrate: hydrateReference }
  = useAutocompleteReference("/specimen", {
    field: "specimen_references_kws",
    filterExclude: "references",
    solrParams: { query: solrQuery, filter: suggestionFilters },
    containsParser: removeNonAlphanumeric,
  });

const { suggest: suggestStratigraphy, hydrate: hydrateStratigraphy, getChildren: getStratigraphyChildren } = useStratigraphyHierarchyFilter("/specimen", {
  filterExclude: "stratigraphy",
  solrParams: { query: solrQuery, filter: suggestionFilters },
  filter: filters.value.stratigraphy,
});

const { suggest: suggestRock, hydrate: hydrateRock, getChildren: getRockChildren } = useRockHierarchyFilter("/specimen", {
  filterExclude: "rock",
  solrParams: { query: solrQuery, filter: suggestionFilters },
  filter: filters.value.rock,
});

const { suggest: suggestTaxon, hydrate: hydrateTaxon, getChildren: getTaxonChildren } = useTaxonHierarchyFilter("/specimen", {
  filterExclude: "taxon",
  solrParams: { query: solrQuery, filter: suggestionFilters },
  filter: filters.value.taxon,
});

interface FilterControl { refreshSuggestions: () => void }
const filterLocality = ref<FilterControl>();
const filterCollector = ref<FilterControl>();
const filterInstitution = ref<FilterControl>();
const filterCollection = ref<FilterControl>();
const filterFossilGroup = ref<FilterControl>();
const filterCountry = ref<FilterControl>();
const filterOriginalStatus = ref<FilterControl>();
const filterReference = ref<FilterControl>();
const filterStratigraphy = ref<FilterControl>();
const filterRock = ref<FilterControl>();
const filterTaxon = ref<FilterControl>();

const suggestionRefreshMap = computed(() => {
  return {
    locality: filterLocality.value?.refreshSuggestions,
    collector: filterCollector.value?.refreshSuggestions,
    institution: filterInstitution.value?.refreshSuggestions,
    collection: filterCollection.value?.refreshSuggestions,
    fossilGroup: filterFossilGroup.value?.refreshSuggestions,
    country: filterCountry.value?.refreshSuggestions,
    originalStatus: filterOriginalStatus.value?.refreshSuggestions,
    reference: filterReference.value?.refreshSuggestions,
    stratigraphy: filterStratigraphy.value?.refreshSuggestions,
    rock: filterRock.value?.refreshSuggestions,
    taxon: filterTaxon.value?.refreshSuggestions,
  };
});

watch(() => props.resultView, () => refreshSuggestionFilters(suggestionRefreshMap.value));

function handleReset() {
  emit("reset");
}

function handleUpdate(excludeKey?: keyof typeof suggestionRefreshMap.value) {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value, excludeKey);
    emit("update");
  });
}

function handleSubmit() {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value);
    emit("submit");
  });
}

function handleHasImageUpdate(value: boolean) {
  filters.value.hasImage.value = value;
  handleUpdate();
}
</script>

<template>
  <form class="portal-filter-form" @submit.prevent="handleSubmit">
    <UFormField
      :label="locale === 'et' ? 'Otsi eksemplare' : 'Search specimens'"
      :description="locale === 'et' ? 'Otsimiseks vajuta Enter.' : 'Press Enter to search.'"
      class="mb-2 px-1"
      :ui="{ label: 'text-[13px] text-portal-text', description: 'text-xs text-portal-muted' }"
    >
      <UInput
        v-model="query"
        type="search"
        :placeholder="locale === 'et' ? 'Nimi või katalooginumber' : 'Name or catalogue number'"
        color="neutral"
        class="w-full"
        :ui="{ base: 'min-h-11 rounded-portal-control ring-portal-border' }"
      />
    </UFormField>
    <UCheckbox
      :model-value="resultView === 'image' || filters.hasImage.value"
      :disabled="resultView === 'image'"
      :label="$t('filters.hasImage')"
      class="px-1 py-1.5"
      @update:model-value="handleHasImageUpdate(!!$event)"
    />
    <UCheckbox
      v-model="filters.hasCoordinates.value"
      :label="$t('filters.hasCoordinates')"
      class="px-1 py-1.5"
      @update:model-value="handleUpdate()"
    />
    <p class="portal-filter-hint">
      {{ locale === 'et' ? 'Filtrivalikud rakenduvad kohe.' : 'Filter selections apply immediately.' }}
    </p>
    <USeparator />
    <div class="portal-filter-list">
      <FilterInputText
        v-model="filters.number.value"
        :title="$t('filters.number')"
        value="number"
        @update:model-value="handleUpdate()"
      />
      <FilterInputAutocomplete
        ref="filterCollection"
        v-model="filters.collection.value"
        :title="$t('filters.collection')"
        :query-function="suggestCollection"
        :hydration-function="hydrateCollection"
        value="collection"
        @update:model-value="handleUpdate('collection')"
      />
      <FilterInputAutocomplete
        ref="filterFossilGroup"
        v-model="filters.fossilGroup.value"
        :title="$t('filters.fossilGroup')"
        :query-function="suggestFossilGroup"
        :hydration-function="hydrateFossilGroup"
        value="fossilGroup"
        @update:model-value="handleUpdate('fossilGroup')"
      />
      <FilterInputHierarchy
        ref="filterTaxon"
        v-model="filters.taxon.value"
        root-value=""
        :title="$t('filters.taxonHierarchy')"
        :hydration-function="hydrateTaxon"
        :get-children="getTaxonChildren"
        :suggestion-function="suggestTaxon"
        value="taxon"
        @update:model-value="handleUpdate('taxon')"
      />
      <FilterInputHierarchy
        ref="filterRock"
        v-model="filters.rock.value"
        root-value=""
        :title="$t('filters.rockHierarchy')"
        :hydration-function="hydrateRock"
        :get-children="getRockChildren"
        :suggestion-function="suggestRock"
        value="rock"
        @update:model-value="handleUpdate('rock')"
      />
      <FilterInputAutocomplete
        ref="filterLocality"
        v-model="filters.locality.value"
        :title="$t('filters.locality')"
        :query-function="suggestLocality"
        :hydration-function="hydrateLocality"
        value="locality"
        @update:model-value="handleUpdate('locality')"
      />
      <FilterInputAutocomplete
        ref="filterCountry"
        v-model="filters.country.value"
        :title="$t('filters.country')"
        :query-function="suggestCountry"
        :hydration-function="hydrateCountry"
        value="country"
        @update:model-value="handleUpdate('country')"
      />
      <FilterInputHierarchy
        ref="filterStratigraphy"
        v-model="filters.stratigraphy.value"
        root-value="1"
        :title="$t('filters.stratigraphyHierarchy')"
        :hydration-function="hydrateStratigraphy"
        :get-children="getStratigraphyChildren"
        :suggestion-function="suggestStratigraphy"
        value="stratigraphy"
        @update:model-value="handleUpdate('stratigraphy')"
      />
      <FilterInputRange
        v-model="filters.depth.value"
        :title="$t('filters.depth')"
        value="depth"
        number-type="float"
        @update:model-value="handleUpdate()"
      />
      <FilterInputAutocomplete
        ref="filterReference"
        v-model="filters.reference.value"
        :title="$t('filters.reference')"
        :query-function="suggestReference"
        :hydration-function="hydrateReference"
        value="reference"
        @update:model-value="handleUpdate('reference')"
      />
      <FilterInputAutocomplete
        ref="filterCollector"
        v-model="filters.collector.value"
        :title="$t('filters.collector')"
        :query-function="suggestCollector"
        :hydration-function="hydrateCollector"
        value="collector"
        @update:model-value="handleUpdate('collector')"
      />
      <FilterInputAutocomplete
        ref="filterOriginalStatus"
        v-model="filters.originalStatus.value"
        :title="$t('filters.originalStatus')"
        :query-function="suggestOriginalStatus"
        :hydration-function="hydrateOriginalStatus"
        value="originalStatus"
        @update:model-value="handleUpdate('originalStatus')"
      />
      <FilterInputAutocomplete
        ref="filterInstitution"
        v-model="filters.institution.value"
        :title="$t('filters.institution')"
        :query-function="suggestInstitution"
        :hydration-function="hydrateInstitution"
        :per-page="-1"
        value="institution"
        @update:model-value="handleUpdate('institution')"
      />
    </div>
    <div class="portal-filter-actions">
      <UButton
        color="neutral"
        variant="outline"
        class="portal-filter-clear"
        @click="handleReset"
      >
        {{ $t('common.resetSearch') }}
      </UButton><UButton type="submit" class="portal-filter-submit">
        {{ $t('common.searchCommand') }}
      </UButton>
    </div>
  </form>
</template>
