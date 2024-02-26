<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits(["update", "reset"]);

const analyticalDataStore = useAnalyticalData();
const { filters, query, solrQuery, solrFilters } = storeToRefs(analyticalDataStore);
const { suggest: suggestLocality, hydrate: hydrateLocality } = useAutocomplete(
  "/analytical_data",
  {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/analytical_data", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestSite, hydrate: hydrateSite }
  = useAutocomplete("/analytical_data", {
    idField: "site_id_s",
    nameField: "site",
    filterExclude: "site",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestProject, hydrate: hydrateProject }
  = useAutocomplete("/analytical_data", {
    idField: "project_id_s",
    nameField: { et: "project_name", en: "project_name_en" },
    filterExclude: "project",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestReference, hydrate: hydrateReference }
  = useAutocomplete("/analytical_data", {
    idField: "reference_id_s",
    nameField: "reference",
    filterExclude: "reference",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestDataset, hydrate: hydrateDataset }
  = useAutocomplete("/analytical_data", {
    idField: "dataset_id_s",
    nameField: "dataset_name",
    filterExclude: "dataset",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestLab, hydrate: hydrateLab }
  = useAutocomplete("/analytical_data", {
    idField: "lab_id_s",
    nameField: { et: "lab", en: "lab_en" },
    filterExclude: "lab",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestSample, hydrate: hydrateSample }
  = useAutocomplete("/analytical_data", {
    idField: "sample_id_s",
    nameField: "sample_number",
    filterExclude: "sample",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestMethod, hydrate: hydrateMethod }
  = useAutocomplete("/analytical_data", {
    idField: "method_id_s",
    nameField: { et: "analysis_method", en: "analysis_method_en" },
    filterExclude: "method",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

function handleReset() {
  emit("reset");
}

const filterLocality = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterMethod = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterSite = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterProject = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterReference = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterDataset = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterLab = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterSample = ref<InstanceType<typeof FilterInputAutocomplete>>();

function handleUpdate() {
  nextTick(() => {
    filterLocality.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    filterMethod.value?.refreshSuggestions();
    filterSite.value?.refreshSuggestions();
    filterProject.value?.refreshSuggestions();
    filterReference.value?.refreshSuggestions();
    filterDataset.value?.refreshSuggestions();
    filterLab.value?.refreshSuggestions();
    filterSample.value?.refreshSuggestions();
    emit("update");
  });
}
</script>

<template>
  <VForm @submit.prevent="handleUpdate">
    <InputSearch v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VExpansionPanels variant="accordion" multiple>
      <FilterInputRange
        v-model="filters.depth.value"
        :title="$t('filters.depth')"
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
        ref="filterProject"
        v-model="filters.project.value"
        :title="$t('filters.project')"
        :query-function="suggestProject"
        :hydration-function="hydrateProject"
        value="project"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterDataset"
        v-model="filters.dataset.value"
        :title="$t('filters.dataset')"
        :query-function="suggestDataset"
        :hydration-function="hydrateDataset"
        value="dataset"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterSample"
        v-model="filters.sample.value"
        :title="$t('filters.sample')"
        :query-function="suggestSample"
        :hydration-function="hydrateSample"
        value="sample"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterReference"
        v-model="filters.reference.value"
        :title="$t('filters.reference')"
        :query-function="suggestReference"
        :hydration-function="hydrateReference"
        value="reference"
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
      <FilterMap
        v-model="filters.geometry.value"
        value="map"
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
</template>
