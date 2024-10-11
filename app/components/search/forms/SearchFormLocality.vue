<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const localitiesStore = useLocalities();
const { filters, query, solrQuery, solrFilters } = storeToRefs(localitiesStore);

const { suggest: suggestCountry, hydrate: hydrateCountry } = useAutocomplete(
  "/locality",
  {
    idField: "country_id_s",
    nameField: { et: "country", en: "country_en" },
    filterExclude: "country",
    solrParams: { query: solrQuery, filter: solrFilters },
    primary: "name",
  },
);
const { suggest: suggestReference, hydrate: hydrateReference }
  = useAutocompleteReference("/locality", {
    field: "locality_references_kws",
    filterExclude: "references",
    solrParams: { query: solrQuery, filter: solrFilters },
    containsParser: removeNonAlphanumeric,
  });

const filterCountry = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterReferences = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  country: filterCountry.value?.refreshSuggestions,
  reference: filterReferences.value?.refreshSuggestions,
}));

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
</script>

<template>
  <div>
    <VForm class="pb-10" @submit.prevent="handleSubmit">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <div id="divider" class="mx-2" />
      <VExpansionPanels
        variant="accordion"
        class="px-2"
        multiple
      >
        <FilterInputText
          v-model="filters.name.value"
          :title="$t('filters.localityName')"
          value="name"
          @update:model-value="handleUpdate()"
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
        <FilterMap
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate"
        />
        <FilterInputRange
          v-model="filters.stratigraphyAge.value"
          :title="$t('filters.stratigraphyAge')"
          value="stratigraphyAge"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterReferences"
          v-model="filters.reference.value"
          :title="$t('filters.reference')"
          :query-function="suggestReference"
          :hydration-function="hydrateReference"
          value="reference"
          @update:model-value="handleUpdate('reference')"
        />
      </VExpansionPanels>
      <div id="divider" class="mx-2" />
    </VForm>
  </div>
</template>
