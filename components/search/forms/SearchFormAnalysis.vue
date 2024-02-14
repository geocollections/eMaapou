<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels v-model="test" variant="accordion" multiple>
        <filter-input-range
          v-model="filters.depth.value"
          :title="$t('filters.depth')"
          interval-labels="intervals.depth"
          :step="0.01"
          @update:model-value="handleUpdate"
          value="depth"
        />
        <filter-input-autocomplete
          v-model="filters.method.value"
          ref="filterMethod"
          :title="$t('filters.method')"
          :query-function="suggestMethod"
          :hydration-function="hydrateMethod"
          @update:model-value="handleUpdate"
          value="method"
        />
        <filter-input-autocomplete
          v-model="filters.lab.value"
          ref="filterLab"
          :title="$t('filters.lab')"
          :query-function="suggestLab"
          :hydration-function="hydrateLab"
          @update:model-value="handleUpdate"
          value="lab"
        />
        <filter-input-autocomplete
          v-model="filters.sample.value"
          ref="filterSample"
          :title="$t('filters.sample')"
          :query-function="suggestSample"
          :hydration-function="hydrateSample"
          primary="id"
          @update:model-value="handleUpdate"
          value="sample"
        />
        <filter-input-autocomplete
          v-model="filters.locality.value"
          ref="filterLocality"
          :title="$t('filters.locality')"
          :query-function="suggestLocality"
          :hydration-function="hydrateLocality"
          @update:model-value="handleUpdate"
          value="locality"
        />
        <filter-input-autocomplete
          v-model="filters.site.value"
          ref="filterSite"
          :title="$t('filters.site')"
          :query-function="suggestSite"
          :hydration-function="hydrateSite"
          @update:model-value="handleUpdate"
          value="site"
        />
        <filter-input-text
          v-model="filters.agent.value"
          :title="$t('filters.agent')"
          @update:model-value="handleUpdate"
          value="agent"
        />
        <filter-map
          v-model="filters.geometry.value"
          @update:model-value="handleUpdate"
          value="map"
        />
        <filter-input-text
          v-model="filters.agent.value"
          :title="$t('filters.agent')"
          @update:model-value="handleUpdate"
          value="agent"
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
import type { FilterInputAutocomplete } from "#build/components";

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
const { suggest: suggestInstitution, hydrate: hydrateInstitution } =
  useAutocomplete("/analysis", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
</script>
