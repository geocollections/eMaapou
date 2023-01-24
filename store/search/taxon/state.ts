import { SearchModuleState } from '../types'
import { TAXON } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  GeomFilter,
  ListIdsFilter,
  ListTextFilter,
  TextFilter,
} from '~/types/filters'

export type TaxonFilters = {
  species: ListTextFilter
  locality: TextFilter
  stratigraphyHierarchy: ListIdsFilter
  taxonHierarchy: ListIdsFilter
  author: ListTextFilter
  map: GeomFilter
}

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
        fields: ['taxon'],
      },
      locality: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['locality', 'locality_en'],
      },
      stratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'startswith',
        fields: ['stratigraphy_hierarchy'],
        valueField: 'hierarchy_string',
        valueType: 'string',
      },
      taxonHierarchy: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'startswith',
        fields: ['hierarchy_string'],
        valueField: 'hierarchy_string',
        valueType: 'string',
      },
      author: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        fields: ['author_year'],
      },
      map: {
        type: FilterType.Geom,
        value: null,
        fields: ['latlong'],
      },
    },
  }
}

export default initState
