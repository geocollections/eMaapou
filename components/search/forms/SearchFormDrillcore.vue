<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const drillcoresStore = useDrillcores();
const { filters, query, solrQuery, solrFilters } = storeToRefs(drillcoresStore);

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

const filterCountry = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterRepository = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  country: filterCountry.value?.refreshSuggestions,
  repository: filterRepository.value?.refreshSuggestions,
  institution: filterInstitution.value?.refreshSuggestions,
}));

function handleReset() {
  emit("reset");
}

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
</script>

<template>
  <div>
    <VForm class="pb-10" @submit.prevent="handleSubmit">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <VDivider class="mx-2" />
      <VExpansionPanels
        class="px-2"
        variant="accordion"
        multiple
      >
        <FilterInputText
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
        <FilterMap
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
        <FilterInputRange
          v-model="filters.boxes.value"
          :title="$t('filters.drillcoreBoxes')"
          value="boxes"
          @update:model-value="handleUpdate"
        />
        <FilterInputRange
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
      </VExpansionPanels>
      <VDivider class="mx-2" />
    </VForm>
  </div>
</template>
