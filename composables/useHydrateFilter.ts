import { useContext, useRoute } from '@nuxtjs/composition-api'
import { Ref } from 'vue'
type HydrationFunction = () => (
  filter: Ref<any>,
  queryParam: string
) => Promise<void>
export const useHydrateFilterLocality: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedIds = (route.value.query[queryParam] as string).split(',')
    const idQuery = selectedIds.join(' ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/locality?q=id:(${idQuery})&rows=${selectedIds.length}&fl=locality,id,locality_en`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterSite: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedIds = (route.value.query[queryParam] as string).split(',')
    const idQuery = selectedIds.join(' ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/site?q=id:(${idQuery})&rows=${selectedIds.length}&fl=id,name`
    )
    filter.value = response.response.docs
  }
}
export const useHydrateFilterDataset: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedIds = (route.value.query[queryParam] as string).split(',')
    const idQuery = selectedIds.join(' ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/dataset?q=id:(${idQuery})&rows=${selectedIds.length}&fl=id,title`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterReference: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return

    const selectedReferences = (route.value.query[queryParam] as string)
      .split(',')
      .map(decodeURIComponent)

    const query = selectedReferences
      .map((reference) => `reference:"${reference}"`)
      .join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/reference?q=(${query})&rows=${selectedReferences.length}&fl=id,reference,title`
    )
    filter.value = response.response.docs
  }
}
export const useHydrateFilterReferenceId: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return

    const selectedReferences = (route.value.query[queryParam] as string).split(
      ','
    )

    const query = selectedReferences
      .map((reference) => `id:"${reference}"`)
      .join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/reference?q=(${query})&rows=${selectedReferences.length}&fl=id,reference,title`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterTaxon: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return

    const selectedTaxa = (route.value.query[queryParam] as string)
      .split(',')
      .map(decodeURIComponent)
    const query = selectedTaxa
      .map((taxa) => `hierarchy_string:"${taxa}"`)
      .join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/taxon?q=(${query})&rows=${selectedTaxa.length}&fl=id,taxon,hierarchy_string`
    )
    filter.value = response.response.docs
  }
}
export const useHydrateFilterRock: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return

    const selectedIds = (route.value.query[queryParam] as string)
      .split(',')
      .map((v) => v.split(':')[0])
      .map(decodeURIComponent)
    const query = selectedIds
      .map((taxa) => `hierarchy_strings:"${taxa}"`)
      .join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/rock?q=(${query})&rows=${selectedIds.length}&fl=id,name,name_en,hierarchy_strings`
    )
    filter.value = response.response.docs
  }
}
export const useHydrateFilterTaxonId: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedTaxa = (route.value.query[queryParam] as string).split(',')
    const query = selectedTaxa.map((taxa) => `id:"${taxa}"`).join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/taxon?q=(${query})&rows=${selectedTaxa.length}&fl=id,taxon,hierarchy_string`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterStratigraphy: HydrationFunction = () => {
  const route = useRoute()
  const { $axios } = useContext()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return

    const selectedStratigraphy = (route.value.query[queryParam] as string)
      .split(',')
      .map(decodeURIComponent)
    const query = selectedStratigraphy
      .map((stratigraphy: string) => `hierarchy_string:"${stratigraphy}"`)
      .join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/stratigraphy?q=(${query})&rows=${selectedStratigraphy.length}&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterAnalysisParameter: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedAnalysisParameters = (route.value.query[queryParam] as string)
      .split(',')
      .map(decodeURIComponent)
    const query = selectedAnalysisParameters
      .map((parameter) => `parameter_index:"${parameter}"`)
      .join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/analysis_parameter?q=(${query})&rows=${selectedAnalysisParameters.length}&fl=id,parameter,parameter_index`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterCollection: HydrationFunction = () => {
  const { $axios } = useContext()

  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedCollections = (route.value.query[queryParam] as string).split(
      ','
    )
    const query = selectedCollections
      .map((sample) => `id:"${sample}"`)
      .join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/collection?q=(${query})&rows=${selectedCollections.length}&fl=id,number`
    )
    filter.value = response.response.docs
  }
}
export const useHydrateFilterSample: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedSamples = (route.value.query[queryParam] as string).split(',')
    const query = selectedSamples.map((sample) => `id:"${sample}"`).join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/sample?q=(${query})&rows=${selectedSamples.length}&fl=id,number`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterArea: HydrationFunction = () => {
  const { $axios } = useContext()
  const route = useRoute()
  return async (filter, queryParam) => {
    if (!route.value.query[queryParam]) return
    const selectedAreas = (route.value.query[queryParam] as string).split(',')
    const query = selectedAreas.map((area) => `id:"${area}"`).join(' OR ')
    const response = await $axios.$get(
      `https://api.geoloogia.info/solr/area?q=(${query})&rows=${selectedAreas.length}&fl=id,name,name_en`
    )
    filter.value = response.response.docs
  }
}

export const useHydrateFilterStatic = () => {
  const route = useRoute()
  return (
    filter: Ref<any>,
    queryParam: string,
    suggestions: any[],
    parseFunc: (v: string) => any,
    compareField = 'id'
  ) => {
    if (!route.value.query[queryParam]) return
    const queryParamValue = route.value.query[queryParam] as string
    const parsedValue = queryParamValue.split(',').map(parseFunc)
    filter.value = suggestions.filter((v) =>
      parsedValue.includes(v[compareField])
    )
  }
}
export const useHydrateFilter = () => {
  const route = useRoute()
  return async (
    filter: Ref<any>,
    queryParam: string,
    hydrationFunc: (ids: any[]) => Promise<any[]>
  ) => {
    if (!route.value.query[queryParam]) return

    const queryParamValue = route.value.query[queryParam] as string
    const parsedValue = queryParamValue.split(',')
    filter.value = await hydrationFunc(parsedValue)
  }
}
