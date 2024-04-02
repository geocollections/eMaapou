<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

const emit = defineEmits(["update", "reset"]);

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

async function hydrateStratigraphy(values: string[]) {
  if (values.length < 1)
    return [];

  const res = await $solrFetch("/stratigraphy", {
    query: {
      q: "*",
      fq: [`hierarchy_string:(${values.join(" ")})`],
      limit: values.length,
    },
  });
  const facetQueries = res.response.docs.reduce((prev, doc: any) => {
    prev[doc.id] = {
      type: "query",
      q: `stratigraphy_hierarchy_descendent_paths:${doc.hierarchy_string}`,
    };
    return prev;
  }, {});

  const countRes = await $solrFetch("/analytical_data", {
    query: {
      json: {
        limit: 0,
        query: solrQuery.value,
        filter: solrFilters.value,
        facet: facetQueries,
      },
    },
  });

  return res.response.docs.map((doc: any) => ({
    id: doc.id,
    name: { et: doc.stratigraphy, en: doc.stratigraphy_en },
    value: doc.hierarchy_string,
    count: countRes.facets[doc.id].count,
  }));
}

async function getStratigraphyChildren(value: string) {
  const depth = value.split("-").length;
  const prefix = `${depth}/${value}`;

  const countRes = await $solrFetch("/analytical_data", {
    query: {
      json: {
        limit: 0,
        query: solrQuery.value,
        filter: solrFilters.value,
        facet: {
          categories: {
            type: "terms",
            prefix,
            limit: -1,
            field: "stratigraphy_categories",
            domain: {
              excludeTags: "stratigraphy",
            },
          },
        },
      },
    },
  });

  if (countRes.facets.categories.buckets.length < 1)
    return [];

  const values = countRes.facets.categories.buckets.map((bucket: any) => {
    const [_depth, value] = bucket.val.split("/");
    return value;
  });
  const res = await $solrFetch("/stratigraphy", {
    query: {
      q: "*",
      fq: [`hierarchy_string:(${values.join(" OR ")})`],
      rows: values.length,
    },
  });

  return countRes.facets.categories.buckets.map((bucket: any) => {
    const [_depth, value] = bucket.val.split("/");
    const doc = res.response.docs.find(
      (doc: any) => doc.hierarchy_string === value,
    );
    return {
      id: doc.id,
      name: { et: doc.stratigraphy, en: doc.stratigraphy_en },
      children: [],
      selected: filters.value.stratigraphy.value.includes(value),
      childrenLoaded: false,
      showChildren: false,
      value,
      count: bucket.count,
      leaf: doc.leaf_node,
    };
  });
}
function handleReset() {
  emit("reset");
}

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

function handleUpdate(excludeKey?: string) {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value, excludeKey);
    emit("update");
  });
}

function handleParameterFilterUpdate(value) {
  const removed = filters.value.parameter.value.filter(
    v => value.every((newV) => { return newV.parameter !== v.parameter; }),
  ).map(v => v.parameter);

  const added = value.filter(
    v => filters.value.parameter.value.every((oldV) => { return oldV.parameter !== v.parameter; }),
  ).map(v => v.parameter);

  removed.forEach((parameter) => {
    handleHeadersChange(parameter);
  });

  added.forEach((parameter) => {
    handleHeadersChange(parameter);
  });

  filters.value.parameter.value = value;
  handleUpdate();
}

function handleSubmit() {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value);
    emit("update");
  });
}

async function suggestParameters({
  query,
  _pagination,
  _values,
}: {
  query: string;
  pagination: { page: number; perPage: number };
  values: string[];
}): Promise<Suggestion[]> {
  const nameField = "parameter";

  const queryValue = query.trim() === "" ? "*" : `${nameField}:*${query}*`;

  const res = await $solrFetch("/analysis_parameter", {
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
  <VForm class="pb-10" @submit.prevent="handleSubmit">
    <SearchFormInput v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VDivider class="mx-2" />
    <VExpansionPanels
      variant="accordion"
      class="px-2"
      multiple
    >
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
    <VDivider class="mx-2" />
  </VForm>
</template>
