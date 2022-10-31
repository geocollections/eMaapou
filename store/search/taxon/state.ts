import { SearchModuleState } from '../types'
import { TAXON } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    name: 'taxon',
    items: [],
    count: 0,
    options: TAXON.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      byIds: {
        species: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'taxon.species',
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
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'taxon.stratigraphyHierarchy',
          fields: ['stratigraphy_hierarchy'],
        },
        taxonHierarchy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'taxon.taxonHierarchy',
          fields: ['hierarchy_string'],
        },
        author: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'taxon.author',
          fields: ['author_year'],
        },
      },
      allIds: [
        'species',
        'stratigraphyHierarchy',
        'taxonHierarchy',
        'stratigraphy',
        'locality',
        'author',
      ],
    },
  }
}

export default initState
