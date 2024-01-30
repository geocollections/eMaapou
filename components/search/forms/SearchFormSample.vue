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
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.locality.value"
          ref="filterLocality"
          :title="$t('filters.locality')"
          :query-function="suggestLocality"
          :hydration-function="hydrateLocality"
          @update:model-value="handleUpdate"
        />
        <filter-map
          v-model="filters.geometry.value"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.depth.value"
          :title="$t('filters.depth')"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.stratigraphy.value"
          ref="filterStratigraphy"
          :title="$t('filters.stratigraphyHierarchy')"
          :query-function="suggestStratigraphy"
          :hydration-function="hydrateStratigraphy"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.rock.value"
          ref="filterRock"
          :title="$t('filters.rockHierarchy')"
          :query-function="suggestRock"
          :hydration-function="hydrateRock"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.collector.value"
          ref="filterCollector"
          :title="$t('filters.collector')"
          :query-function="suggestCollector"
          :hydration-function="hydrateCollector"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.institution.value"
          ref="filterInstitution"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          @update:model-value="handleUpdate"
          :per-page="-1"
        />
        <!--   <filter-input-autocomplete-new -->
        <!--     v-model="locality" -->
        <!--     :title="$t('filters.locality').toString()" -->
        <!--     :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'" -->
        <!--     :query-function="querySuggestionsLocality" -->
        <!--   /> -->
        <!--   <filter-map -->
        <!--     v-model="map" -->
        <!--     sample-overlay -->
        <!--     :items="$accessor.search.sample.items" -->
        <!--   /> -->
        <!--   <filter-input-range -->
        <!--     v-model="depth" -->
        <!--     :label="$t('filters.depth').toString()" -->
        <!--     interval-labels="intervals.depth" -->
        <!--     :step="0.01" -->
        <!--   /> -->
        <!--   <filter-input-autocomplete-new -->
        <!--     v-model="stratigraphyHierarchy" -->
        <!--     :title="$t('filters.stratigraphyHierarchy').toString()" -->
        <!--     :query-field=" -->
        <!--       $i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en' -->
        <!--     " -->
        <!--     :query-function="querySuggestionsStratigraphy" -->
        <!--   /> -->
        <!--   <filter-input-autocomplete-new -->
        <!--     v-model="rockHierarchy" -->
        <!--     :title="$t('filters.rockHierarchySpecimen').toString()" -->
        <!--     :query-field="$i18n.locale === 'et' ? 'rock' : 'rock_en'" -->
        <!--     :query-function="querySuggestionsRock" -->
        <!--   /> -->
        <!--   <filter-input-text -->
        <!--     v-model="collector" -->
        <!--     :title="$t('filters.collector').toString()" -->
        <!--   /> -->
        <!--   <filter-institution v-model="institutions" /> -->
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { FilterInputAutocomplete } from "#build/components";

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
const { suggest: suggestCollector, hydrate: hydrateCollector } =
  useAutocomplete("/sample", {
    idField: "collector_id_s",
    nameField: "collector",
    filterExclude: "collector",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestStratigraphy, hydrate: hydrateStratigraphy } =
  useAutocomplete("/sample", {
    idField: "stratigraphy_hierarchy",
    nameField: { et: "stratigraphy", en: "stratigraphy_en" },
    filterExclude: "stratigraphy",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution } =
  useAutocomplete("/sample", {
    idField: "database_id",
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
      facet: "true",
      "facet.pivot": `{!ex=rock}${pivot}`,
      [`f.${primaryField}.facet.contains`]: query,
      [`f.${primaryField}.facet.contains.ignoreCase`]: true,
      [`f.${primaryField}.facet.excludeTerms`]: values.join(","),
      "facet.limit": pagination.perPage,
      [`f.${primaryField}.facet.offset`]:
        (pagination.page - 1) * pagination.perPage,
      json: {
        query: solrQuery.value,
        filter: solrFilters.value,
        limit: 0,
      },
    },
  });
  const facetQueries = res.facet_counts.facet_pivot[pivot].reduce(
    (prev, item) => {
      prev[item.value] =
        `{!ex=rock}rock_id:${item.pivot[0].value} OR hierarchy_string_rock:*-${item.pivot[0].value}-*`;
      return prev;
    },
    {},
  );
  const res2 = await $solrFetch("/sample", {
    query: {
      facet: "true",
      "facet.query": Object.values(facetQueries),
      json: {
        query: solrQuery.value,
        filter: solrFilters.value,
        limit: 0,
      },
    },
  });

  return res.facet_counts.facet_pivot[pivot].map((item) => {
    return {
      id: item.pivot[0].pivot?.map((p) => p.value) ?? item.pivot[0].value,
      name: item.value,
      count: res2.facet_counts.facet_queries[facetQueries[item.value]],
    };
  });
}

