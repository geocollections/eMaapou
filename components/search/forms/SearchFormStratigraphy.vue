<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits(["update", "reset"]);

const { locale } = useI18n();

const stratigraphiesStore = useStratigraphies();
const { filters, query, solrQuery, solrFilters } = storeToRefs(stratigraphiesStore);

const { suggest: suggestType, hydrate: hydrateType } = useAutocomplete(
  "/stratigraphy",
  {
    idField: "type_s",
    nameField: { et: "stratigraphy_type", en: "stratigraphy_type_en" },
    filterExclude: "type",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestScope, hydrate: hydrateScope } = useAutocomplete(
  "/stratigraphy",
  {
    idField: "scope_s",
    nameField: { et: "stratigraphy_scope", en: "stratigraphy_scope_en" },
    filterExclude: "scope",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestRank, hydrate: hydrateRank } = useAutocomplete(
  "/stratigraphy",
  {
    idField: "rank_s",
    nameField: { et: "stratigraphy_rank", en: "stratigraphy_rank_en" },
    filterExclude: "rank",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const { $solrFetch } = useNuxtApp();

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

  const countRes = await $solrFetch("/stratigraphy", {
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

async function getStratigraphyChildren(value: string, { page, perPage }: { page: number; perPage: number }) {
  const depth = value.split("-").length;
  const prefix = `${depth}/${value}`;

  const countRes = await $solrFetch("/stratigraphy", {
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

  return [countRes.facets.categories.buckets.map((bucket: any) => {
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
  }), countRes.facets.categories.numBuckets];
}

async function suggestStratigraphy(
  query: string,
  pagination: { page: number; perPage: number },
) {
  const searchField = locale.value === "et" ? "stratigraphy" : "stratigraphy_en";
  const queryStr = query.length < 1 ? "*" : `${searchField}:*${query}*`;
  const res = await $solrFetch("/stratigraphy", {
    query: {
      q: queryStr,
      rows: pagination.perPage,
      start: (pagination.page - 1) * pagination.perPage,
      sort: `${searchField} asc`,
    },
  });

  return res.response.docs.map((doc: any) => ({
    id: doc.hierarchy_string,
    name: { et: doc.stratigraphy, en: doc.stratigraphy_en },
    value: doc.hierarchy_string,
  }));
}
async function hydrateRock(values: string[]) {
  if (values.length < 1)
    return [];

  const res = await $solrFetch("/rock", {
    query: {
      q: "*",
      fq: [`hierarchy_strings:(${values.join(" ")})`],
      limit: values.length,
    },
  });
  const facetQueries = res.response.docs.reduce((prev, doc: any) => {
    prev[doc.id] = {
      type: "query",
      q: `rock_categories:*/${doc.hierarchy_strings[0]}*`,
    };
    return prev;
  }, {});

  const countRes = await $solrFetch("/stratigraphy", {
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
    name: { et: doc.name, en: doc.name_en },
    value: doc.hierarchy_strings[0],
    count: countRes.facets[doc.id].count,
  }));
}

const filterType = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterScope = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterRank = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<InstanceType<typeof FilterInputHierarchy>>();

const suggestionRefreshMap = computed(() => ({
  type: filterType.value?.refreshSuggestions,
  scope: filterScope.value?.refreshSuggestions,
  rank: filterRank.value?.refreshSuggestions,
  stratigraphy: filterStratigraphy.value?.refreshSuggestions,
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

function handleReset() {
  emit("reset");
}
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <InputSearch v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VExpansionPanels
      variant="accordion"
      class="px-2"
      multiple
    >
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
      <FilterInputText
        v-model="filters.index.value"
        :title="$t('filters.index')"
        value="index"
        @update:model-value="handleUpdate"
      />
      <FilterInputRange
        v-model="filters.age.value"
        :title="$t('filters.age')"
        value="age"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterType"
        v-model="filters.type.value"
        :title="$t('filters.type')"
        :query-function="suggestType"
        :hydration-function="hydrateType"
        value="type"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterRank"
        v-model="filters.rank.value"
        :title="$t('filters.rank')"
        :query-function="suggestRank"
        :hydration-function="hydrateRank"
        value="rank"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterScope"
        v-model="filters.scope.value"
        :title="$t('filters.scope')"
        :query-function="suggestScope"
        :hydration-function="hydrateScope"
        value="scope"
        @update:model-value="handleUpdate"
      />
    </VExpansionPanels>
  </VForm>
  <!-- <div> -->
  <!-- <v-form @submit.prevent="handleUpdate"> -->
  <!--   <input-search v-model="query" /> -->
  <!--   <search-actions class="mb-3" @click="handleReset" /> -->
  <!--   <v-expansion-panels accordion flat tile multiple> -->
  <!--     <filter-input-autocomplete-new -->
  <!--       v-model="stratigraphyHierarchy" -->
  <!--       :title="$t('filters.stratigraphyHierarchy')" -->
  <!--       :query-field=" -->
  <!--         $i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en' -->
  <!--       " -->
  <!--       :query-function="querySuggestionsStratigraphy" -->
  <!--     /> -->
  <!--     <filter-input-text -->
  <!--       v-model="index" -->
  <!--       :title="$t('filters.index')" -->
  <!--     /> -->
  <!--     <filter-input-text -->
  <!--       v-model="age" -->
  <!--       :title="$t('filters.age')" -->
  <!--     /> -->
  <!--     <filter-input-autocomplete-new -->
  <!--       v-model="type" -->
  <!--       :title="$t('filters.type')" -->
  <!--       static -->
  <!--       :query-field=" -->
  <!--         $i18n.locale === 'et' ? 'stratigraphy_type' : 'stratigraphy_type_en' -->
  <!--       " -->
  <!--       :query-function="querySuggestionsType" -->
  <!--     /> -->
  <!--     <filter-input-autocomplete-new -->
  <!--       v-model="rank" -->
  <!--       :title="$t('filters.rank')" -->
  <!--       static -->
  <!--       :query-field=" -->
  <!--         $i18n.locale === 'et' ? 'stratigraphy_rank' : 'stratigraphy_rank_en' -->
  <!--       " -->
  <!--       :query-function="querySuggestionsRank" -->
  <!--     /> -->
  <!--     <filter-input-autocomplete-new -->
  <!--       v-model="scope" -->
  <!--       :title="$t('filters.scope')" -->
  <!--       static -->
  <!--       :query-field=" -->
  <!--         $i18n.locale === 'et' ? 'stratigraphy_scope' : 'stratigraphy_scope' -->
  <!--       " -->
  <!--       :query-function="querySuggestionsScope" -->
  <!--     /> -->
  <!--   </v-expansion-panels> -->
  <!-- </v-form> -->
  <!-- </div> -->
</template>
