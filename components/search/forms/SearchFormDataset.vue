<script setup lang="ts">
import FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset", "submit"]);

const filterAnalysedParameter
  = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<InstanceType<typeof FilterInputAutocomplete>>();

const datasetsStore = useDatasets();
const { filters, query, solrQuery, solrFilters } = storeToRefs(datasetsStore);

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterAnalysedParameter.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    emit("update");
  });
}

function handleSubmit() {
  nextTick(() => {
    filterAnalysedParameter.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    emit("update");
  });
}

const { suggest: suggestAnalysedParameter, hydrate: hydrateAnalysedParameter }
  = useAutocomplete("/dataset", {
    idField: "parameter_index_list",
    nameField: "parameter_list",
    filterExclude: "analysedParameter",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/dataset", {
    idField: "database_id_s",
    nameField: "database_acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { $solrFetch } = useNuxtApp();
async function suggestParameter({
  query,
  pagination,
  values,
}: {
  query: string;
  pagination: { page: number; perPage: number };
  values: string[];
}): Promise<Suggestion[]> {
  const pivot = `{!ex=analysedParameter}parameter_index_list`;
  const filters
    = query.length > 0
      ? [...(solrFilters.value ?? []), `parameter_list:*${query}*`]
      : solrFilters.value ?? [];

  const res = await $solrFetch("/dataset", {
    query: {
      "facet": "true",
      "facet.pivot": pivot,
      [`f.parameter_index_list.facet.excludeTerms`]: values.join(","),
      "facet.limit": pagination.perPage,
      "facet.sort": "count",
      [`f.parameter_index_list.facet.offset`]:
        (pagination.page - 1) * pagination.perPage,
      "json": {
        query: solrQuery?.value,
        filter: filters,
        limit: 0,
      },
    },
  });
  const ids = res.facet_counts.facet_pivot.parameter_index_list.map(
    item => item.value,
  );

  const nameRes = await $solrFetch("/analysis_parameter", {
    query: {
      json: {
        query: "*",
        filter: [`parameter_index:(${ids.join(" OR ")})`],
        limit: ids.length,
      },
    },
  });

  return res.facet_counts.facet_pivot.parameter_index_list.map(item => ({
    id: item.value,
    name:
      nameRes.response.docs.find(doc => doc.parameter_index === item.value)
        ?.parameter ?? item.value,
    count: item.count,
  }));
}
async function hydrateParameter(values: string[]) {
  const facets = values.reduce((prev, id) => {
    prev[id] = {
      type: "query",
      q: `parameter_index_list:${id}`,
    };
    return prev;
  }, {});

  const res = await $solrFetch("/dataset", {
    query: {
      json: {
        limit: 0,
        query: solrQuery?.value,
        filter: solrFilters?.value,
        facet: {
          ...facets,
        },
      },
    },
  });
  const nameRes = await $solrFetch("/analysis_parameter", {
    query: {
      json: {
        query: "*",
        filter: [`parameter_index:(${values.join(" OR ")})`],
        limit: values.length,
      },
    },
  });

  return values.map(id => ({
    id,
    name:
      nameRes.response.docs.find(doc => doc.parameter_index === id)
        ?.parameter ?? id,
    count: res.facets[id].count,
  }));
}
</script>

<template>
  <div>
    <VForm class="pb-10" @submit.prevent="handleSubmit">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <VDivider class="mx-2" />
      <VExpansionPanels
        variant="accordion"
        class="px-2"
        multiple
      >
        <FilterInputText
          v-model="filters.name.value"
          :title="$t('filters.datasetName')"
          value="name"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterAnalysedParameter"
          v-model="filters.analysedParameter.value"
          :show-filter="false"
          :title="$t('filters.analysisParameter')"
          :query-function="suggestParameter"
          :hydration-function="hydrateParameter"
          value="analysisParameter"
          @update:model-value="handleUpdate"
        />
        <FilterInputText
          v-model="filters.owner.value"
          :title="$t('filters.owner')"
          value="owner"
          @update:model-value="handleUpdate"
        />
        <FilterInputText
          v-model="filters.date.value"
          :title="$t('filters.date')"
          value="date"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterInstitution"
          v-model="filters.institution.value"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          value="institution"
          @update:model-value="handleUpdate"
        />
      </VExpansionPanels>
      <VDivider class="mx-2" />
    </VForm>
  </div>
</template>
