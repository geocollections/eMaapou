<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits(["update", "reset"]);

function handleReset() {
  emit("reset");
}

const filterInstitution = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterLab = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterMethod = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterLocality = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterSite = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterSample = ref<InstanceType<typeof FilterInputAutocomplete>>();

function handleUpdate() {
  nextTick(() => {
    filterInstitution.value?.refreshSuggestions();
    filterLab.value?.refreshSuggestions();
    filterMethod.value?.refreshSuggestions();
    filterLocality.value?.refreshSuggestions();
    filterSite.value?.refreshSuggestions();
    filterSample.value?.refreshSuggestions();
    emit("update");
  });
}
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
</script>

<template>
  <div>
    <VForm @submit.prevent="handleUpdate">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <VExpansionPanels
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
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterMethod"
          v-model="filters.method.value"
          :title="$t('filters.method')"
          :query-function="suggestMethod"
          :hydration-function="hydrateMethod"
          value="method"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterLab"
          v-model="filters.lab.value"
          :title="$t('filters.lab')"
          :query-function="suggestLab"
          :hydration-function="hydrateLab"
          value="lab"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterSample"
          v-model="filters.sample.value"
          :title="$t('filters.sample')"
          :query-function="suggestSample"
          :hydration-function="hydrateSample"
          primary="id"
          value="sample"
          @update:model-value="handleUpdate"
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
          ref="filterSite"
          v-model="filters.site.value"
          :title="$t('filters.site')"
          :query-function="suggestSite"
          :hydration-function="hydrateSite"
          value="site"
          @update:model-value="handleUpdate"
        />
        <FilterInputText
          v-model="filters.agent.value"
          :title="$t('filters.agent')"
          value="agent"
          @update:model-value="handleUpdate"
        />
        <FilterMap
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate"
        />
        <FilterInputText
          v-model="filters.agent.value"
          :title="$t('filters.agent')"
          value="agent"
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
    </VForm>
  </div>
</template>
