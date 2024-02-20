<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
          v-model="filters.name.value"
          :title="$t('filters.drillcoreName')"
          value="name"
        />
        <filter-input-autocomplete
          v-model="filters.country.value"
          ref="filterCountry"
          :title="$t('filters.country')"
          :query-function="suggestCountry"
          :hydration-function="hydrateCountry"
          @update:model-value="handleUpdate"
          value="country"
        />
        <filter-map
          v-model="filters.geometry.value"
          @update:model-value="handleUpdate"
          value="map"
        />
        <filter-input-autocomplete
          v-model="filters.repository.value"
          ref="filterRepository"
          :title="$t('filters.drillcoreRepository')"
          :query-function="suggestRepository"
          :hydration-function="hydrateRepository"
          @update:model-value="handleUpdate"
          value="repository"
        />
        <filter-input-range
          v-model="filters.boxes.value"
          :title="$t('filters.drillcoreBoxes')"
          @update:model-value="handleUpdate"
          value="boxes"
        />
        <filter-input-range
          v-model="filters.stratigraphyAge.value"
          :title="$t('filters.stratigraphyAge')"
          @update:model-value="handleUpdate"
          value="stratigraphyAge"
        />
        <filter-input-autocomplete
          v-model="filters.institution.value"
          ref="filterInstitution"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          @update:model-value="handleUpdate"
          :per-page="-1"
          value="institution"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset"]);

const filterCountry = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterRepository = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<InstanceType<typeof FilterInputAutocomplete>>();

const drillcoresStore = useDrillcores();
const { filters, query, solrQuery, solrFilters } = storeToRefs(drillcoresStore);

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterCountry.value?.refreshSuggestions();
    filterRepository.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    emit("update");
  });
}

const { suggest: suggestCountry, hydrate: hydrateCountry } = useAutocomplete(
  "/drillcore",
  {
    idField: "country_id_s",
    nameField: { et: "country", en: "country_en" },
    filterExclude: "country",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestRepository, hydrate: hydrateRepository } =
  useAutocomplete("/drillcore", {
    idField: "core_repository_id_s",
    nameField: { et: "core_repository", en: "core_repository_en" },
    filterExclude: "repository",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution } =
  useAutocomplete("/drillcore", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
</script>
