<template>
  <div>
    <!--   <v-form @submit.prevent="handleUpdate"> -->
    <!--     <input-search v-model="query" /> -->
    <!--     <search-actions class="mb-3" @click="handleReset" /> -->
    <!---->
    <!--     <v-expansion-panels accordion flat tile multiple> -->
    <!--       <filter-input-range -->
    <!--         v-model="depth" -->
    <!--         :label="$t('filters.depth').toString()" -->
    <!--         interval-labels="intervals.depth" -->
    <!--         :step="0.01" -->
    <!--       /> -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="method" -->
    <!--         :title="$t('filters.method').toString()" -->
    <!--         static -->
    <!--         :query-field=" -->
    <!--           $i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en' -->
    <!--         " -->
    <!--         :query-function="querySuggestionsMethod" -->
    <!--       /> -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="lab" -->
    <!--         :title="$t('filters.lab').toString()" -->
    <!--         static -->
    <!--         :query-field="$i18n.locale === 'et' ? 'lab' : 'lab_en'" -->
    <!--         :query-function="querySuggestionsLab" -->
    <!--       /> -->
    <!---->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="project" -->
    <!--         :title="$t('filters.project').toString()" -->
    <!--         static -->
    <!--         :query-field=" -->
    <!--           $i18n.locale === 'et' ? 'project_name' : 'project_name_en' -->
    <!--         " -->
    <!--         :query-function="querySuggestionsDataset" -->
    <!--       /> -->
    <!---->
    <!--       <!-- TODO: `analytical_data` index does not contain english translation of dataset. Currently only shows estonian name. After english name added to index update the hydration and querying accordingly. -->
    -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="dataset" -->
    <!--         :title="$t('filters.dataset').toString()" -->
    <!--         query-field="dataset_name" -->
    <!--         :query-function="querySuggestionsDataset" -->
    <!--       /> -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="sample" -->
    <!--         :title="$t('filters.sample').toString()" -->
    <!--         query-field="sample_number" -->
    <!--         :query-function="querySuggestionsSample" -->
    <!--       /> -->
    <!--       <filter-input-parameter -->
    <!--         v-model="parameter" -->
    <!--         :parameters="parameterSuggestions" -->
    <!--       /> -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="stratigraphyHierarchy" -->
    <!--         :title="$t('filters.stratigraphyHierarchy').toString()" -->
    <!--         :query-field=" -->
    <!--           $i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en' -->
    <!--         " -->
    <!--         :query-function="querySuggestionsStratigraphy" -->
    <!--       /> -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="lithostratigraphyHierarchy" -->
    <!--         :title="$t('filters.lithostratigraphyHierarchy').toString()" -->
    <!--         :query-field=" -->
    <!--           $i18n.locale === 'et' ? 'lithostratigraphy' : 'lithostratigraphy_en' -->
    <!--         " -->
    <!--         :query-function="querySuggestionsLithostratigraphy" -->
    <!--       /> -->
    <!--       <filter-reference v-model="reference" /> -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="locality" -->
    <!--         :title="$t('filters.locality').toString()" -->
    <!--         :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'" -->
    <!--         :query-function="querySuggestionsLocality" -->
    <!--       /> -->
    <!--       <!-- TODO: `analytical_data` index does not contain english translation of site. Currently only shows estonian name. After english name added to index update the hydration and querying accordingly. -->
    -->
    <!--       <filter-input-autocomplete-new -->
    <!--         v-model="site" -->
    <!--         :title="$t('filters.site').toString()" -->
    <!--         query-field="site" -->
    <!--         :query-function="querySuggestionsSite" -->
    <!--       /> -->
    <!--       <filter-map -->
    <!--         v-model="map" -->
    <!--         locality-overlay -->
    <!--         site-overlay -->
    <!--         :items="$accessor.search.analyticalData.items" -->
    <!--       /> -->
    <!--       <filter-institution v-model="institutions" /> -->
    <!--     </v-expansion-panels> -->
    <!--   </v-form> -->
  </div>
</template>

