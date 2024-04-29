<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

defineProps<{ resultView: "table" | "image" }>();

const emit = defineEmits(["update", "reset", "submit"]);

const specimensStore = useSpecimens();
const { filters, query, solrQuery, solrFilters } = storeToRefs(specimensStore);
const { suggest: suggestLocality, hydrate: hydrateLocality }
  = useAutocomplete("/specimen", {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestCollector, hydrate: hydrateCollector }
  = useAutocomplete("/specimen", {
    idField: "collector_id_s",
    nameField: "collector",
    filterExclude: "collector",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/specimen", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestCollection, hydrate: hydrateCollection }
  = useAutocomplete("/specimen", {
    idField: "collection_id_s",
    nameField: "collection_number",
    filterExclude: "collection",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestFossilGroup, hydrate: hydrateFossilGroup }
  = useAutocomplete("/specimen", {
    idField: "fossilgroup_id_s",
    nameField: "fossilgroup",
    filterExclude: "fossilGroup",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestCountry, hydrate: hydrateCountry }
  = useAutocomplete("/specimen", {
    idField: "country_id_s",
    nameField: { et: "country", en: "country_en" },
    filterExclude: "country",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestOriginalStatus, hydrate: hydrateOriginalStatus }
  = useAutocomplete("/specimen", {
    idField: "original_status_id_s",
    nameField: { et: "original_status", en: "original_status_en" },
    filterExclude: "originalStatus",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestReference, hydrate: hydrateReference }
  = useAutocomplete("/specimen", {
    idField: "specimen_references_kws",
    nameField: "specimen_references",
    filterExclude: "references",
    solrParams: { query: solrQuery, filter: solrFilters },
    primary: "id",
    containsParser: removeNonAlphanumeric,
  });

const { suggest: suggestStratigraphy, hydrate: hydrateStratigraphy, getChildren: getStratigraphyChildren } = useStratigraphyHierarchyFilter("/specimen", {
  filterExclude: "stratigraphy",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.stratigraphy,
});

const { suggest: suggestRock, hydrate: hydrateRock, getChildren: getRockChildren } = useRockHierarchyFilter("/specimen", {
  filterExclude: "rock",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.rock,
});

const { suggest: suggestTaxon, hydrate: hydrateTaxon, getChildren: getTaxonChildren } = useTaxonHierarchyFilter("/specimen", {
  filterExclude: "taxon",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.taxon,
});

function handleReset() {
  emit("reset");
}

const filterLocality = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterCollector = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterCollection = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterFossilGroup = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterCountry = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterOriginalStatus = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterReference = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<ComponentExposed<typeof FilterInputHierarchy>>();
const filterRock = ref<ComponentExposed<typeof FilterInputHierarchy>>();
const filterTaxon = ref<ComponentExposed<typeof FilterInputHierarchy>>();

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

function handleUpdate(excludeKey?: string) {
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
  <VForm class="pb-10" @submit.prevent="handleSubmit">
    <SearchFormInput v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <FilterInputCheckbox
      :model-value="resultView === 'image' ? true : filters.hasImage.value"
      :label="$t('filters.hasImage')"
      :disabled="resultView === 'image'"
      @update:model-value="handleHasImageUpdate"
    />
    <FilterInputCheckbox
      v-model="filters.hasCoordinates.value"
      :label="$t('filters.hasCoordinates')"
      @update:model-value="handleUpdate"
    />
    <VDivider class="mx-2" />
    <VExpansionPanels
      variant="accordion"
      class="px-2"
      multiple
    >
      <FilterInputText
        v-model="filters.number.value"
        :title="$t('filters.number')"
        value="number"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterCollection"
        v-model="filters.collection.value"
        :title="$t('filters.collection')"
        :query-function="suggestCollection"
        :hydration-function="hydrateCollection"
        value="collection"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterFossilGroup"
        v-model="filters.fossilGroup.value"
        :title="$t('filters.fossilGroup')"
        :query-function="suggestFossilGroup"
        :hydration-function="hydrateFossilGroup"
        value="fossilGroup"
        @update:model-value="handleUpdate"
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
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterCountry"
        v-model="filters.country.value"
        :title="$t('filters.country')"
        :query-function="suggestCountry"
        :hydration-function="hydrateCountry"
        value="country"
        @update:model-value="handleUpdate"
      />
      <FilterMap
        v-model="filters.geometry.value"
        value="map"
        @update:model-value="handleUpdate"
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
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterReferences"
        v-model="filters.reference.value"
        :title="$t('filters.reference')"
        :query-function="suggestReference"
        :hydration-function="hydrateReference"
        value="reference"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterCollector"
        v-model="filters.collector.value"
        :title="$t('filters.collector')"
        :query-function="suggestCollector"
        :hydration-function="hydrateCollector"
        value="collector"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterOriginalStatus"
        v-model="filters.originalStatus.value"
        :title="$t('filters.originalStatus')"
        :query-function="suggestOriginalStatus"
        :hydration-function="hydrateOriginalStatus"
        value="originalStatus"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterInstitution"
        v-model="filters.institution.value"
        :title="$t('filters.institution')"
        :query-function="suggestInstitution"
        :hydration-function="hydrateInstitution"
        :per-page="-1"
        value="institution"
        @update:model-value="handleUpdate"
      />
    </VExpansionPanels>
    <VDivider class="mx-2" />
  </VForm>
</template>
