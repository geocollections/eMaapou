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
