<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const analysesStore = useAnalyses();
const { filters, query, solrQuery, solrFilters } = storeToRefs(analysesStore);

const { suggest: suggestLab, hydrate: hydrateLab } = useAutocomplete(
  "/analysis",
  {
    idField: "lab_id_s",
    nameField: { et: "lab", en: "lab_en" },
    filterExclude: "lab",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestMethod, hydrate: hydrateMethod } = useAutocomplete(
  "/analysis",
  {
    idField: "method_s",
    nameField: { et: "analysis_method", en: "analysis_method_en" },
    filterExclude: "method",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestSample, hydrate: hydrateSample } = useAutocomplete(
  "/analysis",
  {
    idField: "sample_id_s",
    nameField: "sample_name",
    filterExclude: "sample",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestLocality, hydrate: hydrateLocality } = useAutocomplete(
  "/analysis",
  {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestSite, hydrate: hydrateSite } = useAutocomplete(
  "/analysis",
  {
    idField: "site_id_s",
    nameField: { et: "name", en: "name_en" },
    filterExclude: "site",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/analysis", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterLab = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterMethod = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterLocality = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterSite = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterSample = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  institution: filterInstitution.value?.refreshSuggestions,
  lab: filterLab.value?.refreshSuggestions,
  method: filterMethod.value?.refreshSuggestions,
  locality: filterLocality.value?.refreshSuggestions,
  site: filterSite.value?.refreshSuggestions,
  sample: filterSample.value?.refreshSuggestions,
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
    <form class="pb-10" @submit.prevent="handleSubmit">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <div id="divider" class="mx-2" />
      <div
        class="px-2"
        variant="accordion"
        multiple
      >
        <FilterInputRange
          v-model="filters.depth.value"
          :title="$t('filters.depth')"
          interval-labels="intervals.depth"
          :step="0.01"
          value="depth"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterMethod"
          v-model="filters.method.value"
          :title="$t('filters.method')"
          :query-function="suggestMethod"
          :hydration-function="hydrateMethod"
          value="method"
          @update:model-value="handleUpdate('method')"
        />
        <FilterInputAutocomplete
          ref="filterLab"
          v-model="filters.lab.value"
          :title="$t('filters.lab')"
          :query-function="suggestLab"
          :hydration-function="hydrateLab"
          value="lab"
          @update:model-value="handleUpdate('lab')"
        />
        <FilterInputAutocomplete
          ref="filterSample"
          v-model="filters.sample.value"
          :title="$t('filters.sample')"
          :query-function="suggestSample"
          :hydration-function="hydrateSample"
          primary="id"
          value="sample"
          @update:model-value="handleUpdate('sample')"
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
          ref="filterSite"
          v-model="filters.site.value"
          :title="$t('filters.site')"
          :query-function="suggestSite"
          :hydration-function="hydrateSite"
          value="site"
          @update:model-value="handleUpdate('site')"
        />
        <FilterMap
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate()"
        />
        <FilterInputText
          v-model="filters.agent.value"
          :title="$t('filters.agent')"
          value="agent"
          @update:model-value="handleUpdate()"
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
      <div id="divider" class="mx-2" />
    </form>
  </div>
</template>
