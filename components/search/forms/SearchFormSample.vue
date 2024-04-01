<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

const emit = defineEmits(["update", "reset"]);

const samplesStore = useSamples();
const { filters, query, solrQuery, solrFilters } = storeToRefs(samplesStore);
const { suggest: suggestLocality, hydrate: hydrateLocality } = useAutocomplete(
  "/sample",
  {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestCollector, hydrate: hydrateCollector }
  = useAutocomplete("/sample", {
    idField: "collector_id_s",
    nameField: "collector",
    filterExclude: "collector",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/sample", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { $solrFetch } = useNuxtApp();
const { locale } = useI18n();

// async function hydrateRock(values: string[]) {
//   const nameField = locale.value === "et" ? "rock" : "rock_en";
//   const facets = values.reduce((prev, id) => {
//     prev[id] = {
//       type: "query",
//       q: `rock_id:${id} OR hierarchy_string_rock:*-${id}-*`,
//       facet: {
//         name: {
//           type: "terms",
//           field: nameField,
//           limit: 1,
//           domain: {
//             query: "*:*",
//             filter: `rock_id:${id}`,
//           },
//         },
//       },
//     };
//     return prev;
//   }, {});
//
//   const res = await $solrFetch("/sample", {
//     query: {
//       json: {
//         limit: 0,
//         query: solrQuery.value,
//         filter: solrFilters?.value,
//         facet: {
//           ...facets,
//         },
//       },
//     },
//   });
//
//   return values.map((id) => ({
//     id,
//     name: res.facets[id].name.buckets[0].val,
//     count: res.facets[id].count,
//   }));
// }
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

  const countRes = await $solrFetch("/sample", {
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

  const countRes = await $solrFetch("/sample", {
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

  const countRes = await $solrFetch("/sample", {
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
async function getRockChildren(value: string, { page, perPage }: { page: number; perPage: number }) {
  const depth = value.split("-").length;
  const prefix = value.length < 1 ? "0/" : `${depth}/${value}`;

  const countRes = await $solrFetch("/sample", {
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
            field: "rock_categories",
            domain: {
              excludeTags: "rock",
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
  const res = await $solrFetch("/rock", {
    query: {
      q: "*",
      fq: [`hierarchy_strings:(${values.join(" OR ")})`],
      rows: values.length,
    },
  });

  return [countRes.facets.categories.buckets.map((bucket: any) => {
    const [_depth, value] = bucket.val.split("/");
    const doc = res.response.docs.find((doc: any) =>
      doc.hierarchy_strings.includes(value),
    );
    return {
      id: doc.id,
      name: { et: doc.name, en: doc.name_en },
      children: [],
      selected: filters.value.rock.value.includes(value),
      childrenLoaded: false,
      showChildren: false,
      value,
      count: bucket.count,
      leaf: false,
    };
  }), countRes.facets.categories.numBuckets];
}

async function suggestRock(
  query: string,
  pagination: { page: number; perPage: number },
) {
  const searchField = locale.value === "et" ? "name" : "name_en";
  const queryStr = query.length < 1 ? "*" : `${searchField}:*${query}*`;
  const res = await $solrFetch("/rock", {
    query: {
      q: queryStr,
      rows: pagination.perPage,
      start: (pagination.page - 1) * pagination.perPage,
      sort: `${searchField} asc`,
    },
  });

  return res.response.docs.map((doc: any) => ({
    id: doc.hierarchy_strings[0],
    name: { et: doc.name, en: doc.name_en },
    value: doc.hierarchy_strings[0],
  }));
}

function handleReset() {
  emit("reset");
}

const filterLocality = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<InstanceType<typeof FilterInputHierarchy>>();
const filterRock = ref<InstanceType<typeof FilterInputHierarchy>>();
const filterCollector = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => {
  return {
    locality: filterLocality.value?.refreshSuggestions,
    stratigraphy: filterStratigraphy.value?.refreshSuggestions,
    rock: filterRock.value?.refreshSuggestions,
    collector: filterCollector.value?.refreshSuggestions,
    institution: filterInstitution.value?.refreshSuggestions,
  };
});
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
  <div>
    <VForm class="pb-10" @submit.prevent="handleSubmit">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <FilterInputCheckbox
        v-model="filters.hasImage.value"
        :label="$t('filters.hasImage')"
        @update:model-value="handleUpdate"
      />
      <FilterInputCheckbox
        v-model="filters.hasCoordinates.value"
        :label="$t('filters.hasCoordinates')"
        @update:model-value="handleUpdate"
      />
      <VDivider class="mx-2" />
      <VExpansionPanels
        variant="accordion"
        class="px-2"
        multiple
      >
        <FilterInputText
          v-model="filters.number.value"
          :title="$t('filters.sampleNumber')"
          value="number"
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
        <FilterMap
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate"
        />
        <FilterInputRange
          v-model="filters.depth.value"
          :title="$t('filters.depth')"
          value="depth"
          @update:model-value="handleUpdate"
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
        <FilterInputHierarchy
          ref="filterRock"
          v-model="filters.rock.value"
          root-value=""
          :title="$t('filters.rockHierarchy')"
          :hydration-function="hydrateRock"
          :get-children="getRockChildren"
          :suggestion-function="suggestRock"
          value="rock"
          @update:model-value="handleUpdate('rock')"
        />
        <FilterInputAutocomplete
          ref="filterCollector"
          v-model="filters.collector.value"
          :title="$t('filters.collector')"
          :query-function="suggestCollector"
          :hydration-function="hydrateCollector"
          value="collector"
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
  </div>
</template>
