<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputHierarchy } from "#components";

const emit = defineEmits(["update", "reset"]);

const taxaStore = useTaxa();
const { filters, query, solrQuery, solrFilters } = storeToRefs(taxaStore);

const { $solrFetch } = useNuxtApp();

async function hydrateTaxon(values: string[]) {
  if (values.length < 1)
    return [];

  const res = await $solrFetch("/taxon", {
    query: {
      q: "*",
      fq: [`hierarchy_string:(${values.join(" ")})`],
      limit: values.length,
    },
  });
  const facetQueries = res.response.docs.reduce((prev, doc: any) => {
    prev[doc.id] = {
      type: "query",
      q: `taxon_hierarchy_descendent_paths:${doc.hierarchy_string}`,
    };
    return prev;
  }, {});

  const countRes = await $solrFetch("/taxon", {
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
    name: doc.taxon,
    value: doc.hierarchy_string,
    count: countRes.facets[doc.id].count,
  }));
}

async function getTaxonChildren(value: string, { page, perPage }: { page: number; perPage: number }) {
  const depth = value.split("-").length;
  const prefix = `${depth}/${value}`;

  const countRes = await $solrFetch("/taxon", {
    query: {
      json: {
        limit: 0,
        query: solrQuery.value,
        filter: solrFilters.value,
        facet: {
          categories: {
            type: "terms",
            prefix,
            offset: (page - 1) * perPage,
            limit: perPage,
            numBuckets: true,
            field: "taxon_categories",
            domain: {
              excludeTags: "taxon",
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
  const res = await $solrFetch("/taxon", {
    query: {
      q: "*",
      fq: [`hierarchy_string:(${values.join(" OR ")})`],
      rows: values.length,
    },
  });

  return [countRes.facets.categories.buckets.map((bucket: any) => {
    const [_depth, value] = bucket.val.split("/");
    const doc = res.response.docs.find(
      (doc: any) => doc.hierarchy_string === value,
    );
    return {
      id: doc.id,
      name: doc.taxon,
      children: [],
      selected: filters.value.taxon.value.includes(value),
      childrenLoaded: false,
      showChildren: false,
      value,
      count: bucket.count,
      leaf: doc.leaf_node,
    };
  }), countRes.facets.categories.numBuckets];
}

async function suggestTaxon(
  query: string,
  pagination: { page: number; perPage: number },
) {
  const searchField = "taxon";
  const queryStr = query.length < 1 ? "*" : `${searchField}:*${query}*`;
  const res = await $solrFetch("/taxon", {
    query: {
      q: queryStr,
      rows: pagination.perPage,
      start: (pagination.page - 1) * pagination.perPage,
      sort: `${searchField} asc`,
    },
  });

  return res.response.docs.map((doc: any) => ({
    id: doc.hierarchy_string,
    name: { et: doc.taxon, en: doc.taxon },
    value: doc.hierarchy_string,
  }));
}

function handleReset() {
  emit("reset");
}

const filterTaxon = ref<ComponentExposed<typeof FilterInputHierarchy>>();

const suggestionRefreshMap = computed(() => ({
  taxon: filterTaxon.value?.refreshSuggestions,
}));

function handleUpdate(excludeKey?: string) {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value, excludeKey);
    emit("update");
  });
}

function handleSubmit() {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value);
    emit("update");
  });
}
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <InputSearch v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VExpansionPanels variant="accordion" multiple>
      <FilterInputText
        v-model="filters.species.value"
        :title="$t('filters.species')"
        value="species"
        @update:model-value="handleUpdate"
      />
      <FilterInputHierarchy
        ref="filterTaxon"
        v-model="filters.taxon.value"
        root-value=""
        :title="$t('filters.taxonHierarchy')"
        :hydration-function="hydrateTaxon"
        :get-children="getTaxonChildren"
        :suggestion-function="suggestTaxon"
        value="taxon"
        @update:model-value="handleUpdate('taxon')"
      />
      <FilterMap
        v-model="filters.geometry.value"
        value="map"
        @update:model-value="handleUpdate"
      />
      <FilterInputText
        v-model="filters.author.value"
        :title="$t('filters.author')"
        value="author"
        @update:model-value="handleUpdate"
      />
    </VExpansionPanels>
  </VForm>
</template>