<script lang="ts">
// import {
//   computed,
//   defineComponent,
//   reactive,
//   ref,
//   toRef,
//   toRefs,
//   useContext,
//   useFetch,
//   useRoute,
// } from '@nuxtjs/composition-api'
// import SearchActions from '../SearchActions.vue'
// import InputSearch from '~/components/input/InputSearch.vue'
// import FilterInputParameter from '~/components/filter/input/FilterInputParameter.vue'
// import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
// import FilterMap from '~/components/filter/FilterMap.vue'
// import FilterInstitution from '~/components/filter/FilterInstitution.vue'
// import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
// import FilterReference from '~/components/filter/FilterReference.vue'
// import { useFilter } from '~/composables/useFilter'
// import {
//   useHydrate,
//   useHydrateFilterLocality,
//   useHydrateFilterNew,
//   useHydrateFilterReferenceId,
//   useHydrateFilterSample,
//   useHydrateFilterSite,
//   useHydrateStatic,
// } from '~/composables/useHydrateFilter'
// import {
//   useQuerySuggestions,
//   useQuerySuggestionsStatic,
// } from '~/composables/useQuerySuggestions'
// import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
// export default defineComponent({
//   name: 'SearchFormAnalyticalData',
//   components: {
//     SearchActions,
//     InputSearch,
//     FilterInputParameter,
//     FilterInputRange,
//     FilterMap,
//     FilterInstitution,
//     FilterInputAutocompleteNew,
//     FilterReference,
//   },
//   setup(_props, { emit }) {
//     const { $accessor, $services } = useContext()
//     const route = useRoute()
//     const emitUpdate = ref(true)
//     const handleUpdate = () => {
//       if (!emitUpdate.value) return
//       emit('update')
//     }
//     const handleReset = () => {
//       emit('reset')
//     }
//
//     const filters = computed(() => ({
//       ...$accessor.search.analyticalData.filters,
//       ...$accessor.search.globalFilters,
//     }))
//     const query = computed({
//       get: () => $accessor.search.analyticalData.query,
//       set: (val) => {
//         $accessor.search.analyticalData.setQuery(val)
//       },
//     })
//     const parameter = useFilter('analyticalData', 'parameter', () => {
//       handleUpdate()
//       $accessor.headers.setAnalyticalDataParameterHeader({
//         options: $accessor.search.analyticalData.options,
//       })
//     })
//     const depth = useFilter('analyticalData', 'depth', handleUpdate)
//     const stratigraphyHierarchy = useFilter(
//       'analyticalData',
//       'stratigraphyHierarchy',
//       handleUpdate
//     )
//     const lithostratigraphyHierarchy = useFilter(
//       'analyticalData',
//       'lithostratigraphyHierarchy',
//       handleUpdate
//     )
//     const map = useFilter('analyticalData', 'map', handleUpdate)
//     const method = useFilter('analyticalData', 'method', handleUpdate)
//     const sample = useFilter('analyticalData', 'sample', handleUpdate)
//     const locality = useFilter('analyticalData', 'locality', handleUpdate)
//     const site = useFilter('analyticalData', 'site', handleUpdate)
//     const lab = useFilter('analyticalData', 'lab', handleUpdate)
//     const project = useFilter('analyticalData', 'project', handleUpdate)
//     const dataset = useFilter('analyticalData', 'dataset', handleUpdate)
//     const reference = useFilter('analyticalData', 'reference', handleUpdate)
//     const institutions = computed({
//       get: () => $accessor.search.globalFilters.institutions.value,
//       set: (val) => {
//         $accessor.search.setInstitutionsFilter(val)
//         handleUpdate()
//       },
//     })
//     const state = reactive({
//       parameterSuggestions: [] as any[],
//     })
//     const hydrateFilterSample = useHydrateFilterSample()
//     const hydrateFilterLocality = useHydrateFilterLocality()
//     const hydrateFilterSite = useHydrateFilterSite()
//     const hydrateFilterReference = useHydrateFilterReferenceId()
//     useWatchSearchQueryParams(() => fetch())
//     const { fetch } = useFetch(async () => {
//       emitUpdate.value = false
//       const listParametersPromise = $services.sarvSolr.getResourceList(
//         'analysis_parameter',
//         {
//           defaultParams: {
//             fq: 'is_null:false',
//           },
//           options: {
//             page: 1,
//             itemsPerPage: 1000,
//           },
//         }
//       )
//       const hydrationPromise = Promise.all([
//         hydrateFilterSample(sample, 'sample'),
//         hydrateFilterReference(reference, 'reference'),
//         hydrateFilterLocality(locality, 'locality'),
//         hydrateFilterSite(site, 'site'),
//         hydrateFilter(
//           method,
//           toRef(filters.value, 'method'),
//           'method',
//           hydrateMethod
//         ),
//         hydrateFilter(lab, toRef(filters.value, 'lab'), 'lab', hydrateLab),
//         hydrateFilter(
//           project,
//           toRef(filters.value, 'project'),
//           'project',
//           hydrateProject
//         ),
//         hydrateFilter(
//           dataset,
//           toRef(filters.value, 'dataset'),
//           'dataset',
//           hydrateDataset
//         ),
//         hydrateFilter(
//           sample,
//           toRef(filters.value, 'sample'),
//           'sample',
//           hydrateSample
//         ),
//         hydrateFilter(
//           stratigraphyHierarchy,
//           toRef(filters.value, 'stratigraphyHierarchy'),
//           'stratigraphyHierarchy',
//           hydrateStratigraphyHierarchy
//         ),
//         hydrateFilter(
//           lithostratigraphyHierarchy,
//           toRef(filters.value, 'lithostratigraphyHierarchy'),
//           'lithostratigraphyHierarchy',
//           hydrateLithostratigraphyHierarchy
//         ),
//         hydrateFilter(
//           locality,
//           toRef(filters.value, 'locality'),
//           'locality',
//           hydrateLocality
//         ),
//         hydrateFilter(site, toRef(filters.value, 'site'), 'site', hydrateSite),
//       ])
//       const [listParametersResponse] = await Promise.all([
//         listParametersPromise,
//         hydrationPromise,
//       ])
//
//       const parameters = listParametersResponse.items
//         .filter((parameter: any) => !!parameter.parameter_index)
//         .reduce((prev: any, parameter: any) => {
//           const correctParameterIndex = parameter.parameter_index.replace(
//             /\W/g,
//             '_'
//           )
//           return {
//             ...prev,
//             [correctParameterIndex]: {
//               value: correctParameterIndex,
//               text: parameter.parameter,
//             },
//           }
//         }, {})
//       $accessor.search.analyticalData.setParameters({ parameters })
//
//       if (route.value.query.parameter) {
//         for (const parameterFilter of $accessor.search.analyticalData.filters
//           .parameter.value) {
//           $accessor.headers.showHeader({
//             module: 'analytical_data',
//             headerId: parameterFilter.parameter,
//           })
//         }
//       }
//
//       state.parameterSuggestions = Object.values(parameters)
//       emitUpdate.value = true
//     })
//
//     const hydrateFilter = useHydrateFilterNew()
//     const hydrateStatic = useHydrateStatic()
//     const hydrate = useHydrate()
//     const hydrateMethod = hydrateStatic(filters.value.method, query, {
//       pivot: ['method_id', 'analysis_method', 'analysis_method_en'],
//       countResourceRelatedIdKey: 'method_id',
//       countResource: 'analytical_data',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'method',
//     })
//     const hydrateLab = hydrateStatic(filters.value.method, query, {
//       pivot: ['lab_id', 'lab', 'lab_en'],
//       countResourceRelatedIdKey: 'lab_id',
//       countResource: 'analytical_data',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'lab',
//     })
//     const hydrateProject = hydrateStatic(filters.value.method, query, {
//       pivot: ['project_id', 'project_name', 'project_name_en'],
//       countResourceRelatedIdKey: 'project_id',
//       countResource: 'analytical_data',
//       countHierarchical: false,
//       filters,
//       tagFilterKey: 'project',
//     })
//     const hydrateDataset = hydrate(
//       filters.value.locality,
//       query,
//       {
//         itemResource: 'dataset',
//         itemFields: ['id', 'name'],
//         itemSearchField: 'id',
//         countResource: 'analytical_data',
//         countResourceRelatedIdKey: 'dataset_id',
//         countHierarchical: false,
//         tagFilterKey: 'dataset',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: parseInt(item.id),
//           text: item.name,
//           text_en: item.name,
//           count: counts[item.id],
//         }))
//     )
//
//     const hydrateSample = hydrate(
//       filters.value.locality,
//       query,
//       {
//         itemResource: 'sample',
//         itemFields: ['id', 'number'],
//         itemSearchField: 'id',
//         countResource: 'analytical_data',
//         countResourceRelatedIdKey: 'sample_id',
//         countHierarchical: false,
//         tagFilterKey: 'sample',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: parseInt(item.id),
//           text: item.number,
//           text_en: item.number,
//           count: counts[item.id],
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
//         countResource: 'analytical_data',
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
//     const hydrateLithostratigraphyHierarchy = hydrate(
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
//         countResource: 'analytical_data',
//         countResourceRelatedIdKey: 'lithostratigraphy_hierarchy',
//         countHierarchical: true,
//         tagFilterKey: 'lithostratigraphyHierarchy',
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
//     const hydrateLocality = hydrate(
//       filters.value.locality,
//       query,
//       {
//         itemResource: 'locality',
//         itemFields: ['id', 'locality', 'locality_en'],
//         itemSearchField: 'id',
//         countResource: 'analytical_data',
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
//     const hydrateSite = hydrate(
//       filters.value.locality,
//       query,
//       {
//         itemResource: 'site',
//         itemFields: ['id', 'name'],
//         itemSearchField: 'id',
//         countResource: 'analytical_data',
//         countResourceRelatedIdKey: 'site_id',
//         countHierarchical: false,
//         tagFilterKey: 'site',
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: parseInt(item.id),
//           text: item.name,
//           text_en: item.name,
//           count: counts[item.id],
//         }))
//     )
//     const querySuggestionsStatic = useQuerySuggestionsStatic()
//     const querySuggestions = useQuerySuggestions()
//     const querySuggestionsMethod = querySuggestionsStatic(query, {
//       resource: 'analytical_data',
//       excludeFilterKey: 'method',
//       pivot: ['method_id', 'analysis_method', 'analysis_method_en'],
//       limit: 100,
//       filters,
//     })
//     const querySuggestionsLab = querySuggestionsStatic(query, {
//       resource: 'analytical_data',
//       excludeFilterKey: 'lab',
//       pivot: ['lab_id', 'lab', 'lab_en'],
//       limit: 100,
//       filters,
//     })
//
//     const querySuggestionsProject = querySuggestionsStatic(query, {
//       resource: 'analytical_data',
//       excludeFilterKey: 'project',
//       pivot: ['project_id', 'project_name', 'project_name_en'],
//       limit: 100,
//       filters,
//     })
//     const querySuggestionsDataset = querySuggestions(query, {
//       resource: 'analytical_data',
//       pivot: ['dataset_id', 'dataset_name'],
//       pivotOffsetField: 'dataset_id',
//       countResourceRelatedKey: 'dataset_id',
//       countHierarchical: false,
//       excludeFilterKey: 'dataset',
//       filters,
//     })
//     const querySuggestionsSample = querySuggestions(query, {
//       resource: 'analytical_data',
//       pivot: ['sample_id', 'sample_number'],
//       pivotOffsetField: 'sample_id',
//       countResourceRelatedKey: 'sample_id',
//       countHierarchical: false,
//       excludeFilterKey: 'sample',
//       filters,
//     })
//     const querySuggestionsStratigraphy = querySuggestions(
//       query,
//       {
//         resource: 'analytical_data',
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
//     const querySuggestionsLithostratigraphy = querySuggestions(
//       query,
//       {
//         resource: 'analytical_data',
//         pivot: [
//           'lithostratigraphy_hierarchy',
//           'lithostratigraphy',
//           'lithostratigraphy_en',
//         ],
//         pivotOffsetField: 'lithostratigraphy_hierarchy',
//         countResourceRelatedKey: 'lithostratigraphy_hierarchy',
//         countHierarchical: true,
//         excludeFilterKey: 'lithostratigraphyHierarchy',
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
//     const querySuggestionsLocality = querySuggestions(query, {
//       resource: 'analytical_data',
//       pivot: ['locality_id', 'locality', 'locality_en'],
//       pivotOffsetField: 'locality_id',
//       countHierarchical: false,
//       countResourceRelatedKey: 'locality_id',
//       excludeFilterKey: 'locality',
//       filters,
//     })
//     const querySuggestionsSite = querySuggestions(query, {
//       resource: 'analytical_data',
//       pivot: ['site_id', 'site'],
//       pivotOffsetField: 'site_id',
//       countHierarchical: false,
//       countResourceRelatedKey: 'site_id',
//       excludeFilterKey: 'site',
//       filters,
//     })
//     return {
//       ...toRefs(state),
//       query,
//       querySuggestionsMethod,
//       querySuggestionsLab,
//       querySuggestionsProject,
//       querySuggestionsDataset,
//       querySuggestionsSample,
//       querySuggestionsStratigraphy,
//       querySuggestionsLithostratigraphy,
//       querySuggestionsLocality,
//       querySuggestionsSite,
//       parameter,
//       depth,
//       stratigraphyHierarchy,
//       lithostratigraphyHierarchy,
//       map,
//       institutions,
//       method,
//       sample,
//       locality,
//       site,
//       lab,
//       project,
//       dataset,
//       reference,
//       handleUpdate,
//       handleReset,
//     }
//   },
// })
</script>
