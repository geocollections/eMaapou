import { useContext } from '@nuxtjs/composition-api'

export const useHydrateFilterLocality = () => {
  const { $axios } = useContext()

  return (selectedIds: number[]) => {
    const idQuery = selectedIds.join(' ')
    return $axios.get(
      `https://api.geoloogia.info/solr/locality?q=id:(${idQuery})&rows=${selectedIds.length}&fl=locality,id,locality_en`
    )
  }
}
export const useHydrateFilterSite = () => {
  const { $axios } = useContext()

  return (selectedIds: number[]) => {
    const idQuery = selectedIds.join(' ')
    return $axios.get(
      `https://api.geoloogia.info/solr/site?q=id:(${idQuery})&rows=${selectedIds.length}&fl=id,name`
    )
  }
}
export const useHydrateFilterDataset = () => {
  const { $axios } = useContext()

  return (selectedIds: number[]) => {
    const idQuery = selectedIds.join(' ')
    return $axios.get(
      `https://api.geoloogia.info/solr/dataset?q=id:(${idQuery})&rows=${selectedIds.length}&fl=id,title`
    )
  }
}

export const useHydrateFilterReference = () => {
  const { $axios } = useContext()

  return (selectedReferences: string[]) => {
    const query = selectedReferences
      .map((reference) => `reference:"${reference}"`)
      .join(' OR ')
    return $axios.get(
      `https://api.geoloogia.info/solr/reference?q=(${query})&rows=${selectedReferences.length}&fl=id,reference,title`
    )
  }
}
export const useHydrateFilterReferenceId = () => {
  const { $axios } = useContext()

  return (selectedReferences: number[]) => {
    const query = selectedReferences
      .map((reference) => `id:"${reference}"`)
      .join(' OR ')
    return $axios.get(
      `https://api.geoloogia.info/solr/reference?q=(${query})&rows=${selectedReferences.length}&fl=id,reference,title`
    )
  }
}

export const useHydrateFilterTaxon = () => {
  const { $axios } = useContext()

  return (selectedTaxa: string[]) => {
    const query = selectedTaxa
      .map((taxa) => `hierarchy_string:"${taxa}"`)
      .join(' OR ')
    return $axios.get(
      `https://api.geoloogia.info/solr/taxon?q=(${query})&rows=${selectedTaxa.length}&fl=id,taxon,hierarchy_string`
    )
  }
}

export const useHydrateFilterStratigraphy = () => {
  const { $axios } = useContext()

  return (selectedStratigraphy: string[]) => {
    const query = selectedStratigraphy
      .map((stratigraphy) => `hierarchy_string:"${stratigraphy}"`)
      .join(' OR ')
    return $axios.get(
      `https://api.geoloogia.info/solr/stratigraphy?q=(${query})&rows=${selectedStratigraphy.length}&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
    )
  }
}

export const useHydrateFilterAnalysisParameter = () => {
  const { $axios } = useContext()

  return (selectedAnalysisParameters: string[]) => {
    const query = selectedAnalysisParameters
      .map((parameter) => `parameter_index:"${parameter}"`)
      .join(' OR ')
    return $axios.get(
      `https://api.geoloogia.info/solr/analysis_parameter?q=(${query})&rows=${selectedAnalysisParameters.length}&fl=id,parameter,parameter_index`
    )
  }
}

export const useHydrateFilterSample = () => {
  const { $axios } = useContext()

  return (selectedSamples: number[]) => {
    const query = selectedSamples.map((sample) => `id:"${sample}"`).join(' OR ')
    return $axios.get(
      `https://api.geoloogia.info/solr/sample?q=(${query})&rows=${selectedSamples.length}&fl=id,number`
    )
  }
}

export const useHydrateFilterArea = () => {
  const { $axios } = useContext()

  return (selectedAreas: number[]) => {
    const query = selectedAreas.map((area) => `id:"${area}"`).join(' OR ')
    return $axios.get(
      `https://api.geoloogia.info/solr/area?q=(${query})&rows=${selectedAreas.length}&fl=id,name,name_en`
    )
  }
}
