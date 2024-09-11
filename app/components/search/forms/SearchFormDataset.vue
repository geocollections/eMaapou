<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";
import type { ComponentExposed } from "vue-component-type-helpers";
import type { Suggestion } from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const datasetsStore = useDatasets();
const { filters, query, solrQuery, solrFilters } = storeToRefs(datasetsStore);

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

  const res = await $solrFetch<any>("/dataset", {
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
    (item: any) => item.value,
  );

  const filter = ids.length > 0 ? `parameter_index:(${ids.join(" OR ")})` : undefined;
  const nameRes = await $solrFetch<any>("/analysis_parameter", {
    query: {
      json: {
        query: "*",
        filter,
        limit: ids.length,
      },
    },
  });

  return res.facet_counts.facet_pivot.parameter_index_list.map((item: any) => ({
    id: item.value,
    name:
      nameRes.response.docs.find((doc: any) => doc.parameter_index === item.value)
        ?.parameter ?? item.value,
    count: item.count,
  }));
}
async function hydrateParameter(values: string[]) {
  const facets = values.reduce((prev: { [K: string]: any }, id) => {
    prev[id] = {
      type: "query",
      q: `parameter_index_list:${id}`,
    };
    return prev;
  }, {});

  const res = await $solrFetch<any>("/dataset", {
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

  const filter = values.length > 0 ? `parameter_index:(${values.join(" OR ")})` : undefined;

  const nameRes = await $solrFetch<any>("/analysis_parameter", {
    query: {
      json: {
        query: "*",
        filter,
        limit: values.length,
      },
    },
  });

  return values.map(id => ({
    id,
    name:
      nameRes.response.docs.find((doc: any) => doc.parameter_index === id)
        ?.parameter ?? id,
    count: res.facets[id].count,
  }));
}

const filterAnalysedParameter = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  analysisParameter: filterAnalysedParameter.value?.refreshSuggestions,
  institution: filterInstitution.value?.refreshSuggestions,
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
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterAnalysedParameter"
          v-model="filters.analysedParameter.value"
          :show-filter="false"
          :title="$t('filters.analysisParameter')"
          :query-function="suggestParameter"
          :hydration-function="hydrateParameter"
          value="analysisParameter"
          @update:model-value="handleUpdate('analysisParameter')"
        />
        <FilterInputText
          v-model="filters.owner.value"
          :title="$t('filters.owner')"
          value="owner"
          @update:model-value="handleUpdate()"
        />
        <FilterInputText
          v-model="filters.date.value"
          :title="$t('filters.date')"
          value="date"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterInstitution"
          v-model="filters.institution.value"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          value="institution"
          @update:model-value="handleUpdate('institution')"
        />
      </VExpansionPanels>
      <VDivider class="mx-2" />
    </VForm>
  </div>
</template>
