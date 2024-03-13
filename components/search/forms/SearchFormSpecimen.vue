<script setup lang="ts">
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

const props = defineProps<{ resultView: "table" | "image" }>();

const emit = defineEmits(["update", "reset"]);

const { $solrFetch } = useNuxtApp();
const { locale } = useI18n();

const specimensStore = useSpecimens();
const { filters, query, solrQuery, solrFilters } = storeToRefs(specimensStore);
const { suggest: suggestLocality, hydrate: hydrateLocality }
  = useAutocomplete("/specimen", {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestCollector, hydrate: hydrateCollector }
  = useAutocomplete("/specimen", {
    idField: "collector_id_s",
    nameField: "collector",
    filterExclude: "collector",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/specimen", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestCollection, hydrate: hydrateCollection }
  = useAutocomplete("/specimen", {
    idField: "collection_id_s",
    nameField: "collection_number",
    filterExclude: "collection",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestFossilGroup, hydrate: hydrateFossilGroup }
  = useAutocomplete("/specimen", {
    idField: "fossilgroup_id_s",
    nameField: "fossilgroup",
    filterExclude: "fossilGroup",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestCountry, hydrate: hydrateCountry }
  = useAutocomplete("/specimen", {
    idField: "country_id_s",
    nameField: { et: "country", en: "country_en" },
    filterExclude: "country",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestOriginalStatus, hydrate: hydrateOriginalStatus }
  = useAutocomplete("/specimen", {
    idField: "original_status_id_s",
    nameField: { et: "original_status", en: "original_status_en" },
    filterExclude: "originalStatus",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestReference, hydrate: hydrateReference }
  = useAutocomplete("/specimen", {
    idField: "specimen_references_kws",
    nameField: "specimen_references",
    filterExclude: "references",
    solrParams: { query: solrQuery, filter: solrFilters },
    primary: "id",
    containsParser: removeNonAlphanumeric,
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

  const countRes = await $solrFetch("/specimen", {
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

  const countRes = await $solrFetch("/specimen", {
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

  const countRes = await $solrFetch("/specimen", {
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

  const countRes = await $solrFetch("/specimen", {
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

  const countRes = await $solrFetch("/specimen", {
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

  const countRes = await $solrFetch("/specimen", {
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
      selected: filters.value.stratigraphy.value.includes(value),
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
    name: doc.taxon,
    value: doc.hierarchy_string,
  }));
}
function handleReset() {
  emit("reset");
}

const filterLocality = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterCollector = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterCollection = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterFossilGroup = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterCountry = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterOriginalStatus = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<InstanceType<typeof FilterInputHierarchy>>();
const filterRock = ref<InstanceType<typeof FilterInputHierarchy>>();
const filterTaxon = ref<InstanceType<typeof FilterInputHierarchy>>();

function handleUpdate() {
  nextTick(() => {
    filterLocality.value?.refreshSuggestions();
    filterCollector.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    filterCollection.value?.refreshSuggestions();
    filterFossilGroup.value?.refreshSuggestions();
    filterCountry.value?.refreshSuggestions();
    filterOriginalStatus.value?.refreshSuggestions();
    filterStratigraphy.value?.refreshSuggestions();
    filterRock.value?.refreshSuggestions();
    filterTaxon.value?.refreshSuggestions();
    emit("update");
  });
}
// import {
//   computed,
//   defineComponent,
//   ref,
//   toRef,
//   useContext,
//   useFetch,
// } from '@nuxtjs/composition-api'
// import SearchActions from '../SearchActions.vue'
// import FilterInstitution from '~/components/filter/FilterInstitution.vue'
// import InputSearch from '~/components/input/InputSearch.vue'
// import FilterInputCheckbox from '~/components/filter/input/FilterInputCheckbox.vue'
// import FilterReference from '~/components/filter/FilterReference.vue'
// import FilterInputText from '~/components/filter/input/FilterInputText.vue'
// import FilterMap from '~/components/filter/FilterMap.vue'
// import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
// import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
// import {
//   useHydrateFilterReference,
//   useHydrate,
//   useHydrateStatic,
//   useHydrateMulti,
//   useHydrateFilterNew,
// } from '~/composables/useHydrateFilter'
// import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
// import { useFilter } from '~/composables/useFilter'
// import { DefaultFilterObject } from '~/types/filters'
// import {
//   useQuerySuggestions,
//   useQuerySuggestionsMulti,
//   useQuerySuggestionsStatic,
// } from '~/composables/useQuerySuggestions'
// export default defineComponent({
//   name: 'SearchFormSpecimen',
//   components: {
//     FilterInputCheckbox,
//     FilterMap,
//     SearchActions,
//     InputSearch,
//     FilterInstitution,
//     FilterReference,
//     FilterInputText,
//     FilterInputRange,
//     FilterInputAutocompleteNew,
//   },
//   props: {
//     resultView: {
//       type: String,
//       default: 'table',
//     },
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
//     const filters = computed(() => ({
//       ...$accessor.search.specimen.filters,
//       ...$accessor.search.globalFilters,
//     }))
//
//     const number = useFilter('specimen', 'number', handleUpdate)
//     const locality = useFilter('specimen', 'locality', handleUpdate)
//     const reference = useFilter('specimen', 'reference', handleUpdate)
//     const taxonHierarchy = useFilter('specimen', 'taxonHierarchy', handleUpdate)
//     const collection = useFilter('specimen', 'collection', handleUpdate)
//     const taxonName = useFilter('specimen', 'taxonName', handleUpdate)
//     const stratigraphyHierarchy = useFilter(
//       'specimen',
//       'stratigraphyHierarchy',
//       handleUpdate
//     )
//     const fossilGroup = useFilter('specimen', 'fossilGroup', handleUpdate)
//     const hasImage = useFilter('specimen', 'hasImage', handleUpdate)
//     const hasCoordinates = useFilter('specimen', 'hasCoordinates', handleUpdate)
//     const map = useFilter('specimen', 'map', handleUpdate)
//     const depth = useFilter('specimen', 'depth', handleUpdate)
//     const country = useFilter('specimen', 'country', handleUpdate)
//     const rockHierarchy = useFilter('specimen', 'rockHierarchy', handleUpdate)
//     const originalStatus = useFilter('specimen', 'originalStatus', handleUpdate)
//     const collector = useFilter('specimen', 'collector', handleUpdate)
//     const institutions = computed({
//       get: () => $accessor.search.globalFilters.institutions.value,
//       set: (val) => {
//         $accessor.search.setInstitutionsFilter(val)
//         handleUpdate()
//       },
//     })
//     const query = computed({
//       get: () => $accessor.search.specimen.query,
//       set: (val) => {
//         $accessor.search.specimen.setQuery(val)
//       },
//     })
//
//     const hydrateFilterReference = useHydrateFilterReference()
//     const hydrateFilter = useHydrateFilterNew()
//     const hydrate = useHydrate()
//     const hydrateStatic = useHydrateStatic()
//     const hydrateMulti = useHydrateMulti()
//
//     const querySuggestions = useQuerySuggestions()
//     const querySuggestionsStatic = useQuerySuggestionsStatic()
//     const querySuggestionsMulti = useQuerySuggestionsMulti()
//
//     useWatchSearchQueryParams(() => fetch())
//     // watch(
//     //   () => route.value.query,
//     //   (newVal, oldVal) => {
//     //     if (newVal.page !== oldVal.page) return
//     //     if (newVal.itemsPerPage !== oldVal.itemsPerPage) return
//     //     if (newVal.sortBy !== oldVal.sortBy) return
//     //     if (newVal.sortDesc !== oldVal.sortDesc) return
//     //     fetch()
//     //   }
//     // )
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
//           collection,
//           toRef(filters.value, 'collection'),
//           'collection',
//           hydrateCollection
//         ),
//         hydrateFilter(
//           fossilGroup,
//           toRef(filters.value, 'fossilGroup'),
//           'fossilGroup',
//           hydrateFossilGroup
//         ),
//         hydrateFilterReference(reference, 'reference'),
//         hydrateFilter(
//           taxonHierarchy,
//           toRef(filters.value, 'taxonHierarchy'),
//           'taxonHierarchy',
//           hydrateTaxonHierarchy
//         ),
//         hydrateFilter(
//           rockHierarchy,
//           toRef(filters.value, 'rockHierarchy'),
//           'rockHierarchy',
//           hydrateRockHierarchy
//         ),
//         hydrateFilter(
//           stratigraphyHierarchy,
//           toRef(filters.value, 'stratigraphyHierarchy'),
//           'stratigraphyHierarchy',
//           hydrateStratigraphyHierarchy
//         ),
//         hydrateFilter(
//           country,
//           toRef(filters.value, 'country'),
//           'country',
//           hydrateCountry
//         ),
//         hydrateFilter(
//           originalStatus,
//           toRef(filters.value, 'originalStatus'),
//           'originalStatus',
//           hydrateOriginalStatus
//         ),
//       ])
//       emitUpdate.value = true
//     })
//
//     const hydrateCountry = hydrateStatic(filters.value.country, query, {
//       pivot: ['country_id', 'country', 'country_en'],
//       countResourceRelatedIdKey: 'country_id',
//       countResource: 'specimen',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'country',
//     })
//     const hydrateOriginalStatus = hydrateStatic(filters.value.country, query, {
//       pivot: ['original_status_id', 'original_status', 'original_status_en'],
//       countResourceRelatedIdKey: 'original_status_id',
//       countResource: 'specimen',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'originalStatus',
//     })
//     const hydrateLocality = hydrate(
//       filters.value.locality,
//       query,
//       {
//         itemResource: 'locality',
//         itemFields: ['id', 'locality', 'locality_en'],
//         itemSearchField: 'id',
//         countResource: 'specimen',
//         countResourceRelatedIdKey: 'locality_id',
//         countHierarchical: false,
//         tagFilterKey: 'locality',
//         filters,
//       },
//       (items, counts) =>
//         items.map(
//           (item: any): DefaultFilterObject => ({
//             id: parseInt(item.id),
//             text: item.locality,
//             text_en: item.locality_en,
//             count: counts[item.id],
//           })
//         )
//     )
//     const hydrateCollection = hydrate(
//       filters.value.collection,
//       query,
//       {
//         itemResource: 'collection',
//         itemFields: ['id', 'number'],
//         itemSearchField: 'id',
//         countResource: 'specimen',
//         countResourceRelatedIdKey: 'collection_id',
//         countHierarchical: false,
//         tagFilterKey: 'collection',
//         filters,
//       },
//       (items, counts) =>
//         items.map(
//           (item: any): DefaultFilterObject => ({
//             id: parseInt(item.id),
//             text: item.number,
//             text_en: item.number,
//             count: counts[item.id],
//           })
//         )
//     )
//     const hydrateFossilGroup = hydrate(
//       filters.value.fossilGroup,
//       query,
//       {
//         itemResource: 'taxon',
//         itemFields: ['id', 'taxon'],
//         itemSearchField: 'id',
//         countResource: 'specimen',
//         countResourceRelatedIdKey: 'fossilgroup_id',
//         countHierarchical: false,
//         tagFilterKey: 'fossilGroup',
//         filters,
//       },
//       (items, counts) =>
//         items.map(
//           (item: any): DefaultFilterObject => ({
//             id: parseInt(item.id),
//             text: item.taxon,
//             text_en: item.taxon,
//             count: counts[item.id],
//           })
//         )
//     )
//
//     const hydrateTaxonHierarchy = hydrate(
//       filters.value.taxonHierarchy,
//       query,
//       {
//         itemResource: 'taxon',
//         itemFields: ['id', 'taxon', 'hierarchy_string'],
//         itemSearchField: 'hierarchy_string',
//         countResource: 'specimen',
//         countResourceRelatedIdKey: 'hierarchy_string',
//         countHierarchical: true,
//         tagFilterKey: 'taxonHierarchy',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: item.hierarchy_string,
//           text: item.taxon,
//           text_en: item.taxon,
//           hierarchy_string: item.hierarchy_string,
//           count: counts[item.hierarchy_string],
//         }))
//     )
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
//         countResource: 'specimen',
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
//     const hydrateRockHierarchy = hydrateMulti(
//       filters.value.rockHierarchy,
//       query,
//       {
//         itemResource: 'rock',
//         itemFields: ['id', 'name', 'name_en', 'hierarchy_strings'],
//         itemSearchField: 'hierarchy_strings',
//         countResource: 'specimen',
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
//     const querySuggestionsLocality = querySuggestions(query, {
//       resource: 'specimen',
//       pivot: ['locality_id', 'locality', 'locality_en'],
//       pivotOffsetField: 'locality_id',
//       countHierarchical: false,
//       countResourceRelatedKey: 'locality_id',
//       excludeFilterKey: 'locality',
//       filters,
//     })
//     const querySuggestionsCollection = querySuggestions(query, {
//       resource: 'specimen',
//       pivot: ['collection_id', 'collection_number'],
//       pivotOffsetField: 'collection_id',
//       countResourceRelatedKey: 'collection_id',
//       countHierarchical: false,
//       excludeFilterKey: 'collection',
//       filters,
//     })
//     const querySuggestionsFossilGroup = querySuggestions(query, {
//       resource: 'specimen',
//       pivot: ['fossilgroup_id', 'fossilgroup'],
//       pivotOffsetField: 'fossilgroup_id',
//       countResourceRelatedKey: 'fossilgroup_id',
//       countHierarchical: false,
//       excludeFilterKey: 'fossilGroup',
//       filters,
//     })
//
//     // TODO: `specimen_references` should be a strings field with keyword tokenizer in solr.
//     const querySuggestionsReference = querySuggestions(query, {
//       resource: 'specimen',
//       pivot: ['specimen_references'],
//       pivotOffsetField: 'specimen_references',
//       countResourceRelatedKey: 'specimen_references',
//       countHierarchical: false,
//       excludeFilterKey: 'reference',
//       filters,
//     })
//
//     const querySuggestionsCountry = querySuggestionsStatic(query, {
//       resource: 'specimen',
//       excludeFilterKey: 'country',
//       pivot: ['country_id', 'country', 'country_en'],
//       limit: 200,
//       filters,
//     })
//
//     const querySuggestionsOriginalStatus = querySuggestionsStatic(query, {
//       resource: 'specimen',
//       excludeFilterKey: 'originalStatus',
//       pivot: ['original_status_id', 'original_status', 'original_status_en'],
//       limit: 100,
//       filters,
//     })
//
//     const querySuggestionsTaxon = querySuggestions(
//       query,
//       {
//         resource: 'specimen',
//         pivot: ['hierarchy_string', 'taxon,taxon_id'],
//         pivotOffsetField: 'hierarchy_string',
//         countResourceRelatedKey: 'hierarchy_string',
//         countHierarchical: true,
//         excludeFilterKey: 'taxonHierarchy',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: item.value as number,
//           count: counts[item.value] as number,
//           text: item.pivot?.[0].value ?? item.value,
//           text_en: item.pivot?.[0].value ?? item.value,
//           hierarchy_string: item.value,
//         }))
//     )
//     const querySuggestionsRock = querySuggestionsMulti(
//       query,
//       {
//         resource: 'specimen',
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
//     const querySuggestionsStratigraphy = querySuggestions(
//       query,
//       {
//         resource: 'specimen',
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
//     return {
//       handleReset,
//       querySuggestionsLocality,
//       querySuggestionsCollection,
//       querySuggestionsTaxon,
//       querySuggestionsFossilGroup,
//       querySuggestionsStratigraphy,
//       querySuggestionsReference,
//       querySuggestionsCountry,
//       querySuggestionsOriginalStatus,
//       querySuggestionsRock,
//       handleUpdate,
//       locality,
//       reference,
//       fossilGroup,
//       taxonHierarchy,
//       stratigraphyHierarchy,
//       taxonName,
//       collection,
//       hasCoordinates,
//       hasImage,
//       institutions,
//       query,
//       map,
//       number,
//       depth,
//       country,
//       rockHierarchy,
//       originalStatus,
//       collector,
//     }
//   },
// })

function handleHasImageUpdate(value: boolean) {
  filters.value.hasImage.value = value;
  handleUpdate();
}
</script>

<template>
  <VForm @submit.prevent="handleUpdate">
    <InputSearch v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <FilterInputCheckbox
      :model-value="resultView === 'image' ? true : filters.hasImage.value"
      :label="$t('filters.hasImage')"
      :disabled="resultView === 'image'"
      @update:model-value="handleHasImageUpdate"
    />
    <FilterInputCheckbox
      v-model="filters.hasCoordinates.value"
      :label="$t('filters.hasCoordinates')"
      @update:model-value="handleUpdate"
    />
    <VExpansionPanels variant="accordion" multiple>
      <FilterInputText
        v-model="filters.number.value"
        :title="$t('filters.number')"
        value="number"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterCollection"
        v-model="filters.collection.value"
        :title="$t('filters.collection')"
        :query-function="suggestCollection"
        :hydration-function="hydrateCollection"
        value="collection"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterFossilGroup"
        v-model="filters.fossilGroup.value"
        :title="$t('filters.fossilGroup')"
        :query-function="suggestFossilGroup"
        :hydration-function="hydrateFossilGroup"
        value="fossilGroup"
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
        @update:model-value="handleUpdate"
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
        ref="filterCountry"
        v-model="filters.country.value"
        :title="$t('filters.country')"
        :query-function="suggestCountry"
        :hydration-function="hydrateCountry"
        value="country"
        @update:model-value="handleUpdate"
      />
      <FilterMap
        v-model="filters.geometry.value"
        value="map"
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
        @update:model-value="handleUpdate"
      />
      <FilterInputRange
        v-model="filters.depth.value"
        :title="$t('filters.depth')"
        value="depth"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterReferences"
        v-model="filters.reference.value"
        :title="$t('filters.reference')"
        :query-function="suggestReference"
        :hydration-function="hydrateReference"
        value="reference"
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
        ref="filterOriginalStatus"
        v-model="filters.originalStatus.value"
        :title="$t('filters.originalStatus')"
        :query-function="suggestOriginalStatus"
        :hydration-function="hydrateOriginalStatus"
        value="originalStatus"
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
  </VForm>
</template>