async function hydrateRock(values: string[]) {
  const nameField = locale.value === "et" ? "rock" : "rock_en";
  const facets = values.reduce((prev, id) => {
    prev[id] = {
      type: "query",
      q: `rock_id:${id} OR hierarchy_string_rock:*-${id}-*`,
      facet: {
        name: {
          type: "terms",
          field: nameField,
          limit: 1,
          domain: {
            query: "*:*",
            filter: `rock_id:${id}`,
          },
        },
      },
    };
    return prev;
  }, {});

  const res = await $solrFetch("/sample", {
    query: {
      json: {
        limit: 0,
        query: solrQuery.value,
        filter: solrFilters?.value,
        facet: {
          ...facets,
        },
      },
    },
  });

  return values.map((id) => ({
    id,
    name: res.facets[id].name.buckets[0].val,
    count: res.facets[id].count,
  }));
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
// export default defineComponent({
//   setup(_props, { emit }) {
//     const hydrateFilter = useHydrateFilterNew()
//     const { fetch } = useFetch(async () => {
//       emitUpdate.value = false
//       await Promise.all([
//         hydrateFilter(
//           locality,
//           toRef(filters.value, 'locality'),
//           'locality',
//           hydrateLocality
//         ),
//         hydrateFilter(
//           stratigraphyHierarchy,
//           toRef(filters.value, 'stratigraphyHierarchy'),
//           'stratigraphyHierarchy',
//           hydrateStratigraphyHierarchy
//         ),
//         hydrateFilter(
//           rockHierarchy,
//           toRef(filters.value, 'rockHierarchy'),
//           'rockHierarchy',
//           hydrateRockHierarchy
//         ),
//       ])
//       emitUpdate.value = true
//     })
//
//     const hydrate = useHydrate()
//     const hydrateLocality = hydrate(
//       filters.value.locality,
//       query,
//       {
//         itemResource: 'locality',
//         itemFields: ['id', 'locality', 'locality_en'],
//         itemSearchField: 'id',
//         countResource: 'sample',
//         countResourceRelatedIdKey: 'locality_id',
//         countHierarchical: false,
//         tagFilterKey: 'locality',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: parseInt(item.id),
//           text: item.locality,
//           text_en: item.locality_en,
//           count: counts[item.id],
//         }))
//     )
//
//     const hydrateStratigraphyHierarchy = hydrate(
//       filters.value.stratigraphyHierarchy,
//       query,
//       {
//         itemResource: 'stratigraphy',
//         itemFields: [
//           'id',
//           'stratigraphy',
//           'stratigraphy_en',
//           'hierarchy_string',
//         ],
//         itemSearchField: 'hierarchy_string',
//         countResource: 'sample',
//         countResourceRelatedIdKey: 'stratigraphy_hierarchy',
//         countHierarchical: true,
//         tagFilterKey: 'stratigraphyHierarchy',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: item.hierarchy_string,
//           text: item.stratigraphy,
//           text_en: item.stratigraphy_en,
//           hierarchy_string: item.hierarchy_string,
//           count: counts[item.hierarchy_string],
//         }))
//     )
//     const hydrateMulti = useHydrateMulti()
//     const hydrateRockHierarchy = hydrateMulti(
//       filters.value.rockHierarchy,
//       query,
//       {
//         itemResource: 'rock',
//         itemFields: ['id', 'name', 'name_en', 'hierarchy_strings'],
//         itemSearchField: 'hierarchy_strings',
//         countResource: 'sample',
//         countResourceRelatedIdKey: 'hierarchy_string_rock',
//         countHierarchical: true,
//         tagFilterKey: 'rockHierarchy',
//         queryFilters: filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: item.id,
//           text: item.name,
//           text_en: item.name_en,
//           hierarchy_strings: item.hierarchy_strings,
//           count: counts[item.id],
//         }))
//     )
//     const querySuggestions = useQuerySuggestions()
//     const querySuggestionsLocality = querySuggestions(query, {
//       resource: 'sample',
//       pivot: ['locality_id', 'locality', 'locality_en'],
//       pivotOffsetField: 'locality_id',
//       countHierarchical: false,
//       countResourceRelatedKey: 'locality_id',
//       excludeFilterKey: 'locality',
//       filters,
//     })
//     const querySuggestionsStratigraphy = querySuggestions(
//       query,
//       {
//         resource: 'sample',
//         pivot: ['stratigraphy_hierarchy', 'stratigraphy', 'stratigraphy_en'],
//         pivotOffsetField: 'stratigraphy_hierarchy',
//         countResourceRelatedKey: 'stratigraphy_hierarchy',
//         countHierarchical: true,
//         excludeFilterKey: 'stratigraphyHierarchy',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: item.value as number,
//           count: counts[item.value] as number,
//           text: item.pivot?.[0].value ?? item.value,
//           text_en:
//             item.pivot?.[0].pivot?.[0].value ??
//             item.pivot?.[0].value ??
//             item.value,
//           hierarchy_string: item.value,
//         }))
//     )
//     const querySuggestionsMulti = useQuerySuggestionsMulti()
//     const querySuggestionsRock = querySuggestionsMulti(
//       query,
//       {
//         resource: 'sample',
//         pivot: ['rock_id'],
//         pivotOffsetField: 'rock_id',
//         countResourceRelatedKey: 'hierarchy_string_rock',
//         countHierarchical: true,
//         excludeFilterKey: 'rockHierarchy',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: item.id as number,
//           count: counts[item.id] as number,
//           text: item.name,
//           text_en: item.name_en,
//           hierarchy_strings: item.hierarchy_strings,
//         }))
//     )
//     return {
//       querySuggestionsLocality,
//       querySuggestionsStratigraphy,
//       querySuggestionsRock,
//       locality,
//       stratigraphyHierarchy,
//       number,
//       depth,
//       collector,
//       institutions,
//       query,
//       map,
//       hasImage,
//       hasCoordinates,
//       rockHierarchy,
//       handleReset,
//       handleUpdate,
//     }
//   },
// })
</script>
