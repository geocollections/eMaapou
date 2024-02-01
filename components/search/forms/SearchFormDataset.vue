<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
          v-model="filters.name.value"
          :title="$t('filters.datasetName')"
          @update:model-value="handleUpdate"
          value="name"
        />
        <filter-input-autocomplete
          v-model="filters.analysedParameter.value"
          ref="filterAnalysedParameter"
          :show-filter="false"
          :title="$t('filters.analysisParameter')"
          :query-function="suggestParameter"
          :hydration-function="hydrateParameter"
          @update:model-value="handleUpdate"
          value="analysisParameter"
        />
        <filter-input-text
          v-model="filters.owner.value"
          :title="$t('filters.owner')"
          @update:model-value="handleUpdate"
          value="owner"
        />
        <filter-input-text
          v-model="filters.date.value"
          :title="$t('filters.date')"
          @update:model-value="handleUpdate"
          value="date"
        />
        <filter-input-autocomplete
          v-model="filters.institution.value"
          ref="filterInstitution"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          @update:model-value="handleUpdate"
          value="institution"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

import type FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset"]);

const filterAnalysedParameter =
  ref<InstanceType<typeof FilterInputAutocomplete>>();
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

const { suggest: suggestAnalysedParameter, hydrate: hydrateAnalysedParameter } =
  useAutocomplete("/dataset", {
    idField: "parameter_index_list",
    nameField: "parameter_list",
    filterExclude: "analysedParameter",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution } =
  useAutocomplete("/dataset", {
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
  const filters =
    query.length > 0
      ? [...(solrFilters.value ?? []), `parameter_list:*${query}*`]
      : solrFilters.value ?? [];

  const res = await $solrFetch("/dataset", {
    query: {
      facet: "true",
      "facet.pivot": pivot,
      [`f.parameter_index_list.facet.excludeTerms`]: values.join(","),
      "facet.limit": pagination.perPage,
      "facet.sort": "count",
      [`f.parameter_index_list.facet.offset`]:
        (pagination.page - 1) * pagination.perPage,
      json: {
        query: solrQuery?.value,
        filter: filters,
        limit: 0,
      },
    },
  });
  const ids = res.facet_counts.facet_pivot["parameter_index_list"].map(
    (item) => item.value,
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

  return res.facet_counts.facet_pivot["parameter_index_list"].map((item) => ({
    id: item.value,
    name:
      nameRes.response.docs.find((doc) => doc.parameter_index === item.value)
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

  return values.map((id) => ({
    id,
    name:
      nameRes.response.docs.find((doc) => doc.parameter_index === id)
        ?.parameter ?? id,
    count: res.facets[id].count,
  }));
}
console.log(await hydrateParameter(["MgO_pct"]));
</script>
