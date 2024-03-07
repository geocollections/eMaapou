<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits(["update", "reset"]);

// import {
//   computed,
//   defineComponent,
//   ref,
//   toRef,
//   useContext,
//   useFetch,
// } from '@nuxtjs/composition-api'
// import SearchActions from '../SearchActions.vue'
// import InputSearch from '~/components/input/InputSearch.vue'
// import FilterInputText from '~/components/filter/input/FilterInputText.vue'
// import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
//
// import {
//   useHydrate,
//   useHydrateFilterNew,
//   useHydrateStatic,
// } from '~/composables/useHydrateFilter'
// import { useFilter } from '~/composables/useFilter'
// import {
//   useQuerySuggestions,
//   useQuerySuggestionsStatic,
// } from '~/composables/useQuerySuggestions'
// import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
// export default defineComponent({
//   name: 'SearchFormStratigraphy',
//   components: {
//     SearchActions,
//     InputSearch,
//     FilterInputText,
//     FilterInputAutocompleteNew,
//   },
//   setup(_props, { emit }) {
//     const { $accessor } = useContext()
//     const emitUpdate = ref(true)
//     const handleReset = () => {
//       emit('reset')
//     }
//     const handleUpdate = () => {
//       if (!emitUpdate.value) return
//       emit('update')
//     }
//     const filters = computed(() => $accessor.search.stratigraphy.filters)
//     const query = computed({
//       get: () => $accessor.search.stratigraphy.query,
//       set: (val) => {
//         $accessor.search.stratigraphy.setQuery(val)
//       },
//     })
//     const stratigraphyHierarchy = useFilter(
//       'stratigraphy',
//       'stratigraphyHierarchy',
//       handleUpdate
//     )
//     const index = useFilter('stratigraphy', 'index', handleUpdate)
//     const age = useFilter('stratigraphy', 'age', handleUpdate)
//     const rank = useFilter('stratigraphy', 'rank', handleUpdate)
//     const scope = useFilter('stratigraphy', 'scope', handleUpdate)
//     const type = useFilter('stratigraphy', 'type', handleUpdate)
//
//     useWatchSearchQueryParams(() => fetch())
//
//     const { fetch } = useFetch(async () => {
//       emitUpdate.value = false
//       await Promise.all([
//         hydrateFilter(
//           stratigraphyHierarchy,
//           toRef(filters.value, 'stratigraphyHierarchy'),
//           'stratigraphyHierarchy',
//           hydrateStratigraphyHierarchy
//         ),
//         hydrateFilter(type, toRef(filters.value, 'type'), 'type', hydrateType),
//         hydrateFilter(rank, toRef(filters.value, 'rank'), 'rank', hydrateRank),
//         hydrateFilter(
//           scope,
//           toRef(filters.value, 'scope'),
//           'scope',
//           hydrateScope
//         ),
//       ])
//       emitUpdate.value = true
//     })
//     const hydrateFilter = useHydrateFilterNew()
//     const hydrateStatic = useHydrateStatic()
//     const hydrate = useHydrate()
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
//         countResource: 'stratigraphy',
//         countResourceRelatedIdKey: 'hierarchy_string',
//         countHierarchical: true,
//         tagFilterKey: 'stratigraphyHierarchy',
//         filters,
//       },
//       (items, counts) => {
//         return items.map((item: any) => {
//           return {
//             id: item.hierarchy_string,
//             text: item.stratigraphy,
//             text_en: item.stratigraphy_en,
//             hierarchy_string: item.hierarchy_string,
//             count: counts[item.hierarchy_string],
//           }
//         })
//       }
//     )
//     const hydrateType = hydrateStatic(filters.value.type, query, {
//       pivot: ['type', 'stratigraphy_type', 'stratigraphy_type_en'],
//       countResourceRelatedIdKey: 'type',
//       countResource: 'stratigraphy',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'type',
//     })
//     const hydrateRank = hydrateStatic(filters.value.rank, query, {
//       pivot: ['rank', 'stratigraphy_rank', 'stratigraphy_rank_en'],
//       countResourceRelatedIdKey: 'rank',
//       countResource: 'stratigraphy',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'rank',
//     })
//     const hydrateScope = hydrateStatic(filters.value.scope, query, {
//       pivot: ['scope', 'stratigraphy_scope', 'stratigraphy_scope_en'],
//       countResourceRelatedIdKey: 'scope',
//       countResource: 'stratigraphy',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'scope',
//     })
//     const querySuggestionsStatic = useQuerySuggestionsStatic()
//     const querySuggestions = useQuerySuggestions()
//     const querySuggestionsStratigraphy = querySuggestions(
//       query,
//       {
//         resource: 'stratigraphy',
//         pivot: ['hierarchy_string', 'stratigraphy', 'stratigraphy_en'],
//         pivotOffsetField: 'hierarchy_string',
//         countResourceRelatedKey: 'hierarchy_string',
//         countHierarchical: true,
//         excludeFilterKey: 'stratigraphyHierarchy',
//         filters,
//       },
//       (items, counts) => {
//         return items.map((item: any) => {
//           return {
//             id: item.value as number,
//             count: counts[item.value] as number,
//             text: item.pivot?.[0].value ?? item.value,
//             text_en:
//               item.pivot?.[0].pivot?.[0].value ??
//               item.pivot?.[0].value ??
//               item.value,
//             hierarchy_string: item.value,
//           }
//         })
//       }
//     )
//     const querySuggestionsType = querySuggestionsStatic(query, {
//       resource: 'stratigraphy',
//       excludeFilterKey: 'type',
//       pivot: ['type', 'stratigraphy_type', 'stratigraphy_type_en'],
//       limit: 20,
//       filters,
//     })
//     const querySuggestionsRank = querySuggestionsStatic(query, {
//       resource: 'stratigraphy',
//       excludeFilterKey: 'rank',
//       pivot: ['rank', 'stratigraphy_rank', 'stratigraphy_rank_en'],
//       limit: 20,
//       filters,
//     })
//     const querySuggestionsScope = querySuggestionsStatic(query, {
//       resource: 'stratigraphy',
//       excludeFilterKey: 'scope',
//       pivot: ['scope', 'stratigraphy_scope', 'stratigraphy_scope_en'],
//       limit: 20,
//       filters,
//     })
//     return {
//       query,
//       querySuggestionsType,
//       querySuggestionsRank,
//       querySuggestionsScope,
//       querySuggestionsStratigraphy,
//       stratigraphyHierarchy,
//       index,
//       age,
//       rank,
//       scope,
//       type,
//       handleReset,
//       handleUpdate,
//     }
//   },
// })

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

const filterType = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterScope = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterRank = ref<InstanceType<typeof FilterInputAutocomplete>>();

function handleUpdate() {
  nextTick(() => {
    filterType.value?.refreshSuggestions();
    filterScope.value?.refreshSuggestions();
    filterRank.value?.refreshSuggestions();
    emit("update");
  });
}

function handleReset() {
  emit("reset");
}
</script>

<template>
  <VForm @submit.prevent="handleUpdate">
    <InputSearch v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VExpansionPanels variant="accordion" multiple>
      <!-- TODO: Stratigraphy filter, need to update solr index -->
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
