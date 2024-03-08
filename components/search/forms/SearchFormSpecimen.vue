<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits(["update", "reset"]);

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

function handleUpdate() {
  nextTick(() => {
    filterLocality.value?.refreshSuggestions();
    filterCollector.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    filterCollection.value?.refreshSuggestions();
    filterFossilGroup.value?.refreshSuggestions();
    filterCountry.value?.refreshSuggestions();
    filterOriginalStatus.value?.refreshSuggestions();
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
</script>

<template>
  <VForm @submit.prevent="handleUpdate">
    <InputSearch v-model="query" />
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
      <FilterInputRange
        v-model="filters.depth.value"
        :title="$t('filters.depth')"
        value="depth"
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
