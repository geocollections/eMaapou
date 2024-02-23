<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";

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
async function suggestRock({
  query,
  pagination,
  values,
}: {
  query: string;
  pagination: { page: number; perPage: number };
  values: string[];
}) {
  const primaryField = locale.value === "et" ? "rock" : "rock_en";
  const pivot = `${primaryField},rock_id`;

  const res = await $solrFetch("/sample", {
    query: {
      "facet": "true",
      "facet.pivot": `{!ex=rock}${pivot}`,
      [`f.${primaryField}.facet.contains`]: query,
      [`f.${primaryField}.facet.contains.ignoreCase`]: true,
      [`f.${primaryField}.facet.excludeTerms`]: values.join(","),
      "facet.limit": pagination.perPage,
      [`f.${primaryField}.facet.offset`]:
        (pagination.page - 1) * pagination.perPage,
      "json": {
        query: solrQuery.value,
        filter: solrFilters.value,
        limit: 0,
      },
    },
  });
  const facetQueries = res.facet_counts.facet_pivot[pivot].reduce(
    (prev, item) => {
      prev[item.value]
        = `{!ex=rock}rock_id:${item.pivot[0].value} OR hierarchy_string_rock:*-${item.pivot[0].value}-*`;
      return prev;
    },
    {},
  );
  const res2 = await $solrFetch("/sample", {
    query: {
      "facet": "true",
      "facet.query": Object.values(facetQueries),
      "json": {
        query: solrQuery.value,
        filter: solrFilters.value,
        limit: 0,
      },
    },
  });

  return res.facet_counts.facet_pivot[pivot].map((item) => {
    return {
      id: item.pivot[0].pivot?.map(p => p.value) ?? item.pivot[0].value,
      name: item.value,
      count: res2.facet_counts.facet_queries[facetQueries[item.value]],
    };
  });
}

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

async function getStratigraphyChildren(value: string) {
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
async function getRockChildren(value: string) {
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
            limit: -1,
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

  return countRes.facets.categories.buckets.map((bucket: any) => {
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
  });
}

function handleReset() {
  emit("reset");
}

const filterLocality = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterRock = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterCollector = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<InstanceType<typeof FilterInputAutocomplete>>();
function handleUpdate() {
  nextTick(() => {
    filterLocality.value?.refreshSuggestions();
    filterStratigraphy.value?.refreshSuggestions();
    filterRock.value?.refreshSuggestions();
    filterCollector.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    emit("update");
  });
}
</script>

<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <filter-input-checkbox
        v-model="filters.hasImage.value"
        :label="$t('filters.hasImage')"
        @update:model-value="handleUpdate"
      />
      <filter-input-checkbox
        v-model="filters.hasCoordinates.value"
        :label="$t('filters.hasCoordinates')"
        @update:model-value="handleUpdate"
      />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
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
        <filter-map
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.depth.value"
          :title="$t('filters.depth')"
          value="depth"
          @update:model-value="handleUpdate"
        />
        <filter-input-hierarchy
          ref="filterStratigraphy"
          v-model="filters.stratigraphy.value"
          root-value="1"
          :title="$t('filters.stratigraphyHierarchy')"
          :hydration-function="hydrateStratigraphy"
          :get-children="getStratigraphyChildren"
          value="stratigraphy"
          @update:model-value="handleUpdate"
        />
        <!-- TODO: This is not finished, have to think how to handle multiple hierarchy string on one rock -->
        <filter-input-hierarchy
          ref="filterRock"
          v-model="filters.rock.value"
          root-value=""
          :title="$t('filters.rockHierarchy')"
          :hydration-function="hydrateRock"
          :get-children="getRockChildren"
          value="rock"
          @update:model-value="handleUpdate"
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
      </v-expansion-panels>
    </v-form>
  </div>
</template>
