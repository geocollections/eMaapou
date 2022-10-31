import { SearchModuleState } from '../types'
import { SPECIMEN } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    name: 'specimen',
    items: [],
    count: 0,
    options: SPECIMEN.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      byIds: {
        locality: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.locality',
          fields: ['locality', 'locality_en'],
        },
        number: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.number',
          fields: [
            'specimen_full_name',
            'specimen_number',
            'specimen_number_old',
          ],
        },
        collectionNr: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.collectionNr',
          fields: ['collection_number'],
        },
        fossil: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.fossilGroup',
          fields: ['fossilgroup'],
        },
        fossilName: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.fossilName',
          fields: ['taxon', 'taxon_txt', 'taxon_full'],
        },
        rock: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.rockName',
          fields: ['rock', 'rock_en', 'rock_txt', 'rock_txt_en'],
        },
        stratigraphyHierarchy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'specimen.stratigraphyHierarchy',
          fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
        },
        hierarchy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'specimen.taxon',
          fields: ['hierarchy_string'],
        },
        reference: {
          value: null,
          type: FilterType.Object,
          searchField: 'reference',
          lookUpType: LookupType.Equals,
          label: 'specimen.reference',
          fields: ['specimen_references'],
        },
        has_image: {
          value: false,
          type: FilterType.Boolean,
          label: 'specimen.has_image',
          fields: ['has_image'],
        },
        has_map: {
          value: false,
          type: FilterType.Boolean,
          label: 'specimen.has_map',
          fields: ['has_map'],
        },
        // mass: {
        //   type: 'range',
        //   lookUpType: 'range',
        //   value: [0, 1000000],
        //   label: 'sample.mass',
        //   placeholders: ['mass.min', 'mass.max'],
        //   fields: ['mass'],
        // },
      },
      allIds: [
        'number',
        'collectionNr',
        'fossilName',
        'fossil',
        'stratigraphyHierarchy',
        'hierarchy',
        'has_image',
        'has_map',
      ],
    },
  }
}

export default initState
