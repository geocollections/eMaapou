import { SearchModuleState } from '../types'
import { TAXON } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export type TaxonFilters =
  | 'species'
  | 'locality'
  | 'stratigraphyHierarchy'
  | 'taxonHierarchy'
  | 'author'
  | 'map'

export const initState = (): SearchModuleState<TaxonFilters> => {
  return {
    name: 'taxon',
    items: [],
    count: 0,
    options: TAXON.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      species: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        label: '',
        fields: ['taxon'],
      },
      locality: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'taxon.locality',
        fields: ['locality', 'locality_en'],
      },
      stratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'startswith',
        label: '',
        fields: ['stratigraphy_hierarchy'],
        valueField: 'hierarchy_string',
        valueType: 'string',
      },
      taxonHierarchy: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'startswith',
        label: '',
        fields: ['hierarchy_string'],
        valueField: 'hierarchy_string',
        valueType: 'string',
      },
      author: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        label: '',
        fields: ['author_year'],
      },
      map: {
        type: FilterType.Geom,
        value: null,
        label: '',
        fields: ['latlong'],
      },
    },
  }
}

export default initState
