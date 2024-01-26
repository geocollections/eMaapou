// import { useContext, useRoute, ComputedRef, Ref } from '@nuxtjs/composition-api'
// import orderBy from 'lodash/orderBy'
// import { Filter, ListIdsFilter, ListIdsMultiFilter } from '~/types/filters'
// import { parseFilterValue } from '~/utils/parseQueryParams'
// type HydrationFunction = () => (
//   filter: Ref<any>,
//   queryParam: string
// ) => Promise<void>
// export const useHydrateFilterLocality: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedIds = (route.value.query[queryParam] as string).split(',')
//     const idQuery = selectedIds.join(' ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/locality?q=id:(${idQuery})&rows=${selectedIds.length}&fl=locality,id,locality_en`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterSite: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedIds = (route.value.query[queryParam] as string).split(',')
//     const idQuery = selectedIds.join(' ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/site?q=id:(${idQuery})&rows=${selectedIds.length}&fl=id,name`
//     )
//     filter.value = response.response.docs
//   }
// }
// export const useHydrateFilterDataset: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedIds = (route.value.query[queryParam] as string).split(',')
//     const idQuery = selectedIds.join(' ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/dataset?q=id:(${idQuery})&rows=${selectedIds.length}&fl=id,title`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterReference: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//
//     const selectedReferences = (route.value.query[queryParam] as string)
//       .split(',')
//       .map(decodeURIComponent)
//
//     const query = selectedReferences
//       .map((reference) => `reference:"${reference}"`)
//       .join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/reference?q=(${query})&rows=${selectedReferences.length}&fl=id,reference,title`
//     )
//     filter.value = response.response.docs
//   }
// }
// export const useHydrateFilterReferenceId: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//
//     const selectedReferences = (route.value.query[queryParam] as string).split(
//       ','
//     )
//
//     const query = selectedReferences
//       .map((reference) => `id:"${reference}"`)
//       .join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/reference?q=(${query})&rows=${selectedReferences.length}&fl=id,reference,title`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterTaxon: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//
//     const selectedTaxa = (route.value.query[queryParam] as string)
//       .split(',')
//       .map(decodeURIComponent)
//     const query = selectedTaxa
//       .map((taxa) => `hierarchy_string:"${taxa}"`)
//       .join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/taxon?q=(${query})&rows=${selectedTaxa.length}&fl=id,taxon,hierarchy_string`
//     )
//     filter.value = response.response.docs
//   }
// }
// export const useHydrateFilterRock: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//
//     const selectedIds = (route.value.query[queryParam] as string)
//       .split(',')
//       .map((v) => v.split(':')[0])
//       .map(decodeURIComponent)
//     const query = selectedIds
//       .map((taxa) => `hierarchy_strings:"${taxa}"`)
//       .join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/rock?q=(${query})&rows=${selectedIds.length}&fl=id,name,name_en,hierarchy_strings`
//     )
//     filter.value = response.response.docs
//   }
// }
// export const useHydrateFilterTaxonId: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedTaxa = (route.value.query[queryParam] as string).split(',')
//     const query = selectedTaxa.map((taxa) => `id:"${taxa}"`).join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/taxon?q=(${query})&rows=${selectedTaxa.length}&fl=id,taxon,hierarchy_string`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterStratigraphy: HydrationFunction = () => {
//   const route = useRoute()
//   const { $axios } = useContext()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//
//     const selectedStratigraphy = (route.value.query[queryParam] as string)
//       .split(',')
//       .map(decodeURIComponent)
//     const query = selectedStratigraphy
//       .map((stratigraphy: string) => `hierarchy_string:"${stratigraphy}"`)
//       .join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/stratigraphy?q=(${query})&rows=${selectedStratigraphy.length}&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterAnalysisParameter: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedAnalysisParameters = (route.value.query[queryParam] as string)
//       .split(',')
//       .map(decodeURIComponent)
//     const query = selectedAnalysisParameters
//       .map((parameter) => `parameter_index:"${parameter}"`)
//       .join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/analysis_parameter?q=(${query})&rows=${selectedAnalysisParameters.length}&fl=id,parameter,parameter_index`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterCollection: HydrationFunction = () => {
//   const { $axios } = useContext()
//
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedCollections = (route.value.query[queryParam] as string).split(
//       ','
//     )
//     const query = selectedCollections
//       .map((sample) => `id:"${sample}"`)
//       .join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/collection?q=(${query})&rows=${selectedCollections.length}&fl=id,number`
//     )
//     filter.value = response.response.docs
//   }
// }
// export const useHydrateFilterSample: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedSamples = (route.value.query[queryParam] as string).split(',')
//     const query = selectedSamples.map((sample) => `id:"${sample}"`).join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/sample?q=(${query})&rows=${selectedSamples.length}&fl=id,number`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterArea: HydrationFunction = () => {
//   const { $axios } = useContext()
//   const route = useRoute()
//   return async (filter, queryParam) => {
//     if (!route.value.query[queryParam]) return
//     const selectedAreas = (route.value.query[queryParam] as string).split(',')
//     const query = selectedAreas.map((area) => `id:"${area}"`).join(' OR ')
//     const response = await $axios.$get(
//       `https://api.geoloogia.info/solr/area?q=(${query})&rows=${selectedAreas.length}&fl=id,name,name_en`
//     )
//     filter.value = response.response.docs
//   }
// }
//
// export const useHydrateFilterStatic = () => {
//   const route = useRoute()
//   return (
//     filter: Ref<any>,
//     queryParam: string,
//     suggestions: any[],
//     parseFunc: (v: string) => any,
//     compareField = 'id'
//   ) => {
//     if (!route.value.query[queryParam]) return
//     const queryParamValue = route.value.query[queryParam] as string
//     const parsedValue = queryParamValue.split(',').map(parseFunc)
//     filter.value = suggestions.filter((v) =>
//       parsedValue.includes(v[compareField])
//     )
//   }
// }
// export const useHydrateFilter = () => {
//   const route = useRoute()
//   return async (
//     filterValue: Ref<any>,
//     queryParam: string,
//     hydrationFunc: (ids: any[]) => Promise<any[]>
//   ) => {
//     if (!route.value.query[queryParam]) return
//     const queryValue = route.value.query[queryParam] as string
//     const parsedValue = queryValue.split(',')
//     filterValue.value = await hydrationFunc(parsedValue)
//   }
// }
// export const useHydrateFilterNew = () => {
//   const route = useRoute()
//   return async (
//     filterValue: Ref<any>,
//     filter: Ref<Filter>,
//     queryParam: string,
//     hydrationFunc: (ids: any[]) => Promise<any[]>
//   ) => {
//     if (!route.value.query[queryParam]) return
//
//     const parsedValue = parseFilterValue(route.value, queryParam, filter.value)
//     filterValue.value = await hydrationFunc(parsedValue)
//   }
// }
//
// type DefaultFilterObject = {
//   id: number | string
//   text: string
//   text_en: string
//   count: number
// }
// export const useHydrate = () => {
//   const { $services } = useContext()
//   return <
//     FilterObject extends {
//       id: number | string
//       count: number
//       [K: string]: any
//     } = DefaultFilterObject
//   >(
//     filter: ListIdsFilter,
//     query: Ref<string>,
//     config: {
//       itemResource: string
//       itemFields: string[]
//       itemSearchField: string
//       countResource: string
//       countResourceRelatedIdKey: string
//       tagFilterKey: string
//       countHierarchical: boolean
//       filters?: ComputedRef<{ [K: string]: Filter }>
//     },
//     parseFunc: (items: any[], counts: { [K: string]: number }) => FilterObject[]
//   ) => {
//     return async (filterValues: any[]): Promise<FilterObject[]> => {
//       const itemQueryString = filterValues
//         .map((v) => v[filter.valueField])
//         .join(' OR ')
//       const facetQueries = filterValues.reduce((prev, v) => {
//         if (config.countHierarchical) {
//           prev[
//             `{!ex=dt}${config.countResourceRelatedIdKey}:${
//               v[filter.valueField]
//             }*`
//           ] = v[filter.valueField]
//           return prev
//         }
//         prev[
//           `{!ex=dt}${config.countResourceRelatedIdKey}:${v[filter.valueField]}`
//         ] = v[filter.valueField]
//         return prev
//       }, {})
//       const [items, countQueries] = await Promise.all([
//         $services.sarvSolr.getResourceList(config.itemResource, {
//           search: `${config.itemSearchField}:(${itemQueryString})`,
//           defaultParams: {
//             rows: filterValues.length,
//             fl: config.itemFields.join(','),
//           },
//           returnRawQ: true,
//         }),
//         $services.sarvSolr.getResourceList(config.countResource, {
//           search: query.value,
//           searchFilters: config.filters?.value,
//           tags: {
//             [config.tagFilterKey]: 'dt',
//           },
//           defaultParams: {
//             'facet.query': Object.keys(facetQueries),
//             rows: 0,
//             start: 0,
//             facet: true,
//             'facet.pivot': `{!ex=dt}${config.countResourceRelatedIdKey}`,
//             'facet.limit': filterValues.length,
//           },
//           returnRawQ: true,
//         }),
//       ])
//       const counts = Object.keys(countQueries.facet.facet_queries).reduce(
//         (prev, curr) => {
//           prev[facetQueries[curr]] = countQueries.facet.facet_queries[curr]
//           return prev
//         },
//         {} as { [K in string | number]: number }
//       )
//       return orderBy(parseFunc(items.items, counts), 'count', 'desc')
//     }
//   }
// }
// export const useHydrateMulti = () => {
//   const { $services } = useContext()
//   return <
//     FilterObject extends {
//       id: number | string
//       count: number
//       [K: string]: any
//     } = DefaultFilterObject
//   >(
//     filter: ListIdsMultiFilter,
//     query: Ref<string>,
//     config: {
//       itemResource: string
//       itemFields: string[]
//       itemSearchField: string
//       countResource: string
//       countResourceRelatedIdKey: string
//       tagFilterKey: string
//       countHierarchical: boolean
//       queryFilters?: ComputedRef<{ [K: string]: Filter }>
//     },
//     parseFunc: (items: any[], counts: { [K: string]: number }) => FilterObject[]
//   ) => {
//     return async (parsedQueryParamValues: any[]): Promise<FilterObject[]> => {
//       const idsQueryStr = parsedQueryParamValues
//         .map((parsedValue) => parsedValue[filter.idValueField])
//         .join(' OR ')
//
//       const facetQueries = parsedQueryParamValues.reduce(
//         (prev, parsedValue) => {
//           const query = parsedValue[filter.valueField]
//             .map(
//               (hierarchyString: string) =>
//                 `${config.countResourceRelatedIdKey}:${hierarchyString}*`
//             )
//             .join(' OR ')
//           prev[`{!ex=dt}${query}`] = parsedValue[filter.idValueField]
//           return prev
//         },
//         {}
//       )
//       const [items, countQueries] = await Promise.all([
//         $services.sarvSolr.getResourceList(config.itemResource, {
//           search: `${config.itemSearchField}:(${idsQueryStr})`,
//           defaultParams: {
//             rows: parsedQueryParamValues.length,
//             fl: config.itemFields.join(','),
//           },
//           returnRawQ: true,
//         }),
//         $services.sarvSolr.getResourceList(config.countResource, {
//           search: query.value,
//           searchFilters: config.queryFilters?.value,
//           tags: {
//             [config.tagFilterKey]: 'dt',
//           },
//           defaultParams: {
//             'facet.query': Object.keys(facetQueries),
//             rows: 0,
//             start: 0,
//             facet: true,
//             'facet.limit': parsedQueryParamValues.length,
//           },
//           returnRawQ: true,
//         }),
//       ])
//       const counts = Object.keys(countQueries.facet.facet_queries).reduce(
//         (prev, curr) => {
//           prev[facetQueries[curr]] = countQueries.facet.facet_queries[curr]
//           return prev
//         },
//         {} as { [K in string | number]: number }
//       )
//       return parseFunc(items.items, counts)
//     }
//   }
// }
//
// export const useHydrateStatic = () => {
//   const { $services } = useContext()
//   return <
//     FilterObject extends {
//       id: number | string
//       count: number
//       [K: string]: any
//     } = DefaultFilterObject
//   >(
//     filter: ListIdsFilter,
//     query: Ref<string>,
//     config: {
//       countResource: string
//       countResourceRelatedIdKey: string
//       pivot: string[]
//       tagFilterKey: string
//       countHierarchical: boolean
//       filters?: ComputedRef<{ [K: string]: Filter }>
//     }
//   ) => {
//     return async (parsedQueryParamValues: any[]): Promise<FilterObject[]> => {
//       const idQueryStr = parsedQueryParamValues
//         .map(
//           (id) =>
//             `${config.countResourceRelatedIdKey}:"${id[filter.valueField]}"`
//         )
//         .join(' OR ')
//       const pivotStr = config.pivot.join(',')
//       const facetQueries = parsedQueryParamValues.reduce((prev, v) => {
//         if (config.countHierarchical) {
//           prev[
//             `{!ex=dt}${config.countResourceRelatedIdKey}:${
//               v[filter.valueField]
//             }*`
//           ] = v[filter.valueField]
//           return prev
//         }
//         prev[
//           `{!ex=dt}${config.countResourceRelatedIdKey}:${v[filter.valueField]}`
//         ] = v[filter.valueField]
//         return prev
//       }, {})
//       const [items, countQueries] = await Promise.all([
//         $services.sarvSolr.getResourceList(config.countResource, {
//           search: query.value,
//           defaultParams: {
//             fq: idQueryStr,
//             rows: 0,
//             start: 0,
//             facet: true,
//             'facet.pivot': pivotStr,
//             'facet.limit': parsedQueryParamValues.length,
//           },
//           returnRawQ: true,
//         }),
//         $services.sarvSolr.getResourceList(config.countResource, {
//           search: query.value,
//           searchFilters: config.filters?.value,
//           tags: {
//             [config.tagFilterKey]: 'dt',
//           },
//           defaultParams: {
//             rows: 0,
//             start: 0,
//             facet: true,
//             'facet.query': Object.keys(facetQueries),
//           },
//           returnRawQ: true,
//         }),
//       ])
//       const counts = Object.keys(countQueries.facet.facet_queries).reduce(
//         (prev, curr) => {
//           prev[facetQueries[curr]] = countQueries.facet.facet_queries[curr]
//           return prev
//         },
//         {} as { [K in string | number]: number }
//       )
//       return items.facet.facet_pivot[pivotStr].map((item: any) => {
//         return {
//           id: item.value as number,
//           count: counts[item.value],
//           text: item.pivot?.[0].value ?? item.value,
//           text_en:
//             item.pivot?.[0].pivot?.[0].value ??
//             item.pivot?.[0].value ??
//             item.value,
//         }
//       })
//     }
//   }
// }
export const useHydrateFilterNew = () => {
  return {};
};
export const useHydrateFilterReference = () => {
  return {};
};
export const useHydrateStatic = () => {
  return {};
};
