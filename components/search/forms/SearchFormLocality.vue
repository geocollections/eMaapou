<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
          v-model="filters.name.value"
          :title="$t('filters.localityName')"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.country.value"
          ref="filterCountry"
          :title="$t('filters.country')"
          :query-function="suggestCountry"
          :hydration-function="hydrateCountry"
          @update:model-value="handleUpdate"
        />
        <filter-map
          v-model="filters.geometry.value"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.stratigraphyAge.value"
          :title="$t('filters.stratigraphyAge')"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.reference.value"
          ref="filterReferences"
          :title="$t('filters.reference')"
          :query-function="suggestReference"
          :hydration-function="hydrateReference"
          @update:model-value="handleUpdate"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

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
  }
);
const { suggest: suggestReference, hydrate: hydrateReference } =
  useAutocomplete("/locality", {
    idField: "locality_references_kws",
    nameField: "locality_references",
    filterExclude: "references",
    solrParams: { query: solrQuery, filter: solrFilters },
    primary: "id",
    containsParser: removeNonAlphanumeric,
  });
</script>
