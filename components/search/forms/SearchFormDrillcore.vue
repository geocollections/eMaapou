<script setup lang="ts">
import FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

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
const { suggest: suggestRepository, hydrate: hydrateRepository }
  = useAutocomplete("/drillcore", {
    idField: "core_repository_id_s",
    nameField: { et: "core_repository", en: "core_repository_en" },
    filterExclude: "repository",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/drillcore", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
</script>

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
        <FilterInputAutocomplete
          ref="filterCountry"
          v-model="filters.country.value"
          :title="$t('filters.country')"
          :query-function="suggestCountry"
          :hydration-function="hydrateCountry"
          value="country"
          @update:model-value="handleUpdate"
        />
        <filter-map
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterRepository"
          v-model="filters.repository.value"
          :title="$t('filters.drillcoreRepository')"
          :query-function="suggestRepository"
          :hydration-function="hydrateRepository"
          value="repository"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.boxes.value"
          :title="$t('filters.drillcoreBoxes')"
          value="boxes"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.stratigraphyAge.value"
          :title="$t('filters.stratigraphyAge')"
          value="stratigraphyAge"
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
      </v-expansion-panels>
    </v-form>
  </div>
</template>
