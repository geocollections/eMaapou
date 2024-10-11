<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";
import type { Suggestion } from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const analyticalDataStore = useAnalyticalData();
const { handleHeadersChange } = analyticalDataStore;
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

const { $solrFetch } = useNuxtApp();

const { suggest: suggestMethod, hydrate: hydrateMethod }
  = useAutocomplete("/analytical_data", {
    idField: "method_id_s",
    nameField: { et: "analysis_method", en: "analysis_method_en" },
    filterExclude: "method",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestStratigraphy, hydrate: hydrateStratigraphy, getChildren: getStratigraphyChildren } = useStratigraphyHierarchyFilter("/analytical_data", {
  filterExclude: "stratigraphy",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.stratigraphy,
});

const filterLocality = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterMethod = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterSite = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterProject = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterReference = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterDataset = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterLab = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterSample = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<ComponentExposed<typeof FilterInputHierarchy>>();

const suggestionRefreshMap = computed(() => {
  return {
    locality: filterLocality.value?.refreshSuggestions,
    method: filterMethod.value?.refreshSuggestions,
    institution: filterInstitution.value?.refreshSuggestions,
    site: filterSite.value?.refreshSuggestions,
    project: filterProject.value?.refreshSuggestions,
    reference: filterReference.value?.refreshSuggestions,
    dataset: filterDataset.value?.refreshSuggestions,
    lab: filterLab.value?.refreshSuggestions,
    sample: filterSample.value?.refreshSuggestions,
    stratigraphy: filterStratigraphy.value?.refreshSuggestions,
  };
});

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

function handleParameterFilterUpdate(value: ParameterValue[]) {
  const removed = filters.value.parameter.value.filter(
    v => value.every((newV) => { return newV.parameter !== v.parameter; }),
  ).map(v => v.parameter);

  const added = value.filter(
    v => filters.value.parameter.value.every((oldV) => { return oldV.parameter !== v.parameter; }),
  ).map(v => v.parameter);

  removed.forEach((parameter) => {
    if (parameter)
      handleHeadersChange(parameter);
  });

  added.forEach((parameter) => {
    if (parameter)
      handleHeadersChange(parameter);
  });

  filters.value.parameter.value = value;
  handleUpdate();
}

async function suggestParameters({
  query,
  // eslint-disable-next-line unused-imports/no-unused-vars
  pagination,
  // eslint-disable-next-line unused-imports/no-unused-vars
  values,
}: {
  query: string;
  pagination: { page: number; perPage: number };
  values: ParameterValue[];
}): Promise<Suggestion[]> {
  const nameField = "parameter";

  const queryValue = query.trim() === "" ? "*" : `${nameField}:*${query}*`;

  const res = await $solrFetch<SolrResponse>("/analysis_parameter", {
    query: {
      json: {
        query: queryValue,
        limit: 1000,
      },
    },
  });

  return res.response.docs.map(
    (doc: any) => {
      return {
        id: doc.parameter_index,
        name: doc.parameter,
        count: 1,
      };
    },
  );
}
</script>

<template>
  <form class="pb-10" @submit.prevent="handleSubmit">
    <SearchFormInput v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <div id="divider" class="mx-2" />
    <VExpansionPanels
      variant="accordion"
      class="px-2"
      multiple
    >
      <FilterInputRange
        v-model="filters.depth.value"
        :title="$t('filters.depth')"
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
        ref="filterProject"
        v-model="filters.project.value"
        :title="$t('filters.project')"
        :query-function="suggestProject"
        :hydration-function="hydrateProject"
        value="project"
        @update:model-value="handleUpdate('project')"
      />
      <FilterInputAutocomplete
        ref="filterDataset"
        v-model="filters.dataset.value"
        :title="$t('filters.dataset')"
        :query-function="suggestDataset"
        :hydration-function="hydrateDataset"
        value="dataset"
        @update:model-value="handleUpdate('dataset')"
      />
      <FilterInputAutocomplete
        ref="filterSample"
        v-model="filters.sample.value"
        :title="$t('filters.sample')"
        :query-function="suggestSample"
        :hydration-function="hydrateSample"
        value="sample"
        @update:model-value="handleUpdate('sample')"
      />
      <FilterInputParameter
        :model-value="filters.parameter.value"
        :query-function="suggestParameters"
        @update:model-value="handleParameterFilterUpdate"
      />
      <FilterInputHierarchy
        ref="filterStratigraphy"
        v-model="filters.stratigraphy.value"
        root-value="1"
        :title="$t('filters.stratigraphyHierarchy')"
        :hydration-function="hydrateStratigraphy"
        :get-children="getStratigraphyChildren"
        :suggestion-function="suggestStratigraphy"
        value="stratigraphy"
        @update:model-value="handleUpdate('stratigraphy')"
      />
      <FilterInputAutocomplete
        ref="filterReference"
        v-model="filters.reference.value"
        :title="$t('filters.reference')"
        :query-function="suggestReference"
        :hydration-function="hydrateReference"
        value="reference"
        @update:model-value="handleUpdate('reference')"
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
        @update:model-value="handleUpdate('institution')"
      />
    </VExpansionPanels>
    <div id="divider" class="mx-2" />
  </form>
</template>
