<script setup lang="ts">
import FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset"]);

const filterCountry = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterReferences = ref<InstanceType<typeof FilterInputAutocomplete>>();

const localitiesStore = useLocalities();
const { filters, query, solrQuery, solrFilters } = storeToRefs(localitiesStore);

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterCountry.value?.refreshSuggestions();
    filterReferences.value?.refreshSuggestions();
    emit("update");
  });
}

const { suggest: suggestCountry, hydrate: hydrateCountry } = useAutocomplete(
  "/locality",
  {
    idField: "country_id_s",
    nameField: { et: "country", en: "country_en" },
    filterExclude: "country",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestReference, hydrate: hydrateReference }
  = useAutocomplete("/locality", {
    idField: "locality_references_kws",
    nameField: "locality_references",
    filterExclude: "references",
    solrParams: { query: solrQuery, filter: solrFilters },
    primary: "id",
    containsParser: removeNonAlphanumeric,
  });
</script>

<template>
  <div>
    <VForm @submit.prevent="handleUpdate">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <VExpansionPanels
        variant="accordion"
        class="px-2"
        multiple
      >
        <FilterInputText
          v-model="filters.name.value"
          :title="$t('filters.localityName')"
          value="name"
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
        <FilterInputRange
          v-model="filters.stratigraphyAge.value"
          :title="$t('filters.stratigraphyAge')"
          value="stratigraphyAge"
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
      </VExpansionPanels>
    </VForm>
  </div>
</template>
